# Chapter 1.3 — Trees

**IK Section I, Module 3.** Reading time: 22 minutes.

> Trees are the data structure FAANG interviewers love the most. The reason: trees test recursion, traversal patterns, and pointer manipulation simultaneously. One well-chosen tree question is a complete signal.

## Hash tables, dictionaries, sets — the prerequisite

Before trees, the IK curriculum touches hash tables. They're the most-used data structure at FAANG and the most-implicit in interview problems. Half the optimal solutions to "find the duplicate / find the pair / count the occurrences" type questions use a hash map.

```
Operation       Hash table        Sorted array       Tree (BST)
─────────────  ─────────────     ────────────────   ──────────────
Insert          O(1) average      O(n)               O(log n)
Lookup          O(1) average      O(log n) binary    O(log n)
Delete          O(1) average      O(n)               O(log n)
Ordered scan    O(n log n)        O(n)               O(n)
Worst case      O(n)              O(n)               O(n)
```

Hash tables crush sorted arrays and trees for *individual operations* but lose for *ordered access*. The interviewer almost always assumes hash tables when you say "I'll store these in a map"; you don't need to explain. Reach for them by default unless the problem requires ordering.

## Binary trees vs binary search trees

**Binary tree** = a tree where every node has at most two children. That's it. No ordering constraint.

**Binary search tree (BST)** = a binary tree where, for every node, all values in the left subtree are less than the node's value, and all values in the right subtree are greater.

```
Binary tree (arbitrary):                Binary search tree:
       5                                       5
      / \                                     / \
     3   8                                   3   8
    / \   \                                 / \   \
   9   1   2                               1   4   9

Left subtree of 5 = {3, 9, 1}              Left subtree of 5 = {3, 1, 4}
No ordering constraint.                    All values < 5.

                                           Right subtree of 5 = {8, 9}
                                           All values > 5.
```

The BST property is what gives you O(log n) operations — at every node, you can throw away half the tree based on the comparison.

When the BST is **balanced**, height is O(log n). When it's unbalanced (e.g., insert sorted data into an unbalanced BST → linked list), height is O(n). Real production BSTs are self-balancing: AVL trees, red-black trees (`std::map` in C++, `TreeMap` in Java).

## Tree traversals

The four canonical traversals. Memorize them.

```
              5
             / \
            3   8
           / \   \
          1   4   9

Pre-order (root → left → right):    5, 3, 1, 4, 8, 9
In-order (left → root → right):     1, 3, 4, 5, 8, 9    ← sorted (BST)
Post-order (left → right → root):   1, 4, 3, 9, 8, 5
Level-order (BFS):                  5, 3, 8, 1, 4, 9
```

**Pre-order** = process node, then descend. Used for serializing trees, copying trees.
**In-order on a BST** = produces sorted output. Used for in-order successor problems, k-th smallest.
**Post-order** = descend, then process. Used for deletion, computing tree height, evaluating expression trees.
**Level-order** = BFS, process by depth. Used for level-by-level problems, computing tree width, shortest path.

The fluency to build: you should be able to write the recursive form of pre/in/post-order in 30 seconds, and the iterative form (using an explicit stack) in 2 minutes.

## BFS patterns

BFS uses a queue. The shape:

```
function bfs(root):
    if root is null: return
    queue = [root]
    while queue is not empty:
        node = queue.dequeue()
        process(node)
        for child in node.children:
            queue.enqueue(child)
```

**Level-by-level processing** is the variant that comes up in interviews. To process each level separately, snapshot the queue size at the start of each iteration:

```
function bfs_levels(root):
    if root is null: return
    queue = [root]
    while queue is not empty:
        level_size = queue.size()
        for i in 0..level_size:
            node = queue.dequeue()
            process(node, level)
            for child in node.children:
                queue.enqueue(child)
        level += 1
```

That `level_size = queue.size()` trick is the difference between "do BFS" and "do BFS level-by-level." Internalize it. It's used in: tree right-side view, level averages, zigzag traversal, minimum depth.

