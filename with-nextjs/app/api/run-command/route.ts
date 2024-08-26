import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import os from 'os';

export async function POST(request: Request) {
  const { command } = await request.json();

  return new Promise<NextResponse>((resolve) => {
    console.log(`▶ Executing command: ${command}`);

    const process = spawn(command, [], { shell: true });

    let commandOutput = '';

    process.stdout.on('data', (data) => {
      const output = data.toString();
      commandOutput += output;
      console.log('[STDOUT]:', output); // Stream to backend console
    });

    process.stderr.on('data', (data) => {
      const error = data.toString();
      commandOutput += error;
      console.error('[STDERR]:', error); // Stream errors to backend console
    });

    process.on('close', (code) => {
      const cpuUsage = os.loadavg()[0].toFixed(2);
      const memUsage = (1 - os.freemem() / os.totalmem()).toFixed(2);

      const result = {
        commandOutput,
        command,
        cpuUsage,
        memUsage,
        exitCode: code,
      };

      console.log(`Command exited with code ${code}`);
      resolve(NextResponse.json(result));
    });
  });
}
