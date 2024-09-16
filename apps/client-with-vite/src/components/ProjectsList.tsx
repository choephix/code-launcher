'use client';

import { CodeIcon, FolderIcon, GithubIcon, GitPullRequestIcon, PlusIcon, ChevronDownIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import { useOpenEditorAt } from '@/lib/hooks/useOpenEditorAt';
import { actions, useStore } from '@/lib/store';
// import { useSelectedEditor } from '@/lib/hooks/useSelectedEditor';

type TabType = 'directories' | 'gitRepos' | 'codeWorkspaces';

const ProjectsList: React.FC = () => {
  const { workspaceInfo, uiState, configuration } = useStore();
  const openEditorAt = useOpenEditorAt();

  const [activeTab, setActiveTab] = useState<TabType>('directories');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!configuration) return null;

  const onProjectClick = (project: string) => {
    openEditorAt(project);
  };

  const renderItemPrefix = (item: any) => {
    switch (activeTab) {
      case 'directories':
        switch (configuration.ui.projectDirectoriesPrefix) {
          case 'folderIcon':
            return <FolderIcon size={12} className="mr-2 text-gray-500" />;
          case 'backslash':
            return <span className="text-gray-500">/</span>;
          default:
            return null;
        }
      case 'gitRepos':
        switch (item.originDomain) {
          case 'github.com':
            return <GithubIcon size={12} className="mr-2 text-gray-500" />;
          default:
            return <GitPullRequestIcon size={12} className="mr-2 text-gray-500" />;
        }
      case 'codeWorkspaces':
        return <CodeIcon size={12} className="mr-2 text-gray-500" />;
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
                  {renderItemPrefix(item)}
                  {item.relativePath}
                </span>
                <span className="text-blue-400 text-xs">→</span>
                {/* <span className="text-gray-600 text-xs">•</span> */}
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

  const tabLabels: Record<TabType, string> = {
    directories: 'directories',
    gitRepos: 'repositories',
    codeWorkspaces: '.code-workspaces',
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: TabType) => {
    setActiveTab(option);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-2 px-2 border-b border-gray-700">
        <div className="text-sm text-gray-400 flex items-center">
          Existing project&nbsp;
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="appearance-none bg-transparent text-gray-300 pr-4 focus:outline-none cursor-pointer"
            >
              {tabLabels[activeTab]}
              <ChevronDownIcon className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
            </button>
            {isOpen && (
              <div className="absolute left-0 mt-1 min-w-[120px] max-w-[200px] bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                {Object.entries(tabLabels).map(([tab, label]) => (
                  <button
                    key={tab}
                    onClick={() => selectOption(tab as TabType)}
                    className="block w-full text-left px-2 py-1 text-gray-300 hover:bg-gray-700 focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
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

// const renderItemRightPart = () => {
//   const { selectedEditor } = useSelectedEditor();

//   if (!selectedEditor) return null;
//   return <span className="text-blue-400 text-xs">Open in {selectedEditor?.name}</span>;
// };

export default ProjectsList;
