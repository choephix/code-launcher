'use client';

import { apiService } from '@/lib/apiService';
import { useStore } from '@/lib/store';

export default function ExtraTools() {
  const { lastCommandOutput, stats } = useStore();

  const runCustomCommand = () => {
    const command = prompt('Enter the command to run:');
    if (command) {
      apiService.runCommand(command);
    }
  };

  return (
    <>
      <div className='bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4'>
        <div className='flex justify-start space-x-4 border-b border-gray-700 pb-2 mb-2'>
          <button
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200'
            onClick={runCustomCommand}
          >
            Run Custom Command
          </button>
        </div>
        {
          <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
            {lastCommandOutput && (
              <div>
                <h2 className='text-xl font-semibold text-blue-400 pb-2 mb-2'>Command Output</h2>
                <pre className='bg-gray-900 p-2 rounded-md overflow-x-auto'>
                  {lastCommandOutput}
                </pre>
              </div>
            )}
            <div>
              <h2 className='text-xl font-semibold text-blue-400 pb-2 mb-2'>System Stats</h2>
              <p>CPU Usage: {stats.cpuUsage}%</p>
              <p>Memory Usage: {stats.memUsage}%</p>
            </div>
          </div>
        }
      </div>
    </>
  );
}
