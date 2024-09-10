import fs from 'fs/promises';
import path from 'path';
import YAML from 'yaml';

import type { WorkspaceConfiguration } from '@code-launcher/data-types';

export async function getProjectDirectoriesList(workspacePath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(workspacePath, { withFileTypes: true });

    return entries
      .filter(entry => entry.isDirectory())
      .filter(entry => !entry.name.startsWith('.'))
      .map(entry => entry.name);
  } catch (error) {
    console.error(`Error reading directory: ${error}`);
    return [];
  }
}

export async function getWorkspaceConfiguration(workspacePath: string): Promise<WorkspaceConfiguration> {
  try {
    const configFilePath = path.resolve(workspacePath, '.code-launcher.yaml');
    const configFileContent = await fs.readFile(configFilePath, 'utf8');
    const configuration = YAML.parse(configFileContent);
    return configuration;
  } catch (error) {
    console.error(`Error reading workspace configuration: ${error}`);
    return {
      ui: {
        showTemplatesByDefault: false,
      },
      templates: [],
    };
  }
}
