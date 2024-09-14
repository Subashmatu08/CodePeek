# CodePeek <span style="color:#D9BF2A;">👀</span>

Welcome to **CodePeek**, the ultimate Visual Studio Code extension that revolutionizes the way you interact with your code. Not only does CodePeek effortlessly generate a comprehensive contextual overview of your workspace, but it also captures your terminal sessions! This powerful tool creates `context.txt` and `terminalcontext.txt` files that map out the entire structure of your project, include contents of selected files, and capture terminal outputs—all designed to seamlessly integrate with your language model (LLM) of choice. Elevate your coding efficiency and streamline your development workflow with CodePeek!

---

## Features

- **Generate Contextual Overview**: Create a `context.txt` file that lists all directories and files in your workspace. The extension automatically adds the generated file to `.gitignore`.
- **Select Specific Files**: Choose specific files to include their content in the `context.txt` file.
- **Terminal Context Capture**: Automatically capture terminal output and relevant files with terminal context saved in `terminalcontext.txt`. Simply save any file (`Ctrl+S` or `Cmd+S`), and CodePeek will capture the latest terminal context. _(Note: You may need to press save twice to ensure the terminal output is fully captured.)_ CodePeek also pulls in all the relevant files and its contents including the entire structure of your project!
- **Customize Terminal Prompt Recognition**: Specify your terminal prompt text in settings to accurately capture only the last command output.
- **Integrated UI**: Utilize a simple and intuitive webview panel within VS Code to select the files and directories to be included.
- **Status Bar Integration**: Easily access context generation commands from the status bar.

---

## Usage Instructions

### 1. Creating a Context File

1. **Open your project** in Visual Studio Code.
2. In the status bar, click on **Create Context ✨**, or open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and select **Create Context**.
3. A webview panel will appear, showing the file structure of your workspace. Here, you can **select specific files** whose content you want to include in the `context.txt` file.
4. If no files are selected, only the directory structure will be saved in `context.txt`.
5. Click the **Create Context ✨** button to generate the `context.txt` file in your workspace.

### 2. Capturing Terminal Context

1. **Set Up Terminal Prompt Text**:

   - To ensure CodePeek accurately captures only the last command output, you need to **set your terminal prompt text** in the extension settings.
   - Go to **Settings** (`Ctrl+,` or `Cmd+,`), search for **`Codepeek: Prompt Text`**, and enter your terminal prompt text.
   - **Examples of Terminal Prompt Text**:
     - `user@hostname:~$`
     - `(venv) C:\Users\user\project>`
     - `PS C:\Users\user\project>`
     - `➜  ~/project`
     - `user@machine ~/project %`
   - This helps the extension identify where the last command starts in your terminal output.

2. **Automatic Capture on Save**:

   - Every time you **save a file** (`Ctrl+S` or `Cmd+S`), CodePeek automatically captures the latest terminal output and saves it to `terminalcontext.txt`. _(Note: You may need to press save twice to ensure the terminal output is fully captured.)_

3. **Manual Capture**:

   - You can also manually capture the terminal context by clicking on **Terminal Context 📋** in the status bar or using the command **Generate Terminal Context** from the Command Palette.

4. **Default Behavior Without Prompt Text**:

   - If you do not set the `Codepeek: Prompt Text`, CodePeek will capture **the entire terminal output** instead of just the last command.
   - Setting the prompt text ensures more precise and relevant terminal context.

---

## Extension Settings

CodePeek provides the following settings to customize its behavior:

- **Codepeek: Prompt Text**

  - **Description**: Your terminal prompt text. The extension uses this text to identify the last command in your terminal.
  - **Usage**: Enter the exact string that appears at your terminal prompt before you type a command. This allows CodePeek to accurately extract only the output from the last executed command.
  - **Examples**:
    - If your terminal prompt looks like `user@hostname:~$`, enter `user@hostname:~$`.
    - For PowerShell users, if your prompt is `PS C:\Users\user\project>`, enter `PS C:\Users\user\project>`.
    - On macOS, if your prompt is `user@MacBook-Pro ~ %`, enter `user@MacBook-Pro ~ %`.
  - **Importance**: Setting this ensures that CodePeek captures only the output from the last command, making your `terminalcontext.txt` more focused and relevant.

---

## Automatically Ignored Files and Directories

