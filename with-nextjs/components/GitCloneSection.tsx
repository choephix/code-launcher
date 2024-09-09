// components/GitCloneSection.tsx

'use client';

import React, { useState } from 'react';
import { runCommand } from '@/lib/commands';
import useCommandResultStore from '@/hooks/useCommandResultStore';

const GitCloneSection: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const { setResult } = useCommandResultStore();

  const handleClone = async () => {
    if (!repoUrl) return;

    const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'cloned-repo';
    const cloneCommand = `
      REPO_NAME="${repoName}"
      COUNTER=0
      while [ -d "$HOME/workspace/$REPO_NAME" ]; do
        COUNTER=$((COUNTER + 1))
        REPO_NAME="${repoName}-$COUNTER"
      done
      mkdir -p "$HOME/workspace/$REPO_NAME"
      # git clone ${repoUrl} "$HOME/workspace/$REPO_NAME" && echo "Cloned to $REPO_NAME"
    `;

    const data = await runCommand(cloneCommand);
    setResult(data);
    setRepoUrl('');
  };

  return (
    <div className='mb-8'>
      <h2 className='text-xl font-bold text-blue-400 mb-4'>Clone Git Repository</h2>
      <div className='flex'>
        <input
          type='text'
          value={repoUrl}
          onChange={e => setRepoUrl(e.target.value)}
          placeholder='Enter Git repository URL'
          className='flex-grow px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-l-lg focus:outline-none focus:border-blue-500'
        />
        <button
          onClick={handleClone}
          className='px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none'
        >
          Clone
        </button>
      </div>
    </div>
  );
};

export default GitCloneSection;
