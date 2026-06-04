# Relational Data Systems — The Visual Edition

*A diagram-first foundation for a frontend developer who already knows DSA. Built the way you learned graphs and trees — but you can SEE every mechanic move.*

---

## Who this is for / how to read it

You are a **frontend developer**. You already think in:

- **component trees** (nested, parent owns child)
- **props vs. state** (data passed down vs. data owned)
- **references** (you pass objects around; you know `===` is identity, not equality)
- **DSA foundations** (you implemented graph & tree collections — nodes, edges, traversal)

This book reuses *all* of that. Every relational concept is mapped to something already in your head. And every mechanic is drawn — you will watch records get created, references get resolved, edges get deleted, frame by frame.

**Reading rule:** don't skim the diagrams. They *are* the explanation. The prose just labels them.

```
   THE WHOLE BOOK IN ONE PICTURE
   ─────────────────────────────────────────────────────────────

   PART I        PART II         PART III        PART IV       PART V
   primitives    invariants      operations      the engine    build it
   ┌────────┐    ┌────────┐      ┌────────┐      ┌────────┐    ┌────────┐
   │ record │    │ entity │      │ create │      │ @mswjs │    │  ~120  │
   │ collec-│ →  │ integ. │  →   │ read   │  →   │ /data  │ →  │  lines │
   │ tion   │    │ ref.   │      │ update │      │ mapped │    │  from  │
   │ ref.   │    │ integ. │      │ delete │      │ to I-III│   │ scratch│
   └────────┘    └────────┘      └────────┘      └────────┘    └────────┘
   "node,edge"   "tree must     "traversal"     one real      "implement
                  be acyclic"                    system        the class"

   each layer only uses the layer to its left. learn left-to-right.
```

---

**Next:** [01 — Records & identity](01-records-and-identity.md)
