import React, { useState, useEffect, useCallback, useRef } from 'react';
import ControlPanel from '../ControlPanel';
import type { AlgorithmKey, GraphAnimationStep } from '../../types';

// --- Graph Data ---
// FIX: Explicitly type `graphData` to ensure `graphData.edges` is correctly inferred as `[number, number][]`.
const graphData: {
    nodes: { id: number; value: string }[];
    edges: [number, number][];
    positions: { x: number; y: number }[];
    adj: number[][];
} = {
    nodes: [
        { id: 0, value: 'A' }, { id: 1, value: 'B' }, { id: 2, value: 'C' },
        { id: 3, value: 'D' }, { id: 4, value: 'E' }, { id: 5, value: 'F' },
        { id: 6, value: 'G' },
    ],
    edges: [
        [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [4, 5]
    ],
    positions: [ // Pre-calculated positions for a nice layout
        { x: 250, y: 50 }, { x: 150, y: 120 }, { x: 350, y: 120 },
        { x: 50, y: 200 }, { x: 150, y: 200 }, { x: 350, y: 200 },
        { x: 450, y: 200 },
    ],
    adj: [
      [1, 2],    // Node 0 (A)
      [0, 3, 4], // Node 1 (B)
      [0, 5, 6], // Node 2 (C)
      [1],       // Node 3 (D)
      [1, 5],    // Node 4 (E)
      [2, 4],    // Node 5 (F)
      [2],       // Node 6 (G)
    ]
};

// --- Algorithm Implementations ---
const generateBFSSteps = (adj: number[][], startNode: number): GraphAnimationStep[] => {
    const steps: GraphAnimationStep[] = [];
    const visited = new Array(adj.length).fill(false);
    const queue: number[] = [];

    visited[startNode] = true;
    queue.push(startNode);
    steps.push({ type: 'enqueue', nodeId: startNode });

    while (queue.length > 0) {
        const u = queue.shift()!;
        steps.push({ type: 'dequeue', nodeId: u });
        steps.push({ type: 'visit', nodeId: u });

        for (const v of adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                steps.push({ type: 'edge', nodeId: v, edge: [u, v] });
                queue.push(v);
                steps.push({ type: 'enqueue', nodeId: v });
            }
        }
        steps.push({ type: 'finishNode', nodeId: u });
    }
    return steps;
};

const generateDFSSteps = (adj: number[][], startNode: number): GraphAnimationStep[] => {
    const steps: GraphAnimationStep[] = [];
    const visited = new Array(adj.length).fill(false);
    const stack: number[] = [];

    stack.push(startNode);
    steps.push({ type: 'push', nodeId: startNode });

    while (stack.length > 0) {
        const u = stack.pop()!;
        steps.push({ type: 'pop', nodeId: u });
        
        if (!visited[u]) {
            visited[u] = true;
            steps.push({ type: 'visit', nodeId: u });

            // Push neighbors in reverse order to visit them in lexicographical order
            for (let i = adj[u].length - 1; i >= 0; i--) {
                const v = adj[u][i];
                if (!visited[v]) {
                    steps.push({ type: 'edge', nodeId: v, edge: [u, v] });
                    stack.push(v);
                    steps.push({ type: 'push', nodeId: v });
                }
            }
        }
        steps.push({ type: 'finishNode', nodeId: u });
    }
    return steps;
};

const ALGORITHM_MAP = {
    bfs: generateBFSSteps,
    dfs: generateDFSSteps,
};

