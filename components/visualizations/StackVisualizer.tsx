import React, { useState, useRef } from 'react';

type StackItem = {
    id: number;
    value: number;
    state: 'visible' | 'popping';
};

const StackVisualizer: React.FC = () => {
    const [stack, setStack] = useState<StackItem[]>([
        { id: 1, value: 10, state: 'visible' },
        { id: 2, value: 20, state: 'visible' },
    ]);
    const [inputValue, setInputValue] = useState<string>('');
    const [poppedValue, setPoppedValue] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const idCounter = useRef(3);

    const handlePush = () => {
        setError('');
        setPoppedValue(null);
        const num = parseInt(inputValue, 10);
        if (isNaN(num)) {
            setError('Please enter a valid number.');
            return;
        }
        if (stack.length >= 7) {
            setError('Stack is full.');
            return;
        }
        const newItem: StackItem = { id: idCounter.current++, value: num, state: 'visible' };
        setStack([...stack, newItem]);
        setInputValue('');
    };

    const handlePop = () => {
        setError('');
        if (stack.length === 0) {
            setError('Stack is empty.');
            setPoppedValue(null);
            return;
        }
        
        const lastItem = stack[stack.length - 1];
        setPoppedValue(lastItem.value);

        setStack(prev => prev.map((item, index) => 
            index === prev.length - 1 ? { ...item, state: 'popping' } : item
        ));
        
        setTimeout(() => {
            setStack(prev => prev.filter(item => item.id !== lastItem.id));
        }, 300); // Corresponds to animation duration
    };
    
    const baseButtonClass = "px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";

    return (
        <div className="flex flex-col h-full items-center justify-between p-4">
             <div className="relative w-28 h-10 -top-2">
                <p className="absolute left-0 text-gray-400 font-bold">TOP</p>
                <svg className="absolute w-4 h-4 text-gray-400 left-12 top-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
            <div className="flex flex-col-reverse items-center gap-1 w-28 flex-grow">
                {stack.map((item, index) => (
                    <div
                        key={item.id}
                        className={`w-24 h-10 flex items-center justify-center rounded-md font-bold text-white shadow-lg ${item.state === 'popping' ? 'animate-slideOutDown' : 'animate-slideInUp'} ${
                            index === stack.length - 1 ? 'bg-cyan-500 ring-2 ring-cyan-400' : 'bg-cyan-700'
                        }`}
                    >
                        {item.value}
                    </div>
                ))}
                {stack.length === 0 && <p className="text-gray-500">Stack is empty</p>}
            </div>
            <div className="text-center w-full mt-4">
                <div className="min-h-[24px] mb-2 text-sm">
                    {poppedValue !== null && <p className="text-green-400 animate-fadeIn">Popped: {poppedValue}</p>}
                    {error && <p className="text-rose-500 animate-fadeIn">{error}</p>}
                </div>
                <div className="flex justify-center gap-2">
                    <input 
                        type="number"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePush()}
                        placeholder="Value"
                        className="w-24 bg-gray-800 text-white p-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    <button onClick={handlePush} className={`${baseButtonClass} bg-violet-500 hover:bg-violet-400 focus:ring-violet-400`}>Push</button>
                    <button onClick={handlePop} className={`${baseButtonClass} bg-rose-600 hover:bg-rose-500 focus:ring-rose-500`}>Pop</button>
                </div>
            </div>
        </div>
    );
};

export default StackVisualizer;
