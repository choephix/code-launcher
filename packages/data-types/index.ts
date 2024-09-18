export interface WorkspaceConfiguration {
  ui: {
    projectDirectoriesPrefix: 'folderIcon' | 'backslash' | null;
  };
  editors: {
    name: string;
    shellExecutable?: string;
    urlTemplate?: string;
  }[];
  templates: {
    name: string;
    icon: string;
    command: string;
  }[];
}

export interface CodeLauncherServerActionResult {
  pathToWorkspaces: string;
  configuration?: WorkspaceConfiguration;
  workspaceInfo?: {
    rootDirectories: {
      dirName: string;
      relativePath: string;
      absolutePath: string;
      lastModified: number;
      isGitRepo: boolean;
    }[];
    vscodeWorkspaceFiles: {
      relativePath: string;
      absolutePath: string;
    }[];
    gitRepositories: {
      relativePath: string;
      absolutePath: string;
      originDomain: string | null;
      status: {
        ahead: number;
        behind: number;
        branch: string;
        lastCommitHash: string;
        lastCommitDate: string;
        lastCommitMessage: string;
        unstagedChanges: number;
        stagedChanges: number;
        stashes: number;
      } | null;
    }[];
  };
  stats?: {
    cpuUsage: number | null;
    memUsage: number | null;
  };
  commandOutput?: string;
  exitCode: number | null;
}
