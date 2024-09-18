- [ ] Proper backend error handling (e.g. non-existent workspace folder)
- [ ] Stream commmand output
  - [ ] Pulsing animation on last line of output while running
  - [ ] Move spinner in place of the button while running
- [ ] Cache workspace state in localstorage for faster load time
  - [ ] Make parts of app non-interactable while loading
- [x] Clean up server console logs
- [x] Add tiny top-ribbon with current workspace and maybe settings?
- [ ] Multiple workspace support
- [ ] Add version bump npm scripts (esp for minor)

- [x] Refactor api to list not just strings for folder/file lists, but objects with helpful shit
  - [x] Folder: last changes in any file datetime?
  - [ ] Icon: just get the first image one you find, [favicon|logo].[ico|png|svg]
  - [x] For folders: is git repo
  - [x] For folders and repos: commits ahead/behind (gitinfo?)
- [x] Add Directories/Workspaces/Git Repos tabs

- [ ] Configurability through .code-launcher.yaml - Default search engine (google)
- [x] Configurability through .code-launcher.yaml - Default IDE command (code)

- [x] IDE command uses relative paths instead of absolute, which breaks click actions

- [x] Open VSCode/Cursor client-side.
  - <a href="vscode://file/a%3A/Revoltage">Open in VS Code Windows</a>
  - <a href="vscode://vscode-remote/wsl+Ubuntu/home/cx/workspace/nilo-4">Open in VS Code WSL</a>
  - <a href="cursor://vscode-remote/wsl+Ubuntu/home/cx/workspace/nilo-4">Open in Cursor</a>
  - <a href="vscode://file//Users/username/My%20Project/">Open My Project in VS Code Mac</a>
  - <a href="vscode://file//home/username/project/myworkspace.code-workspace">Open Workspace</a>
  - <a href="vscode://file/c%3A/Users/username/project/myworkspace.code-workspace">Open Workspace Win</a>
  - <a href="vscode://file//home/username/project/main.py:10:5">Open main.py at Line 10, Column 5</a>
  - <a href="vscode://vscode-remote/ssh-remote+myserver/home/username/project/">Open Remote Project in VS Code</a>
  - <a href="vscode://vscode-remote/container+mycontainerid/home/project/">Open Container Project in VS Code</a>
  - <a href="vscode://github.codespaces/connect?name=mycodespace">Open GitHub Codespace in VS Code</a>
  - <a href="vscode://command/workbench.action.showCommands">Open Command Palette</a>
  - <a href="vscode://command/extension.sayHello?%5B%22World%22%5D">Say Hello to World</a>
  - <a href="vscode://command/workbench.action.debug.start">Start Debugging</a>
  - <a href="vscode://command/workbench.action.openSettings">Open Settings</a>

- [x] Persist selected projects list tab via localstorage

- [ ] Disable project list item while opening (incl muted visual)
  - [ ] Stream command output to row component instead of globally? (if shell type)
    - [ ] And differentiate between editors, so 1 output per editor, with disablement if current editor output ongoing
