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

function saveToFile(dirPath, outputPath) {
  const structure = getFileStructure(dirPath);
  fs.writeFileSync(outputPath, structure);
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

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "codepeek" is now active!');

  const disposable = vscode.commands.registerCommand(
    'codepeek.generateContext',
    function () {
      const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      const outputFilePath = path.join(rootPath, 'context.txt');

      saveToFile(rootPath, outputFilePath);
    }
  );

  context.subscriptions.push(disposable);

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
