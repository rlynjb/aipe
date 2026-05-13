# Chapter 1.5 — Dynamic Programming

**IK Section I, Module 5.** Reading time: 25 minutes.

> Dynamic programming is the topic candidates fear most and the topic interviewers ask most often at senior level. It's not because DP is hard — it's because DP requires you to see the recursive structure of a problem, then notice the redundancy, then write the optimization. Three skills stacked. Most candidates can do one or two; few can do all three under interview pressure.

## What DP actually is

Dynamic programming is **recursion with memoization** — you solve a problem by breaking it into subproblems, and you remember the answers to subproblems so you don't recompute them.

That's it. Everything else is mechanics.

The two prerequisites for DP:

1. **Optimal substructure** — the optimal solution to the problem contains the optimal solutions to its subproblems. If I know the best way to solve a smaller version, I can extend it to the bigger version.
2. **Overlapping subproblems** — the same subproblem appears multiple times when you solve naively. Without overlap, memoization doesn't help; you just have recursion.

If both hold, DP applies. If only the first holds, you have plain divide-and-conquer (mergesort, quicksort).

## The Fibonacci example — the canonical motivator

Naive recursion:

```
function fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

Call tree for fib(5):

                 fib(5)
                /      \
             fib(4)    fib(3)
            /     \     /    \
         fib(3) fib(2) fib(2) fib(1)
         /   \   ...    ...
      fib(2) fib(1)
       ...

fib(3) computed 2 times.
fib(2) computed 3 times.
fib(1) computed multiple times.
```

Each subproblem gets recomputed. Total: O(2^n). Useless for n > 40.

The DP fix: memoize.

```
memo = {}

function fib(n):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]
```

Now fib(2), fib(3), etc. are each computed once. Total work is O(n). The same recursive structure, now with a cache.

## Top-down memoization vs bottom-up tabulation

Two ways to write the same DP. Memorize the distinction; interviewers ask.

**Top-down (memoization):** recursive, with a cache. The function calls itself; the cache shortcuts repeated calls.

```
memo = {}

function fib(n):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]
```

**Bottom-up (tabulation):** iterative, filling in a table from smallest subproblem up.

```
function fib(n):
    if n <= 1: return n
    dp = [0, 1] + [0] * (n - 1)
    for i in 2..n:
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

Same answer. Same complexity (O(n) time, O(n) space). Different flavor.

**When to use which:**

- **Top-down** is easier to write when you already have the recursive solution. You just slap on memoization. Good for irregular subproblem orderings.
- **Bottom-up** is easier to optimize for space (often you only need the last few dp[i] values, not the whole table). Good for predictable subproblem ordering.

The senior move in an interview: write top-down first because it's faster to derive, then convert to bottom-up if asked about space optimization.

## Optimizing bottom-up tabulation

This is where you turn O(n) space into O(1) space.

For fib:

```
function fib(n):
    if n <= 1: return n
    prev2, prev1 = 0, 1
    for i in 2..n:
        curr = prev1 + prev2
        prev2, prev1 = prev1, curr
    return prev1
```

Two variables instead of an n-element array. Same time complexity, O(1) space.

This rolling-window optimization applies whenever the DP recurrence only depends on a fixed number of recent subproblems. Most 1D DP problems collapse to O(1) space this way.

## The DP problem-detection checklist

When you see a problem in an interview, ask:

```
1. Is there a "find the optimal X" or "count the number of X"
   or "is there a way to X" phrasing?

2. Can I describe the answer as a recursive function of smaller answers?
   "f(n) = optimal way to do X with input of size n"

3. When I'd compute f(n), would I end up calling f(k) for some k < n
   from multiple paths?

If yes to all three: DP.
```

If yes to (1) and (2) but no to (3), you have plain recursion or divide-and-conquer.
If no to (1), you don't have a DP problem.

## The DP problem-solving template

```
1. Define the state.
   - What does dp[i] (or dp[i][j]) represent?
   - This is the hardest step. Get it wrong, the whole derivation fails.

2. Write the recurrence.
   - dp[i] in terms of dp[j] for j < i.
   - This is the recursive step in math form.

3. Identify the base case.
   - What's dp[0] or dp[1]? The trivial smallest answer.

4. Decide the iteration order.
   - Bottom-up: smallest to largest.
   - Make sure each dp[i] is computed before any cell that depends on it.

5. Extract the answer.
   - Often dp[n], sometimes max(dp), sometimes a sum.

6. (Optional) Optimize space.
   - If only last K values are needed, use K variables.
```

The state-definition step is where 80% of DP interview failures happen. Practice this specifically. For "longest increasing subsequence," `dp[i] = length of LIS ending at i` is the right state; `dp[i] = length of LIS in arr[0..i]` is the wrong state (it doesn't carry enough information for the recurrence).

## The four DP problem categories

```
1D DP — state is a single index.
  Climbing stairs                            dp[i] = ways to reach step i
  House robber                               dp[i] = max from houses 0..i
  Longest increasing subsequence             dp[i] = LIS ending at i
  Word break                                 dp[i] = can the prefix [0..i] break?

2D DP — state is a pair of indices.
  Edit distance                              dp[i][j] = ops to convert a[0..i] to b[0..j]
  Longest common subsequence                 dp[i][j] = LCS of a[0..i] and b[0..j]
  Coin change                                dp[i][j] = ways to make amount j with coins 0..i
  Unique paths                               dp[i][j] = paths to cell (i, j)

