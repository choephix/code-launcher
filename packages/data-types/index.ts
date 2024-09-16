export interface WorkspaceConfiguration {
  ui: {
    projectDirectoriesPrefix: 'folderIcon' | 'backslash' | null;
  };
  editors: {
    name: string;
    shellExecutable?: string;
    urlTemplate?: string;
  }[];
  idePaths: {
    name: string;
    path: string;
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
  projects?: string[];
  workspaceInfo?: {
    rootDirectories: any[];
    vscodeWorkspaceFiles: any[];
    gitRepositories: any[];
  };
  stats?: {
    cpuUsage: number | null;
    memUsage: number | null;
  };
  commandOutput?: string;
  exitCode: number | null;
}
