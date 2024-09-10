import { proxy, useSnapshot } from 'valtio';
import { apiService } from './apiService';

import { WorkspaceConfiguration } from '@code-launcher/data-types';

interface State {
  projects: string[];
  lastCommandOutput: string | null;
  stats: {
    memUsage: number;
    cpuUsage: number;
  };
  isSomeActionRunning: boolean;

  configuration: WorkspaceConfiguration;
}

export const store = proxy<State>({
  projects: [],
  lastCommandOutput: null,
  stats: {
    memUsage: 0,
    cpuUsage: 0,
  },
  isSomeActionRunning: false,

  configuration: {
    templates: [],
  },
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
};

export function useStore() {
  return useSnapshot(store);
}

Object.assign(globalThis, { store, actions });
