import { getProjectDirectoriesList } from './lib/files';
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

export const CodeLauncherServerActions = {
  getProjectDirectoriesList: async () => {
    const projects = await getProjectDirectoriesList();
    const { cpuUsage, memUsage } = getMemoryAndCPU();
    return {
      projects,
      stats: { cpuUsage, memUsage },
      exitCode: null,
    };
  },

  runCommand: async (command: string) => {
    const { output, exitCode } = await runCommand(command);
    const projects = await getProjectDirectoriesList();
    const { cpuUsage, memUsage } = getMemoryAndCPU();

    return {
      commandOutput: output,
      stats: { cpuUsage, memUsage },
      projects,
      exitCode,
    };
  },
} satisfies Record<string, (...args: any[]) => Promise<CodeLauncherServerActionResult>>;
