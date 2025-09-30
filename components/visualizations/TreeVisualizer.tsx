import React, { useState, useEffect, useCallback, useRef } from 'react';
import ControlPanel from '../ControlPanel';
import type { AlgorithmKey, TreeAnimationStep, TreeNode } from '../../types';
// FIX: Import ALGORITHM_CONTENT to resolve reference error.
import { ALGORITHM_CONTENT } from '../../constants';

const MAX_NODES = 15;
const NODE_X_SPACING = 70;
const NODE_Y_SPACING = 70;

// Helper class to manage BST logic and animation step generation
class BST {
    nodes: Map<number, Omit<TreeNode, 'x' | 'y'>> = new Map();
    rootId: number | null = null;
    private nextId = 0;

    findNode(value: number): [TreeNode | undefined, TreeAnimationStep[]] {
        const steps: TreeAnimationStep[] = [];
        if (this.rootId === null) {
            steps.push({ type: 'not-found', targetValue: value, message: `Tree is empty. Cannot find ${value}.` });
            return [undefined, steps];
        }

        let current = this.nodes.get(this.rootId)!;
        while (true) {
            steps.push({ type: 'compare', nodeId: current.id, targetValue: value, message: `Comparing with ${current.value}` });
            if (current.value === value) {
                steps.push({ type: 'found', nodeId: current.id, targetValue: value, message: `Found ${value}!` });
                return [current as TreeNode, steps];
            } else if (value < current.value) {
                if (current.left === null) {
                    steps.push({ type: 'not-found', targetValue: value, message: `${value} not found.` });
                    return [undefined, steps];
                }
                steps.push({ type: 'traverse', edgeFrom: current.id, edgeTo: current.left, message: `${value} < ${current.value}, moving left.` });
                current = this.nodes.get(current.left)!;
            } else {
                if (current.right === null) {
                    steps.push({ type: 'not-found', targetValue: value, message: `${value} not found.` });
                    return [undefined, steps];
                }
                steps.push({ type: 'traverse', edgeFrom: current.id, edgeTo: current.right, message: `${value} > ${current.value}, moving right.` });
                current = this.nodes.get(current.right)!;
            }
        }
    }

    insert(value: number): TreeAnimationStep[] {
        const steps: TreeAnimationStep[] = [];
        if (this.nodes.size >= MAX_NODES) {
            steps.push({ type: 'not-found', message: `Tree is full. Cannot insert ${value}.` });
            return steps;
        }

        const newNodeData = { id: this.nextId, value, left: null, right: null, parent: null };

        if (this.rootId === null) {
            this.rootId = newNodeData.id;
            this.nodes.set(newNodeData.id, newNodeData);
            steps.push({ type: 'insert', nodeToInsert: newNodeData, message: `Tree is empty. Inserting ${value} as root.` });
            this.nextId++;
            return steps;
        }

        let current = this.nodes.get(this.rootId)!;
        while (true) {
            steps.push({ type: 'compare', nodeId: current.id, targetValue: value, message: `Comparing with ${current.value}` });
            if (value === current.value) {
                steps.push({ type: 'not-found', nodeId: current.id, message: `${value} already exists.` });
                return steps;
            } else if (value < current.value) {
                if (current.left === null) {
                    current.left = newNodeData.id;
                    newNodeData.parent = current.id;
                    this.nodes.set(newNodeData.id, newNodeData);
                    steps.push({ type: 'insert', nodeToInsert: newNodeData, message: `Inserting ${value} as left child of ${current.value}.` });
                    this.nextId++;
                    return steps;
                }
                steps.push({ type: 'traverse', edgeFrom: current.id, edgeTo: current.left, message: `${value} < ${current.value}, moving left.` });
                current = this.nodes.get(current.left)!;
            } else {
                if (current.right === null) {
                    current.right = newNodeData.id;
                    newNodeData.parent = current.id;
                    this.nodes.set(newNodeData.id, newNodeData);
                    steps.push({ type: 'insert', nodeToInsert: newNodeData, message: `Inserting ${value} as right child of ${current.value}.` });
                    this.nextId++;
                    return steps;
                }
                steps.push({ type: 'traverse', edgeFrom: current.id, edgeTo: current.right, message: `${value} > ${current.value}, moving right.` });
                current = this.nodes.get(current.right)!;
            }
        }
    }

