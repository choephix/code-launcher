import { DotIcon, GitBranch, GlobeIcon, SearchIcon, SparklesIcon, TerminalIcon } from 'lucide-react';
import type React from 'react';

import { apiService } from '@/lib/apiService';

const GIT_REPO_REGEX = /^(https?:\/\/|git@)?([\w.-]+@)?([\w.-]+)(:\d+)?[:\/]([\w.-]+)\/([\w.-]+)(\.git)?\/?$/;
const GIT_CLONE_PREFIX_REGEX = /^git\s+clone\s+/i;
const SHELL_COMMAND_REGEX = /^(\$|>)\s*/m;
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;

export interface SmartBarFeature {
  readonly type: string;
  readonly bigTitle: {
    readonly content: string;
    readonly style: React.CSSProperties;
  };
  readonly icon: any;
  readonly placeholder?: string;
  readonly match: (input: string) => boolean;
  readonly action?: (input: string) => void | Promise<void>;
  readonly label?: string;
  readonly disabled: boolean;
}

export const SmartBarFeatures = [
  {
    type: 'null',
    bigTitle: {
      content: '{code:launcher}',
      style: {
        fontFamily: 'monospace',
      },
    },
    icon: DotIcon,
    match: (input: string) => input.trim().length < 2,
    disabled: false,
  },
  {
    type: 'git',
    bigTitle: {
      content: 'git clone',
      style: {
        fontFamily: 'monospace',
      },
    },
    icon: GitBranch,
    placeholder: 'Git repository URL to clone',
    match: (input: string) => GIT_REPO_REGEX.test(input.trim()) || GIT_CLONE_PREFIX_REGEX.test(input.trim()),
    action: async (input: string) => {
      const repoUrl = input.trim().replace(GIT_CLONE_PREFIX_REGEX, '');
      const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'cloned-repo';
      const cloneCommand = `
        REPO_NAME="${repoName}"
        COUNTER=0
        while [ -d "$REPO_NAME" ]; do
          COUNTER=$((COUNTER + 1))
          REPO_NAME="${repoName}-$COUNTER"
        done
        git clone ${repoUrl} "$REPO_NAME" && echo "Cloned to $REPO_NAME"
      `;
      await apiService.runCommand(cloneCommand);
    },
    label: 'Clone',
    disabled: false,
  },
  {
    type: 'shell',
    bigTitle: {
      content: 'run command',
      style: {
        fontFamily: 'monospace',
        fontVariant: 'small-caps',
      },
    },
    icon: TerminalIcon,
    placeholder: '">" + CLI command to run',
    match: (input: string) => SHELL_COMMAND_REGEX.test(input.trim()),
    action: async (input: string) => {
      const commandLines = input.split('\n');
      const trimmedCommandLines = commandLines.map(line => line.trim());
      const cleanCommandLines = trimmedCommandLines.map(line => line.replace(SHELL_COMMAND_REGEX, ''));
      const command = cleanCommandLines.join('\n');
      await apiService.runCommand(command);
    },
    label: 'Run',
    disabled: false,
  },
  {
    type: 'ai_prompt',
    bigTitle: {
      // content: '/Claude',
      content: '/AI',
      style: {
        fontFamily: 'monospace',
      },
    },
    icon: SparklesIcon,
    placeholder: '"*" + AI prompt to AI with',
    match: (input: string) => input.trim().startsWith('/') || input.trim().startsWith('*'),
    action: async () => {
      alert('AI prompt handling not implemented yet');
    },
    label: 'Ask AI',
    disabled: true,
  },
  {
    type: 'url',
    bigTitle: {
      content: 'Open URL',
      style: {
        fontFamily: 'monospace',
      },
    },
    icon: GlobeIcon, // You'll need to import this from 'lucide-react'
    placeholder: 'Enter a URL to open',
    match: (input: string) => URL_REGEX.test(input.trim()),
    action: (input: string) => {
      const url = input.trim();
      window.location.href = url;
    },
    label: 'Open',
    disabled: false,
  },
  {
    type: 'search',
    bigTitle: {
      content: 'Search',
      style: {
        fontFamily: 'monospace',
        // fontFamily: '"Open Sans", Manrope, "Product Sans", sans-serif',
      },
    },
    icon: SearchIcon,
    placeholder: 'a query to search',
    match: (input: string) => input.trim().length >= 2,
    action: async (input: string) => {
      const encodedQuery = encodeURIComponent(input.trim());
      const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
      window.open(searchUrl, '_blank');
    },
    label: 'Search',
    disabled: false,
  },
] as SmartBarFeature[];

export type SmartBarFeatureType = (typeof SmartBarFeatures)[number]['type'];
