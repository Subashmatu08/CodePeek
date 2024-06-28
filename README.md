# CodePeek 👀

Welcome to CodePeek, the ultimate Visual Studio Code extension that changes the way you interact with your code. With CodePeek, effortlessly generate and view a comprehensive contextual overview of your workspace. This powerful tool creates a `context.txt` file that not only maps out the entire structure of your project but also optionally includes the contents of selected files. Designed to seamlessly integrate with your language model (LLM) of choice, CodePeek ensures you have all the context you need when seeking assistance with your code. Elevate your coding efficiency and streamline your development workflow with CodePeek!

## Features

- **Generate Contextual Overview**: Create a `context.txt` file that lists all directories and files in your workspace, excluding commonly ignored files and directories and adds it into your `.gitignore` automatically.
- **Select Specific Files**: Choose specific files to include their content in the `context.txt` file.
- **Integrated UI**: Utilize a simple and intuitive webview panel within VS Code to select the files and directories to be included.
- **Status Bar Integration**: Easily access the context generation command from the status bar.

## Usage Examples

<!-- ![File Selection & Context Generation](https://raw.githubusercontent.com/Subashmatu08/CodePeek/main/images/vid1.mp4)

![Using the Context File](https://raw.githubusercontent.com/Subashmatu08/CodePeek/main/images/vid2.mp4) -->

![Create Context Menu](https://raw.githubusercontent.com/Subashmatu08/CodePeek/main/images/image1.png)
![File Selection](https://raw.githubusercontent.com/Subashmatu08/CodePeek/main/images/image2.png)
![Context.txt File](https://raw.githubusercontent.com/Subashmatu08/CodePeek/main/images/image3.png)
![Using ChatGPT with Context](https://raw.githubusercontent.com/Subashmatu08/CodePeek/main/images/image4.png)
![ChatGPTs' Response having Context](https://raw.githubusercontent.com/Subashmatu08/CodePeek/main/images/image5.png)

**Automatically Ignored Files and Directories:**

When generating the `context.txt` file, CodePeek automatically ignores certain files and directories to keep the context file clean, relevant and most importantly safe. Here is the list of files and directories that are ignored by default:

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

### Ignored Files

- `.DS_Store`
- `Thumbs.db`
- `.env`
- `package-lock.json`
- `yarn.lock`
- `.eslintcache`
- `.gitignore`
- `context.txt`

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl/Cmd+Shift+X`.
3. Search for `CodePeek`.
4. Click **Install**.

## Usage

1. Open your workspace in VS Code.
2. Click on the "Create Context ✨" button in the status bar or run the command `Create Context` from the Command Palette (`Ctrl/Cmd+Shift+P`).
3. A webview panel will appear, allowing you to select the files you want to include in the `context.txt` file.
4. Click the **Create Context ✨** button in the webview to generate the file.

## Extension Settings

This extension currently does not contribute any settings. Future versions may include configurable options for file and directory ignoring patterns.

## Release Notes

### 1.0.0

- Initial release of CodePeek.
- Ability to generate `context.txt` file with workspace structure and file contents for giving LLMs context.

## Roadmap

### Upcoming Features

#### Version 2.0.0 (Soon to be released)

1. **Bring Your Own Key (BYOK) for your ChatGPT Account**: Use your own ChatGPT API key for personalized interactions.
2. **Chat Window within VS Code**: Have a chat window directly in VS Code that already includes the context of your code, allowing seamless interaction with ChatGPT without leaving your workspace.
3. **Enhanced Workflow**: A more seamless approach to getting your work done efficiently with integrated context-aware assistance.

#### Version 3.0.0

1. **Automatic Error Detection**: Automatically detect errors in the console and trigger an error context button.
2. **ErrorContext File Creation**: Option to create an `errorcontext.txt` file containing the error and relevant files when an error occurs.
3. **Chat Window with Error Context**: Directly within VS Code, a chat window will have the error context attached so you can focus on the solution while we handle the relevant information seamlessly.

## Feedback and Support

We value your feedback and are here to help! If you encounter any issues or have suggestions for improvements, please let us know:

1. Visit our [GitHub Issues page](https://github.com/Subashmatu08/CodePeek/issues) to report a problem or provide feedback.
2. Describe the issue or suggestion clearly, including steps to reproduce the problem if applicable.
3. Attach any relevant screenshots or files that might help us understand and address the issue more effectively.

Your input is crucial in helping us improve CodePeek and make it even better for the community. Thank you for your support!
