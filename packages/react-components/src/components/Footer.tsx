'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Github, Heart } from 'lucide-react';

const Bar: React.FC<{
  label: string;
  value: number;
  color: string;
  className?: string;
}> = ({ label, value, color, className = '' }) => (
  <div className={'flex items-center ' + className}>
    <div className="w-20 bg-gray-700 rounded-full h-1 mr-2 overflow-hidden">
      <div className={`${color} h-1 `} style={{ width: `${value}%` }}></div>
    </div>
    <span>
      {label} {~~value}%
    </span>
  </div>
);

export default function Footer() {
  const { stats } = useStore();

  return (
    <footer className="mt-8 mb-8 pt-4 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center text-xs text-gray-400">
          <Bar label="CPU" value={stats.cpuUsage} color="bg-blue-500" />
          <div className="mx-2">&nbsp;</div>
          <Bar label="MEM" value={stats.memUsage} color="bg-green-500" />

          <span className="mx-2">|</span>

          <span className="flex items-center">
            Made with <Heart className="text-red-500 mx-1 w-4 h-4" /> by{' '}
            <a
              href="https://github.com/choephix"
              className="ml-1 hover:text-blue-400 transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>choephix</b>
            </a>
            <span className="mx-2">|</span>
            <a
              href="https://github.com/choephix/code-launcher/stargazers"
              className="flex items-center hover:text-blue-400 transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-1 w-4 h-4" /> Star on GitHub
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
