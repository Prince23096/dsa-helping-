import type { ALGORITHM_CONTENT } from './constants';

export type AlgorithmKey = keyof typeof ALGORITHM_CONTENT;

export interface AlgorithmContent {
  name: string;
  category: string;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  code: {
    c: string;
    cpp: string;
  };
  isImplemented?: boolean;
}

// Visualizer-specific types
export type SortAnimationStep = {
  type: 'compare' | 'swap' | 'set' | 'sorted' | 'pivot' | 'partition';
  indices: number[];
  values?: number[];
};

export type SearchAnimationStep = {
  type: 'compare' | 'found' | 'not-found' | 'partition';
  index: number;
};

export type ArrayOpAnimationStep = {
  type: 'highlight' | 'insert' | 'delete' | 'shift-right' | 'shift-left';
  index: number;
  value?: number;
};

export type GraphAnimationStep = {
    type: 'visit' | 'enqueue' | 'dequeue' | 'push' | 'pop' | 'edge' | 'finishNode';
    nodeId: number;
    edge?: [number, number];
};

export interface TreeNode {
    id: number;
    value: number;
    left: number | null;
    right: number | null;
    parent: number | null;
    x: number;
    y: number;
}

export type TreeAnimationStep = {
    type: 'compare' | 'traverse' | 'found' | 'not-found' | 'insert' | 'visit' | 'finish-visit';
    nodeId?: number; 
    targetValue?: number;
    message: string;
    edgeFrom?: number;
    edgeTo?: number;
    traversalList?: number[];
    nodeToInsert?: Omit<TreeNode, 'x' | 'y'>;
};
