import { useSelectedEditor } from '@/lib/hooks/useSelectedEditor';
import { useStore } from '@/lib/store';
import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const TopBar: React.FC = () => {
  const { pathToWorkspaces } = useStore();
  const { editors, selectedEditor, setSelectedEditorIndex } = useSelectedEditor();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: number) => {
    setSelectedEditorIndex(option);
    setIsOpen(false);
  };

  return (
    // <div className="w-full bg-gray-800 text-gray-400 text-[10px] py-1 px-4 flex justify-between items-center">
    <div className="w-full text-gray-400 opacity-40 hover:opacity-100 text-[10px] py-1 px-4 flex justify-between items-center absolute transition-opacity duration-700 hover:duration-150">
      {' '}
      <div>{pathToWorkspaces}</div>
      <div className="flex items-center">
        <span className="mr-1">default ide:</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="appearance-none bg-transparent text-gray-300 pr-4 focus:outline-none cursor-pointer"
          >
            {selectedEditor?.name}
            <ChevronDownIcon className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-1 min-w-[120px] max-w-[200px] bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
              {editors.map((editor, index) => (
                <button
                  key={index}
                  onClick={() => selectOption(index)}
                  className="block w-full text-left px-2 py-1 text-gray-300 hover:bg-gray-700 focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {editor.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
