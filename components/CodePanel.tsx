import React, { useState } from 'react';

interface CodePanelProps {
  code: {
    c: string;
    cpp: string;
  };
  isImplemented: boolean;
}

const keywords = new Set(['int', 'void', 'for', 'if', 'else', 'while', 'return', 'struct', 'const', 'class', 'public', 'private', 'bool', 'auto', 'new', 'delete']);
const types = new Set(['Node', 'stack', 'queue', 'std', 'vector', 'list']);
const preprocessor = new Set(['#include', '#define']);

const SyntaxHighlighter: React.FC<{ code: string }> = ({ code }) => {
  const highlight = (line: string) => {
    // Comments
    const commentMatch = line.match(/(\/\/.*)/);
    if (commentMatch) {
      const codePart = line.substring(0, commentMatch.index);
      return (
        <>
          {highlight(codePart)}
          <span className="text-green-400/70">{commentMatch[0]}</span>
        </>
      );
    }
    
    return line.split(/(\s+|\(|\)|\[|\]|\;|\,|\:\:|\-\>|\&|\*|\<|\>)/).map((token, index) => {
      if (keywords.has(token)) {
        return <span key={index} className="text-violet-400 font-medium">{token}</span>;
      }
      if (types.has(token)) {
        return <span key={index} className="text-amber-400">{token}</span>;
      }
      if (preprocessor.has(token)) {
        return <span key={index} className="text-rose-500">{token}</span>;
      }
      // Numbers
      if (!isNaN(parseInt(token))) {
         return <span key={index} className="text-cyan-300">{token}</span>;
      }
      // Punctuation
      if (['(', ')', '[', ']', ';', ',', '<', '>'].includes(token)) {
        return <span key={index} className="text-gray-400">{token}</span>;
      }
      return <span key={index} className="text-gray-300">{token}</span>;
    });
  };

  return (
    <pre className="text-xs md:text-sm font-mono">
      <code>
        {code.trim().split('\n').map((line, i) => (
          <div key={i} className="flex hover:bg-gray-800/50">
            <span className="w-8 text-right text-gray-500 pr-4 select-none">{i + 1}</span>
            <span className="flex-1">{highlight(line)}</span>
          </div>
        ))}
      </code>
    </pre>
  );
};

const CodePanel: React.FC<CodePanelProps> = ({ code, isImplemented }) => {
  const [activeTab, setActiveTab] = useState<'c' | 'cpp'>('cpp');

  return (
    <div className="bg-gray-900 rounded-lg shadow-inner h-full flex flex-col border border-gray-700/50">
      <div className="flex border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab('c')}
          className={`px-4 py-2 text-sm font-medium transition-colors rounded-tl-lg focus:outline-none ${
            activeTab === 'c' ? 'bg-gray-800 text-cyan-400' : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          C
        </button>
        <button
          onClick={() => setActiveTab('cpp')}
          className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
            activeTab === 'cpp' ? 'bg-gray-800 text-cyan-400' : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          C++
        </button>
      </div>
      <div className="p-4 overflow-auto flex-grow">
        {!isImplemented ? (
          <div className="flex items-center justify-center h-full text-gray-500">
              Code examples will be available soon.
          </div>
        ) : (
          <>
            {activeTab === 'c' && <SyntaxHighlighter code={code.c} />}
            {activeTab === 'cpp' && <SyntaxHighlighter code={code.cpp} />}
          </>
        )}
      </div>
    </div>
  );
};

export default CodePanel;
