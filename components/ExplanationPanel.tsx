import React, { useState } from 'react';
import type { AlgorithmContent } from '../types';
import { getAIExplanation } from '../services/geminiService';

interface ExplanationPanelProps {
  content: AlgorithmContent;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ content }) => {
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateExplanation = async () => {
    setIsLoading(true);
    setAiExplanation('');
    const explanation = await getAIExplanation(content.name, content.category);
    setAiExplanation(explanation);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-inner p-5 h-full flex flex-col border border-gray-700/50">
      <h3 className="text-lg font-bold text-cyan-400 mb-3">Explanation</h3>
      <div className="text-sm text-gray-300 space-y-4 flex-grow">
        <p className="leading-relaxed">{content.description}</p>
        <div className="flex gap-4 pt-2">
          <p><strong>Time:</strong> <code className="bg-gray-800 px-2 py-1 rounded text-cyan-300 text-xs font-mono ring-1 ring-gray-700">{content.complexity.time}</code></p>
          <p><strong>Space:</strong> <code className="bg-gray-800 px-2 py-1 rounded text-cyan-300 text-xs font-mono ring-1 ring-gray-700">{content.complexity.space}</code></p>
        </div>
        <div className="pt-2">
          <button
            onClick={handleGenerateExplanation}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-wait transition-all duration-200 shadow-md hover:shadow-lg shadow-cyan-500/20 transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Generating...' : 'Get AI Explanation (Gemini)'}
          </button>
        </div>
        {aiExplanation && (
          <div className="mt-4 p-3 bg-gray-950 rounded-md border border-gray-700/50 animate-fadeIn">
            <h4 className="font-semibold text-cyan-400 mb-2">Gemini's Explanation:</h4>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{aiExplanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplanationPanel;
