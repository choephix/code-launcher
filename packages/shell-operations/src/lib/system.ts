import os from 'os';
import fs from 'fs';

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

export function getSystemInfo() {
  const platform = os.platform();

  const cpuUsage = os.loadavg()[0];
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memUsage = (totalMemory - freeMemory) / totalMemory;

  const wslDistroName = process.env.WSL_DISTRO_NAME;
  const wslInterop = process.env.WSL_INTEROP;
  const isWSL = process.platform === 'linux' && (wslDistroName || wslInterop);

  // const procVersion = fs.readFileSync('/proc/version', 'utf8').toLowerCase();
  // const procVersionLowerCase = procVersion.toLowerCase();
  // if (procVersion.includes('microsoft') || procVersion.includes('wsl')) isWSL = true;

  return {
    platform,
    architecture: os.arch(),
    kernelVersion: os.release(),
    type: os.type(),
    userInfo: os.userInfo(),
    memTotal: totalMemory,
    memFree: freeMemory,
    memUsage,
    cpuUsage,
    isWSL,
    wslDistroName,
    wslInterop,
  };
}
