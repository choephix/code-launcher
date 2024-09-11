import type { CodeLauncherServerActionResult } from '@code-launcher/data-types';

import { store } from './store';

type ApiResponse = CodeLauncherServerActionResult;

const createApiService = (baseUrl: string) => {
  const fetchWithStats = async (url: string, options?: RequestInit): Promise<ApiResponse> => {
    const response = await fetch(`${baseUrl}${url}`, options);
    const data: ApiResponse = await response.json();

    if (data.commandOutput !== undefined) store.lastCommandOutput = data.commandOutput;
    if (data.stats !== undefined) store.stats = { ...store.stats, ...data.stats };
    if (data.projects !== undefined) store.projects = data.projects;
    if (data.configuration !== undefined) store.configuration = data.configuration;
    if (data.pathToWorkspaces !== undefined) store.pathToWorkspaces = data.pathToWorkspaces;

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
