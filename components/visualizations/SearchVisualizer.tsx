import React, { useState, useEffect, useCallback, useRef } from 'react';
import ControlPanel from '../ControlPanel';
import type { AlgorithmKey, SearchAnimationStep } from '../../types';

const TARGET_VALUE = 42;

// --- Algorithm Implementations ---
const generateLinearSearchSteps = (arr: number[], target: number): SearchAnimationStep[] => {
  const steps: SearchAnimationStep[] = [];
  for (let i = 0; i < arr.length; i++) {
    steps.push({ type: 'compare', index: i });
    if (arr[i] === target) {
      steps.push({ type: 'found', index: i });
      return steps;
    }
  }
  steps.push({ type: 'not-found', index: -1 });
  return steps;
};

const generateBinarySearchSteps = (arr: number[], target: number): SearchAnimationStep[] => {
  const steps: SearchAnimationStep[] = [];
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    steps.push({ type: 'compare', index: mid });
    if (arr[mid] === target) {
      steps.push({ type: 'found', index: mid });
      return steps;
    }
    if (arr[mid] < target) {
      for(let i=left; i <= mid; i++) steps.push({type: 'partition', index: i});
      left = mid + 1;
    } else {
      for(let i=mid; i <= right; i++) steps.push({type: 'partition', index: i});
      right = mid - 1;
    }
  }
   for(let i=0; i < arr.length; i++) steps.push({type: 'partition', index: i});
  steps.push({ type: 'not-found', index: -1 });
  return steps;
};

const ALGORITHM_MAP: Record<string, (arr: number[], target: number) => SearchAnimationStep[]> = {
  linearSearch: generateLinearSearchSteps,
  binarySearch: generateBinarySearchSteps,
};

// --- Component ---
const SearchVisualizer: React.FC<{ algorithmKey: AlgorithmKey }> = ({ algorithmKey }) => {
  const generateInitialArray = useCallback(() => {
    const arr = Array.from({ length: 15 }, (_, i) => i * 5 + Math.floor(Math.random() * 4) + 5);
    if (!arr.includes(TARGET_VALUE)) {
        arr[Math.floor(Math.random() * arr.length)] = TARGET_VALUE;
    }
    return arr.sort((a, b) => a - b);
  }, []);

  const [array, setArray] = useState(generateInitialArray());
  const [animationSteps, setAnimationSteps] = useState<SearchAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elementStatus, setElementStatus] = useState<Record<number, 'compare' | 'found' | 'partition'>>({});
  const [message, setMessage] = useState('Searching for ' + TARGET_VALUE);

  const animationInterval = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (animationInterval.current) clearInterval(animationInterval.current);
    const newArray = generateInitialArray();
    setArray(newArray);
    const stepGenerator = ALGORITHM_MAP[algorithmKey];
    if (stepGenerator) {
      setAnimationSteps(stepGenerator(newArray, TARGET_VALUE));
    }
    setCurrentStep(0);
    setIsPlaying(false);
    setElementStatus({});
    setMessage('Searching for ' + TARGET_VALUE);
  }, [algorithmKey, generateInitialArray]);

  useEffect(() => {
    reset();
  }, [algorithmKey, reset]);

  const performStep = useCallback((stepIndex: number) => {
    if (stepIndex >= animationSteps.length) {
      setIsPlaying(false);
      return;
    }

    const step = animationSteps[stepIndex];
    let newStatus = { ...elementStatus };
    
    if (step.type !== 'partition') {
         Object.keys(newStatus).forEach(key => {
            if(newStatus[Number(key)] === 'compare') delete newStatus[Number(key)]
        });
    }

    switch (step.type) {
      case 'compare':
        newStatus[step.index] = 'compare';
        setMessage(`Comparing with ${array[step.index]}`);
        break;
      case 'found':
        newStatus[step.index] = 'found';
        setIsPlaying(false);
        setMessage(`Found ${TARGET_VALUE} at index ${step.index}!`);
        break;
      case 'partition':
        newStatus[step.index] = 'partition';
        break;
      case 'not-found':
        setIsPlaying(false);
        setMessage(`${TARGET_VALUE} not found in the array.`);
        break;
    }
    setElementStatus(newStatus);
  }, [animationSteps, array, elementStatus]);

  const handleNext = useCallback(() => {
    if (currentStep < animationSteps.length) {
      performStep(currentStep);
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, animationSteps.length, performStep]);

  useEffect(() => {
    if (isPlaying) {
      animationInterval.current = window.setInterval(handleNext, speed);
    } else {
      if (animationInterval.current) clearInterval(animationInterval.current);
    }
    return () => {
      if (animationInterval.current) clearInterval(animationInterval.current);
    };
  }, [isPlaying, speed, handleNext]);

  const getCellStyling = (index: number) => {
    let classes = 'bg-cyan-600';
    let animation = '';
    switch (elementStatus[index]) {
      case 'compare': 
        classes = 'bg-amber-500 ring-4 ring-amber-400';
        animation = 'animate-pulse';
        break;
      case 'found': 
        classes = 'bg-green-500 ring-4 ring-green-400';
        animation = 'animate-pulse';
        break;
      case 'partition': 
        classes = 'bg-gray-700 opacity-60';
        break;
      default: 
        classes = 'bg-cyan-600';
        break;
    }
    return `${classes} ${animation}`;
  };

  return (
    <div className="flex flex-col h-full justify-between">
       <div className="text-center p-2 min-h-[40px]">
        <p className="text-lg font-mono tracking-wider transition-all duration-300">{message}</p>
      </div>
      <div className="flex-grow flex items-center justify-center gap-2 p-4">
        {array.map((value, index) => (
          <div
            key={index}
            className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-white transition-all duration-300 shadow-lg ${getCellStyling(index)}`}
          >
            {value}
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
        disableControls={currentStep >= animationSteps.length && !isPlaying}
      />
    </div>
  );
};

export default SearchVisualizer;
