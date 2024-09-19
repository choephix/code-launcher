import { spawn, SpawnOptions } from 'child_process';
import os from 'os';
import path from 'path';

export interface CommandResult {
  output: string;
  exitCode: number | null;
}

export async function runCommand(command: string, options: SpawnOptions = {}): Promise<CommandResult> {
  return new Promise(resolve => {
    const defaultOptions: SpawnOptions = {
      shell: true,
      cwd: path.join(os.homedir(), 'workspace'),
      stdio: 'pipe',
    };
    const mergedOptions = { ...defaultOptions, ...options };
    const process = spawn(command, [], mergedOptions);

    let commandOutput: string[] = [];

    const handleOutput = (data: Buffer) => {
      const lines = data.toString().split('\n');
      commandOutput.push(...lines);
      console.log('🖥️ [OUTPUT]:', JSON.stringify(lines));
    };

    process.stdout?.on('data', handleOutput);
    process.stderr?.on('data', handleOutput);

    process.on('close', code => {
      console.log(`🏁 Command exited with code ${code}`);
      resolve({
        output: commandOutput.join('\n'),
        exitCode: code,
      });
    });
  });
}