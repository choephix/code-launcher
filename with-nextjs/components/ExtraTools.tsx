'use client';

import { useStore } from '@/lib/store';

export default function ExtraTools() {
  const { stats } = useStore();

  return (
    <>
      <div className='bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4'>
        <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
          <div>
            <h2 className='text-xl font-semibold text-blue-400 pb-2 mb-2'>System Stats</h2>
            <p>CPU Usage: {stats.cpuUsage}%</p>
            <p>Memory Usage: {stats.memUsage}%</p>
          </div>
        </div>
      </div>
    </>
  );
}
