'use client';

import { FolderIcon, PlusIcon } from 'lucide-react';
import React, { useState } from 'react';

import { apiService } from '@/lib/apiService';
import { actions, useStore } from '@/lib/store';

type TabType = 'directories' | 'gitRepos' | 'codeWorkspaces';

const ProjectsList: React.FC = () => {
  const { workspaceInfo, uiState, pathToWorkspaces, idePath, configuration } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('directories');

  const onProjectClick = async (project: string) => {
    const command = `${idePath} "${pathToWorkspaces}/${project}"`;
    await apiService.runCommand(command);
  };

  const renderProjectDirectoriesPrefix = () => {
    switch (configuration.ui.projectDirectoriesPrefix) {
      case 'folderIcon':
        return <FolderIcon size={12} className="mr-2 text-gray-500" />;
      case 'backslash':
        return <span className="text-gray-500">/</span>;
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    if (!workspaceInfo) return null;

    let items: readonly {
      readonly relativePath: string;
      readonly absolutePath: string;
    }[] = [];

    switch (activeTab) {
      case 'directories':
        items = workspaceInfo.rootDirectories;
        break;
      case 'gitRepos':
        items = workspaceInfo.gitRepositories;
        break;
      case 'codeWorkspaces':
        items = workspaceInfo.vscodeWorkspaceFiles;
        break;
    }

    return (
      <ul className="">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li
              key={activeTab + '|' + index}
              className="animate-fade-in-left opacity-0 border-b border-gray-700"
              style={{
                animationDelay: `${index * 16.67}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <button
                className="w-full text-left py-1 px-2 text-gray-300 hover:text-white hover:bg-gray-800 transition duration-300 hover:duration-0 flex justify-between items-center text-sm"
                onClick={() => onProjectClick(item.relativePath)}
              >
                <span className="flex items-center">
                  {renderProjectDirectoriesPrefix()}
                  {item.relativePath}
                </span>
                <span className="text-blue-400 text-xs">→</span>
              </button>
            </li>
          ))
        ) : (
          <div className="flex items-center justify-center py-4 border-b border-gray-700">
            <p>No items found.</p>
          </div>
        )}
      </ul>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-2 px-2 border-b border-gray-700">
        <div className="text-sm font-semibold text-gray-300 flex space-x-2">
          {['directories', 'gitRepos', 'codeWorkspaces'].map(tab => (
            <button
              key={tab}
              className={`hover:text-white transition-colors duration-200 ${
                activeTab === tab ? 'border-b-2 border-blue-400' : ''
              }`}
              onClick={() => setActiveTab(tab as TabType)}
            >
              {tab === 'directories' && 'Existing project'}
              {tab === 'gitRepos' && '.git repos'}
              {tab === 'codeWorkspaces' && '.code-workspaces'}
            </button>
          ))}
        </div>
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

      {workspaceInfo === null ? (
        <div className="flex items-center justify-center py-4 border-b border-gray-700">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-xs text-gray-400">Loading...</span>
        </div>
      ) : (
        renderTabContent()
      )}
    </div>
  );
};

export default ProjectsList;
