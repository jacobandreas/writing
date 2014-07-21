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
