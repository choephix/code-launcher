import type { CodeLauncherServerActionResult } from '@code-launcher/data-types';

import { store } from './store';

type ApiResponse = CodeLauncherServerActionResult;

const createApiService = (baseUrl: string) => {
  const fetchWithStats = async (url: string, options?: RequestInit): Promise<ApiResponse> => {
    const response = await fetch(`${baseUrl}${url}`, options);
    const data: ApiResponse = await response.json();

    const { commandOutput, stats, projects, configuration } = data;
    if (commandOutput !== undefined) store.lastCommandOutput = commandOutput;
    if (stats !== undefined) store.stats = { ...store.stats, ...stats };
    if (projects !== undefined) store.projects = projects;
    if (configuration !== undefined) store.configuration = configuration;

    return data;
  };

  return {
    fetchProjects: async (): Promise<ApiResponse> => {
      return fetchWithStats('/ls');
    },

    runCommand: async (command: string): Promise<ApiResponse> => {
      return fetchWithStats('/run-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
    },
  };
};

export const apiService = createApiService('/api');
