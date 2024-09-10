'use client';

import { apiService } from '@/lib/apiService';
import
  {
    SmartBarPlaceholderStrings,
    useAnimatedPlaceholder,
  } from '@/lib/hooks/useAnimatedPlaceholder';
import
  {
    GitBranch,
    HandMetalIcon,
    SmileIcon,
    SparklesIcon,
    TerminalIcon
  } from 'lucide-react';
import React, { useRef, useState } from 'react';

const SmartBar: React.FC = () => {
  const [inputContent, setInputContent] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useAnimatedPlaceholder(inputRef, SmartBarPlaceholderStrings, 'Enter ');

  const handleClone = async () => {
    if (!inputContent) return;

    setIsBusy(true);

    try {
      const repoName = inputContent.split('/').pop()?.replace('.git', '') || 'cloned-repo';
      const cloneCommand = `
        REPO_NAME="${repoName}"
        COUNTER=0
        while [ -d "$HOME/workspace/$REPO_NAME" ]; do
          COUNTER=$((COUNTER + 1))
          REPO_NAME="${repoName}-$COUNTER"
        done
        git clone ${inputContent} "$HOME/workspace/$REPO_NAME" && echo "Cloned to $REPO_NAME"
      `;

      await apiService.runCommand(cloneCommand);

      setInputContent('');
    } finally {
      setIsBusy(false);
    }
  };

  const Icon = getIconClass(inputContent);

  return (
    <div className='mb-8'>
      <div className='flex'>
        <div className='flex items-center flex-grow border border-gray-600 bg-gray-700 rounded-l-lg'>
          <div className='flex items-center ml-3 mr-1'>
            <Icon
              size='1.2em'
              className={inputContent ? 'text-white' : 'text-gray-400'}
              strokeWidth={1.5}
            />
          </div>
          <input
            ref={inputRef}
            type='text'
            value={inputContent}
            onChange={e => setInputContent(e.target.value)}
            placeholder='Enter Git repository URL'
            className='bg-transparent text-white py-2 pl-2 pr-4 flex-grow focus:outline-none'
            disabled={isBusy}
          />
        </div>
        <button
          onClick={handleClone}
          className='px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none'
          disabled={isBusy}
        >
          Clone
        </button>
      </div>
    </div>
  );
};

const GIT_REPO_REGEX = /^(https?:\/\/)?([\w.-]+@)?([\w.-]+)(:\d+)?[\/\w.-]*\.git\/?$/;
const getIconClass = (value: string) => {
  //// If no value, show a generic icon
  if (!value || value.length < 2) {
    return HandMetalIcon;
  }

  value = value.trim();

  //// If it's a git repo URL, show a git branch icon
  if (GIT_REPO_REGEX.test(value)) {
    return GitBranch;
  }

  //// If it's a command, show a terminal icon
  if (value.startsWith('$ ') || value.startsWith('>') || value.startsWith('bash ')) {
    return TerminalIcon;
  }

  //// If all else fails, show a AI sparkles icon
  return SparklesIcon;
};

export default SmartBar;
