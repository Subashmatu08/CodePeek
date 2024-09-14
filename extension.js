const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const IgnoreDirectories = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.vscode',
  '.idea',
  '.cache',
  'out',
  'tmp',
  'temp',
  '__pycache__',
  'logs',
  'venv',
  'target',
];

const IgnoreFiles = [
  '.DS_Store',
  'Thumbs.db',
  '.env',
  'package-lock.json',
  'yarn.lock',
  '.eslintcache',
  '.gitignore',
  'context.txt',
  '.npmrc',
  'tsconfig.json',
];

function shouldIgnore(fileName, stats) {
  const ignoredExtensions = [
    '.log',
    '.pyc',
    '.mp4',
    '.avi',
    '.mov',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.ico',
    '.svg',
    '.mp3',
    '.wav',
    '.exe',
    '.bin',
    '.dll',
    '.zip',
    '.tar.gz',
    '.pdf',
    '.xlsx',
    '.csv',
  ];

  const isDirectory = stats.isDirectory();

  if (isDirectory) {
    return IgnoreDirectories.includes(fileName);
  } else {
    return (
      ignoredExtensions.some((ext) => fileName.endsWith(ext)) ||
      IgnoreFiles.includes(fileName)
    );
  }
}

// const IgnoreFiles = [
//   '.DS_Store',
//   'Thumbs.db',
//   '.env',
//   'package-lock.json',
//   'yarn.lock',
//   '.eslintcache',
//   '.gitignore',
//   'context.txt',
// ];

// function getFileStructure(dirPath, indent = '') {
//   let structure = '';
//   const files = fs.readdirSync(dirPath);

//   for (const file of files) {
//     if (IgnoreDirectories.includes(file) || IgnoreFiles.includes(file)) {
//       continue;
//     }

//     const filePath = path.join(dirPath, file);
//     const stats = fs.statSync(filePath);

//     if (stats.isDirectory()) {
//       structure += `${indent}📁 ${file}\n`;
//       structure += getFileStructure(filePath, indent + '  ');
//     } else {
//       structure += `${indent}📄 ${file}\n`;
//     }
//   }
//   return structure;
// }

// function getFilesAndFolders(dirPath, indent = '') {
//   let items = [];
//   const files = fs.readdirSync(dirPath);

//   for (const file of files) {
//     if (IgnoreDirectories.includes(file) || IgnoreFiles.includes(file)) {
//       continue;
//     }

//     const filePath = path.join(dirPath, file);
//     const stats = fs.statSync(filePath);

//     if (stats.isDirectory()) {
//       items.push({ type: 'directory', name: file, path: filePath, indent });
//       items = items.concat(getFilesAndFolders(filePath, indent + '  '));
//     } else {
//       items.push({ type: 'file', name: file, path: filePath, indent });
//     }
//   }
//   return items;
// }
function getFileStructure(dirPath, indent = '') {
  let structure = '';
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (shouldIgnore(file, stats)) {
      continue;
    }

    if (stats.isDirectory()) {
      structure += `${indent}📁 ${file}\n`;
      structure += getFileStructure(filePath, indent + '  ');
    } else {
      structure += `${indent}📄 ${file}\n`;
    }
  }
  return structure;
}

function getFilesAndFolders(dirPath, indent = '') {
  let items = [];
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (shouldIgnore(file, stats)) {
      continue;
    }

    if (stats.isDirectory()) {
      items.push({ type: 'directory', name: file, path: filePath, indent });
      items = items.concat(getFilesAndFolders(filePath, indent + '  '));
    } else {
      items.push({ type: 'file', name: file, path: filePath, indent });
    }
  }
  return items;
}

function saveToFile(dirPath, outputPath, selectedFiles) {
  const structure = getFileStructure(dirPath);
  let fileContents = '';
  selectedFiles.forEach((file) => {
    const relativePath = path.relative(dirPath, file.path);
    const content = fs.readFileSync(file.path, 'utf-8');
    fileContents += `\nFile: ${relativePath}\n\n${content}\n`;
  });

  const finalContent = `${structure}\n${fileContents}`;
  fs.writeFileSync(outputPath, finalContent);

  vscode.window.showInformationMessage(
    'Context saved as context.txt in your workspace!'
  );

  addToGitIgnore(dirPath, 'context.txt');
}

