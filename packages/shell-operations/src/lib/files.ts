import fs from 'fs/promises';
import path from 'path';
import YAML from 'yaml';

import type { WorkspaceConfiguration } from '@code-launcher/data-types';
import { defaultConfigYaml } from '../data/defaultConfigYaml';

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
    const configFileContent = await loadConfigFileContent(configFilePath, false);
    const configuration = YAML.parse(configFileContent);
    return configuration;
  } catch (error) {
    console.error(`Error reading workspace configuration: ${error}. Using default configuration.`);
    return defaultWorkspaceConfiguration;
  }
}

const defaultWorkspaceConfiguration: WorkspaceConfiguration = {
  templates: [],
};

async function loadConfigFileContent(configFilePath: string, writeIfMissing: boolean): Promise<string> {
  try {
    const configFileContent = await fs.readFile(configFilePath, 'utf8');
    return configFileContent;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }

    if (writeIfMissing) {
      await fs.writeFile(configFilePath, defaultConfigYaml, 'utf8');
    }

    return defaultConfigYaml;
  }
}
