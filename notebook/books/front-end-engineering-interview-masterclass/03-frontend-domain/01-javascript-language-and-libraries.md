# Chapter 3.1 — JavaScript Language and Libraries

**IK Section III, Module 1.** Reading time: 30 minutes.

> Senior FE interviews probe whether you actually understand JavaScript — not whether you can use React. The questions are language-level: `this` binding, scope, closures, currying, promises. You'll get them in the JS-coding slot of the FAANG loop. They're not exotic; they're the JS fundamentals every senior FE engineer is expected to know cold.

## What FAANG actually expects

The FE coding interview at Google, Meta, Netflix, Stripe, and others has a specific JS slot that's separate from the DSA slot. The slot tests:

- Can you reason about `this`?
- Can you implement core JS utilities from scratch (debounce, throttle, curry, memoize)?
- Can you handle async correctly — promises, async/await, error propagation?
- Can you reach for the right data structure (object vs Map vs Set vs Array) and justify the choice?

These are not framework questions. Frameworks abstract the language. The interview probes the language directly.

## The `this` keyword

The single most-tested JavaScript concept. The reason: JS's `this` behavior is genuinely confusing, and the candidate who has it cold signals language-level understanding.

The four binding rules, in priority order:

```
Rule 1: new binding
  When `new Foo()` is called, `this` inside Foo() is the new object.

  function User(name) {
    this.name = name;  // this = new User instance
  }
  const u = new User("Alice");

Rule 2: explicit binding (call, apply, bind)
  When you call fn.call(ctx, ...args) or fn.apply(ctx, args) or
  fn.bind(ctx)(...), `this` inside fn is ctx.

  function greet() { console.log(this.name); }
  greet.call({ name: "Alice" });  // "Alice"

Rule 3: implicit binding
  When you call obj.fn(...), `this` inside fn is obj.

  const obj = {
    name: "Bob",
    greet() { console.log(this.name); }  // this = obj
  };
  obj.greet();  // "Bob"

  Pitfall: detaching loses the binding.
  const g = obj.greet;
  g();  // undefined or window/global — this is no longer obj

Rule 4: default binding
  When none of the above apply, `this` is:
    - In non-strict mode: the global object (window in browsers).
    - In strict mode: undefined.

  function alone() { console.log(this); }
  alone();  // window (non-strict) or undefined (strict)
```

The priority order matters. `new` beats `call/bind`. `call/bind` beats implicit. Implicit beats default. Memorize the order.

## Arrow functions vs bind

```
Arrow functions DON'T bind their own `this`.
They inherit `this` from the enclosing lexical scope.

class Component {
  constructor() {
    this.name = "Comp";

    // Method as arrow function — `this` is the instance.
    this.greet = () => console.log(this.name);
  }
}

const c = new Component();
const g = c.greet;
g();  // "Comp" — even though detached, the arrow function
       // captured `this` from the constructor scope.

Contrast with regular methods:

class Component2 {
  constructor() {
    this.name = "Comp2";
  }
  greet() { console.log(this.name); }
}

const c2 = new Component2();
const g2 = c2.greet;
g2();  // undefined or error — `this` is lost
```

The interview question: "when would you use an arrow function for a class method?" The right answer: "when I need to pass the method as a callback and want `this` to remain bound to the instance." The wrong answer: "always, because they're shorter."

The follow-up: "what's the cost?" Arrow methods are created per-instance (not on the prototype), so memory usage is higher. For a small number of instances, this is fine. For thousands of instances, it adds up. At Facebook's scale, this matters. At your app's scale, it usually doesn't.

## Scope and closures

Scope determines where variables can be accessed. Closure is the mechanism by which inner functions remember outer variables even after the outer function returned.

```
function makeCounter() {
  let count = 0;
  return function increment() {
    count += 1;
    return count;
  };
}

const counter = makeCounter();
counter();  // 1
counter();  // 2
counter();  // 3

The `count` variable lives in the closure scope.
Each call to makeCounter() creates a NEW closure with its own count.

const a = makeCounter();
const b = makeCounter();
a();  // 1
b();  // 1 — separate count
a();  // 2
```

This pattern is the foundation of:

- **Private variables.** Variables in a closure can't be accessed from outside. They're "private" in a way that ES2022 `#fields` formalizes but closures pre-dated by years.
- **Module pattern.** Pre-ES-modules, this was how you exposed a controlled API: wrap state in a closure, return an object with the public methods.
- **Memoization.** A closure holds the cache; the returned function reads/writes the cache.
- **Currying.** Each curried call returns a function that closes over the partially-applied arguments.

The interview move when you see "implement X": ask yourself, "does X need to remember state across calls?" If yes, it's a closure pattern. Write it that way.

## Currying

Currying converts a function of N arguments into a chain of functions, each taking one argument.