    getTraversal(type: 'in-order' | 'pre-order' | 'post-order'): TreeAnimationStep[] {
        const steps: TreeAnimationStep[] = [];
        const visitedOrder: number[] = [];

        if (this.rootId === null) {
            steps.push({ type: 'visit', message: 'Tree is empty.', traversalList: [] });
            return steps;
        }
        
        const traverse = (nodeId: number | null) => {
            if (nodeId === null) return;
            const node = this.nodes.get(nodeId)!;

            if (type === 'pre-order') {
                steps.push({ type: 'visit', nodeId, message: `Visiting ${node.value}` });
                visitedOrder.push(node.value);
            }
            traverse(node.left);
            if (type === 'in-order') {
                steps.push({ type: 'visit', nodeId, message: `Visiting ${node.value}` });
                visitedOrder.push(node.value);
            }
            traverse(node.right);
            if (type === 'post-order') {
                steps.push({ type: 'visit', nodeId, message: `Visiting ${node.value}` });
                visitedOrder.push(node.value);
            }
            steps.push({ type: 'finish-visit', nodeId, message: `Finished subtree of ${node.value}` });
        };
        
        traverse(this.rootId);
        steps.push({ type: 'visit', message: `Traversal complete.`, traversalList: visitedOrder });
        return steps;
    }
}

