import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import os from 'os';

export async function POST(request: Request) {
  const { command } = await request.json();

  return new Promise(resolve => {
    exec(command, (error, stdout, stderr) => {
      const commandOutput = stdout || stderr || 'Command executed successfully.';

      const cpuUsage = os.loadavg()[0].toFixed(2);
      const memUsage = (1 - os.freemem() / os.totalmem()).toFixed(2);

      const result = {
        commandOutput,
        command,
        cpuUsage,
        memUsage,
      };

      resolve(NextResponse.json(result));
    });
  });
}
