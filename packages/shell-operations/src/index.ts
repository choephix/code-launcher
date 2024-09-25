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
import { createCachedFunction } from './utils/caching';

export function createCodeLauncherServerActions(pathToWorkspaces: string) {
  pathToWorkspaces = path.resolve(pathToWorkspaces);

  const cachedGetTheStuff = createCachedFunction('getTheStuff', getTheStuff, 300000); // 5 minutes TTL

  async function getTheStuff() {
    console.log('🔍 Fetching workspace data...');
    const { cpuUsage, memUsage } = getMemoryAndCPU();
    const systemInfo = getSystemInfo();

    const [configuration, rootDirectories, vscodeWorkspaceFiles, gitRepositories] = await Promise.all([
      getWorkspaceConfiguration(pathToWorkspaces),
      getProjectDirectoriesList(pathToWorkspaces),
      getVSCodeWorkspaceFiles(pathToWorkspaces),
      getGitRepositories(pathToWorkspaces),
    ]);

    console.log('✅ Workspace data fetched successfully');
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
      return await cachedGetTheStuff();
    },

    runCommand: async (command: string) => {
      console.log(`🚀 Running command: ${command}`);
      const { output, exitCode } = await runCommand(command, {
        cwd: pathToWorkspaces,
      });
      const workspaceState = await cachedGetTheStuff();

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

  const cachedFindOpenPorts = createCachedFunction('findOpenPorts', scanOpenPorts, 60000); // 1 minute TTL

  return {
    findOpenPorts: async () => {
      console.log('🔍 Scanning for open ports...');
      const result = await cachedFindOpenPorts();
      console.log('✅ Port scan completed');
      return result;
    },
  } satisfies Record<string, (...args: any[]) => Promise<any>>;
}

//// Experimental
// export * from './experimental/shell-stream';
export * from './experimental/hello-world';
export { runCommandStream } from './experimental/shell-iterative';
