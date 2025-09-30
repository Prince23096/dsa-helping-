import type { AlgorithmContent } from './types';

export const ALGORITHM_CONTENT: Record<string, AlgorithmContent> = {
  // --- Arrays ---
  arrayInsertion: {
    name: "Array: Insertion",
    category: "Arrays",
    description: "Inserting an element into an array at a specific position requires shifting all subsequent elements to the right to make space. This can be an O(n) operation in the worst case, as every element after the insertion point needs to be moved.",
    complexity: { time: "O(n)", space: "O(1)" },
    code: {
      c: `
// Function to insert element in array
int insertElement(int arr[], int n, int x, int pos) {
    // shift elements to the right
    // which are on the right side of pos
    for (int i = n - 1; i >= pos; i--)
        arr[i + 1] = arr[i];

    arr[pos] = x;
    return n + 1;
}`,
      cpp: `
// Function to insert element in array
int insertElement(int arr[], int n, int x, int pos) {
    // shift elements to the right
    // which are on the right side of pos
    for (int i = n - 1; i >= pos; i--)
        arr[i + 1] = arr[i];

    arr[pos] = x;
    return n + 1;
}`
    },
    isImplemented: true,
  },
  arrayDeletion: {
    name: "Array: Deletion",
    category: "Arrays",
    description: "Deleting an element from an array at a specific position requires shifting all subsequent elements to the left to fill the gap. Similar to insertion, this is an O(n) operation in the worst case.",
    complexity: { time: "O(n)", space: "O(1)" },
    code: {
      c: `
// Function to delete element from array
int deleteElement(int arr[], int n, int pos) {
    // shift elements to the left
    // which are on the right side of pos
    for (int i = pos; i < n - 1; i++)
        arr[i] = arr[i + 1];

    return n - 1;
}`,
      cpp: `
// Function to delete element from array
int deleteElement(int arr[], int n, int pos) {
    // shift elements to the left
    // which are on the right side of pos
    for (int i = pos; i < n - 1; i++)
        arr[i] = arr[i + 1];

    return n - 1;
}`
    },
    isImplemented: true,
  },

  // --- Sorting ---
  bubbleSort: {
    name: "Bubble Sort",
    category: "Sorting",
    description: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
    complexity: { time: "O(n^2)", space: "O(1)" },
    code: {
      c: `
void bubbleSort(int arr[], int n) {
    int i, j;
    for (i = 0; i < n-1; i++) {
        // Last i elements are already in place
        for (j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                // swap arr[j] and arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,
      cpp: `
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
}`
    },
    isImplemented: true,
  },
  insertionSort: {
    name: "Insertion Sort",
    category: "Sorting",
    description: "Insertion sort iterates through an input array and removes one element per iteration, finds the place the element belongs in the array, and then places it there.",
    complexity: { time: "O(n^2)", space: "O(1)" },
    code: {
      c: `
void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;

        /* Move elements of arr[0..i-1], that are
           greater than key, to one position ahead
           of their current position */
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
      cpp: `
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
    },
    isImplemented: true,
  },
  selectionSort: {
    name: "Selection Sort",
    category: "Sorting",
    description: "Selection sort divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire input list. The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element (putting it in sorted order), and moving the sublist boundaries one element to the right.",
    complexity: { time: "O(n^2)", space: "O(1)" },
    code: {
        c: `
void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n - 1; i++) {
        min_idx = i;
        for (j = i + 1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
        cpp: `
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        std::swap(arr[min_idx], arr[i]);
    }
}`
    },
    isImplemented: true,
  },
  mergeSort: {
    name: "Merge Sort",
    category: "Sorting",
    description: "Merge Sort is an efficient, comparison-based, divide and conquer sorting algorithm. It divides the array into two halves, recursively sorts them, and then merges the two sorted halves.",
    complexity: { time: "O(n log n)", space: "O(n)" },
    code: { 
      c: `
void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (i = 0; i < n1; i++) L[i] = arr[l + i];
    for (j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    i = 0; j = 0; k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`, 
      cpp: `
void merge(int array[], int const left, int const mid, int const right) {
    auto const subArrayOne = mid - left + 1;
    auto const subArrayTwo = right - mid;
    auto *leftArray = new int[subArrayOne], *rightArray = new int[subArrayTwo];
    for (auto i = 0; i < subArrayOne; i++) leftArray[i] = array[left + i];
    for (auto j = 0; j < subArrayTwo; j++) rightArray[j] = array[mid + 1 + j];
    // Merge logic...
    delete[] leftArray;
    delete[] rightArray;
}
void mergeSort(int array[], int const begin, int const end) {
    if (begin >= end) return;
    auto mid = begin + (end - begin) / 2;
    mergeSort(array, begin, mid);
    mergeSort(array, mid + 1, end);
    merge(array, begin, mid, end);
}` 
    },
    isImplemented: true,
  },
  quickSort: {
    name: "Quick Sort",
    category: "Sorting",
    description: "Quick Sort is an efficient sorting algorithm that uses a divide and conquer approach. It picks an element as a pivot and partitions the given array around the picked pivot.",
    complexity: { time: "O(n log n) average", space: "O(log n)" },
    code: { 
      c: `
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            // swap arr[i] and arr[j]
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    // swap arr[i+1] and arr[high]
    int temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;
    return (i + 1);
}
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`, 
      cpp: `
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return (i + 1);
}
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
    },
    isImplemented: true,
  },

  // --- Searching ---
  linearSearch: {
    name: "Linear Search",
    category: "Searching",
    description: "Linear search is a method for finding an element within a list. It sequentially checks each element of the list until a match is found or the whole list has been searched.",
    complexity: { time: "O(n)", space: "O(1)" },
    code: {
      c: `
int linearSearch(int arr[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == x)
            return i; // Found
    }
    return -1; // Not found
}`,
      cpp: `
int linearSearch(int arr[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == x)
            return i; // Found
    }
    return -1; // Not found
}`
    },
    isImplemented: true,
  },
  binarySearch: {
    name: "Binary Search",
    category: "Searching",
    description: "Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you've narrowed down the possible locations to just one.",
    complexity: { time: "O(log n)", space: "O(1)" },
    code: {
      c: `
int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        // Check if x is present at mid
        if (arr[m] == x)
            return m;
        // If x greater, ignore left half
        if (arr[m] < x)
            l = m + 1;
        // If x is smaller, ignore right half
        else
            r = m - 1;
    }
    // if we reach here, then element was not present
    return -1;
}`,
      cpp: `
