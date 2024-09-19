import { actions, useStore } from '@/lib/store';
import { ChevronsDownIcon, XIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

const fitAddon = new FitAddon();
const webLinksAddon = new WebLinksAddon();

const SmartBarCommandOutput: React.FC = () => {
  const { lastCommandOutput } = useStore();
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);

  useEffect(() => {
    if (terminalRef.current && lastCommandOutput) {
      if (!terminalInstance.current) {
        terminalInstance.current = new Terminal({
          cursorBlink: true,
          fontSize: 12,
          fontFamily: 'Consolas, "Courier New", monospace',
          theme: {
            background: '#1e1e1e',
            foreground: '#d4d4d4',
          },
        });

        terminalInstance.current.loadAddon(fitAddon);

        terminalInstance.current.loadAddon(webLinksAddon);

        terminalInstance.current.open(terminalRef.current);
        fitAddon.fit();
      }

      terminalInstance.current.clear();
      // terminalInstance.current.write(lastCommandOutput);

      const lastCommandOutputLines = lastCommandOutput.split('\n');
      lastCommandOutputLines.forEach((line: string) => {
        terminalInstance.current?.writeln(line);
      });

      fitAddon.fit();
    }

    const interval = setInterval(() => {
      fitAddon.fit();
    }, 100);

    return () => clearInterval(interval);
  }, [lastCommandOutput]);

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
        <div ref={terminalRef} className="h-64" />
      </div>
    </>
  );
};

export default SmartBarCommandOutput;
