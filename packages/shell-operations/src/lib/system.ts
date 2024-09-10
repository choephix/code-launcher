import os from 'os';

interface SystemStats {
  cpuUsage: number | null;
  memUsage: number | null;
}

export function getMemoryAndCPU(): SystemStats {
  try {
    const cpuUsage = os.loadavg()[0];
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memUsage = (totalMemory - freeMemory) / totalMemory;

    return {
      cpuUsage: cpuUsage ?? null,
      memUsage: memUsage ?? null,
    };
  } catch (error) {
    console.error(`Error getting system stats: ${error}`);
    return {
      cpuUsage: null,
      memUsage: null,
    };
  }
}
