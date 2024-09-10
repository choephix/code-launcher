'use client';

import { useStore } from '@/lib/store';
import React from 'react';

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

export default function MachineStats() {
  const { stats } = useStore();

  return (
    <footer className="my-1 py-1 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center text-xs text-gray-400">
          <Bar label="CPU" value={stats.cpuUsage} color="bg-blue-500" />
          <div className="mx-2">&nbsp;</div>
          <Bar label="MEM" value={stats.memUsage} color="bg-green-500" />
        </div>
      </div>
    </footer>
  );
}
