# Chapter 1.1 — Sorting

**IK Section I, Module 1.** Reading time: 20 minutes.

> Sorting interview questions are rarely about sorting. They're about whether you can reason in terms of comparisons, invariants, and asymptotic costs while also pattern-matching from the problem to one of three or four canonical algorithms. The sort is the vehicle. The reasoning is the point.

## Why sorting is the IK foundation chapter

The IK curriculum starts with sorting because it's the cleanest concept in CS to teach asymptotic analysis on. Every sort is a thought experiment in big-O: O(n²) bubble sort vs O(n log n) merge sort vs O(n + k) counting sort. By the time you've internalized why merge sort is O(n log n) and bubble sort is O(n²), you've internalized how to *talk* about algorithm cost.

The senior interviewer at Google won't ask you to implement bubble sort. They'll ask you to solve a problem where the optimal solution sorts the input first and exploits that ordering. The skill being measured isn't "can you write quicksort"; it's "can you see when sorting unlocks a better algorithm."

## Asymptotic analysis — the foundation

```
Notation       Meaning                  Example
─────────────  ──────────────────────  ────────────────────────
O(1)           Constant time           Array index
O(log n)       Logarithmic             Binary search
O(n)           Linear                  Single pass
O(n log n)     Linearithmic            Merge sort, quick sort avg
O(n²)          Quadratic               Bubble, insertion (worst)
O(2^n)         Exponential             Naive subset enumeration
O(n!)          Factorial               Naive permutation
```

Worst case, average case, best case. The interviewer almost always wants worst case unless they specify otherwise.

```
Worst case is the upper bound — the input that makes the algorithm
crawl. Quicksort is O(n²) worst case (already-sorted input with
bad pivot choice).

Average case is what happens on a randomized input. Quicksort is
O(n log n) average case. This is what you ship.

Best case is the input the algorithm flies through. Insertion sort
is O(n) on already-sorted data.
```

The bridge from infra: you already think this way about network latency. You don't say "the link is fast." You say "the link is 1 Gbps best case, p95 320 Mbps under load, worst case it craters during the failover." Algorithms have the same shape. Worst / average / best are the algorithmic versions of best-case / typical / tail-latency.

## The canonical sorts

```
Algorithm          Time          Space    Stable?   Notes
─────────────────  ────────────  ───────  ────────  ──────────────────────────
Bubble sort        O(n²)         O(1)     Yes       Never shipped. Teaching tool.
Insertion sort     O(n²) / O(n)  O(1)     Yes       Fast on tiny / nearly sorted
Merge sort         O(n log n)    O(n)     Yes       Predictable. External-friendly.
Quick sort         O(n log n) /  O(log n) No        Cache-friendly. Fast in practice.
                   O(n²) worst
Heap sort          O(n log n)    O(1)     No        In-place, no worst case.
Counting sort      O(n + k)      O(n + k) Yes       Integer keys, bounded range
Radix sort         O(d × (n+k))  O(n + k) Yes       Multi-digit integer / string
```

**Stable** means: if two elements have the same key, the sort preserves their original relative order. Matters when you sort by multiple criteria — sort by date first, then by name; if the name-sort is stable, the date order survives.

The instinct to absorb: **quicksort is the default in practice, merge sort is the default for predictable performance, heap sort is the default when memory matters.** Memorize that. The interviewer rarely asks "implement quicksort" but often asks "would you use quick or merge here, and why?"

## Algorithm paradigms — `Divide & Conquer / Decrease & Conquer / Transform & Conquer`

This is one of those IK concepts that sounds like classroom material and turns out to be load-bearing in interviews. Every algorithm fits into one of three paradigms, and naming the paradigm in your interview answer shows you're thinking in *patterns*, not in *specifics*.

```
Divide & Conquer
  Split the problem into smaller versions of itself.
  Solve each independently. Combine the results.
  Examples: merge sort, quick sort, FFT, closest-pair-of-points.

Decrease & Conquer
  Reduce the problem to ONE smaller version of itself.
  Solve it. The solution is the answer (or extends to one).
  Examples: binary search, insertion sort, Euclidean algorithm.

Transform & Conquer
  Convert the problem into a different representation
  that's easier to solve. Solve the easy form.
  Examples: presorting (transform to sorted form, then sweep),
  AVL/red-black trees (transform to balanced form).
```

The pattern recognition: when an interviewer poses a problem, your first move is to ask "what paradigm does this fit?" If it fits divide-and-conquer, you're looking at recursion + merge. If decrease-and-conquer, you're looking at iteration with a shrinking subproblem. If transform-and-conquer, you're looking at a preprocessing step that unlocks a linear sweep.

## Presorting — the highest-leverage pattern

This is one of the patterns IK hammers because it shows up constantly in FAANG interviews.

```
Naive O(n²): for each pair (i, j), check some condition.

Better: sort the input first (O(n log n)), then sweep
        once (O(n)) exploiting the sorted order.

Total: O(n log n) + O(n) = O(n log n).  Saved a factor of n.
```

Examples where this pattern wins:

- **Two-sum (sorted variant):** find pairs that sum to target. Sort, then two pointers from ends. O(n log n) instead of O(n²) hash-table search.
- **Meeting rooms / interval scheduling:** sort by start time, sweep, track overlap. O(n log n) instead of O(n²) interval comparison.
- **Closest pair:** sort by x-coordinate, recurse on halves, merge. O(n log n) instead of O(n²) all-pairs distance.
- **Largest gap:** sort the input, find max consecutive difference. O(n log n) trivially.

The interview move: when you see "find pairs" or "find optimal subset where order matters," your first reflex should be *"can I sort first?"* If sorting solves the problem in O(n log n), that's almost certainly the expected answer.

## Common interview problems

The IK curriculum hits these in module 1:

```
Sort-based:
  Merge K sorted lists                       (Heap, O(N log k))
  Find Kth largest element                   (Quickselect, O(n) avg)
  Sort by frequency                          (Counting + sort)
  Group anagrams                             (Sort chars to canonical form)

Sweep-based after sort:
  Meeting rooms                              (Sort by start, sweep)
  Largest gap                                (Sort, max consecutive diff)
  Closest pair                               (Divide & conquer)

Partition-based:
  Sort colors (Dutch flag)                   (Three-way partition)
  Wiggle sort                                (Sort, interleave)
```

For each, internalize the **pattern** before the **code**. The pattern is what transfers; the code is throwaway.

## How interviewers probe sorting questions

Three layers:

1. **Surface:** "Sort this." Trivial. They're checking you know to use the library sort.
2. **Standard:** "Find the K largest." Tests whether you reach for a heap (better than full sort).
3. **Twist:** "Sort an array of N elements where each is at most K positions from its sorted location." Tests whether you can adapt — a min-heap of size K, sweep through, O(N log K).

The bar at FAANG is the third layer. The first two are screen-out questions.

## The Interview Move

> *"Before I write code, let me think about which paradigm fits. The problem has a 'find pairs satisfying a condition' shape, which is the canonical presorting pattern — sort in O(n log n), then sweep in O(n) exploiting the sorted order. The total is O(n log n), better than the obvious O(n²). If the input were already sorted I'd skip straight to the sweep; if the input were small enough or had a bounded integer range, I'd use counting sort to get to O(n+k) preprocessing instead. Let me write the sweep."*

That's the answer. You named the paradigm, you named the algorithm, you named two adjacent alternatives and when they'd win. Then you wrote code. Sorting interviews aren't about the code; they're about the framing.

Next chapter: recursion. The control-flow paradigm that quietly drives half of these problems.