## DFS patterns

DFS uses the call stack (recursion) or an explicit stack (iteration). The shape:

```
function dfs(node):
    if node is null: return
    process(node)
    for child in node.children:
        dfs(child)
```

**Iterative form** for trees:

```
function dfs_iterative(root):
    if root is null: return
    stack = [root]
    while stack is not empty:
        node = stack.pop()
        process(node)
        for child in node.children:
            stack.push(child)
```

Pre-order, post-order, and in-order are all DFS variants — the difference is *when* you process the current node relative to descending.

## Tree construction from traversals

A FAANG-favorite trick question. Given pre-order and in-order, reconstruct the tree.

```
Pre-order: [5, 3, 1, 4, 8, 9]
In-order:  [1, 3, 4, 5, 8, 9]

Step 1: Pre-order's first element (5) is the root.
Step 2: Find 5 in in-order. Everything left of 5 (= [1, 3, 4]) is the left subtree;
        everything right (= [8, 9]) is the right subtree.
Step 3: Recurse on each subtree.
```

The pattern: pre-order tells you the root; in-order tells you how to split into subtrees. Post-order and in-order work analogously (post-order's last element is the root).

Why this matters: serialization. To send a tree across a network, you serialize it as a traversal. To rebuild it on the other side, you need either two traversals or a single traversal with explicit null markers.

## Common tree interview problems

```
Traversal-based:
  Maximum depth of a binary tree           (Recursion, max of left/right + 1)
  Diameter of a binary tree                (DFS, return depth, track max)
  Balanced binary tree check               (Recursion, return -1 on imbalance)
  Lowest Common Ancestor (LCA)             (Recursion, return non-null branch)

BST-specific:
  Validate a BST                            (In-order traversal, check sorted)
  K-th smallest element in BST              (In-order, count to k)
  Recover BST (two nodes swapped)           (In-order, find out-of-order pair)

Construction:
  Build tree from pre-order + in-order      (Root from pre, split via in)
  Serialize / deserialize binary tree       (Pre-order with null markers)

BFS-specific:
  Level-order traversal                     (Queue with level snapshot)
  Right-side view                           (Last node of each level)
  Minimum depth                             (BFS, return on first leaf)

DFS-specific:
  Path sum                                  (DFS, track running sum)
  All root-to-leaf paths                    (DFS, backtrack on path list)
```

For each category, internalize **one template** and reuse it. Tree problems decompose into a small number of patterns; the IK module exists to give you those patterns explicit names.

## A note on the frontend analog

You've worked with React's virtual DOM, which is literally a tree. You traverse it constantly — `React.Children.map`, the reconciliation algorithm walking the tree to find dirty subtrees, ref-forwarding through nested components. The instinct of "recurse into children, do something at each level" you already have. The IK curriculum is teaching you to name the patterns and apply them to abstract data, not just JSX.

## How interviewers probe tree questions

Three layers:

1. **Surface:** "Implement BFS." Trivial. They're checking you know the queue.
2. **Standard:** "Find the lowest common ancestor of two nodes." Tests recursion + tree-property reasoning.
3. **Twist:** "LCA when parent pointers exist." Tests whether you can adapt the algorithm to a different data shape (now you can walk up; use that).

The third layer is what's evaluated at senior level. Memorizing standard solutions gets you to mid. Adapting them to twists gets you to senior.

## The Interview Move

> *"Tree problems decompose into traversal pattern and per-node work. For this problem, the traversal is — let me see — DFS post-order, because I need the answer from both subtrees before I can compute the answer for the current node. The per-node work is: combine the left and right subtree answers, update a global max if needed, return the relevant value upward. That's the same shape as diameter, the same shape as max path sum, the same shape as balanced-check. I'll write the recursion."*

Pattern recognition is the senior skill. Naming the traversal and the per-node work before you write code is the move.

Next chapter: graphs. Trees with cycles, multiple edges, no parent-child ordering — the same recursion, plus the visited set.
