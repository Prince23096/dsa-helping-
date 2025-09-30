import React, { useState, useEffect, useCallback, useRef } from 'react';
import ControlPanel from '../ControlPanel';
import type { AlgorithmKey, SortAnimationStep } from '../../types';

// --- Algorithm Implementations ---
const generateBubbleSortSteps = (arr: number[]): SortAnimationStep[] => {
  const steps: SortAnimationStep[] = [];
  const localArr = [...arr];
  const n = localArr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ type: 'compare', indices: [j, j + 1] });
      if (localArr[j] > localArr[j + 1]) {
        steps.push({ type: 'swap', indices: [j, j + 1], values: [localArr[j+1], localArr[j]] });
        [localArr[j], localArr[j + 1]] = [localArr[j + 1], localArr[j]];
      }
    }
    steps.push({ type: 'sorted', indices: [n - 1 - i] });
  }
  steps.push({ type: 'sorted', indices: [0] });
  return steps;
};

const generateInsertionSortSteps = (arr: number[]): SortAnimationStep[] => {
  const steps: SortAnimationStep[] = [];
  const localArr = [...arr];
  const n = localArr.length;
  for (let i = 1; i < n; i++) {
    let key = localArr[i];
    let j = i - 1;
    steps.push({ type: 'compare', indices: [i, j < 0 ? i : j]});
    while (j >= 0 && localArr[j] > key) {
        steps.push({ type: 'set', indices: [j + 1], values: [localArr[j]] });
        localArr[j + 1] = localArr[j];
        j = j - 1;
        if (j >= 0) steps.push({ type: 'compare', indices: [i, j] });
    }
    steps.push({ type: 'set', indices: [j + 1], values: [key] });
    localArr[j + 1] = key;
  }
  steps.push(...Array.from({length: n}, (_, i) => ({ type: 'sorted', indices: [i] } as SortAnimationStep)));
  return steps;
};

const generateSelectionSortSteps = (arr: number[]): SortAnimationStep[] => {
    const steps: SortAnimationStep[] = [];
    const localArr = [...arr];
    const n = localArr.length;
    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        for (let j = i + 1; j < n; j++) {
            steps.push({ type: 'compare', indices: [j, min_idx] });
            if (localArr[j] < localArr[min_idx]) {
                min_idx = j;
            }
        }
        steps.push({ type: 'swap', indices: [i, min_idx], values: [localArr[min_idx], localArr[i]] });
        [localArr[i], localArr[min_idx]] = [localArr[min_idx], localArr[i]];
        steps.push({ type: 'sorted', indices: [i] });
    }
    steps.push({ type: 'sorted', indices: [n-1]});
    return steps;
};

const generateMergeSortSteps = (arr: number[]): SortAnimationStep[] => {
    const steps: SortAnimationStep[] = [];
    const localArr = [...arr];
    
    function merge(l: number, m: number, r: number) {
        const n1 = m - l + 1;
        const n2 = r - m;
        const L = localArr.slice(l, m + 1);
        const R = localArr.slice(m + 1, r + 1);

        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            steps.push({ type: 'compare', indices: [l + i, m + 1 + j] });
            if (L[i] <= R[j]) {
                steps.push({ type: 'set', indices: [k], values: [L[i]] });
                localArr[k++] = L[i++];
            } else {
                steps.push({ type: 'set', indices: [k], values: [R[j]] });
                localArr[k++] = R[j++];
            }
        }
        while (i < n1) {
            steps.push({ type: 'set', indices: [k], values: [L[i]] });
            localArr[k++] = L[i++];
        }
        while (j < n2) {
            steps.push({ type: 'set', indices: [k], values: [R[j]] });
            localArr[k++] = R[j++];
        }
    }

    function mergeSort(l: number, r: number) {
        if (l >= r) return;
        const m = Math.floor(l + (r - l) / 2);
        steps.push({ type: 'partition', indices: [l, r] });
        mergeSort(l, m);
        mergeSort(m + 1, r);
        merge(l, m, r);
    }
    
    mergeSort(0, localArr.length - 1);
    steps.push(...Array.from({length: localArr.length}, (_, i) => ({ type: 'sorted', indices: [i] } as SortAnimationStep)));
    return steps;
};

const generateQuickSortSteps = (arr: number[]): SortAnimationStep[] => {
    const steps: SortAnimationStep[] = [];
    const localArr = [...arr];

    function partition(low: number, high: number) {
        const pivot = localArr[high];
        steps.push({ type: 'pivot', indices: [high] });
        let i = low - 1;
        for (let j = low; j < high; j++) {
            steps.push({ type: 'compare', indices: [j, high] });
            if (localArr[j] < pivot) {
                i++;
                steps.push({ type: 'swap', indices: [i, j], values: [localArr[j], localArr[i]] });
                [localArr[i], localArr[j]] = [localArr[j], localArr[i]];
            }
        }
        steps.push({ type: 'swap', indices: [i + 1, high], values: [localArr[high], localArr[i+1]] });
        [localArr[i + 1], localArr[high]] = [localArr[high], localArr[i + 1]];
        return i + 1;
    }

    function quickSort(low: number, high: number) {
        if (low < high) {
            steps.push({ type: 'partition', indices: [low, high] });
            const pi = partition(low, high);
            steps.push({ type: 'sorted', indices: [pi] });
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        } else if (low === high) {
             steps.push({ type: 'sorted', indices: [low] });
        }
    }
    
    quickSort(0, localArr.length - 1);
    return steps;
};


