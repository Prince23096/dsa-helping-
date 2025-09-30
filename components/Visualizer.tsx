import React from 'react';
import { ALGORITHM_CONTENT } from '../constants';
import type { AlgorithmKey } from '../types';
import ExplanationPanel from './ExplanationPanel';
import CodePanel from './CodePanel';
import SortVisualizer from './visualizations/SortVisualizer';
import SearchVisualizer from './visualizations/SearchVisualizer';
import ArrayOpVisualizer from './visualizations/ArrayOpVisualizer';
import StackVisualizer from './visualizations/StackVisualizer';
import QueueVisualizer from './visualizations/QueueVisualizer';
import LinkedListVisualizer from './visualizations/LinkedListVisualizer';
import GraphVisualizer from './visualizations/GraphVisualizer';
import TreeVisualizer from './visualizations/TreeVisualizer';
import ComingSoon from './ComingSoon';

interface VisualizerProps {
  algorithmKey: AlgorithmKey;
}

const Visualizer: React.FC<VisualizerProps> = ({ algorithmKey }) => {
  const content = ALGORITHM_CONTENT[algorithmKey];

  const renderVisualizer = () => {
    if (content.isImplemented === false) {
      return <ComingSoon />;
    }

    switch (content.category) {
      case 'Sorting':
        return <SortVisualizer algorithmKey={algorithmKey} key={algorithmKey} />;
      case 'Searching':
        return <SearchVisualizer algorithmKey={algorithmKey} key={algorithmKey} />;
      case 'Arrays':
        return <ArrayOpVisualizer algorithmKey={algorithmKey} key={algorithmKey} />;
      case 'Stacks & Queues':
        if (algorithmKey === 'stack') return <StackVisualizer key={algorithmKey} />;
        if (algorithmKey === 'queue') return <QueueVisualizer key={algorithmKey} />;
        return <ComingSoon />; // Fallback for the category
      case 'Linked Lists':
        return <LinkedListVisualizer key={algorithmKey} />;
      case 'Trees':
        return <TreeVisualizer algorithmKey={algorithmKey} key={algorithmKey} />;
      case 'Graphs':
        return <GraphVisualizer algorithmKey={algorithmKey} key={algorithmKey} />;
      default:
        return <ComingSoon />;
    }
  };

  if (!content) {
    return <div>Error: Algorithm content not found.</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="min-h-[380px] bg-gray-900 rounded-lg shadow-inner p-4 border border-gray-700/50">
        {renderVisualizer()}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExplanationPanel content={content} />
        <CodePanel code={content.code} isImplemented={content.isImplemented ?? true} />
      </div>
    </div>
  );
};

export default Visualizer;