DP on intervals — state is (left, right).
  Matrix chain multiplication                dp[i][j] = min cost for product i..j
  Burst balloons                             dp[i][j] = max coins from balloons i..j

Knapsack — state is (item index, remaining capacity).
  0/1 Knapsack                               dp[i][w] = max value with items 0..i, capacity w
  Subset sum                                 dp[i][s] = can sum s be made from items 0..i?
  Partition equal subset                     Subset sum to total/2
```

Memorize the canonical example for each category. When a new problem appears, ask: which of these does it look like? The state and recurrence usually map onto one of the canonical examples with minor modifications.

## The classic interview problems, with templates

### Coin change

> "Given coins of denominations [1, 2, 5] and a target of 11, find the minimum number of coins to make 11."

```
State: dp[i] = min coins to make amount i
Base: dp[0] = 0
Recurrence: dp[i] = min over each coin c of (dp[i - c] + 1)
Answer: dp[target]

function coin_change(coins, amount):
    dp = [infinity] * (amount + 1)
    dp[0] = 0
    for i in 1..amount:
        for c in coins:
            if c <= i:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != infinity else -1
```

### Longest increasing subsequence

> "Given an array, find the length of the longest strictly increasing subsequence."

```
State: dp[i] = length of LIS ending at index i
Base: dp[i] = 1 for all i
Recurrence: dp[i] = 1 + max(dp[j] for j < i where arr[j] < arr[i])
Answer: max(dp)

function lis(arr):
    n = len(arr)
    dp = [1] * n
    for i in 0..n:
        for j in 0..i:
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

Complexity: O(n²). There's an O(n log n) version using binary search,
but O(n²) is usually accepted.
```

### Edit distance (Levenshtein)

> "Given two strings, find the minimum number of operations (insert, delete, replace) to convert one to the other."

```
State: dp[i][j] = edit distance between a[0..i] and b[0..j]
Base: dp[0][j] = j (insert j chars); dp[i][0] = i (delete i chars)
Recurrence:
  if a[i-1] == b[j-1]:
      dp[i][j] = dp[i-1][j-1]                      ← match: no op
  else:
      dp[i][j] = 1 + min(
        dp[i-1][j],     ← delete a[i-1]
        dp[i][j-1],     ← insert b[j-1]
        dp[i-1][j-1]    ← replace
      )
Answer: dp[m][n]
```

### Knapsack (0/1)

> "Given items with weights and values, and a knapsack of capacity W, maximize value without exceeding W. Each item used at most once."

```
State: dp[i][w] = max value using items 0..i with capacity w
Base: dp[0][w] = 0 for all w
Recurrence:
  if weight[i] > w:
      dp[i][w] = dp[i-1][w]                        ← can't take item i
  else:
      dp[i][w] = max(
        dp[i-1][w],                                ← skip item i
        dp[i-1][w - weight[i]] + value[i]          ← take item i
      )
Answer: dp[n][W]
```

These four templates cover ~60% of DP interview problems. Internalize them.

## How interviewers probe DP

Three layers:

1. **Surface:** "Climbing stairs." Trivial. Confirms you can write a 1D DP.
2. **Standard:** "Coin change." Tests whether you can build the state + recurrence + base case.
3. **Twist:** "Coin change II — count the *number of ways*, not the minimum coins." Tests whether you can adapt the same template (change `min` to sum, change the iteration order to avoid double-counting).

The twist layer is brutal. Two common DP twists:

- **Counting vs optimizing.** "Number of ways" vs "minimum cost." The template is the same; the combine step changes from `sum` to `min`.
- **Iteration order tricks.** Coin change vs Coin change II: in one, you iterate amounts in the outer loop; in the other, you iterate coins in the outer loop. Get this wrong and you double-count.

## A note on the production analog

DP appears in production all the time even when nobody calls it DP. The shortest-path computation in Google Maps is dynamic programming on the road graph. The autocomplete ranking is DP. The HTML rendering layout engine uses DP for line breaking (the algorithm Knuth designed for TeX). The compiler optimizer uses DP for register allocation.

When you ship a system that recomputes the same intermediate result repeatedly, you're paying for missing DP. The IK module exists to make you fluent in the pattern so you can spot it.

## How to practice DP

Solve 20 problems across the four categories. After each one, write down:

1. What was the state?
2. What was the recurrence?
3. What was the base case?
4. Was there a space optimization?

If you can do that retrospective in 60 seconds, you've internalized the problem. If you can't, you've memorized the code without understanding the structure.

## The Interview Move

> *"This looks like a DP problem because we're asking for the optimal X over a set of choices. Let me define the state as dp[i] = optimal X using the first i elements. The recurrence is dp[i] in terms of dp[i-1] and some operation. Base case is dp[0] = trivial answer. I'll write top-down first because it's faster to derive, then convert to bottom-up if you want space optimization. Let me check the state captures enough information for the recurrence to work."*

That paragraph is the senior DP answer. You named the pattern, defined the state, wrote the recurrence in words, named the base case, named the optimization path. Then you write code.

Five chapters of DSA. You've covered sorting, recursion, trees, graphs, DP. That's the bar for the two DSA loops at any FAANG interview. Move on to system design.

Next section: System design. Where your data-center background starts to pay rent.