const ALGORITHM_MAP: Record<string, (arr: number[]) => SortAnimationStep[]> = {
  bubbleSort: generateBubbleSortSteps,
  insertionSort: generateInsertionSortSteps,
  selectionSort: generateSelectionSortSteps,
  mergeSort: generateMergeSortSteps,
  quickSort: generateQuickSortSteps,
};

// --- Component ---
const SortVisualizer: React.FC<{ algorithmKey: AlgorithmKey }> = ({ algorithmKey }) => {
  const generateInitialArray = useCallback(() => Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10), []);
  
  const [array, setArray] = useState(generateInitialArray());
  const [animationSteps, setAnimationSteps] = useState<SortAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(250);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elementStatus, setElementStatus] = useState<Record<number, 'compare' | 'swap' | 'sorted' | 'pivot' | 'partition'>>({});

  const animationInterval = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (animationInterval.current) clearInterval(animationInterval.current);
    const newArray = generateInitialArray();
    setArray(newArray);
    const stepGenerator = ALGORITHM_MAP[algorithmKey];
    if (stepGenerator) {
      setAnimationSteps(stepGenerator(newArray));
    }
    setCurrentStep(0);
    setIsPlaying(false);
    setElementStatus({});
  }, [algorithmKey, generateInitialArray]);

  useEffect(() => {
    reset();
  }, [algorithmKey, reset]);
  
  const performStep = useCallback((stepIndex: number) => {
    if (stepIndex >= animationSteps.length) {
      setIsPlaying(false);
      setElementStatus(Object.fromEntries(array.map((_, i) => [i, 'sorted'])));
      return;
    }
    
    const step = animationSteps[stepIndex];
    const newStatus: Record<number, any> = {...elementStatus};
    
    // Clear transient highlights
    Object.keys(newStatus).forEach(keyStr => {
        const key = Number(keyStr);
        if(['compare', 'swap', 'pivot'].includes(newStatus[key])) {
            delete newStatus[key];
        }
    });

    switch(step.type) {
        case 'compare':
            step.indices.forEach(i => newStatus[i] = 'compare');
            break;
        case 'swap':
        case 'set':
             setArray(prev => {
                const newArr = [...prev];
                const [i, j] = step.indices;
                const [val1, val2] = step.values!;
                newArr[i] = val1;
                if (j !== undefined && val2 !== undefined) newArr[j] = val2;
                return newArr;
            });
            step.indices.forEach(i => newStatus[i] = 'swap');
            break;
        case 'sorted':
            step.indices.forEach(i => newStatus[i] = 'sorted');
            break;
        case 'pivot':
            step.indices.forEach(i => newStatus[i] = 'pivot');
            break;
         case 'partition':
            Object.keys(newStatus).forEach(key => {
                if(newStatus[Number(key)] === 'partition') delete newStatus[Number(key)]
            });
            for(let i=step.indices[0]; i <= step.indices[1]; i++) {
                if(newStatus[i] !== 'sorted') newStatus[i] = 'partition';
            }
            break;
    }
    setElementStatus(newStatus);

  }, [animationSteps, elementStatus, array]);

  const handleNext = useCallback(() => {
    if (currentStep < animationSteps.length) {
      performStep(currentStep);
      setCurrentStep(currentStep + 1);
    } else {
        setIsPlaying(false);
    }
  }, [currentStep, animationSteps.length, performStep]);
  
  useEffect(() => {
    if (isPlaying) {
      animationInterval.current = window.setInterval(() => {
        handleNext();
      }, speed);
    } else {
      if (animationInterval.current) clearInterval(animationInterval.current);
    }
    return () => {
      if (animationInterval.current) clearInterval(animationInterval.current);
    };
  }, [isPlaying, speed, handleNext]);


  const getBarStyling = (index: number) => {
    let colorClass = 'from-gray-700 to-gray-600';
    let shadowClass = '';

    switch (elementStatus[index]) {
      case 'compare':
        colorClass = 'from-amber-500 to-amber-400';
        shadowClass = 'shadow-[0_0_12px_2px_#f59e0b]';
        break;
      case 'swap':
        colorClass = 'from-rose-600 to-rose-500';
        shadowClass = 'shadow-[0_0_12px_2px_#f43f5e]';
        break;
      case 'sorted':
        colorClass = 'from-green-500 to-green-400';
        break;
      case 'pivot':
        colorClass = 'from-violet-500 to-violet-400';
        shadowClass = 'shadow-[0_0_12px_2px_#8b5cf6]';
        break;
      case 'partition':
        colorClass = 'from-cyan-600 to-cyan-500';
        break;
      default:
        colorClass = 'from-cyan-700 to-cyan-600';
        break;
    }
     return `bg-gradient-to-b ${colorClass} ${shadowClass}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex items-end justify-center gap-1 p-4 min-h-[280px]">
        {array.map((value, index) => (
          <div
            key={index}
            className={`w-6 rounded-t-lg transition-all duration-300 ease-in-out ${getBarStyling(index)}`}
            style={{ height: `${value * 2.8}px` }}
          >
             <span className="text-xs text-white/80 text-center block relative -top-5 font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">{value}</span>
          </div>
        ))}
      </div>
      <ControlPanel
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onNext={handleNext}
        onReset={reset}
        speed={speed}
        onSpeedChange={setSpeed}
        disableControls={false}
      />
    </div>
  );
};

export default SortVisualizer;