When generating the `context.txt` or `terminalcontext.txt` files, CodePeek automatically ignores certain files and directories to keep the context clean and relevant. Here is the list of files and directories ignored by default:

### Ignored Directories

- `node_modules`
- `.git`
- `dist`
- `build`
- `coverage`
- `.vscode`
- `.idea`
- `.cache`
- `out`
- `tmp`
- `temp`
- `__pycache__`
- `logs`
- `venv`
- `target`

### Ignored Files

- `.DS_Store`
- `Thumbs.db`
- `.env`
- `package-lock.json`
- `yarn.lock`
- `.eslintcache`
- `.gitignore`
- `context.txt`
- `.npmrc`
- `tsconfig.json`
- **Various media formats** (`.png`, `.jpg`, `.gif`, `.mp4`, etc.)
- **Compressed archives** (`.zip`, `.tar.gz`)
- **Binary/executable files** (`.exe`, `.bin`, `.dll`)

---

## Installation

1. **Open Visual Studio Code**.
2. Go to the **Extensions** view by clicking the Extensions icon in the Activity Bar or pressing `Ctrl+Shift+X` or `Cmd+Shift+X`.
3. **Search for** `CodePeek`.
4. Click **Install**.

---

## Detailed Usage Guide

1. **Create Context ✨ Button**: Access this from the status bar to quickly generate a context file for your workspace.
2. **File Selection**: In the webview panel, tick the checkboxes to select specific files to include their contents in the context.
3. **Setting Terminal Prompt Text**:

   - Go to **Settings** (`Ctrl+,` or `Cmd+,`).
   - Search for **`Codepeek: Prompt Text`**.
   - Enter your terminal prompt text **exactly as it appears** in your terminal.
   - **Examples**:
     - If your terminal prompt looks like `user@hostname:~$`, enter `user@hostname:~$`.
     - For PowerShell users, if your prompt is `PS C:\Users\user\project>`, enter `PS C:\Users\user\project>`.
     - On macOS, if your prompt is `user@MacBook-Pro ~ %`, enter `user@MacBook-Pro ~ %`.
   - This is crucial for accurately capturing the last command's output in the terminal context.

4. **Terminal Context 📋 Button**: Generate a terminal context file containing the last command output and related files from the terminal sessions.
5. **Automatic Terminal Capture**: Simply **save any file** in your workspace to automatically update the terminal context. _(Note: You may need to press save twice to ensure the terminal output is fully captured.)_
6. **Default Behavior Without Prompt Text**: If the prompt text is not set, CodePeek will capture the **entire terminal output**. Setting the prompt text refines the captured context.
7. **Git Ignore Integration**: CodePeek automatically updates your `.gitignore` to prevent the `context.txt` and `terminalcontext.txt` from being tracked by Git.

---

## Release Notes

### 1.1.0

- Added **terminal context capture** feature.
- Terminal context is automatically captured on file save (`Ctrl+S` or `Cmd+S`).
- **New Setting**: `Codepeek: Prompt Text` for specifying your terminal prompt text.
- Enhanced context generation with file and directory ignoring patterns.

### 1.0.0

- Initial release of CodePeek.
- Ability to generate `context.txt` file with workspace structure and file contents for giving LLMs context.

---

## Roadmap

### Version 2.0.0 (Upcoming)

1. **Bring Your Own Key (BYOK) for your ChatGPT Account**: Use your own ChatGPT API key for personalized interactions.
2. **Chat Window within VS Code**: Have a chat window directly in VS Code that already includes the context of your code and terminal sessions, allowing seamless interaction with ChatGPT without leaving your workspace.
3. **Enhanced Workflow**: A more seamless approach to getting your work done efficiently with integrated context-aware assistance, including both code and terminal context when sending queries to the LLM.

---

## Feedback and Support

We value your feedback and are here to help! If you encounter any issues or have suggestions for improvements, please let us know:

1. Visit our [GitHub Issues page](https://github.com/Subashmatu08/CodePeek/issues) to report a problem or provide feedback.
2. Describe the issue or suggestion clearly, including steps to reproduce the problem if applicable.
3. Attach any relevant screenshots or files that might help us understand and address the issue more effectively.

Your input is crucial in helping us improve CodePeek and make it even better for the community. Thank you for your support!

---