int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x)
            return m;
        if (arr[m] < x)
            l = m + 1;
        else
            r = m - 1;
    }
    return -1;
}`
    },
    isImplemented: true,
  },

  // --- Graph Algorithms ---
  bfs: {
      name: "Breadth-First Search",
      category: "Graphs",
      description: "BFS is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.",
      complexity: { time: "O(V + E)", space: "O(V)" },
      code: { 
        c: `
// Using an adjacency list representation
void BFS(int s, int V, struct AdjListNode* adj[]) {
    bool* visited = (bool*)malloc(V * sizeof(bool));
    for (int i = 0; i < V; i++) visited[i] = false;
    
    int* queue = (int*)malloc(V * sizeof(int));
    int front = 0, rear = 0;
    
    visited[s] = true;
    queue[rear++] = s;
    
    while (front != rear) {
        s = queue[front++];
        printf("%d ", s);
        
        struct AdjListNode* node = adj[s];
        while (node != NULL) {
            if (!visited[node->dest]) {
                visited[node->dest] = true;
                queue[rear++] = node->dest;
            }
            node = node->next;
        }
    }
}`, 
        cpp: `
#include <iostream>
#include <list>
#include <queue>

class Graph {
    int V;
    std::list<int>* adj;
public:
    Graph(int V);
    void addEdge(int v, int w);
    void BFS(int s);
};

void Graph::BFS(int s) {
    std::vector<bool> visited(V, false);
    std::queue<int> queue;
    
    visited[s] = true;
    queue.push(s);
    
    while(!queue.empty()) {
        s = queue.front();
        std::cout << s << " ";
        queue.pop();
        
        for (auto const& i : adj[s]) {
            if (!visited[i]) {
                visited[i] = true;
                queue.push(i);
            }
        }
    }
}`
      },
      isImplemented: true,
  },
  dfs: {
      name: "Depth-First Search",
      category: "Graphs",
      description: "DFS is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node and explores as far as possible along each branch before backtracking.",
      complexity: { time: "O(V + E)", space: "O(V)" },
      code: { 
        c: `
