export interface WorkspaceConfiguration {
  ui: {
    projectDirectoriesPrefix: "folderIcon" | "backslash" | null;
  };
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
  stats?: {
    cpuUsage: number | null;
    memUsage: number | null;
  };
  commandOutput?: string;
  exitCode: number | null;
}
