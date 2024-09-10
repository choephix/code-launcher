import { apiService } from '@/lib/apiService';
import { DotIcon, GitBranch, SearchIcon, ShieldQuestionIcon, SparklesIcon, TerminalIcon } from 'lucide-react';

export enum InputType {
  NULL,
  GIT,
  SHELL,
  SEARCH,
  AI_PROMPT,
}

const GIT_REPO_REGEX = /^(https?:\/\/)?([\w.-]+@)?([\w.-]+)(:\d+)?[\/\w.-]*\.git\/?$/;
const SHELL_COMMAND_REGEX = /^(\$|>|bash)\s+.+/;

const handleGitClone = async (repoUrl: string): Promise<void> => {
  const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'cloned-repo';
  const cloneCommand = `
    REPO_NAME="${repoName}"
    COUNTER=0
    while [ -d "$HOME/workspace/$REPO_NAME" ]; do
      COUNTER=$((COUNTER + 1))
      REPO_NAME="${repoName}-$COUNTER"
    done
    git clone ${repoUrl} "$HOME/workspace/$REPO_NAME" && echo "Cloned to $REPO_NAME"
  `;
  await apiService.runCommand(cloneCommand);
};

const handleShellCommand = async (command: string): Promise<void> => {
  const cleanCommand = command.replace(/^(\$ |>|bash )/, '');
  await apiService.runCommand(cleanCommand);
};

const handleAIPrompt = async (): Promise<void> => {
  alert('AI prompt handling not implemented yet');
};

const handleSearch = async (query: string): Promise<void> => {
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
  window.open(searchUrl, '_blank');
};

export const interpretSmartBarInput = (input: string) => {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      type: InputType.NULL,
      icon: DotIcon,
    };
  }

  if (trimmedInput.length < 2) {
    return {
      type: InputType.NULL,
      icon: DotIcon,
    };
  }

  if (GIT_REPO_REGEX.test(trimmedInput)) {
    return {
      type: InputType.GIT,
      icon: GitBranch,
      action: () => handleGitClone(trimmedInput),
      label: 'Clone',
    };
  }

  if (SHELL_COMMAND_REGEX.test(trimmedInput)) {
    return {
      type: InputType.SHELL,
      icon: TerminalIcon,
      action: () => handleShellCommand(trimmedInput),
      label: 'Run',
    };
  }

  if (trimmedInput.startsWith('/ ')) {
    return {
      type: InputType.AI_PROMPT,
      icon: SparklesIcon,
      action: handleAIPrompt,
      label: 'Ask AI',
    };
  }

  return {
    type: InputType.SEARCH,
    icon: SearchIcon,
    action: () => handleSearch(trimmedInput),
    label: 'Search',
  };
};

export type InterpretedInput = ReturnType<typeof interpretSmartBarInput>;
