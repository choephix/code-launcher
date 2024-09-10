import { proxy, useSnapshot } from 'valtio';
import { apiService } from './apiService';

interface State {
  projects: string[];
  lastCommandOutput: string | null;
  stats: {
    memUsage: number;
    cpuUsage: number;
  };
}

export const store = proxy<State>({
  projects: [],
  lastCommandOutput: null,
  stats: {
    memUsage: 0,
    cpuUsage: 0,
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
};

export function useStore() {
  return useSnapshot(store);
}

Object.assign(globalThis, { store, actions });
