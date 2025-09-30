import React, { useState } from 'react';

const Arrow: React.FC = () => (
    <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
);

const NullNode: React.FC = () => (
    <div className="w-16 h-14 flex items-center justify-center bg-gray-800 text-gray-400 font-mono rounded-lg shadow-md ring-1 ring-gray-700">
        NULL
    </div>
);


const LinkedListVisualizer: React.FC = () => {
    const [list, setList] = useState<number[]>([15, 99, 37]);
    const [inputValue, setInputValue] = useState<string>('');

    const addNode = () => {
        const num = parseInt(inputValue, 10);
        if (!isNaN(num) && list.length < 6) {
            setList([...list, num]);
            setInputValue('');
        }
    }
    
    const removeNode = () => {
        if(list.length > 0) {
            setList(list.slice(0,-1));
        }
    }

    const baseButtonClass = "px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";


    return (
        <div className="flex flex-col h-full items-center justify-between p-4">
            <div className="flex items-center gap-2 flex-wrap justify-center min-h-[100px] animate-fadeIn">
                {list.map((value, index) => (
                    <React.Fragment key={index}>
                        <div className="flex items-center shadow-lg rounded-lg">
                            <div className="w-14 h-14 flex items-center justify-center bg-cyan-600 text-white font-bold rounded-l-lg">
                                {value}
                            </div>
                            <div className="w-6 h-14 bg-cyan-700 rounded-r-lg border-l-2 border-cyan-500"></div>
                        </div>
                        <Arrow />
                    </React.Fragment>
                ))}
                <NullNode />
            </div>

            <div className="flex justify-center gap-2 mt-4">
                <input 
                    type="number"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addNode()}
                    placeholder="Value"
                    className="w-24 bg-gray-800 text-white p-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <button onClick={addNode} className={`${baseButtonClass} bg-violet-500 hover:bg-violet-400 focus:ring-violet-400`}>Add</button>
                 <button onClick={removeNode} className={`${baseButtonClass} bg-rose-600 hover:bg-rose-500 focus:ring-rose-500`}>Remove</button>
            </div>
        </div>
    );
};

export default LinkedListVisualizer;
