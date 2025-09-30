import React, { useState, useRef } from 'react';

type QueueItem = {
    id: number;
    value: number;
    state: 'visible' | 'dequeuing';
};


const QueueVisualizer: React.FC = () => {
    const [queue, setQueue] = useState<QueueItem[]>([
        { id: 1, value: 10, state: 'visible' },
        { id: 2, value: 20, state: 'visible' },
    ]);
    const [inputValue, setInputValue] = useState<string>('');
    const [dequeuedValue, setDequeuedValue] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const idCounter = useRef(3);

    const handleEnqueue = () => {
        setError('');
        setDequeuedValue(null);
        const num = parseInt(inputValue, 10);
        if (isNaN(num)) {
            setError('Please enter a valid number.');
            return;
        }
        if (queue.length >= 7) {
            setError('Queue is full.');
            return;
        }
        const newItem: QueueItem = { id: idCounter.current++, value: num, state: 'visible' };
        setQueue([...queue, newItem]);
        setInputValue('');
    };

    const handleDequeue = () => {
        setError('');
        if (queue.length === 0) {
            setError('Queue is empty.');
            setDequeuedValue(null);
            return;
        }
        
        const firstItem = queue[0];
        setDequeuedValue(firstItem.value);

        setQueue(prev => prev.map((item, index) => 
            index === 0 ? { ...item, state: 'dequeuing' } : item
        ));
        
        setTimeout(() => {
            setQueue(prev => prev.filter(item => item.id !== firstItem.id));
        }, 300); // Corresponds to animation duration
    };

    const baseButtonClass = "px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";

    return (
        <div className="flex flex-col h-full items-center justify-between p-4">
            <div className="flex items-center gap-2 h-16 w-full justify-center">
                <div className="flex flex-col items-center mr-2">
                    <p className="font-bold text-gray-400 text-sm">Front</p>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
                {queue.map((item, index) => (
                    <div
                        key={item.id}
                        className={`w-16 h-12 flex items-center justify-center rounded-lg font-bold text-white shadow-lg ${item.state === 'dequeuing' ? 'animate-slideOutLeft' : 'animate-slideInRight'} ${
                            index === 0 ? 'bg-cyan-500 ring-2 ring-cyan-400' : 'bg-cyan-700'
                        }`}
                    >
                        {item.value}
                    </div>
                ))}
                {queue.length === 0 && <p className="text-gray-500">Queue is empty</p>}
                 <div className="flex flex-col items-center ml-2">
                    <p className="font-bold text-gray-400 text-sm">Rear</p>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path></svg>
                </div>
            </div>
            <div className="text-center w-full mt-4">
                 <div className="min-h-[24px] mb-2 text-sm">
                    {dequeuedValue !== null && <p className="text-green-400 animate-fadeIn">Dequeued: {dequeuedValue}</p>}
                    {error && <p className="text-rose-500 animate-fadeIn">{error}</p>}
                </div>
                <div className="flex justify-center gap-2">
                    <input 
                        type="number"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
                        placeholder="Value"
                        className="w-24 bg-gray-800 text-white p-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    <button onClick={handleEnqueue} className={`${baseButtonClass} bg-violet-500 hover:bg-violet-400 focus:ring-violet-400`}>Enqueue</button>
                    <button onClick={handleDequeue} className={`${baseButtonClass} bg-rose-600 hover:bg-rose-500 focus:ring-rose-500`}>Dequeue</button>
                </div>
            </div>
        </div>
    );
};

export default QueueVisualizer;
