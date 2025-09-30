import React, { useState, useEffect } from 'react';
import type { AlgorithmKey } from '../../types';

const ArrayOpVisualizer: React.FC<{ algorithmKey: AlgorithmKey }> = ({ algorithmKey }) => {
    const isInsertion = algorithmKey === 'arrayInsertion';
    const initialArray = [10, 20, 40, 50, 60];
    const opIndex = 2;
    const opValue = 30;

    const [array, setArray] = useState(initialArray);
    const [animatedIndices, setAnimatedIndices] = useState<Record<number, string>>({});
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setArray(initialArray);
        setAnimatedIndices({});
        setIsAnimating(false);
    }, [algorithmKey]);
    
    const triggerAnimation = () => {
        if(isAnimating) return;
        setIsAnimating(true);
        setArray(initialArray);

        if (isInsertion) {
            // Shift elements right
            for (let i = initialArray.length - 1; i >= opIndex; i--) {
                setTimeout(() => {
                    setAnimatedIndices(prev => ({...prev, [i]: 'shifting-right'}));
                }, (initialArray.length - 1 - i) * 200);
            }
            // Insert new element
            setTimeout(() => {
                setArray(prev => {
                    const newArr = [...prev];
                    newArr.splice(opIndex, 0, opValue);
                    return newArr;
                });
                 setAnimatedIndices(prev => {
                    const newAnimated = {};
                    // Remap old indices
                    Object.keys(prev).forEach(key => {
                        const idx = parseInt(key);
                        if (idx >= opIndex) newAnimated[idx+1] = prev[idx];
                        else newAnimated[idx] = prev[idx];
                    });
                    newAnimated[opIndex] = 'inserted';
                    return newAnimated;
                });
            }, (initialArray.length - opIndex) * 200 + 100);
        } else { // Deletion
            // Highlight element to be deleted
            setAnimatedIndices({ [opIndex]: 'deleted' });

            setTimeout(() => {
                 // Shift elements left
                for (let i = opIndex + 1; i < initialArray.length; i++) {
                    setTimeout(() => {
                         setAnimatedIndices(prev => ({...prev, [i]: 'shifting-left'}));
                    }, (i - (opIndex + 1)) * 200);
                }
            }, 500)

            setTimeout(() => {
                setArray(prev => prev.filter((_, i) => i !== opIndex));
                setAnimatedIndices({});
            }, 500 + (initialArray.length - opIndex -1) * 200 + 100);
        }
        
        // Reset animation state
        setTimeout(() => setIsAnimating(false), 3000);
    };

    const getElementStyle = (index: number) => {
        const status = animatedIndices[index];
        if (status === 'shifting-right') return 'translate-x-16';
        if (status === 'shifting-left') return '-translate-x-16';
        return 'translate-x-0';
    };

    const getElementColor = (index: number) => {
        const status = animatedIndices[index];
        if (status === 'inserted') return 'bg-green-500';
        if (status === 'deleted') return 'bg-rose-600 scale-0 opacity-0';
        return 'bg-cyan-600';
    }

    return (
        <div className="flex flex-col h-full items-center justify-around p-4">
            <div className="text-center">
                <p className="text-gray-400 mb-2">
                    {isInsertion ? `Demonstrate inserting ${opValue} at index ${opIndex}` : `Demonstrate deleting element at index ${opIndex}`}
                </p>
                <p className="text-sm text-amber-400">Elements must be shifted to accommodate the change.</p>
            </div>

            <div className="flex gap-2 h-16 items-center">
                {array.map((val, index) => (
                     <div
                        key={`${val}-${index}`}
                        className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-white shadow-lg transition-all duration-500 ${getElementStyle(index)} ${getElementColor(index)}`}
                    >
                        {val}
                    </div>
                ))}
            </div>

            <button 
                onClick={triggerAnimation}
                disabled={isAnimating}
                className="px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 bg-violet-500 hover:bg-violet-400 focus:ring-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isAnimating ? 'Animating...' : 'Start Animation'}
            </button>
        </div>
    );
};

export default ArrayOpVisualizer;
