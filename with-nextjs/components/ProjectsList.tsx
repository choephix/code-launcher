'use client';

import React, { useEffect } from 'react';
import { FolderIcon } from 'lucide-react';

import { apiService } from '@/lib/apiService';
import { actions, useStore } from '@/lib/store';
import { urlParams } from '@/lib/urlParams';

const ProjectsList: React.FC = () => {
  const { projects } = useStore();

  useEffect(() => {
    actions.refreshProjects();
  }, []);

  const ideCmd = urlParams.ide;
  const onProjectClick = async (project: string) => {
    const command = ideCmd + ` ~/workspace/${project}`;
    await apiService.runCommand(command);
  };

  return (
    <div className='bg-gray-800 border border-gray-700 rounded-lg overflow-hidden w-fullshadow-lg'>
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
              className='w-full text-left py-1 px-4 bg-gray-800 group hover:bg-gray-700 transition duration-200 hover:duration-0 flex justify-between items-center text-sm animate-fade-in-left'
              style={{
                opacity: 0,
                animationDelay: `${index * 16.67}ms`,
                animationFillMode: 'forwards',
              }}
              onClick={() => onProjectClick(project)}
            >
              <span>
                <FolderIcon size='1em' className='inline-block' /> &nbsp; {project}
              </span>
              <span className='text-blue-400'>→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
