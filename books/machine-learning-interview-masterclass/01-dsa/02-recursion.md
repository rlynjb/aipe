# Chapter 1.2 — Recursion

**IK Section I, Module 2.** Reading time: 18 minutes.

> Recursion is what you reach for when you have a problem that can be defined in terms of a smaller version of itself. The skill being measured is: can you see that structure? Once you see it, the code writes itself.

## Why recursion is hard

It's not that recursion is conceptually hard. It's that recursive thinking is **unintuitive** — your brain wants to trace through every step, but the recursive style asks you to *trust* that the recursive call does its job and just focus on the current level. IK calls this "the lazy manager's strategy" for a reason: you delegate the hard work down a level and only think about *your* level.

The reader's frontend instinct that applies: you've written components that render other components. You don't trace through every grandchild render when you write a parent component; you trust the child components to do their job and focus on what the parent needs to assemble. Recursion is the same trust contract, applied to algorithms.

## The structure of every recursive function

Every recursive function has three parts:

```
function recurse(input):
    if base case:                    ← 1. The base case
        return base answer

    smaller_result = recurse(smaller_input)   ← 2. The recursive call

    return combine(current, smaller_result)   ← 3. The combination step
```

When you write a recursive solution, the order to think about it is:

1. **What's the base case?** What's the smallest version of the problem with an obvious answer?
2. **What's the recursive call?** How do I reduce the current problem to a smaller version?
3. **How do I combine?** Given the answer to the smaller version, how do I extend it to the current version?

That's the algorithm. The trick is convincing yourself the recursive call will work *before* you've finished writing it. That's where the leap is.

## Recursive mathematical functions

The canonical entry points. These are exam questions; you memorize them but more importantly you internalize the *pattern*.

```
fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
```

