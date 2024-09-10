'use client';

import { apiService } from '@/lib/apiService';
import {
  SmartBarPlaceholderStrings,
  useAnimatedPlaceholder,
} from '@/lib/hooks/useAnimatedPlaceholder';
import { interpretSmartBarInput } from '@/lib/interpretSmartBarInput';
import { GitBranch, HandMetalIcon, SparklesIcon, TerminalIcon } from 'lucide-react';
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
      await performButtonAction?.();

      setInputContent('');
    } finally {
      setIsBusy(false);
    }
  };

  const {
    icon: Icon,
    action: performButtonAction,
    label: buttonLabel,
  } = interpretSmartBarInput(inputContent);

  return (
    <div className='mb-8'>
      <div className='flex'>
        <div className='flex items-center flex-grow border border-gray-600 bg-gray-700 rounded-full overflow-hidden'>
          <div className='flex items-center ml-3 mr-1'>
            <Icon
              size='1.2em'
              className={`${inputContent ? 'text-white' : 'text-gray-400'} animate-pop-in`}
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
          <button
            onClick={handleClone}
            className={`
                px-6 py-2 text-white focus:outline-none rounded-full
                transition-colors duration-200
                bg-blue-500 hover:bg-blue-600
                animate-slide-in-right
              `}
            disabled={isBusy || !performButtonAction}
            hidden={!performButtonAction}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartBar;
