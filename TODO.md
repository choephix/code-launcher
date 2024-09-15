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

- [ ] Refactor api to list not just strings for folder/file lists, but objects with helpful shit
  - [ ] Folder: last changes in any file datetime?
  - [ ] Icon: just get the first image one you find, [favicon|logo].[ico|png|svg]
- [ ] Add Directories/Workspaces/Git Repos tabs

- [ ] Configurability through .code-launcher.yaml - Default search engine (google)
- [x] Configurability through .code-launcher.yaml - Default IDE command (code)

- [x] IDE command uses relative paths instead of absolute, which breaks click actions
