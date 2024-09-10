# Code Launcher

## Overview

Code Launcher is a web-based application designed to streamline the process of managing and interacting with your development projects. It provides a user-friendly interface to list, create, and manage project directories, execute shell commands, and clone Git repositories directly from your browser.

## Features

- **Project Management**: Easily view and manage your existing project directories.
- **Command Execution**: Run shell commands directly from the web interface.
- **Git Integration**: Clone Git repositories with a simple input.
- **Smart Bar**: A versatile input bar that interprets various commands and actions.
- **Resource Monitoring**: View real-time CPU and memory usage.

## How to Use

### Viewing Projects

1. Open the application.
2. Navigate to the "Projects List" section.
3. View your existing project directories.

### Creating a New Project

1. Go to the "Project Templates" section.
2. Select a template for your new project.
3. Enter a name for the project folder when prompted.
4. The project will be created and opened in your preferred IDE.

### Running Commands

1. Use the Smart Bar at the top of the interface.
2. Enter a shell command prefixed with [`>`]("Go to definition") (e.g., `> ls`).
3. Press Enter to execute the command.

### Cloning a Git Repository

1. Use the Smart Bar.
2. Enter the Git repository URL.
3. Press Enter to clone the repository into your workspace.

### Monitoring Resources

1. View the footer of the application.
2. Check the real-time CPU and memory usage displayed.

## Technical Aspects

Code Launcher is built using modern web technologies including React, TypeScript, and Tailwind CSS. It leverages Valtio for state management and integrates with various APIs to provide its functionality. The backend services are designed to handle command execution and project management efficiently.
