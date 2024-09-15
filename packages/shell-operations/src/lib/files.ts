import fs from 'fs/promises';
import path from 'path';
import YAML from 'yaml';

import type { WorkspaceConfiguration } from '@code-launcher/data-types';
import { defaultConfigYaml } from '../data/defaultConfigYaml';

export async function getProjectDirectoriesList(workspacePath: string) {
  try {
    const directoryNames = await fs.readdir(workspacePath, { withFileTypes: true });

    return directoryNames
      .filter(entry => entry.isDirectory())
      .filter(entry => !entry.name.startsWith('.'))
      .map(entry => entry.name);
  } catch (error) {
    console.error(`Error reading directory: ${error}`);
    return [];
  }
}

//// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

const IGNORED_PATTERNS = [
  // Package managers
  /^(?:node_modules|bower_components|jspm_packages|packages)$/,

  // Version control
  /^\.(?:git|svn|hg|bzr|fossil)$/,

  // Build outputs and caches
  /^(?:dist|build|target|out|bin|obj|lib|es|publish)$/,
  /^\.(?:next|nuxt|vuepress|docusaurus|gatsby-cache)$/,
  /^(?:\.cache|\.output|\.parcel-cache)$/,

  // Temporary and log files
  /^(?:tmp|temp|logs?|coverage|test-results)$/,

  // Vendor directories
  /^(?:vendor|third-party)$/,

  // Custom ignore pattern
  /^\.ignore-.+/,
];

function shouldIgnoreDirectory(name: string): boolean {
  return IGNORED_PATTERNS.some(pattern => pattern.test(name));
}

export async function getVSCodeWorkspaceFiles(workspacePath: string): Promise<string[]> {
  const workspaceFiles: string[] = [];

  async function traverse(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !shouldIgnoreDirectory(entry.name)) {
        await traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.code-workspace')) {
        const relativePath = path.relative(workspacePath, fullPath);
        workspaceFiles.push(relativePath);
      }
    }
  }

  await traverse(workspacePath);
  return workspaceFiles;
}

export async function getGitRepoDirectories(workspacePath: string): Promise<string[]> {
  const gitRepos: string[] = [];

  async function traverse(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    if (entries.some(entry => entry.name === '.git' && entry.isDirectory())) {
      const relativePath = path.relative(workspacePath, dir);
      gitRepos.push(relativePath);
      return; // Don't traverse further if it's a git repo
    }
    for (const entry of entries) {
      if (entry.isDirectory() && !shouldIgnoreDirectory(entry.name)) {
        await traverse(path.join(dir, entry.name));
      }
    }
  }

  await traverse(workspacePath);
  return gitRepos;
}

//// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

export async function getWorkspaceConfiguration(workspacePath: string): Promise<WorkspaceConfiguration> {
  try {
    const configFilePath = path.resolve(workspacePath, '.code-launcher.yaml');
    const configFileContent = await loadConfigFileContent(configFilePath, false);
    const configuration = YAML.parse(configFileContent);
    return configuration;
  } catch (error) {
    console.error(`Error reading workspace configuration: ${error}. Using default configuration.`);
    return {
      ui: {
        projectDirectoriesPrefix: null,
      },
      idePaths: [],
      templates: [],
    };
  }
}

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
