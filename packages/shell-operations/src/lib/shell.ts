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

    let commandOutput = '';

    process.stdout?.on('data', data => {
      const output = data.toString();
      commandOutput += output;
      console.log('[STDOUT]:', output);
    });

    process.stderr?.on('data', data => {
      const error = data.toString();
      commandOutput += error;
      console.error('[STDERR]:', error);
    });

    process.on('close', code => {
      console.log(`Command exited with code ${code}`);
      resolve({
        output: commandOutput,
        exitCode: code,
      });
    });
  });
}
