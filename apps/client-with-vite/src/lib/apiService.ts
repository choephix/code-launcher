import type { CodeLauncherServerActionResult } from '@code-launcher/data-types';

import { store } from './store';

type ApiResponse = CodeLauncherServerActionResult;

interface PortInfo {
  port: number;
  contentType: string;
  status: number;
  title: string | null;
  favicon: string | null;
}

const createApiService = (baseUrl: string) => {
  const fetchWithStats = async (url: string, options?: RequestInit): Promise<ApiResponse> => {
    const response = await fetch(`${baseUrl}${url}`, options);
    const data: ApiResponse = await response.json();

    if (data.commandOutput !== undefined) store.lastCommandOutput = data.commandOutput;
    if (data.stats !== undefined) store.stats = { ...store.stats, ...data.stats };
    if (data.configuration !== undefined) store.configuration = data.configuration;
    if (data.pathToWorkspaces !== undefined) store.pathToWorkspaces = data.pathToWorkspaces;
    if (data.workspaceInfo !== undefined) store.workspaceInfo = data.workspaceInfo;

    return data;
  };

  return {
    fetchProjects: async (): Promise<ApiResponse> => {
      return fetchWithStats('/ls');
    },

    runCommand: async (command: string): Promise<ApiResponse> => {
      const result = await fetchWithStats('/run-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      fetchWithStats('/ls?ignoreCache=true');

      return result;
    },

    findOpenPorts: async (): Promise<PortInfo[]> => {
      const response = await fetch(`${baseUrl}/find-open-ports`);
      const data: PortInfo[] = await response.json();
      return data;
    },
  };
};

export const apiService = createApiService('/api');
