import { apiService } from '@/lib/apiService';
import { DotIcon, GitBranch, SearchIcon, SparklesIcon, TerminalIcon } from 'lucide-react';

const GIT_REPO_REGEX = /^(https?:\/\/|git@)?([\w.-]+@)?([\w.-]+)(:\d+)?[:\/]([\w.-]+)\/([\w.-]+)(\.git)?\/?$/;
const GIT_CLONE_PREFIX_REGEX = /^git\s+clone\s+/i;
const SHELL_COMMAND_REGEX = /^(\$|>|bash\s+)\s*/;

export interface SmartBarFeature {
  readonly type: string;
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
    icon: DotIcon,
    match: (input: string) => input.trim().length < 2,
    disabled: false,
  },
  {
    type: 'git',
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
    icon: TerminalIcon,
    placeholder: '">" + CLI command to run',
    match: (input: string) => SHELL_COMMAND_REGEX.test(input.trim()),
    action: async (input: string) => {
      const cleanCommand = input.trim().replace(SHELL_COMMAND_REGEX, '');
      await apiService.runCommand(cleanCommand);
    },
    label: 'Run',
    disabled: false,
  },
  {
    type: 'ai_prompt',
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
    type: 'search',
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
