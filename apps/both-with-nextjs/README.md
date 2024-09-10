# Code Launcher

## Overview

Code Launcher is a web-based application designed to streamline the process of managing and interacting with your development projects. It provides a user-friendly interface to list, create, and manage project directories, execute shell commands, and clone Git repositories directly from your browser. Whether you are a solo developer or part of a team, Code Launcher simplifies your workflow by integrating essential development tools into a single platform.

## Features

- **Project Management**: Easily view and manage your existing project directories. The ProjectsList component provides a comprehensive view of all your projects.
- **Command Execution**: Run shell commands directly from the web interface using the SmartBar. This feature allows you to execute commands without leaving the browser.
- **Git Integration**: Clone Git repositories with a simple input. The application supports cloning repositories directly into your workspace.
- **Smart Bar**: A versatile input bar that interprets various commands and actions. The SmartBar component is designed to handle multiple types of inputs and execute corresponding actions.
- **Resource Monitoring**: View real-time CPU and memory usage. The Footer component displays system resource usage to help you monitor your development environment.

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
2. Enter a shell command prefixed with `>` (e.g., `> ls`).
3. Press Enter to execute the command.

### Cloning a Git Repository

1. Use the Smart Bar.
2. Enter the Git repository URL.
3. Press Enter to clone the repository into your workspace.

### Monitoring Resources

1. View the footer of the application.
2. Check the real-time CPU and memory usage displayed.

## Technical Aspects

Code Launcher is built using modern web technologies including React, TypeScript, and Tailwind CSS. It leverages [Valtio](https://github.com/pmndrs/valtio) for state management and integrates with various APIs to provide its functionality. The backend services are designed to handle command execution and project management efficiently.

### Project Structure

The project is organized as follows:

```
.gitignore
.next/
app/
components/
lib/
public/
README.md
tailwind.config.ts
tsconfig.json
```

### Key Components

- **Launcher**: The main component that ties together the Smart Bar, Project Templates, Projects List, and Footer.
- **SmartBar**: Handles user input for commands and actions.
- **ProjectsList**: Displays a list of existing projects.
- **ProjectTemplates**: Provides templates for creating new projects.
- **Footer**: Displays system resource usage.

### State Management

State management is handled using Valtio. The store maintains the state of the application, including project lists, command outputs, and system stats.

### API Service

The apiService handles communication with the backend. It provides methods to fetch project lists and run commands.

### Templates

Project templates are defined in templates.ts. These templates provide predefined setups for various types of projects, making it easy to get started with new projects.

### Styling

Styling is managed using Tailwind CSS. Global styles are defined in globals.css.
