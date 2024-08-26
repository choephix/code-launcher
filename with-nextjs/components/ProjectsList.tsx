// components/ProjectsList.tsx

import React from 'react';

interface ProjectsListProps {
  projects: string[];
  onProjectClick: (project: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onProjectClick }) => {
  return (
    <div className='bg-gray-800 border border-gray-700 rounded-lg p-4 mb-8'>
      <h2 className='text-2xl font-bold text-blue-400 mb-4'>Existing Projects</h2>
      <div className='space-y-2'>
        {projects.map((project, index) => (
          <button
            key={index}
            className='w-full text-left p-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition duration-200 flex justify-between items-center'
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
