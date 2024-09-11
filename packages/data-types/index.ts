export interface WorkspaceConfiguration {
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
