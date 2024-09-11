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

class Emitter<T, R> implements PromiseLike<R> {
  private listeners: ((value: T) => void)[] = [];
  private resolvePromise: ((value: R) => void) | null = null;
  private promise: Promise<R>;

  constructor() {
    this.promise = new Promise(resolve => {
      this.resolvePromise = resolve;
    });
  }

  emit(value: T) {
    this.listeners.forEach(listener => listener(value));
  }

  on(listener: (value: T) => void) {
    this.listeners.push(listener);
  }

  finish(value: R) {
    if (this.resolvePromise) {
      this.resolvePromise(value);
    }
  }

  then<TResult1 = R, TResult2 = never>(
    onfulfilled?: ((value: R) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  [Symbol.asyncIterator]() {
    return {
      next: () => {
        return new Promise<IteratorResult<T>>(resolve => {
          this.on(value => {
            resolve({ value, done: false });
          });
        });
      },
    };
  }
}

export function runCommandStream(command: string, options: SpawnOptions = {}): Emitter<CommandProgress, CommandResult> {
  const emitter = new Emitter<CommandProgress, CommandResult>();

  const defaultOptions: SpawnOptions = {
    shell: true,
    cwd: path.join(os.homedir(), 'workspace'),
    stdio: 'pipe',
  };
  const mergedOptions = { ...defaultOptions, ...options };
  const process = spawn(command, [], mergedOptions);

  let commandOutput = '';

  process.stdout?.on('data', (data: Buffer) => {
    const output = data.toString();
    commandOutput += output;
    emitter.emit({ type: 'stdout', data: output });
  });

  process.stderr?.on('data', (data: Buffer) => {
    const error = data.toString();
    commandOutput += error;
    emitter.emit({ type: 'stderr', data: error });
  });

  process.on('close', code => {
    emitter.finish({
      output: commandOutput,
      exitCode: code,
    });
  });

  return emitter;
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