```
// Regular:
function add(a, b, c) { return a + b + c; }
add(1, 2, 3);  // 6

// Curried:
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}
curriedAdd(1)(2)(3);  // 6
```

A common interview problem is to write a generic curry function:

```
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

const add = curry((a, b, c) => a + b + c);
add(1, 2, 3);      // 6
add(1)(2)(3);      // 6
add(1, 2)(3);      // 6
add(1)(2, 3);      // 6
```

The trick: keep collecting args until we have enough to call fn. The closure remembers args between calls.

When to use currying in real code: rarely. It's an interview signal more than a practical pattern in JS (Haskell makes more use of it). But knowing it lets you read functional libraries (Ramda, lodash/fp).

## Callbacks and async patterns

```
Era 1 — Callbacks:
  fs.readFile("a.txt", (err, dataA) => {
    if (err) return console.error(err);
    fs.readFile("b.txt", (err, dataB) => {
      if (err) return console.error(err);
      fs.readFile("c.txt", (err, dataC) => {
        if (err) return console.error(err);
        // ... callback hell ...
      });
    });
  });

Era 2 — Promises:
  readFile("a.txt")
    .then(dataA => readFile("b.txt"))
    .then(dataB => readFile("c.txt"))
    .then(dataC => /* ... */)
    .catch(err => console.error(err));

Era 3 — async/await:
  try {
    const dataA = await readFile("a.txt");
    const dataB = await readFile("b.txt");
    const dataC = await readFile("c.txt");
    /* ... */
  } catch (err) {
    console.error(err);
  }
```

Async/await is the modern default. Promises are still useful when you want to fire parallel work:

```
// Parallel:
const [a, b, c] = await Promise.all([
  readFile("a.txt"),
  readFile("b.txt"),
  readFile("c.txt"),
]);

// First to resolve:
const winner = await Promise.race([
  fetchPrimary(),
  fetchBackup(),
]);
```

The interview probe: "what's the difference between Promise.all and Promise.allSettled?" `Promise.all` rejects on the first failure. `Promise.allSettled` waits for all to complete and returns the status of each. Use `allSettled` when you want to know each result individually — e.g., "load 10 API calls; show each section that succeeded; show errors for the ones that failed."

## Promise pitfalls

```
Pitfall 1 — Forgetting to return a promise.
  // BAD:
  function load() {
    fetchData();  // promise discarded; errors silently swallowed
  }

  // GOOD:
  function load() {
    return fetchData();
  }

Pitfall 2 — Mixing async/await and .then.
  // CONFUSING:
  async function load() {
    const data = await fetchData()
      .then(d => transform(d));  // mixing styles
    return data;
  }

  // CLEANER:
  async function load() {
    const data = await fetchData();
    return transform(data);
  }

Pitfall 3 — Sequential await when parallel is fine.
  // SLOW: sequential
  const a = await fetchA();
  const b = await fetchB();
  const c = await fetchC();

  // FAST: parallel
  const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()]);

Pitfall 4 — Unhandled promise rejections.
  Browsers and Node both have global handlers for unhandled rejections.
  Production code should never have any.
```

## Object literals vs Map vs Set vs Array

The IK curriculum specifically asks about trade-offs. Memorize:

```
Object literal { a: 1, b: 2 }:
  + Lightweight; JSON-serializable.
  + Property access via dot notation.
  - Keys are strings (or symbols).
  - Inherits prototype chain (foo.toString, foo.hasOwnProperty exist).
  - No size/iteration helpers.

Map:
  + Keys can be any type (objects, functions, primitives).
  + Preserves insertion order.
  + Has .size, .keys(), .values(), .entries().
  + No prototype chain pollution.
  - Slightly higher memory overhead.
  - Not JSON-serializable directly.

Set:
  + Unique values.
  + Preserves insertion order.
  + Fast .has() lookup.
  + Useful for deduplication.

Array:
  + Indexed access.
  + Iteration helpers (.map, .filter, .reduce).
  + Stack/queue semantics via push/pop/shift/unshift.
  - Linear-time lookup unless you build an index.
```

The interview probe: "I need to keep track of which user IDs have been processed. What data structure?" If the IDs are numbers/strings → Set. If you need to associate metadata with each ID → Map. If insertion order matters and you also need to look up by index → an Array of objects plus a Set for the lookup index.

## Memoization

The pattern: cache the result of a function so repeated calls with the same arguments return the cached value.

```
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const slowAdd = (a, b) => {
  // imagine this is expensive
  return a + b;
};

const fastAdd = memoize(slowAdd);
fastAdd(1, 2);  // slow first time
fastAdd(1, 2);  // cached, fast
```

Senior probes:

- "How do you handle objects as arguments?" `JSON.stringify` works only for simple objects. For complex ones, use a WeakMap keyed by the object reference.
- "Memory growth?" The cache grows unbounded. Add LRU eviction for production use.
- "How does this compose with React?" `useMemo` and `useCallback` are essentially React-aware memoization. The principle is the same; the dependency tracking is React-specific.