void DFSUtil(int v, bool visited[], struct AdjListNode* adj[]) {
    visited[v] = true;
    printf("%d ", v);

    struct AdjListNode* node = adj[v];
    while (node != NULL) {
        if (!visited[node->dest])
            DFSUtil(node->dest, visited, adj);
        node = node->next;
    }
}

void DFS(int V, struct AdjListNode* adj[]) {
    bool* visited = (bool*)malloc(V * sizeof(bool));
    for (int i = 0; i < V; i++) visited[i] = false;
    
    for (int i = 0; i < V; i++) {
        if (visited[i] == false)
            DFSUtil(i, visited, adj);
    }
}`, 
        cpp: `
#include <iostream>
#include <list>
#include <stack>

class Graph {
    int V;
    std::list<int>* adj;
public:
    Graph(int V);
    void addEdge(int v, int w);
    void DFS(int s);
};

void Graph::DFS(int s) {
    std::vector<bool> visited(V, false);
    std::stack<int> stack;
    
    stack.push(s);
    
    while (!stack.empty()) {
        s = stack.top();
        stack.pop();
        
        if (!visited[s]) {
            std::cout << s << " ";
            visited[s] = true;
        }
        
        for (auto i = adj[s].rbegin(); i != adj[s].rend(); ++i) {
            if (!visited[*i])
                stack.push(*i);
        }
    }
}`
      },
      isImplemented: true,
  },
  
  // --- Trees ---
  bstInsertion: {
      name: "BST: Insertion",
      category: "Trees",
      description: "In a Binary Search Tree, new elements are inserted based on their value. Starting from the root, if the new value is smaller, traverse left; otherwise, traverse right. Continue until an empty spot (a null child pointer) is found, and insert the new node there. This maintains the BST property.",
      complexity: { time: "O(log n) average, O(n) worst", space: "O(log n) recursive" },
      code: { 
          c: `
struct node* insert(struct node* node, int key) {
    if (node == NULL) return newNode(key);
 
    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);
 
    return node;
}`, 
          cpp: `
Node* insert(Node* root, int key) {
    if (!root) {
        return new Node(key);
    }
    if (key < root->key) {
        root->left = insert(root->left, key);
    } else {
        root->right = insert(root->right, key);
    }
    return root;
}` 
      },
      isImplemented: true,
  },
  bstSearch: {
      name: "BST: Search",
      category: "Trees",
      description: "Searching for a value in a BST is highly efficient. Start at the root; if the target value matches the node's value, it's found. If the target is smaller, search the left subtree. If it's larger, search the right subtree. This process is repeated until the value is found or a null child is reached.",
      complexity: { time: "O(log n) average, O(n) worst", space: "O(log n) recursive" },
      code: {
          c: `
struct node* search(struct node* root, int key) {
    if (root == NULL || root->key == key)
       return root;
    
    if (root->key < key)
       return search(root->right, key);
 
    return search(root->left, key);
}`,
          cpp: `
