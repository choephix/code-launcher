'use client';

import { runCommand } from '@/lib/commands';
import { actions, useStore } from '@/lib/store';
import { urlParams } from '@/lib/urlParams';
import React, { useEffect } from 'react';

const ProjectsList: React.FC = () => {
  const { projects } = useStore();

  useEffect(() => {
    actions.refreshProjects();
  }, []);

  const ideCmd = urlParams.ide;
  const onProjectClick = async (project: string) => {
    const command = ideCmd + ` ~/workspace/${project}`;
    const data = await runCommand(command);
    actions.setCommandResult(data);
  };

  return (
    <div className='bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8'>
      <h2 className='text-xl font-bold text-blue-400 p-4 border-b border-gray-700'>
        Existing Project Directories
      </h2>
      {projects.length === 0 ? (
        <div className='flex items-center justify-center p-8'>
          <div className='flex items-center flex-col text-center gap-4'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2'></div>
            <span className='text-gray-400'>Loading directories list...</span>
          </div>
        </div>
      ) : (
        <div className='divide-y divide-gray-700'>
          {projects.map((project, index) => (
            <button
              key={index}
              className='w-full text-left py-1 px-4 bg-gray-800 hover:bg-gray-700 transition duration-200 flex justify-between items-center text-sm'
              onClick={() => onProjectClick(project)}
            >
              <span>
                <FolderIcon /> &nbsp; {project}
              </span>
              <span className='text-blue-400'>→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const FolderIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='lucide lucide-folder inline-block'
  >
    <path d='M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z' />
  </svg>
);

export default ProjectsList;
