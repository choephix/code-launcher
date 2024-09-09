import { spawn } from 'child_process';
import { NextResponse } from 'next/server';
import os from 'os';
import path from 'path';

import { getProjectDirectoriesList } from '../lib/getDirectoriesList';
import { getMemoryAndCPU } from '../lib/getMemoryAndCPU';

export async function POST(request: Request) {
  const { command } = await request.json();

  return new Promise<NextResponse>(resolve => {
    console.log(`▶ Executing command: ${command}`);

    const process = spawn(command, [], { shell: true, cwd: path.join(os.homedir(), 'workspace') });

    let commandOutput = '';

    process.stdout.on('data', data => {
      const output = data.toString();
      commandOutput += output;
      console.log('[STDOUT]:', output);
    });

    process.stderr.on('data', data => {
      const error = data.toString();
      commandOutput += error;
      console.error('[STDERR]:', error);
    });

    process.on('close', async code => {
      const projects = await getProjectDirectoriesList();
      const { cpuUsage, memUsage } = getMemoryAndCPU();

      const result = {
        commandOutput: commandOutput,
        stats: { cpuUsage: cpuUsage, memUsage: memUsage },
        projects: projects,
        exitCode: code,
      };

      console.log(`Command exited with code ${code}`);
      resolve(NextResponse.json(result));
    });
  });
}
