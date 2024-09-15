'use client';

import { FolderIcon, PlusIcon } from 'lucide-react';
import React from 'react';

import { apiService } from '@/lib/apiService';
import { actions, useStore } from '@/lib/store';

const ProjectsList: React.FC = () => {
  const { projects, uiState, pathToWorkspaces, idePath } = useStore();

  const onProjectClick = async (project: string) => {
    const command = `${idePath} "${pathToWorkspaces}/${project}"`;
    await apiService.runCommand(command);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-2 px-2 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">Existing Project Directories</h2>
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

      {projects === null ? (
        <div className="flex items-center justify-center py-4 border-b border-gray-700">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-xs text-gray-400">Loading...</span>
        </div>
      ) : (
        <ul className="">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <li
                key={index}
                className="animate-fade-in-left opacity-0 border-b border-gray-700"
                style={{
                  animationDelay: `${index * 16.67}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <button
                  className="w-full text-left py-1 px-2 text-gray-300 hover:text-white hover:bg-gray-800 transition duration-300 hover:duration-0 flex justify-between items-center text-sm"
                  onClick={() => onProjectClick(project)}
                >
                  <span className="flex items-center">
                    <FolderIcon size={12} className="mr-2 text-gray-500" />
                    {/* <span className="text-gray-500">/</span> */}
                    {project}
                  </span>
                  <span className="text-blue-400 text-xs">→</span>
                </button>
              </li>
            ))
          ) : (
            <div className="flex items-center justify-center py-4 border-b border-gray-700">
              <p>No projects found.</p>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProjectsList;