Node* search(Node* root, int key) {
    if (root == nullptr || root->key == key) {
        return root;
    }
    if (key > root->key) {
        return search(root->right, key);
    }
    return search(root->left, key);
}`
      },
      isImplemented: true,
  },
  bstDeletion: {
      name: "BST: Deletion",
      category: "Trees",
      description: "Deleting a node from a BST involves three cases: 1) The node is a leaf (no children): simply remove it. 2) The node has one child: replace the node with its child. 3) The node has two children: find its in-order successor (the smallest node in the right subtree), copy its value to the target node, and then delete the successor.",
      complexity: { time: "O(log n) average, O(n) worst", space: "O(log n) recursive" },
      code: { c: `// Code coming soon...`, cpp: `// Code coming soon...` },
      isImplemented: false,
  },
  inOrderTraversal: {
      name: "Traversal: In-order",
      category: "Trees",
      description: "In-order traversal of a BST visits nodes in ascending order. The process is: 1) Recursively traverse the left subtree. 2) Visit the root node. 3) Recursively traverse the right subtree. (Left, Root, Right)",
      complexity: { time: "O(n)", space: "O(n)" },
      code: {
          c: `
void printInorder(struct Node* node) {
    if (node == NULL)
        return;
    printInorder(node->left);
    printf("%d ", node->data);
    printInorder(node->right);
}`,
          cpp: `
void printInorder(Node* node) {
    if (node == nullptr)
        return;
    printInorder(node->left);
    cout << node->data << " ";
    printInorder(node->right);
}`
      },
      isImplemented: true,
  },
  preOrderTraversal: {
      name: "Traversal: Pre-order",
      category: "Trees",
      description: "Pre-order traversal visits the root node before its children. The process is: 1) Visit the root node. 2) Recursively traverse the left subtree. 3) Recursively traverse the right subtree. (Root, Left, Right). Often used to create a copy of the tree.",
      complexity: { time: "O(n)", space: "O(n)" },
      code: {
          c: `
void printPreorder(struct Node* node) {
    if (node == NULL)
        return;
    printf("%d ", node->data);
    printPreorder(node->left);
    printPreorder(node->right);
}`,
          cpp: `
void printPreorder(Node* node) {
    if (node == nullptr)
        return;
    cout << node->data << " ";
    printPreorder(node->left);
    printPreorder(node->right);
}`
      },
      isImplemented: true,
  },
  postOrderTraversal: {
      name: "Traversal: Post-order",
      category: "Trees",
      description: "Post-order traversal visits the root node after its children. The process is: 1) Recursively traverse the left subtree. 2) Recursively traverse the right subtree. 3) Visit the root node. (Left, Right, Root). Often used to delete a tree.",
      complexity: { time: "O(n)", space: "O(n)" },
      code: {
          c: `
void printPostorder(struct Node* node) {
    if (node == NULL)
        return;
    printPostorder(node->left);
    printPostorder(node->right);
    printf("%d ", node->data);
}`,
          cpp: `
void printPostorder(Node* node) {
    if (node == nullptr)
        return;
    printPostorder(node->left);
    printPostorder(node->right);
    cout << node->data << " ";
}`
      },
      isImplemented: true,
  },

  // --- Other DS ---
  linkedList: {
      name: "Linked List",
      category: "Linked Lists",
      description: "A linked list is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next. Operations like insertion and deletion are efficient. (Note: Visualization is simplified).",
      complexity: { time: "O(n) traversal, O(1) insertion/deletion at ends", space: "O(n)" },
      code: {
          c: `
struct Node {
    int data;
    struct Node* next;
};

void push(struct Node** head_ref, int new_data) {
    struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));
    new_node->data = new_data;
    new_node->next = (*head_ref);
    (*head_ref) = new_node;
}`,
          cpp: `
struct Node {
    int data;
    Node* next;
};

void push(Node** head_ref, int new_data) {
    Node* new_node = new Node();
    new_node->data = new_data;
    new_node->next = (*head_ref);
    (*head_ref) = new_node;
}`
      },
      isImplemented: true,
  },
  stack: {
    name: "Stack (LIFO)",
    category: "Stacks & Queues",
    description: "A stack is a linear data structure that follows the Last-In, First-Out (LIFO) principle. It has two main operations: push (adds an element to the top) and pop (removes the element from the top).",
    complexity: { time: "O(1)", space: "O(n)" },
    code: {
      c: `
#define MAX 1000
int top = -1;
int stack[MAX];

void push(int x) {
    if (top >= (MAX - 1)) return; // Overflow
    stack[++top] = x;
}

int pop() {
    if (top < 0) return 0; // Underflow
    return stack[top--];
}`,
      cpp: `
#include <stack>
#include <iostream>

int main() {
    std::stack<int> s;
    s.push(10);
    s.push(20);
    s.pop(); // removes 20
    // top is now 10
    return 0;
}`
    },
    isImplemented: true,
  },
  queue: {
    name: "Queue (FIFO)",
    category: "Stacks & Queues",
    description: "A queue is a linear data structure that follows the First-In, First-Out (FIFO) principle. It has two main operations: enqueue (adds an element to the rear) and dequeue (removes an element from the front).",
    complexity: { time: "O(1)", space: "O(n)" },
    code: {
        c: `
#define MAX 1000
int queue[MAX];
int front = -1, rear = -1;

void enqueue(int val) {
    if (rear == MAX - 1) return; // Overflow
    if (front == -1) front = 0;
    queue[++rear] = val;
}

int dequeue() {
    if (front == -1 || front > rear) return -1; // Underflow
    return queue[front++];
}`,
        cpp: `
#include <queue>
#include <iostream>

int main() {
    std::queue<int> q;
    q.push(10); // front
    q.push(20); // rear
    q.pop(); // removes 10
    // front is now 20
    return 0;
}`
    },
    isImplemented: true,
  },
};
