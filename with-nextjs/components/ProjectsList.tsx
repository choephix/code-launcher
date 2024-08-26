'use client';

import { fetchProjects, runCommand } from '@/lib/commands';
import useCommandResultStore from '@/hooks/useCommandResultStore';
import React, { useEffect, useState } from 'react';

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects().then(data => setProjects(data.projects));
  }, []);

  const onProjectClick = (project: string) => {
    runCommand(`code ~/workspace/${project}`);
  };

  return (
    <div className='bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8'>
      <h2 className='text-xl font-bold text-blue-400 p-4 border-b border-gray-700'>
        Existing Projects
      </h2>
      <div className='divide-y divide-gray-700'>
        {projects.map((project, index) => (
          <button
            key={index}
            className='w-full text-left py-1 px-4 bg-gray-800 hover:bg-gray-700 transition duration-200 flex justify-between items-center text-sm'
            onClick={() => onProjectClick(project)}
          >
            <span>{project}</span>
            <span className='text-blue-400'>→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
