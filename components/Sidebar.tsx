import React from 'react';
import { ALGORITHM_CONTENT } from '../constants';
import type { AlgorithmKey } from '../types';

interface SidebarProps {
  selectedAlgorithm: AlgorithmKey;
  setSelectedAlgorithm: (key: AlgorithmKey) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedAlgorithm, setSelectedAlgorithm }) => {
  const groupedAlgorithms = Object.entries(ALGORITHM_CONTENT).reduce((acc, [key, value]) => {
    const { category } = value;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ key: key as AlgorithmKey, name: value.name, isImplemented: value.isImplemented ?? true });
    return acc;
  }, {} as Record<string, { key: AlgorithmKey; name: string; isImplemented: boolean }[]>);

  // Define a consistent order for categories
  const categoryOrder = ["Sorting", "Searching", "Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Graphs"];
  const sortedCategories = Object.entries(groupedAlgorithms).sort(([a], [b]) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      return (indexA > -1 ? indexA : Infinity) - (indexB > -1 ? indexB : Infinity);
  });

  return (
    <nav className="w-72 bg-gray-900 h-full overflow-y-auto shadow-2xl flex-shrink-0 border-r border-gray-800">
      <div className="p-5 border-b border-gray-800">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">DSA Visualizer</h2>
        <p className="text-gray-400 text-sm mt-1">Select an algorithm to visualize</p>
      </div>
      <ul className="mt-4 p-2">
        {sortedCategories.map(([category, algorithms]) => (
          <li key={category} className="px-3 py-2">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">{category}</h3>
            <ul className="space-y-1.5">
              {algorithms.map(({ key, name, isImplemented }) => (
                <li key={key}>
                  <button
                    onClick={() => isImplemented && setSelectedAlgorithm(key)}
                    disabled={!isImplemented}
                    className={`w-full text-left p-2.5 rounded-md transition-all duration-200 text-sm font-medium flex justify-between items-center ${
                      selectedAlgorithm === key
                        ? 'bg-cyan-500/10 text-cyan-400 ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/10'
                        : isImplemented
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{name}</span>
                    {!isImplemented && (
                      <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Soon</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
