import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Visualizer from './components/Visualizer';
import { ALGORITHM_CONTENT } from './constants';
import type { AlgorithmKey } from './types';

const App: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmKey>('bubbleSort');

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-300 font-sans">
      <Sidebar 
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm} 
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900/70 backdrop-blur-sm shadow-lg p-4 z-10 border-b border-gray-700/50">
          <h1 className="text-xl font-bold text-cyan-400 tracking-wide">
            {ALGORITHM_CONTENT[selectedAlgorithm]?.name || 'DSA Visualizer'}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-transparent">
          <Visualizer algorithmKey={selectedAlgorithm} />
        </div>
      </main>
    </div>
  );
};

export default App;
