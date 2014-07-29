---
title: "Prelim notes: Classical AI"
layout: essay
categories: [prelims]
---

## Heuristic search, briefly

An admissible heuristic underestimates the distance from here to the goal state.

A consistent heuristic underestimates the distance from here to every state.

Easy to prove that an admissible heuristic will always find the shortest path to
the goal---for a consistent heuristic, the first time we visit _any_ node, we
got there along the shortest path.

## Constraint satistfaction problems

Difference from vanilla search: the order in which we assign values to variables
doesn't matter for objective function---still very important for solution
procedure.

How do we do this fast? Heuristics specialized for general CSPs. Easy one:
"minimum remaining values" or "_most constrained variable_"---choose a setting for
the variable with the least possible settings remaining. Can also sort by
_degree_. Once we've picked a variable, assign values to it on _least
constraining_ order, that leave other values open.

How do we compute remaining values? _Constraint propagation_: once we've picked
a value for a variable, iteratively update remaining constraints along arcs,
eliminating assignments allowed by no assignments to their neighbors. This
doesn't give you everything for free (easy counterexample: 2-coloring $$K_3$$)
but works well in practice. Higher-order analogs (considering subsets of
$$n > 2$$ variables) also possible.

Can design corresponding special procedures for special constraints (all-unique,
only-one, etc.).

What do we do once we fail? Don't need to worry about backtracking one step,
since maintaining arc consistency means we'll never try an assignment which
would be fixed by simple backtracking. _Conflict-directed backjumping_ backs of
to full set of earlier assignments which caused an inconsistency.

Natural ways to use local search: hill climbing and annealing.

Another easy trick for a full solution: start by taking a tree decomposition,
and enumerate solutions to each node locally.

Obviously finding a satisfying solution is NP-hard, and satisfying a fixed
fraction of constraints is Unique Games.

## Adversarial search

Search through the game tree (or just up to a certain depth), keeping track of
game value for all players, and maxing for the appropriate player.

$$\alpha-\beta$$ pruning is a heuristic which prunes the remaining branches at
a node when the node's value is known to be worse than the best value along an
alternate path.

{% highlight python %}
max_val(state, alpha, beta):
  if terminal(state):
    return utility(state)
  best = -inf
  for child in state.children:
    v = min_val(child, alpha, beta)
    best = max(v, best)
    if v > beta:
      return v # Satan won't allow us to reach this state anyway
    alpha = max(v, alpha)
  return best
{% endhighlight %}

This is PH (for fixed-length games) or PSPACE.

## Propositional logic

The atomic elements of our universe are _propositions_, which we can combine
with the usual set of logical operators. A model is just an assignment of truth
and falsehood to atomic propositions.

Key tool for deriving conclusions: _resolution_. First encode my whole knowledge
base in CNF. Then from pairs of clauses, produce new clauses containing only the
literals which don't disagree.

Easy to prove $$K \models \alpha$$ this way: just derive $$\bot$$ from $$K
\land \neg\alpha$$. Only finitely many clauses possible, so procedure eventually
terminates.

This is hard in general, but certain representations admit easy reasoning.
Standard one: _Horn clauses_ of the form $$(A \land B \land \cdots) \Rightarrow
Z$$. How do we work with these efficiently? _Forward chaining_: take clauses for
which all antecedents have been proved, and add consequent until the desired
result is obtained. _Backward chaining_: try to prove all antecedents of desired
consequent (fast with memoization).

Also lots of good ways of doing heuristic forward search, local search to find
satisfying models.

## First-order logic

Now our atoms are _objects_, _relations_ and _functions_; we have the logical
operators from PL, but also _existential_ and _universal_ quantification. A
model is just an instantiation of all relations and atoms.

Some new rules: any time we have a universal quantification, we can instantiate
it explicitly by replacing the variable with some symbol. Any time we have an
existential quantification, we can create a new constant (a "Skolem" constant)
and replace the variable with that constant. This reduces the inference problem
to PL inference, with the caveat that there are now infinitely many possible
clauses, so inference is only semidecidable. We can be more sophisticated.

