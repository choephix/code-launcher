'use client';

import { FolderIcon, PlusIcon } from 'lucide-react';
import React, { useState } from 'react';

import { actions, useStore } from '@/lib/store';
import { useOpenEditorAt } from '@/lib/hooks/useOpenEditorAt';

type TabType = 'directories' | 'gitRepos' | 'codeWorkspaces';

const ProjectsList: React.FC = () => {
  const { workspaceInfo, uiState, configuration } = useStore();
  const openEditorAt = useOpenEditorAt();
  
  const [activeTab, setActiveTab] = useState<TabType>('directories');

  if (!configuration) return null;

  const onProjectClick = (project: string) => {
    openEditorAt(project);
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

    const itemsMap = {
      directories: workspaceInfo.rootDirectories,
      gitRepos: workspaceInfo.gitRepositories,
      codeWorkspaces: workspaceInfo.vscodeWorkspaceFiles,
    };

    const items = itemsMap[activeTab];

    return (
      <ul className="">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li
              key={`${activeTab}|${index}`}
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

  const tabLabels = {
    directories: 'directories',
    gitRepos: '.git repos',
    codeWorkspaces: '.code-workspaces',
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-2 px-2 border-b border-gray-700">
        <div className="text-sm text-gray-400 flex space-x-2">
          Existing project &nbsp;
          {Object.entries(tabLabels).map(([tab, label], index) => (
            <React.Fragment key={tab}>
              {index > 0 && <span className="text-gray-500">/</span>}
              <button
                className={`transition-colors duration-200 ${
                  activeTab === tab ? 'text-white underline underline-offset-2' : 'text-gray-600 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab as TabType)}
              >
                {label}
              </button>
            </React.Fragment>
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
