'use client';

import { useAnimatedPlaceholder } from '@/lib/hooks/useAnimatedPlaceholder';
import { SmartBarFeatures } from '@/lib/smartbar/SmartBarFeatures';
import { actions, useStore } from '@/lib/store';
import { ChevronsDownIcon, XIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const SmartBar: React.FC = () => {
  const { isSomeActionRunning } = useStore();

  const [inputContent, setInputContent] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useAnimatedPlaceholder(inputRef, getAllSmartBarFeatureHints(), 'Enter ');

  useEffect(() => {
    inputRef.current?.focus();
  }, [isSomeActionRunning]);

  const handleActionButtonClick = async () => {
    if (!inputContent) return;

    actions.setIsSomeActionRunning(true);

    try {
      await performButtonAction?.(inputContent);

      setInputContent('');
    } finally {
      actions.setIsSomeActionRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleActionButtonClick();
    }
  };

  const {
    icon: Icon,
    action: performButtonAction,
    label: buttonLabel,
  } = interpretSmartBarInput(inputContent);

  return (
    <div className='flex flex-col items-stretch'>
      <div className='flex items-center flex-grow border border-gray-600 bg-gray-700 rounded-full overflow-hidden shadow-lg'>
        <div className='flex items-center ml-3 mr-1'>
          <Icon
            size='1.2em'
            className={`${
              inputContent ? 'text-white' : 'text-gray-400'
            } animate-pop-in transition-colors duration-500`}
            strokeWidth={1.5}
          />
        </div>
        <input
          ref={inputRef}
          type='text'
          value={inputContent}
          onChange={e => setInputContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Enter Git repository URL'
          className='bg-transparent text-white py-2 pl-2 pr-4 flex-grow focus:outline-none'
          disabled={isSomeActionRunning}
        />
        <button
          onClick={handleActionButtonClick}
          className={`
                px-6 py-2 text-white focus:outline-none rounded-full
                transition-colors duration-200
                bg-blue-500 hover:bg-blue-600
                animate-slide-in-right
              `}
          disabled={isSomeActionRunning || !performButtonAction}
          hidden={!performButtonAction}
        >
          {buttonLabel}
        </button>
      </div>

      {isSomeActionRunning ? (
        <div className='animate-fade-in-pop'>
          <div className='flex items-center justify-center py-8'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2'></div>
          </div>
        </div>
      ) : (
        <CommandOutput />
      )}
    </div>
  );
};

const CommandOutput = () => {
  const { lastCommandOutput } = useStore();

  if (!lastCommandOutput) return null;

  const handleClose = () => {
    actions.clearCommandOutput();
  };

  return (
    <>
      <div className='text-center line-height-0'>
        <ChevronsDownIcon className='text-gray-400 w-4 h-4 inline-block' />
      </div>
      <div className='bg-gray-800 border border-gray-700 rounded-lg p-4 text-start animate-slide-in-from-up relative min-h-32 shadow-lg'>
        <button
          onClick={handleClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-200 transition-colors'
        >
          <XIcon size='1em' />
        </button>
        <h2 className='px-2 text-xmd font-bold text-blue-400 mb-2'>Command Output</h2>
        <pre className='px-2 overflow-x-auto text-xs border-l-2 border-gray-700'>
          {lastCommandOutput}
        </pre>
      </div>
    </>
  );
};

const getAllSmartBarFeatureHints = () => {
  const placeholders = SmartBarFeatures.map(feature => feature.placeholder);
  const nonEmptyPlaceholders = placeholders.filter(Boolean) as string[];
  return nonEmptyPlaceholders;
};

const interpretSmartBarInput = (input: string | undefined) => {
  const trimmedInput = input?.trim() ?? '';

  for (const feature of SmartBarFeatures) {
    if (feature.disabled) continue;
    if (!feature.match(trimmedInput)) continue;
    return feature;
  }

  return SmartBarFeatures[0];
};

export default SmartBar;