Key tool: _unification_. Given $$p$$ and $$q$$, find a substitution $$\theta$$
for free variables in both such that they become the same. Can do this in linear
time.

How do we do forward chaining here? Unification lets us define a generalized
_modus ponens_; apply this immediately.

Backward chaining? Again, has the form of a search problem where we want to
repeatedly prove antecedents.

Resolution? First, recall that for FOL it's incomplete (G&ouml;del!). As
preprocessing, move all existential quantification to the outside, all negation
onto atoms. Then remove existential quantifiers by Skolemization. Note one
subtlety: Skolem constants depend on the variables they're scoped under---

<div>
\[
  \forall x. \exists y. bar(x,y)
  \neq
  \forall x. bar(x,Y)
\]
</div>

---so instead we write $$Y(x)$$ for the Skolemization. Finally turn everything
into CNF. Then find $$\theta$$ which unifies the two clauses being annihilated,
and substitute in everywhere else. Finally, can eliminate pairs of clauses
which are not just identical (as in PL case), but unifiable.

## Planning

Why can't we just use generic search tools to solve planning? Typically huge
branching factor, but also problems that decompose naturally into subproblems,
and good general-purpose heuristics.

How to represent a planning domain? STRIPS: state is a conjunction of positive
literals (everything else assumed to be negative); actions either add or delete.
Goals are conjunctions of positive literals. More general things: relax
open-world assmption; allow negatives as well as positives. EVen more general:
allow arbitrary first-order preconditions and goals.

How to solve? Either forward search or backwards search. Lots of useful
heuristics here: solve a relaxed planning problem (e.g. empty delete list), or
assume subgoals are independent and their costs can be summed (this is
inadmissible).

Another general strategy for dealing with plans that factor: _partial order
planning_. Here our search space consists of entire plans (DAGs), rather than
states; operations for expanding nodes include adding additional edges to plan
until every edge has all its preconditions satisfied.
With FO planning language, may additionally want to apply action schemas only
partially.

Useful way of structuring heuristics: a _planning graph_. This is a DAG, divided
into _levels_, where level $$t$$ contains all literals that could be true at
time $$t$$, with mutual exclusion links between them. Levels alternate between
states and actions. Actions are mutex if they have inconsistent preconditions,
inconsistent effects, or if one negates the precondition of the other. Literals
are mutex if they are inconsistent, or if every pair of actions which achieves
them is mutex.

From this graph we can extract a max-level heuristic (when does the last goal
become achievable?), a level-sum heuristic (inadmissible) or a set-level
heuristic (when do all of the goals become achievable?). Or we can extract a
plan directly from the graph: for plans of increasing length, solve the
corresponding planning graph, then treat it as a binary CSP and look for
assignments that make it a well-formed solution.

We can treat all of this as a theorem-proving problem: from initial state, want
to prove $$\textit{initial state}^0 \land \textit{all actions} \land
\textit{goal}^T$$ for $$T$$ increasing until we find a goal. Note that state
representation needs both things that are true and negations of things that are
false. Need axioms of the form
<div>
\[
  \textit{state}^{t+1} \Leftrightarrow (\textit{state}^t \land \textrm{no action
negates it}) \lor (\textrm{some action takes it} \land \textrm{preconditions
satisfied})
\]
</div>
Additionally need
<div>
\[ \textrm{action taken} \Rightarrow \textrm{preconditions satisfied} \]
</div>
and
<div>
\[ \textrm{mutual exclusion} \]
</div>
Now just hand it to a SAT solver.

## Fancy planning

What if we have durations? First find a partial order plan---then easy to
schedule things.

Can make things a lot better with hierarchical planning. Define a hierarchical
task network---each step decomposes into multiple, more specific steps. Note
that if recursive plans are allowed, this strictly generalizes partial-order
planning.

What about nondeterminism? A couple of options: _sensorless planning_ (solve the
minimax problem) or replan on the fly. Also see POMDP stuff about representation
of belief states, etc.
