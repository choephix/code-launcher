// components/ProjectsList.tsx

import React from 'react';

interface ProjectsListProps {
  projects: string[];
  onProjectClick: (project: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onProjectClick }) => {
  return (
    <div className='bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8'>
      <h2 className='text-xl font-bold text-blue-400 p-4 border-b border-gray-700'>
        Existing Projects
      </h2>
      <div className='divide-y divide-gray-700'>
        {projects.map((project, index) => (
          <button
            key={index}
            className='w-full text-left py-1 px-4 bg-gray-800 hover:bg-gray-700 transition duration-200 flex justify-between items-center text-xs'
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
