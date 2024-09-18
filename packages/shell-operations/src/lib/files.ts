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

async function getGitRemoteDomain(gitRepoPath: string): Promise<string | null> {
  try {
    const gitConfigPath = path.join(gitRepoPath, '.git', 'config');
    const configContent = await fs.readFile(gitConfigPath, 'utf-8');

    // Regular expression to match the remote origin URL
    const remoteOriginRegex = /\[remote "origin"\][\s\S]*?url = (.+)/;
    const match = configContent.match(remoteOriginRegex);

    if (match && match[1]) {
      const url = match[1].trim();

      // Extract domain from URL
      const domainRegex = /(?:https?:\/\/)?(?:www\.)?([^\/]+)/i;
      const domainMatch = url.match(domainRegex);

      if (domainMatch && domainMatch[1]) {
        let domain = domainMatch[1].toLowerCase();
        domain = domain.replace(/^.*@/, '');
        domain = domain.replace(/:[^:]*$/, '');
        return String(domain);
      }
    }

    return null; // No remote origin found or couldn't extract domain
  } catch (error) {
    console.error('Error reading git config:', error);
    return null;
  }
}

async function getGitStatus(
  repoPath: string,
  autoFetchAll: boolean = false
): Promise<{
  ahead: number;
  behind: number;
  branch: string;
  lastCommitHash: string;
  lastCommitDate: string;
  lastCommitMessage: string;
  unstagedChanges: number;
  stagedChanges: number;
  stashes: number;
} | null> {
  try {
    const { execFile } = await import('child_process');
    const util = await import('util');
    const execFilePromise = util.promisify(execFile);

    if (autoFetchAll) {
      console.log('🔄 Fetching latest changes...');
      await execFilePromise('git', ['fetch'], { cwd: repoPath });
    }

    const [statusOutput, branchOutput, lastCommitOutput, stashOutput] = await Promise.all([
      execFilePromise('git', ['status', '-sb'], { cwd: repoPath }),
      execFilePromise('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: repoPath }),
      execFilePromise('git', ['log', '-1', '--pretty=format:%h|%ad|%s'], { cwd: repoPath }),
      execFilePromise('git', ['stash', 'list'], { cwd: repoPath }),
    ]);

    const currentBranch = branchOutput.stdout.trim();

    const [aheadOutput, behindOutput] = await Promise.all([
      execFilePromise('git', ['rev-list', `origin/${currentBranch}..${currentBranch}`, '--count'], { cwd: repoPath }),
      execFilePromise('git', ['rev-list', `${currentBranch}..origin/${currentBranch}`, '--count'], { cwd: repoPath }),
    ]);

    const unstagedMatch = statusOutput.stdout.match(/\n\s*M\s/g);
    const stagedMatch = statusOutput.stdout.match(/\n\w/g);

    const [lastCommitHash, lastCommitDate, lastCommitMessage] = lastCommitOutput.stdout.split('|');

    return {
      ahead: parseInt(aheadOutput.stdout.trim(), 10),
      behind: parseInt(behindOutput.stdout.trim(), 10),
      branch: currentBranch,
      lastCommitHash,
      lastCommitDate,
      lastCommitMessage,
      unstagedChanges: unstagedMatch ? unstagedMatch.length : 0,
      stagedChanges: stagedMatch ? stagedMatch.length : 0,
      stashes: stashOutput.stdout.split('\n').filter(Boolean).length,
    };
  } catch (error) {
    console.error('🚨 Error getting git status:', error);
    return null;
  }
}

export async function getGitRepoDirectories(workspacePath: string) {
  const gitRepos: {
    relativePath: string;
    absolutePath: string;
    originDomain: string | null;
    status: { ahead: number; behind: number } | null;
  }[] = [];

  async function traverse(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const isGitRepo = entries.some(entry => entry.name === '.git' && entry.isDirectory());
    if (isGitRepo) {
      const relativePath = path.relative(workspacePath, dir);
      const absolutePath = path.resolve(workspacePath, dir);
      const originDomain = await getGitRemoteDomain(absolutePath);
      const status = await getGitStatus(absolutePath);
      gitRepos.push({ relativePath, absolutePath, originDomain, status });
      console.log(`📊 Git repo found: ${relativePath}, Status: ${JSON.stringify(status)}`);
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
      editors: [],
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
