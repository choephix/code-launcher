import path from 'path';

import { CodeLauncherServerActionResult } from '@code-launcher/data-types';
import {
  getGitRemoteDomain,
  getGitRepoDirectories as getGitRepositories,
  getProjectDirectoriesList,
  getVSCodeWorkspaceFiles,
  getWorkspaceConfiguration,
} from './lib/files';
import { runCommand } from './lib/shell';
import { getMemoryAndCPU } from './lib/system';

export function createCodeLauncherServerActions(pathToWorkspaces: string) {
  pathToWorkspaces = path.resolve(pathToWorkspaces);

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
      workspaceInfo: {
        rootDirectories: rootDirectories.map(dir => ({
          relativePath: dir,
          absolutePath: path.resolve(pathToWorkspaces, dir),
        })),
        vscodeWorkspaceFiles: vscodeWorkspaceFiles.map(dir => ({
          relativePath: dir,
          absolutePath: path.resolve(pathToWorkspaces, dir),
        })),
        gitRepositories: gitRepositories,
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

//// Experimental
export * from './lib/shell-stream';
