import React from 'react';

interface AutocompleteListProps {
  items: string[];
  selectedIndex: number;
  onItemClick: (item: string) => void;
}

export const AutocompleteList: React.FC<AutocompleteListProps> = ({ items, selectedIndex, onItemClick }) => {
  if (items.length === 0) return null;

  return (
    <ul className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-2xl z-10">
      {items.map((item, index) => (
        <li
          key={index}
          className={`px-4 py-2 cursor-pointer ${
            index === selectedIndex ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => onItemClick(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
