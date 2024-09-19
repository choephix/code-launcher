import { spawn, SpawnOptions } from 'child_process';
import os from 'os';
import path from 'path';

export interface CommandResult {
  output: string;
  exitCode: number | null;
}

export interface CommandProgress {
  type: 'stdout' | 'stderr';
  data: string;
}

class AsyncQueue<T> {
  private queue: T[] = [];
  private resolve?: (value: IteratorResult<T>) => void;
  private ended = false;

  enqueue(value: T) {
    if (this.resolve) {
      this.resolve({ value, done: false });
      this.resolve = undefined;
    } else {
      this.queue.push(value);
    }
  }

  end() {
    this.ended = true;
    if (this.resolve) {
      this.resolve({ value: undefined as any, done: true });
      this.resolve = undefined;
    }
  }

  [Symbol.asyncIterator]() {
    return this;
  }

  async next(): Promise<IteratorResult<T>> {
    if (this.queue.length > 0) {
      const value = this.queue.shift()!;
      return { value, done: false };
    } else if (this.ended) {
      return { value: undefined as any, done: true };
    } else {
      return new Promise<IteratorResult<T>>(resolve => {
        this.resolve = resolve;
      });
    }
  }
}

export async function* runCommandStream(
  command: string,
  options: SpawnOptions = {}
): AsyncGenerator<CommandProgress, CommandResult, void> {
  const defaultOptions: SpawnOptions = {
    shell: true,
    cwd: path.join(os.homedir(), 'workspace'),
    stdio: 'pipe',
  };
  const mergedOptions = { ...defaultOptions, ...options };
  const process = spawn(command, [], mergedOptions);

  let commandOutput = '';
  let exitCode: number | null = null;

  const queue = new AsyncQueue<CommandProgress>();

  process.stdout?.on('data', (data: Buffer) => {
    const output = data.toString();
    commandOutput += output;
    queue.enqueue({ type: 'stdout', data: output });
  });

  process.stderr?.on('data', (data: Buffer) => {
    const error = data.toString();
    commandOutput += error;
    queue.enqueue({ type: 'stderr', data: error });
  });

  process.on('close', code => {
    exitCode = code;
    queue.end();
  });

  for await (const progress of queue) {
    yield progress;
  }

  return {
    output: commandOutput,
    exitCode,
  };
}

// Example usage:
export async function runAndLogCommand(command: string) {
  const stream = runCommandStream(command);

  for await (const progress of stream) {
    if (progress.type === 'stdout') {
      console.log('[STDOUT]:', progress.data);
    } else {
      console.error('[STDERR]:', progress.data);
    }
  }

  const result = await stream;
  console.log('Final result:', result);
}