function addToGitIgnore(dirPath, file) {
  const gitignorePath = path.join(dirPath, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    let gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');

    if (!gitignoreContent.includes(file)) {
      gitignoreContent += `\n${file}\n`;
      fs.writeFileSync(gitignorePath, gitignoreContent);
    }
  } else {
    fs.writeFileSync(gitignorePath, file);
  }
}

function createWebviewPanel(context, rootPath) {
  const panel = vscode.window.createWebviewPanel(
    'selectFiles',
    'CodePeek - Select Files',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  const files = getFilesAndFolders(rootPath);
  panel.webview.html = getWebviewContent(files);

  panel.webview.onDidReceiveMessage(
    (message) => {
      switch (message.command) {
        case 'generate':
          saveToFile(
            rootPath,
            path.join(rootPath, 'context.txt'),
            message.selectedFiles
          );
          panel.dispose();
          break;
      }
    },
    undefined,
    context.subscriptions
  );
}

function getWebviewContent(files) {
  let fileItems = files
    .map((file) => {
      if (file.type === 'file') {
        return `<input type="checkbox" id="${file.path}" name="file" value="${file.path}">
              <label for="${file.path}">${file.indent}${file.name}</label><br>`;
      } else {
        return `<label>${file.indent}📁 ${file.name}</label><br>`;
      }
    })
    .join('\n');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <body>
      <h1><b>Choose which Files to include for Context<b></h1>
      <form id="fileForm">
        ${fileItems}
        <br>
        <p>If <span style="color:gold;">NO</span> files are selected, only the file structure is saved in <span style="color:gold;">context.txt</span> file</p>
        <button type="button" 
        style="cursor:pointer;
        border:1px solid white; 
        padding:0.5rem;
        margin-bottom: 1rem;
        background-color: grey; 
        border-radius: 5px;" 
        onclick="generate()">Create Context ✨</button>
      </form>
      <script>
        const vscode = acquireVsCodeApi();
        function generate() {
          const selectedFiles = Array.from(document.querySelectorAll('input[name="file"]:checked')).map(checkbox => ({
            name: checkbox.nextSibling.textContent.trim(),
            path: checkbox.value
          }));
          vscode.postMessage({
            command: 'generate',
            selectedFiles: selectedFiles
          });
        }
      </script>
    </body>
    </html>
  `;
}

function saveTerminalContext(dirPath, terminalSessions) {
  console.log('Saving terminal context...');
  const outputPath = path.join(dirPath, 'terminalcontext.txt');

  const structure = getFileStructure(dirPath);
  let fileContents = '';

  terminalSessions.forEach((session) => {
    fileContents += `\n=== Terminal Context from Terminal: ${session.terminalName} ===\n\n`;
    fileContents += `Last Command: ${session.lastCommand}\n\n`;
    fileContents += `Output:\n${session.output}\n`;

    session.referencedFiles.forEach((file) => {
      try {
        const relativePath = path.relative(dirPath, file.path);
        const content = fs.readFileSync(file.path, 'utf-8');
        fileContents += `\nFile: ${relativePath}\n\n${content}\n`;
      } catch (error) {
        console.error(`Failed to read file: ${file.path}`, error);
      }
    });
  });

  const finalContent = `${structure}\n${fileContents}`;

  try {
    fs.writeFileSync(outputPath, finalContent);
    console.log(`Terminal context saved to: ${outputPath}`);
    vscode.window.showInformationMessage(
      `Terminal context saved to ${path.basename(
        outputPath
      )} in your workspace!`
    );
  } catch (error) {
    console.error(`Failed to write to file: ${outputPath}`, error);
    vscode.window.showErrorMessage(
      `Failed to save terminal context: ${error.message}`
    );
  }

  addToGitIgnore(dirPath, 'terminalcontext.txt');
}

async function getTerminalOutput(terminal) {
  const previousClipboard = await vscode.env.clipboard.readText();

  terminal.show(true);
  await vscode.commands.executeCommand('workbench.action.terminal.selectAll');
  await vscode.commands.executeCommand(
    'workbench.action.terminal.copySelection'
  );

  const clipboardContent = await vscode.env.clipboard.readText();

  await vscode.env.clipboard.writeText(previousClipboard);

  return clipboardContent.trim();
}

function getLastSession(terminalOutput) {
  // Get user-defined prompt text
  const promptText = vscode.workspace
    .getConfiguration('codepeek')
    .get('promptText');

  if (!promptText) {
    return {
      command: '',
      output: terminalOutput,
    };
  }

  const lastPromptIndex = terminalOutput.lastIndexOf(promptText);

  if (lastPromptIndex === -1) {
    return {
      command: '',
      output: terminalOutput,
    };
  }

  const sessionText = terminalOutput
    .substring(lastPromptIndex + promptText.length)
    .trim();
  const lines = sessionText.split('\n');
  const command = lines[0].trim();
  const output = lines.slice(1).join('\n').trim();

  return {
    command,
    output,
  };
}

function extractReferencedFiles(rootPath, sessionOutput) {
  const referencedFiles = [];
  const lines = sessionOutput.split('\n');
  const filePathRegex = /([^\s'"]+?(\.\/|\/|\\)[^\s'"]+?\.\w+)/g;

  lines.forEach((line) => {
    const matches = line.match(filePathRegex);
    if (matches) {
      matches.forEach((match) => {
        let filePath = match.trim();
        if (!path.isAbsolute(filePath)) {
          filePath = path.join(rootPath, filePath);
        }
        filePath = path.normalize(filePath);
        if (
          fs.existsSync(filePath) &&
          !referencedFiles.some((e) => e.path === filePath)
        ) {
          referencedFiles.push({ path: filePath });
        }
      });
    }
  });

  return referencedFiles;
}

function activate(context) {
  console.log('"codepeek" is now active!');

  const generateContextCommand = vscode.commands.registerCommand(
    'codepeek.generateContext',
    function () {
      const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      createWebviewPanel(context, rootPath);
    }
  );

  context.subscriptions.push(generateContextCommand);

  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  myStatusBarItem.command = 'codepeek.generateContext';
  myStatusBarItem.text = 'Create Context ✨';
  myStatusBarItem.tooltip = 'Generate a Context file for my workspace';
  myStatusBarItem.show();
  context.subscriptions.push(myStatusBarItem);

  vscode.workspace.onDidSaveTextDocument(() => {
    extractTerminalOnSave();
  });

  const generateTerminalContextCommand = vscode.commands.registerCommand(
    'codepeek.generateTerminalContext',
    function () {
      extractTerminalContext();
    }
  );
  context.subscriptions.push(generateTerminalContextCommand);

  const terminalContextStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    99
  );
  terminalContextStatusBarItem.command = 'codepeek.generateTerminalContext';
  terminalContextStatusBarItem.text = 'Terminal Context 📋';
  terminalContextStatusBarItem.tooltip = 'Generate a Terminal Context file';
  terminalContextStatusBarItem.show();
  context.subscriptions.push(terminalContextStatusBarItem);
}

async function extractTerminalOnSave() {
  const terminals = vscode.window.terminals;
  if (terminals.length > 0) {
    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const terminalSessions = [];

    for (const terminal of terminals) {
      const terminalOutput = await getTerminalOutput(terminal);
      if (terminalOutput) {
        const lastSession = getLastSession(terminalOutput);
        const referencedFiles = extractReferencedFiles(
          rootPath,
          lastSession.output
        );
        terminalSessions.push({
          terminalName: terminal.name,
          lastCommand: lastSession.command,
          output: lastSession.output,
          referencedFiles: referencedFiles,
        });
      }
    }

    if (terminalSessions.length > 0) {
      saveTerminalContext(rootPath, terminalSessions);
    }
  }
}

async function extractTerminalContext() {
  const terminals = vscode.window.terminals;
  if (terminals.length > 0) {
    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const terminalSessions = [];

    for (const terminal of terminals) {
      const terminalOutput = await getTerminalOutput(terminal);
      if (terminalOutput) {
        const lastSession = getLastSession(terminalOutput);
        const referencedFiles = extractReferencedFiles(
          rootPath,
          lastSession.output
        );
        terminalSessions.push({
          terminalName: terminal.name,
          lastCommand: lastSession.command,
          output: lastSession.output,
          referencedFiles: referencedFiles,
        });
      }
    }

    if (terminalSessions.length > 0) {
      saveTerminalContext(rootPath, terminalSessions);
    } else {
      vscode.window.showErrorMessage('Failed to get terminal output.');
    }
  } else {
    vscode.window.showErrorMessage('No active terminals found.');
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
