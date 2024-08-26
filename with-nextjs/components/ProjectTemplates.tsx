'use client';

import { runCommand } from '@/lib/commands';
import templates from '@/lib/templates';
import useCommandResultStore from '@/hooks/useCommandResultStore';
import React from 'react';

const ProjectTemplates: React.FC = () => {
  const { setResult } = useCommandResultStore();

  const createProjectFolder = (template: any) => {
    const folderName = prompt(`Enter the project folder name for ${template.name}:`);
    if (folderName) {
      const command = template.command.replace(/\{folderName\}/g, folderName);
      runCommand(command).then(data => setResult(data));
    }
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'>
      {templates.map((template, index) => (
        <button
          key={index}
          className='flex flex-col items-center p-4 bg-gray-800 border border-gray-700 rounded-lg transition duration-200 hover:bg-gray-700 hover:border-blue-500'
          onClick={() => createProjectFolder(template)}
        >
          <img
            src={template.icon}
            alt={`${template.name} icon`}
            className='w-12 h-12 mb-2 invert'
          />
          <span>{template.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ProjectTemplates;