const TreeVisualizer: React.FC<{ algorithmKey: AlgorithmKey }> = ({ algorithmKey }) => {
    const bst = useRef(new BST());
    const [nodes, setNodes] = useState<Map<number, TreeNode>>(new Map());
    
    const [animationSteps, setAnimationSteps] = useState<TreeAnimationStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [speed, setSpeed] = useState(600);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [message, setMessage] = useState('Select an operation.');
    const [inputValue, setInputValue] = useState('');
    
    const [nodeStatus, setNodeStatus] = useState<Record<number, 'compare' | 'found' | 'path' | 'visited'>>({});
    const [edgeStatus, setEdgeStatus] = useState<Record<string, 'path'>>({});
    const [traversalResult, setTraversalResult] = useState<number[]>([]);

    const animationInterval = useRef<number | null>(null);
    const isTraversal = algorithmKey.includes('Traversal');

    const reset = useCallback((isNewAlgorithm = true) => {
        if (animationInterval.current) clearInterval(animationInterval.current);
        setIsPlaying(false);
        setCurrentStep(0);
        setAnimationSteps([]);
        setMessage('Select an operation.');
        setNodeStatus({});
        setEdgeStatus({});
        setTraversalResult([]);
        if(isNewAlgorithm) {
            bst.current = new BST();
            [50, 30, 70, 20, 40, 60, 80].forEach(val => bst.current.insert(val));
            recalculatePositions();
        }
    }, []);

    const recalculatePositions = () => {
        const positionedNodes = new Map<number, TreeNode>();
        let currentX = 0;
        
        const setPosition = (nodeId: number | null, depth: number) => {
            if (nodeId === null) return;
            const node = bst.current.nodes.get(nodeId)!;
            
            setPosition(node.left, depth + 1);
            
            positionedNodes.set(nodeId, {
                ...node,
                x: currentX * NODE_X_SPACING,
                y: depth * NODE_Y_SPACING,
            });
            currentX += 1;
            
            setPosition(node.right, depth + 1);
        };
        
        setPosition(bst.current.rootId, 0);

        // Center the tree
        const minX = Math.min(...Array.from(positionedNodes.values()).map(n => n.x));
        const maxX = Math.max(...Array.from(positionedNodes.values()).map(n => n.x));
        const treeWidth = maxX - minX;
        const containerWidth = (MAX_NODES - 1) * NODE_X_SPACING;
        const xOffset = (containerWidth - treeWidth) / 2 - minX;

        positionedNodes.forEach(node => {
            node.x += xOffset;
        });

        setNodes(positionedNodes);
    };

    useEffect(() => {
        reset(true);
    }, [algorithmKey, reset]);

    const handleOperation = (type: 'insert' | 'search' | 'in-order' | 'pre-order' | 'post-order') => {
        reset(false);
        let steps: TreeAnimationStep[] = [];
        if (type === 'insert' || type === 'search') {
            const value = parseInt(inputValue, 10);
            if (isNaN(value)) {
                setMessage('Please enter a valid number.');
                return;
            }
            steps = type === 'insert' ? bst.current.insert(value) : bst.current.findNode(value)[1];
            setInputValue('');
        } else {
            steps = bst.current.getTraversal(type);
        }
        setAnimationSteps(steps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const performStep = useCallback((stepIndex: number) => {
        if (stepIndex >= animationSteps.length) {
            setIsPlaying(false);
            return;
        }
        
        const step = animationSteps[stepIndex];
        setMessage(step.message);
        setTraversalResult(step.traversalList ?? traversalResult);

        // Clear previous transient highlights
        const newNodeStatus = { ...nodeStatus };
        Object.keys(newNodeStatus).forEach(k => {
            const key = Number(k);
            if (['compare', 'found'].includes(newNodeStatus[key])) delete newNodeStatus[key];
        });
        const newEdgeStatus = { ...edgeStatus };

        switch (step.type) {
            case 'compare':
            case 'found':
                if(step.nodeId !== undefined) newNodeStatus[step.nodeId] = step.type;
                break;
            case 'traverse':
                if(step.edgeFrom !== undefined && step.edgeTo !== undefined) {
                    newEdgeStatus[`${step.edgeFrom}-${step.edgeTo}`] = 'path';
                    newNodeStatus[step.edgeFrom] = 'path';
                }
                break;
            case 'insert':
                if (step.nodeToInsert) recalculatePositions();
                break;
            case 'visit':
                if(step.nodeId !== undefined) newNodeStatus[step.nodeId] = 'visited';
                break;
            case 'finish-visit':
                 if(step.nodeId !== undefined) delete newNodeStatus[step.nodeId];
                 break;
        }

        setNodeStatus(newNodeStatus);
        setEdgeStatus(newEdgeStatus);

    }, [animationSteps, nodeStatus, traversalResult]);

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
            animationInterval.current = window.setInterval(handleNext, speed);
        } else if (animationInterval.current) {
            clearInterval(animationInterval.current);
        }
        return () => { if (animationInterval.current) clearInterval(animationInterval.current); };
    }, [isPlaying, speed, handleNext]);


    const getNodeStyling = (id: number) => {
        switch (nodeStatus[id]) {
            case 'compare': return 'bg-amber-500 ring-4 ring-amber-400 animate-pulse';
            case 'found': return 'bg-green-500 ring-4 ring-green-400 animate-pulse';
            case 'path': return 'bg-cyan-500';
            case 'visited': return 'bg-violet-500 ring-4 ring-violet-400 animate-pulse';
            default: return 'bg-gray-700';
        }
    };
    
    const getEdgeStyling = (fromId: number, toId: number) => {
        return edgeStatus[`${fromId}-${toId}`] === 'path' ? 'stroke-cyan-400' : 'stroke-gray-700';
    };

    const isOperationDisabled = isPlaying || (currentStep > 0 && currentStep < animationSteps.length);
    const nodesArray = Array.from(nodes.values());

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow relative w-full min-h-[250px] mb-2">
                <svg className="absolute w-full h-full" style={{ overflow: 'visible' }}>
                    {nodesArray.map(node => {
                        const from = nodes.get(node.id);
                        const toLeft = node.left !== null ? nodes.get(node.left) : null;
                        const toRight = node.right !== null ? nodes.get(node.right) : null;
                        return (
                            <React.Fragment key={`edge-${node.id}`}>
                                {from && toLeft && <line x1={from.x + 20} y1={from.y + 40} x2={toLeft.x + 20} y2={toLeft.y} className={`stroke-2 transition-all duration-300 ${getEdgeStyling(from.id, toLeft.id)}`} />}
                                {from && toRight && <line x1={from.x + 20} y1={from.y + 40} x2={toRight.x + 20} y2={toRight.y} className={`stroke-2 transition-all duration-300 ${getEdgeStyling(from.id, toRight.id)}`} />}
                            </React.Fragment>
                        )
                    })}
                </svg>
                {nodesArray.map(node => (
                    <div key={node.id} className={`w-10 h-10 absolute rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300 ${getNodeStyling(node.id)}`} style={{ left: node.x, top: node.y, transition: 'left 0.5s ease, top 0.5s ease' }}>
                        {node.value}
                    </div>
                ))}
            </div>
            
            <div className="text-center min-h-[24px] mb-2">
                <p className="text-lg font-mono tracking-wider">{message}</p>
                {traversalResult.length > 0 && 
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="font-semibold text-gray-400">Result:</span>
                        {traversalResult.map((val, i) => <span key={i} className="font-mono text-cyan-400">{val}</span>)}
                    </div>
                }
            </div>

            {isTraversal ? (
                <div className="flex items-center justify-center gap-2">
                     <button onClick={() => handleOperation(algorithmKey.includes('inOrder') ? 'in-order' : algorithmKey.includes('preOrder') ? 'pre-order' : 'post-order')} disabled={isOperationDisabled} className="flex-grow px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-400 disabled:bg-gray-600 transition-all duration-200 shadow-md transform hover:-translate-y-0.5">
                        Start {ALGORITHM_CONTENT[algorithmKey].name}
                    </button>
                </div>
            ) : (
                 <div className="flex items-center justify-center gap-2">
                    <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value" disabled={isOperationDisabled} className="w-24 bg-gray-800 text-white p-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-gray-700"/>
                    <button onClick={() => handleOperation('insert')} disabled={isOperationDisabled || algorithmKey !== 'bstInsertion'} className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-400 disabled:bg-gray-600 transition-colors">Insert</button>
                    <button onClick={() => handleOperation('search')} disabled={isOperationDisabled || algorithmKey !== 'bstSearch'} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 transition-colors">Search</button>
                </div>
            )}

            <div className="mt-2">
                 <ControlPanel
                    isPlaying={isPlaying}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onNext={handleNext}
                    onReset={() => reset(false)}
                    speed={speed}
                    onSpeedChange={setSpeed}
                    disableControls={animationSteps.length === 0}
                  />
            </div>
        </div>
    );
};

export default TreeVisualizer;