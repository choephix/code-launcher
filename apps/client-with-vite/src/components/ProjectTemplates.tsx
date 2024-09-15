'use client';

import React from 'react';

import { apiService } from '@/lib/apiService';
import { useStore, actions } from '@/lib/store';

const ProjectTemplates: React.FC = () => {
  const { isSomeActionRunning, lastCommandOutput, configuration, uiState, idePath } = useStore();
  const { templates } = configuration;

  if (!uiState.showTemplates) return null;

  if (isSomeActionRunning) return null;

  if (lastCommandOutput) return null;

  const createProjectFolder = async (template: any) => {
    const folderName = prompt(`Enter the project folder name for ${template.name}:`);
    if (folderName) {
      actions.setIsSomeActionRunning(true);
      try {
        const command = template.command.replace(/\{folderName\}/g, folderName);
        await apiService.runCommand(command);

        const ideCmd = idePath;
        await apiService.runCommand(`${ideCmd} ~/workspace/${folderName}`);
      } finally {
        actions.setIsSomeActionRunning(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.map((template, index) => (
        <button
          key={index}
          className="flex flex-col items-center p-4 bg-gray-800 border border-gray-700 rounded-lg transition duration-200 hover:bg-gray-700 hover:border-blue-500 animate-fade-in-pop"
          style={{
            opacity: 0,
            animationDelay: `${index * 33.33}ms`,
            animationFillMode: 'forwards',
          }}
          onClick={() => createProjectFolder(template)}
        >
          <img src={template.icon} alt={`${template.name} icon`} className="w-12 h-12 mb-2 invert" />
          <span className="text-xs">{template.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ProjectTemplates;
