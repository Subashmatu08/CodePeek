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
];

function getFileStructure(dirPath, indent = '') {
  let structure = '';
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      structure += `${indent}📁 ${file}\n`;
      if (!IgnoreDirectories.includes(file)) {
        structure += getFileStructure(filePath, indent + '  ');
      }
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

    if (stats.isDirectory()) {
      items.push({ type: 'directory', name: file, path: filePath, indent });
      if (!IgnoreDirectories.includes(file)) {
        items = items.concat(getFilesAndFolders(filePath, indent + '  '));
      }
    } else {
      if (!IgnoreFiles.includes(file)) {
        items.push({ type: 'file', name: file, path: filePath, indent });
      }
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

function activate(context) {
  console.log('Congratulations, "codepeek" is now active!');

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
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
