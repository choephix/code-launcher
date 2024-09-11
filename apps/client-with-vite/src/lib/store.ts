import { proxy, useSnapshot } from 'valtio';
import { apiService } from './apiService';

import { WorkspaceConfiguration } from '@code-launcher/data-types';

interface State {
  isSomeActionRunning: boolean;
  uiState: {
    showTemplates: boolean;
  };
  //// Workspace State
  pathToWorkspaces: string | null;
  projects: string[] | null;
  lastCommandOutput: string | null;
  stats: {
    cpuUsage: number | null;
    memUsage: number | null;
  };
  configuration: WorkspaceConfiguration;
}

export const store = proxy<State>({
  projects: null,
  pathToWorkspaces: null,
  lastCommandOutput: null,
  stats: {
    memUsage: 0,
    cpuUsage: 0,
  },
  configuration: {
    templates: [],
  },
  uiState: { showTemplates: false },
  isSomeActionRunning: false,
});

export const actions = {
  updateStore: (data: Partial<State>) => {
    Object.assign(store, data);
  },
  refreshProjects: async () => {
    return await apiService.fetchProjects();
  },
  runCommand: async (command: string) => {
    return await apiService.runCommand(command);
  },
  setIsSomeActionRunning: (value: boolean) => {
    store.isSomeActionRunning = value;
  },
  clearCommandOutput: () => {
    store.lastCommandOutput = null;
  },
  toggleShowTemplates: () => {
    store.uiState.showTemplates = !store.uiState.showTemplates;
  },
};

export function useStore() {
  return useSnapshot(store);
}

Object.assign(globalThis, { store, actions });
