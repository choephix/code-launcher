# `code:launcher`

---

## Overview

`code:launcher` is a visual tool designed to streamline the process of initializing various front-end and back-end web development projects. It offers a graphical interface to quickly start new projects using popular web development frameworks and libraries. This interface allows developers to skip the manual setup process for different project types, improving efficiency, especially when working with multiple project types or testing new setups.

## Key Features

- **Template-Based Project Creation**: Select from a variety of project templates including Next.js, Vite, Three.js, and more, for both front-end and back-end development.
- **Existing Project Management**: View and access your existing projects directly from the UI.
- **Integrated CLI Command Runner**: Use the built-in CLI command runner to quickly execute project-specific commands without leaving the interface.
- **Frameworks and Tools Supported**:
  - **Next.js**: Full-stack React framework for building web applications.
  - **Vite (Vanilla/React + TypeScript)**: Lightweight front-end build tool that offers fast development and hot module replacement.
  - **Three.js**: 3D graphics library for rendering 3D content in the browser.
  - **Pixi.js**: A fast 2D rendering engine.
  - **Express + TypeScript**: Node.js web application framework, enhanced with TypeScript.
  - **Astro**: Static site generator optimized for performance.
  - **Elysia**: A new framework for building fast, scalable APIs.
  - **Turbo Monorepo**: Tooling for managing monorepos with TurboRepo.
  - **v0 Powered App**: Likely refers to a framework or library utilizing version 0 of a specific technology.

## How to Use

1. **Start a New Project**: 
   - Select one of the project templates by clicking on the desired option (e.g., Next.js, Vite, Three.js, etc.).
   - The selected template will initialize a new project with the necessary configuration and folder structure.

2. **Access Existing Projects**:
   - Scroll down to the "Existing Project Directories" section.
   - Click on any existing project to open or manage the project.

3. **Run CLI Commands**:
   - Enter commands in the CLI input field (indicated by the prompt `> + CLI command`) to run specific tasks or commands related to your project.
   
4. **Custom Configuration**:
   - For advanced users, modify configurations of the initialized projects by editing the respective `config` or `.env` files in the generated project directories.

## Installation

### Prerequisites
- **Node.js**: Ensure you have Node.js installed (v14+ recommended).
- **Git**: For cloning templates if not locally available.

### Installation Steps

1. **Clone the Repository**:  
   ```bash
   git clone https://github.com/your-repo/code-launcher.git
   cd code-launcher
   ```

2. **Install Dependencies**:  
   ```bash
   npm install
   ```

3. **Start the Application**:  
   ```bash
   npm start
   ```

4. **Access the UI**:  
   Open a browser and navigate to `http://localhost:19999` to start using the interface.

## Contribution

Feel free to fork this repository, submit issues, or send pull requests. All contributions are welcome.

## License

This project is licensed under the MIT License.

---

### Developer Notes

- **Customization**: Modify the available project templates by editing the configuration files in the `/templates` directory.
- **CLI Commands**: You can use the CLI input to execute custom commands such as `npm install`, `git init`, or any other terminal-based command.
  
