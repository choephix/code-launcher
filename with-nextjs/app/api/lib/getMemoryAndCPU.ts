import os from 'os';

interface SystemStats {
  cpuUsage: number;
  memUsage: number;
}

export function getMemoryAndCPU(): SystemStats {
  const cpuUsage = os.loadavg()[0];
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memUsage = (totalMemory - freeMemory) / totalMemory;

  return {
    cpuUsage: cpuUsage,
    memUsage: memUsage,
  };
}