This is O(2^n) without memoization — exponential blowup because it recomputes the same fib(k) over and over. Spotting that is the next step (it's what dynamic programming exists to fix; see chapter 1.5).

```
power(x, n):
    if n == 0: return 1
    if n is even:
        half = power(x, n/2)
        return half * half       ← critical optimization
    return x * power(x, n-1)
```

The optimization: by halving `n` instead of decrementing, you turn O(n) into O(log n). This trick — recursing on n/2 instead of n-1 — is one of the most common ways to convert linear recursion into logarithmic recursion.

## Combinatorial enumeration — `[the FAANG bread-and-butter]`

This is the largest category of recursion interview problems. The shape: "list all the X" or "count how many X."

```
All subsets of [1,2,3]:
  []
  [1]
  [2]
  [3]
  [1,2]
  [1,3]
  [2,3]
  [1,2,3]

The recursive structure:
  For each element, two choices: include it, or don't.
  At each step, you fork into two recursive branches.
  Base case: no more elements to consider → emit current subset.

  function subsets(remaining, current):
      if remaining is empty:
          emit current
          return
      first = remaining[0]
      rest = remaining[1:]
      subsets(rest, current)              ← skip first
      subsets(rest, current + [first])    ← include first
```

That `include vs skip at each level → 2^n branches` shape is one of the three canonical recursion templates. Once you see it, you'll see it everywhere.

```
Common combinatorial problems:
  All subsets / power set            (include/skip at each level)
  All permutations                   (try each remaining at each position)
  All combinations of size k         (subset enumeration with size guard)
  Generate parentheses               (open/close branching with constraints)
  N-Queens placement                 (backtracking on board positions)
```

## Backtracking — the constraint-aware enumeration

Backtracking is enumeration with **early termination** when a partial solution violates a constraint.

```
The pattern:

  function backtrack(state):
      if state is a complete solution:
          record it
          return
      if state violates constraint:
          return                          ← prune; don't recurse further
      for each next choice:
          modify state
          backtrack(state)
          undo modification               ← critical: restore state
```

The N-Queens problem is the canonical example:

```
Place N queens on an N×N board such that no two attack each other.

For each row, try each column.
After placing, check: does this conflict with any earlier queen?
  If yes, backtrack — undo the placement, try the next column.
  If no, recurse to the next row.

When you reach row N, record the placement.
```

The "undo modification" line is the part beginners forget. Without it, the state from one branch leaks into the next. The interview probe: "what happens if you don't undo?" The answer is: "the state is shared across branches, you get wrong solutions, and you'd debug for an hour."

## Exhaustive enumeration vs backtracking

These are siblings. Exhaustive enumeration explores every option without pruning; backtracking prunes the moment a partial solution violates a constraint. **Use backtracking when the constraint check is cheap relative to exploring the doomed branch.** If you can detect "this path is dead" early, you save the exponential subtree.

```
Subsets:     exhaustive (no constraints to check)
N-Queens:    backtracking (place a queen, check conflict, prune)
Sudoku:      backtracking (place a digit, check row/col/box, prune)
Word break:  backtracking (try prefixes, prune if no rest match)
```

## Recursion vs iteration

For interview purposes:
- **Tree and graph problems** → recursion is almost always more natural.
- **Linear / array problems** → iteration is often clearer.
- **Problems with shared state across calls** → iteration is easier (no implicit stack to manage).
- **Problems where you want to short-circuit** → recursion's `return` from deep inside is convenient.

The trap: stack overflow. Deep recursion on a million-element input will overflow on most platforms. The interviewer might ask you to convert a recursive solution to iterative using an explicit stack. **Be ready for that question.** It's a frequent senior-bar-raiser probe.

## How interviewers probe recursion

Three layers:

1. **Surface:** "Implement fib." Trivial. They're checking you can write base case + recursive call.
2. **Standard:** "Generate all permutations." Tests whether you can structure the recursion with the include/skip or try-each-remaining template.
3. **Twist:** "Generate all valid parentheses of length 2n." Tests whether you can add constraint pruning on top of the basic structure.

The twist layer is where most candidates fail. They write the brute-force enumeration, the interviewer asks about constraints, and they freeze. The fix: practice 5–10 backtracking problems before the interview, internalize the modify-recurse-undo rhythm.

## Common interview problems

```
Pure recursion:
  Fibonacci / Climbing stairs              (Two-call recurrence)
  Power function                           (Half optimization)
  Reverse a linked list recursively        (Trust the recursive call)

Combinatorial enumeration:
  All subsets / power set                  (Include/skip)
  All permutations                         (Try each remaining)
  K combinations                           (Size-guarded subsets)

Backtracking:
  N-Queens                                 (Place + check + undo)
  Sudoku solver                            (Same shape, more constraints)
  Word search in grid                      (DFS with visited set)
  Word break                               (Try each prefix)
  Generate parentheses                     (Open / close counters)
```

For each: implement the template once, then notice that 80% of the code is reusable across the category.

## A note on the data-center analog

You've debugged recursive route lookups in routers. When a packet hits a router and the destination isn't in the cache, the router recurses up to its default gateway, which recurses to its default gateway, until the packet is either delivered or NACK'd. The base case is "the destination is local"; the recursive call is "ask the next hop"; the combination is "return the result back down the call stack."

If you've ever traced a packet through a multi-hop topology, you've already used the recursive thinking the IK curriculum is asking for. Just apply it to data structures instead of routes.

## The Interview Move

> *"Let me set up the recursion. The base case is when the input is empty — return the trivial answer. The recursive call is the same function on a smaller input — I'll trust it does its job. The combination step takes the smaller answer and extends it with the current element. For enumeration problems this pattern doubles at each level, so the work is O(2^n) — but the constraint check lets me prune the moment a partial solution is invalid, so the actual work is usually closer to the number of valid solutions, not 2^n. Let me write the template."*

Three components. Pattern named. Pruning mentioned. Then you write code. That's the senior-level recursion answer.

Next chapter: trees. Recursion's natural habitat.
