import { actions, useStore } from '@/lib/store';
import { ChevronsDownIcon, XIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { ITerminalOptions, Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

const SmartBarCommandOutput: React.FC = () => {
  const { lastCommandOutput } = useStore();
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);

  const lastCommandOutputLines = lastCommandOutput?.split('\n') ?? [];
  lastCommandOutputLines.pop();
  console.log('lastCommandOutput', lastCommandOutputLines);

  const terminalOptions: ITerminalOptions = {
    cursorBlink: true,
    fontSize: 12,
    fontFamily: 'Consolas, "Courier New", monospace',
    theme: {
      background: '#0000',
      foreground: '#d4d4d4',
    },
  };

  useEffect(() => {
    if (terminalInstance.current) return;

    if (!terminalRef.current) return;

    if (!lastCommandOutput) return;

    terminalInstance.current = new Terminal(terminalOptions);

    const fitAddon = new FitAddon();
    terminalInstance.current.loadAddon(fitAddon);

    const webLinksAddon = new WebLinksAddon();
    terminalInstance.current.loadAddon(webLinksAddon);

    terminalInstance.current.open(terminalRef.current);
    fitAddon.fit();

    const interval = setInterval(() => fitAddon.fit(), 100);
    return () => clearInterval(interval);
  }, [terminalOptions]);

  useEffect(() => {
    const terminal = terminalInstance.current;
    if (!terminal) return;

    console.log('Clearing terminal');

    if (!lastCommandOutput) return;

    const handle = requestAnimationFrame(() => {
      terminal.clear();
      lastCommandOutputLines.forEach((line: string) => {
        console.log('🖥️ [OUTPUT]:', line);
        terminal.writeln(line);
      });
    });

    return () => {
      cancelAnimationFrame(handle);
      terminal.clear();
    };
  }, [terminalInstance.current, lastCommandOutput]);

  if (!lastCommandOutput) return null;

  const handleClose = () => {
    actions.clearCommandOutput();
  };

  return (
    <>
      <div className="text-center line-height-0">
        <ChevronsDownIcon className="text-gray-400 w-4 h-4 inline-block" />
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-start animate-slide-in-from-up relative min-h-32">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-200 transition-colors"
        >
          <XIcon size="1em" />
        </button>
        <h2 className="px-2 text-xmd font-bold text-blue-400 mb-2">Command Output</h2>
        <div className="border border-gray-700 rounded-md p-2 relative" style={{ background: '#0002' }}>
          <div ref={terminalRef} />
        </div>
      </div>
    </>
  );
};

export default SmartBarCommandOutput;
