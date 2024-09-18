import { useState, useEffect } from 'react';

const projectTabs = ['directories', 'gitRepos', 'codeWorkspaces'] as const;

export type ProjectsListTabType = (typeof projectTabs)[number];

const SELECTED_PROJECT_TAB_KEY = 'selectedProjectTab';
const DEFAULT_TAB: ProjectsListTabType = 'directories';

function getSelectedProjectTabFromLocalStorage(): ProjectsListTabType {
  const storedTab = localStorage.getItem(SELECTED_PROJECT_TAB_KEY);
  return projectTabs.includes(storedTab as ProjectsListTabType) ? (storedTab as ProjectsListTabType) : DEFAULT_TAB;
}

function setSelectedProjectTabToLocalStorage(tab: ProjectsListTabType): void {
  localStorage.setItem(SELECTED_PROJECT_TAB_KEY, tab);
}

export function useSelectedProjectsListTab() {
  const [selectedTab, setSelectedTab] = useState<ProjectsListTabType>(() => getSelectedProjectTabFromLocalStorage());

  useEffect(() => {
    console.log('🗂️ Selected project tab:', selectedTab);
  }, [selectedTab]);

  const setSelectedProjectTab = (tab: ProjectsListTabType) => {
    setSelectedTab(tab);
    setSelectedProjectTabToLocalStorage(tab);
  };

  return [selectedTab, setSelectedProjectTab] as const;
}
