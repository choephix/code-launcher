'use client';

import React from 'react';

import { runCommand } from '@/lib/commands';
import { actions } from '@/lib/store';
import templates from '@/lib/templates';
import { urlParams } from '@/lib/urlParams';

const ProjectTemplates: React.FC = () => {
  const createProjectFolder = async (template: any) => {
    const folderName = prompt(`Enter the project folder name for ${template.name}:`);
    if (folderName) {
      const command = template.command.replace(/\{folderName\}/g, folderName);
      const data = await runCommand(command);
      actions.setCommandResult(data);

      const ideCmd = urlParams.ide;
      await runCommand(`${ideCmd} ~/workspace/${folderName}`);
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
