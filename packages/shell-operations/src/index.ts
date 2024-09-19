import path from 'path';

import { CodeLauncherServerActionResult } from '@code-launcher/data-types';
import {
  getGitRepoDirectories as getGitRepositories,
  getProjectDirectoriesList,
  getVSCodeWorkspaceFiles,
  getWorkspaceConfiguration,
} from './lib/files';
import { scanOpenPorts } from './lib/ports';
import { runCommand } from './lib/shell';
import { getMemoryAndCPU, getSystemInfo } from './lib/system';

export function createCodeLauncherServerActions(pathToWorkspaces: string) {
  pathToWorkspaces = path.resolve(pathToWorkspaces);

  async function getTheStuff() {
    const { cpuUsage, memUsage } = getMemoryAndCPU();
    const systemInfo = getSystemInfo();

    const [configuration, rootDirectories, vscodeWorkspaceFiles, gitRepositories] = await Promise.all([
      getWorkspaceConfiguration(pathToWorkspaces),
      getProjectDirectoriesList(pathToWorkspaces),
      getVSCodeWorkspaceFiles(pathToWorkspaces),
      getGitRepositories(pathToWorkspaces),
    ]);

    return {
      pathToWorkspaces,
      configuration,
      workspaceInfo: {
        rootDirectories: rootDirectories,
        vscodeWorkspaceFiles: vscodeWorkspaceFiles,
        gitRepositories: gitRepositories,
      },
      stats: { cpuUsage, memUsage },
      systemInfo,
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

export function createCodeLauncherServerExtraActions(pathToWorkspaces: string) {
  pathToWorkspaces = path.resolve(pathToWorkspaces);

  return {
    findOpenPorts: async () => {
      return await scanOpenPorts();
    },
  } satisfies Record<string, (...args: any[]) => Promise<any>>;
}

//// Experimental
export * from './experimental/shell-stream';
