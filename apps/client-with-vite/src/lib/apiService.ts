import { store } from './store';

import type { WorkspaceConfiguration } from '@code-launcher/data-types';

interface ApiResponse {
  projects?: string[];
  commandOutput?: string;
  stats?: {
    memUsage: number;
    cpuUsage: number;
  };
  configuration?: WorkspaceConfiguration;
}

const createApiService = () => {
  const fetchWithStats = async (url: string, options?: RequestInit): Promise<ApiResponse> => {
    const response = await fetch(url, options);
    const data: ApiResponse = await response.json();

    const { commandOutput, stats, projects, configuration } = data;
    if (commandOutput) store.lastCommandOutput = commandOutput;
    if (stats) store.stats = { ...store.stats, ...stats };
    if (projects) store.projects = projects;
    if (configuration) store.configuration = configuration;

    return data;
  };

  return {


    fetchProjects: async (): Promise<ApiResponse> => {
      return fetchWithStats('/api/ls');
    },

    runCommand: async (command: string): Promise<ApiResponse> => {
      return fetchWithStats('/api/run-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
    },
  };
};

export const apiService = createApiService();