// --- Component ---
const GraphVisualizer: React.FC<{ algorithmKey: AlgorithmKey }> = ({ algorithmKey }) => {
    const [animationSteps, setAnimationSteps] = useState<GraphAnimationStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [speed, setSpeed] = useState(700);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [nodeStatus, setNodeStatus] = useState<Record<number, 'visited' | 'visiting' | 'in-struct'>>({});
    const [edgeStatus, setEdgeStatus] = useState<Record<string, 'traversed' | 'active'>>({});
    const [structure, setStructure] = useState<number[]>([]); // Queue or Stack

    const animationInterval = useRef<number | null>(null);
    const isBFS = algorithmKey === 'bfs';

    const reset = useCallback(() => {
        if (animationInterval.current) clearInterval(animationInterval.current);
        const stepGenerator = ALGORITHM_MAP[algorithmKey];
        setAnimationSteps(stepGenerator(graphData.adj, 0));
        setCurrentStep(0);
        setIsPlaying(false);
        setNodeStatus({});
        setEdgeStatus({});
        setStructure([]);
    }, [algorithmKey]);

    useEffect(() => {
        reset();
    }, [algorithmKey, reset]);

    const performStep = useCallback((stepIndex: number) => {
        if (stepIndex >= animationSteps.length) {
            setIsPlaying(false);
            return;
        }

        const step = animationSteps[stepIndex];
        
        setNodeStatus(prev => {
            const newStatus = { ...prev };
            Object.keys(newStatus).forEach(k => {
                if (newStatus[Number(k)] === 'visiting') delete newStatus[Number(k)];
            });
            if (step.type === 'visit') newStatus[step.nodeId] = 'visiting';
            if (step.type === 'finishNode') newStatus[step.nodeId] = 'visited';
            if (step.type === 'enqueue' || step.type === 'push') newStatus[step.nodeId] = 'in-struct';
            return newStatus;
        });

        setEdgeStatus(prev => {
            const newStatus = { ...prev };
            Object.keys(newStatus).forEach(k => {
                if (newStatus[k] === 'active') delete newStatus[k];
            });
            if (step.edge) {
                const edgeKey = step.edge.slice().sort().join('-');
                newStatus[edgeKey] = 'active';
            }
            if (step.type === 'visit' && stepIndex > 0) {
                 const prevStep = animationSteps[stepIndex-1];
                 if(prevStep.edge) {
                    const prevEdgeKey = prevStep.edge.slice().sort().join('-');
                    newStatus[prevEdgeKey] = 'traversed';
                 }
            }
            return newStatus;
        });

        if (isBFS) {
            if (step.type === 'enqueue') setStructure(prev => [...prev, step.nodeId]);
            if (step.type === 'dequeue') setStructure(prev => prev.slice(1));
        } else { // DFS
            if (step.type === 'push') setStructure(prev => [...prev, step.nodeId]);
            if (step.type === 'pop') setStructure(prev => prev.slice(0, -1));
        }
    }, [animationSteps, isBFS]);
    
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
        return () => {
            if (animationInterval.current) clearInterval(animationInterval.current);
        };
    }, [isPlaying, speed, handleNext]);

    const getNodeStyling = (id: number) => {
        switch (nodeStatus[id]) {
            case 'visiting': return 'bg-amber-500 ring-4 ring-amber-400 animate-pulse';
            case 'visited': return 'bg-green-500';
            case 'in-struct': return 'bg-cyan-500';
            default: return 'bg-gray-700';
        }
    };
    
    const getEdgeStyling = (edge: [number, number]) => {
        const edgeKey = edge.slice().sort().join('-');
        switch(edgeStatus[edgeKey]) {
            case 'active': return 'bg-amber-400';
            case 'traversed': return 'bg-cyan-500';
            default: return 'bg-gray-700';
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow relative">
                {graphData.edges.map((edge, i) => {
                    const [u, v] = edge;
                    const p1 = graphData.positions[u];
                    const p2 = graphData.positions[v];
                    const length = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
                    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
                    const style = {
                        width: `${length}px`,
                        transform: `rotate(${angle}deg)`,
                        left: `${p1.x}px`,
                        top: `${p1.y + 20}px`,
                    };
                    return <div key={i} className={`h-1 absolute origin-left transition-colors duration-300 ${getEdgeStyling(edge)}`} style={style}></div>
                })}
                 {graphData.nodes.map(node => (
                    <div key={node.id} className={`w-10 h-10 absolute rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300 ${getNodeStyling(node.id)}`} style={{ left: graphData.positions[node.id].x - 20, top: graphData.positions[node.id].y }}>
                        {node.value}
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-between gap-4">
                 <div className="w-1/3 text-center">
                    <h3 className="font-bold text-cyan-400">{isBFS ? "Queue" : "Stack"}</h3>
                    <div className="flex gap-1 mt-1 bg-gray-800 p-1 rounded-md h-12 items-center justify-center">
                       {structure.map(id => (
                           <div key={id} className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center font-mono text-sm">
                               {graphData.nodes[id].value}
                           </div>
                       ))}
                       {structure.length === 0 && <span className="text-gray-500 text-sm">Empty</span>}
                    </div>
                </div>
                <div className="w-2/3">
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
            </div>
        </div>
    );
};

export default GraphVisualizer;