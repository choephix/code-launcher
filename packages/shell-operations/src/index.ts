import { getProjectDirectoriesList } from './lib/files';
import { pathToWorkspaces } from './lib/pathToWorkspace';
import { runCommand } from './lib/shell';
import { getMemoryAndCPU } from './lib/system';

type CodeLauncherServerActionResult = {
  projects?: string[];
  stats?: {
    cpuUsage: number | null;
    memUsage: number | null;
  };
  commandOutput?: string;
  exitCode: number | null;
};

export function createCodeLauncherServerActions(_pathToWorkspaces: string) {
  return {
    getProjectDirectoriesList: async () => {
      const projects = await getProjectDirectoriesList(pathToWorkspaces);
      const { cpuUsage, memUsage } = getMemoryAndCPU();
      return {
        pathToWorkspaces,
        projects,
        stats: { cpuUsage, memUsage },
        exitCode: null,
      };
    },

    runCommand: async (command: string) => {
      const { output, exitCode } = await runCommand(command, { cwd: pathToWorkspaces });
      const projects = await getProjectDirectoriesList(pathToWorkspaces);
      const { cpuUsage, memUsage } = getMemoryAndCPU();

      return {
        pathToWorkspaces,
        commandOutput: output,
        stats: { cpuUsage, memUsage },
        projects,
        exitCode,
      };
    },
  } satisfies Record<string, (...args: any[]) => Promise<CodeLauncherServerActionResult>>;
}

export const CodeLauncherServerActions = createCodeLauncherServerActions(pathToWorkspaces);
