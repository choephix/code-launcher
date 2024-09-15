import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { ChevronDownIcon } from 'lucide-react';

const TopBar: React.FC = () => {
  const { pathToWorkspaces } = useStore();
  const [defaultIde, setDefaultIde] = useState('code');

  return (
    <div className="w-full text-gray-500 text-[10px] py-1 px-4 flex justify-between items-center">
      <div>{pathToWorkspaces}</div>
      <div className="flex items-center">
        <span className="mr-1">default ide:</span>
        <div className="relative">
          <select
            value={defaultIde}
            onChange={(e) => setDefaultIde(e.target.value)}
            className="appearance-none bg-transparent text-gray-300 underline pr-4 focus:outline-none cursor-pointer"
          >
            <option value="code">code</option>
            <option value="cursor">cursor</option>
          </select>
          <ChevronDownIcon className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
