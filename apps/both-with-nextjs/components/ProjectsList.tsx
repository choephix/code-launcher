'use client';

import React, { useEffect } from 'react';
import { FolderIcon, PlusIcon } from 'lucide-react';

import { apiService } from '@/lib/apiService';
import { actions, useStore } from '@/lib/store';
import { urlParams } from '@/lib/urlParams';

const ProjectsList: React.FC = () => {
  const { projects, uiState } = useStore();

  useEffect(() => {
    actions.refreshProjects();
  }, []);

  const ideCmd = urlParams.ide;
  const onProjectClick = async (project: string) => {
    const command = ideCmd + ` ~/workspace/${project}`;
    await apiService.runCommand(command);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-2 px-2 border-b-2 border-gray-700">
        <h2 className="text-xs font-semibold text-gray-300">Existing Project Directories</h2>
        <button
          onClick={actions.toggleShowTemplates}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center"
        >
          {uiState.showTemplates ? (
            'Hide Templates'
          ) : (
            <>
              <PlusIcon size={14} className="mr-1" />
              Create
            </>
          )}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex items-center justify-center py-4 border-b border-gray-700">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-xs text-gray-400">Loading...</span>
        </div>
      ) : (
        <ul className="divide-y divide-gray-700">
          {projects.map((project, index) => (
            <li
              key={index}
              className="animate-fade-in-left"
              style={{
                animationDelay: `${index * 16.67}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <button
                className="w-full text-left py-1 px-2 text-gray-300 hover:text-white hover:bg-gray-700 transition duration-200 flex justify-between items-center text-xs"
                onClick={() => onProjectClick(project)}
              >
                <span className="flex items-center">
                  <FolderIcon size={12} className="mr-1" />
                  {project}
                </span>
                <span className="text-blue-400 text-xs">→</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsList;
