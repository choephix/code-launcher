import { CodeLauncherServerActionResult } from '@code-launcher/data-types';
import {
  getGitRepoDirectories as getGitRepositories,
  getProjectDirectoriesList,
  getVSCodeWorkspaceFiles,
  getWorkspaceConfiguration,
} from './lib/files';
import { pathToWorkspaces as defaultPathToWorkspaces } from './lib/pathToWorkspace';
import { runCommand } from './lib/shell';
import { getMemoryAndCPU } from './lib/system';

export function createCodeLauncherServerActions(pathToWorkspaces: string) {
  async function getTheStuff() {
    const configuration = await getWorkspaceConfiguration(pathToWorkspaces);
    const { cpuUsage, memUsage } = getMemoryAndCPU();

    const rootDirectories = await getProjectDirectoriesList(pathToWorkspaces);
    const vscodeWorkspaceFiles = await getVSCodeWorkspaceFiles(pathToWorkspaces);
    const gitRepositories = await getGitRepositories(pathToWorkspaces);

    return {
      pathToWorkspaces,
      configuration,
      projects: rootDirectories,
      workspaceFiles: {
        rootDirectories,
        vscodeWorkspaceFiles,
        gitRepositories,
      },
      stats: { cpuUsage, memUsage },
      exitCode: null,
    };
  }

  return {
    getProjectDirectoriesList: async () => {
      const workspaceState = await getTheStuff();
      return workspaceState;
    },

    runCommand: async (command: string) => {
      const { output, exitCode } = await runCommand(command, {
        cwd: pathToWorkspaces,
      });
      const workspaceState = await getTheStuff();

      return {
        ...workspaceState,
        commandOutput: output,
        exitCode,
      };
    },
  } satisfies Record<string, (...args: any[]) => Promise<CodeLauncherServerActionResult>>;
}

export const CodeLauncherServerActions = createCodeLauncherServerActions(defaultPathToWorkspaces);

//// Experimental
export * from './lib/shell-stream';