## Existential get()

A classic FAANG FE interview problem. The task: given an object and a path, safely retrieve the value at the path, returning undefined if any intermediate value is missing.

```
get({ a: { b: { c: 5 } } }, "a.b.c");      // 5
get({ a: { b: null } }, "a.b.c");           // undefined (no crash)
get(null, "a.b.c");                          // undefined
get({ a: [1, 2, { b: 5 }] }, "a[2].b");     // 5

function get(obj, path) {
  const keys = path.split(/[.[\]]/).filter(Boolean);
  let current = obj;
  for (const key of keys) {
    if (current == null) return undefined;
    current = current[key];
  }
  return current;
}
```

The senior nuances:
- Handle both `.` and `[N]` syntax.
- Return undefined on missing — don't throw.
- Don't use eval. Don't use `with`.
- This is essentially `lodash.get`. Reimplementing is the interview.

Modern JS makes some of this trivial: `obj?.a?.b?.c`. But the interview asks about the path-string variant because that's what comes up with dynamic data (user-typed JSON path, form field names from a config).

## Debounce and throttle

The two functions every senior FE engineer has implemented. Memorize.

```
Debounce: delay execution until the input has been quiet for N ms.
  Use for: search-as-you-type (wait for user to pause typing
           before searching).

function debounce(fn, ms) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
}

const search = debounce((q) => fetchResults(q), 300);
// Each keystroke resets the timer. Only the last one fires.

Throttle: ensure fn fires at most once per N ms, regardless of
          how often called.
  Use for: scroll handlers, resize handlers, drag updates.

function throttle(fn, ms) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= ms) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

const onScroll = throttle(() => updateUI(), 100);
// updateUI fires at most once every 100ms.
```

The senior follow-up: "what's the leading vs trailing variant?" Leading fires immediately and then ignores for N ms; trailing waits N ms then fires. Production libraries (lodash) support both.

## How the interview probes JavaScript

Three layers:

1. **Surface:** "Implement debounce." Tests whether you can write the basic version.
2. **Standard:** "Implement a curry function that handles arbitrary arity." Tests recursion + closure + arguments handling.
3. **Twist:** "Implement memoize with LRU eviction." Tests data structure choice (linked list + map) and pointer manipulation.

The third layer is what separates senior. It's not about the specific problem; it's about whether you can compose JS primitives into non-trivial code under interview pressure.

## A note on JavaScript engines

You won't usually be asked, but having a basic mental model of how JS runs separates senior from mid.

```
V8 (Chrome, Node), SpiderMonkey (Firefox), JavaScriptCore (Safari).

Architecture:
  1. Parse source → AST.
  2. Compile to bytecode (interpreter runs this).
  3. Profile hot functions; JIT-compile to optimized machine code.
  4. Optimize: inline caches, hidden classes, escape analysis.
  5. Deoptimize when assumptions break (type changes, etc.).

For performance:
  - Keep object shapes stable (don't add/remove properties dynamically).
  - Don't deoptimize hot paths with try/catch.
  - Don't generate functions in hot loops (engines can't optimize as well).
```

This material is bonus, but it comes up in deep technical interviews at Google or Meta's runtime teams.

## How interviewers probe

The classic JS interview questions, ranked by frequency at FAANG:

```
Most-asked (>50% of loops):
  - Implement debounce / throttle.
  - Implement memoize.
  - "What's `this` in this code?" (quizzes, 3-5 of them).
  - Promise.all vs Promise.allSettled.
  - Event loop / task queue / microtask queue.

Common (>25%):
  - Implement curry.
  - Implement deepEqual / deepClone.
  - "What's the difference between == and ===?"
  - "What's the difference between var, let, const?"
  - "Explain hoisting."

Less common but high-signal:
  - Implement Promise from scratch.
  - Implement an event emitter (.on, .off, .emit).
  - Implement a polling function with backoff.
  - Implement infinite scroll using Intersection Observer.
  - Implement a small reactive state library (like Solid's signals).
```

Practice the top 10. They cover ~80% of the JS slot.

## The Interview Move

> *"For the JS coding slot, the patterns I rely on are: closures for stateful functions, prototype chain for shared methods, async/await for async control flow with Promise.all for parallel, Map for arbitrary-key storage, Set for deduplication, Intersection Observer for scroll-driven UI. The questions I get most often are debounce, throttle, memoize, curry, and existential get — all closure patterns. The senior signal is naming the data structure tradeoffs and explaining the engine behavior of `this` and prototypes. Let me work through this problem step by step."*

That paragraph signals fluency. You've named the patterns; you've named the data structures; you've named the engine concerns. Then you write code.

Next chapter: UI and DOM. Where vanilla JS meets HTML/CSS in a 45-minute UI-build slot.
