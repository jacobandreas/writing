---
title: "Prelim notes: Graphical models"
layout: essay
categories: [prelims]
---

## Basic definitions

In probabilistic inference, we want to place distributions on groups of
variables. In general, these distributions are not arbitrary, but have structure
that we can exploit for statistical and computational efficiency. (This is a
statement about nature: most processes we are interested in modeling are simple
in particular ways.) "Structure" here means conditional independence. A
graphical model is a compact way of representing a family of distributions that
all make the same conditional independence assumptions.

### Directed graphs

Suppose we have a description of the process that _generates_ our data: that is,
we start by drawing some set of base variables from a prior distribution, then
draw some more variables conditioned on those, until we eventually produce our
observations. This is an _directed_ graphical model: we draw it as a DAG, and
its edges explicitly model the causal process behind the observations.

Also known as Bayes nets.

### Undirected graphs

What if we don't have a complete picture of the way in which our data was
created, but nevertheless have some kind of _local_ information about the way in
which variables are related? Canonical example: the Ising lattice. 

In these graphs, scores (not necessarily probabilities!) are defined on max
cliques rather than children and their parents. These scores are nonnegative,
but otherwise arbitrary.

Where directed models are motivated by a description of a generative process,
but happen to admit efficient independence queries, undirected models are
usually motivated directly by their conditional independence semantics---it's
easy to see that any pair of nodes is made independent by conditioning on any
separator set.

Also known as Markov random fields.

## Query algorithms

### Conditional independence in directed models

The "Bayes ball" algorithm. We have three canonical graphs on three nodes, a
chain, a shared cause, and a V-structure. 

- In the chain, the first and last nodes are dependent unless the middle node is
  observed. 

- In the shared cause, the two results are dependent unless the cause is
  observed. 

- In the V-structure, the two causes are independent unless the result is
  observed. 

Because conditional dependence is transitive, this gives rise to a simple
algorithm for testing whether two nodes are conditionally dependent: they are if
there is any path between them which decomposes along pairs of dependent nodes
matching the templates above.

### Conditional independence in undirected mode

As mentioned above, this is trivial---remove from the graph the nodes we're
conditioning on, and look for a path. The minimal set of nodes which makes a
variable independent from the rest of the graph is called the _Markov blanket_.

## Inference algorithms

### Elimination

For generality, we're working with a factor graph. We want to compute arbitrary
conditional probabilities (for now only over single variables). How to do this?
Note that we can "sum" any variable out of the graph by pushing it into all the
factors that touch it; this will cause all adjacent edges to be joined by a
single giant factor. To create this factor, we just sum over all settings of all
adjacent variables; the entry in the resulting table is the product of all
previous scores associated with that setting. Do this repeatedly until only the
query and conditioning are left, then eliminate the query to get the
denominator.

### Acyclic BP ("Probability propagation")

Assume for a moment that our factor graph is a tree. Then, when eliminating a
node $$x_j$$ whose parent (unique, because this is a tree) is $$x_i$$, the
resulting factor has a predictable form:

$$
m_{ji} (x_i) = sum_{x_j} \left( \psi^{E}(x_j) \psi(x_i, x_j) \prod_{k \in
\nu(j)\setminus i} m_{kj}(x_j) \right)
$$

If we choose the node we want to query as the root, this defines a dynamic
program that gives us desired marginals without explicitly altering the
structure of the graph. It also makes it clear that we can get joint
(conditional) distributions over simply connected sets of nodes, by passing
eliminating only nodes on the periphery.

It's easy to see that once we've computed all of these messages towards the
root, we can compute the corresponding message in the opposite direction along
every edge in the graph. Thus it's possible to get marginals for _every_ node
with only twice as much work as is required for a single node.

We can also replace the sums with maxes to get the MAP assignment of variables.

Special cases: Viterbi and forward--backward algorithms on HMMs.

### Junction tree

What if the graph isn't a tree? Make it into one! Still in the factor graph
view (so we're not worrying about moralization, etc.), form a tree decomposition
of the input graph. Then add potentials corresponding to the separators between
each pair of tree nodes. Then looks just like BP, except that we're summing over
blocks that might be non-adjacent in the original graph.

### (Loopy BP)

### (Mean field)

## Learning algorithms

### LMS

High-level: this is just (stochastic) gradient descent on the OLS error.

A linear regression problem: I have a bunch of examples $$(x, y)$$, and I want
to find a predictor $$\theta$$ minimizing $$\sum (y_i - \theta^\top x_i)^2$$.
The gradient of this quantity w.r.t. $$\theta$$ is $$2 \sum (y_i - \theta^\top
x_i) x_i$$. We can either optimize this directly (gradient descent) or one
example at a time (SGD).

(The latter has the following interpretation, which Mike seems to really like:
$$\theta^\top x / ||x||$$ is the scalar projection of $$\theta$$ onto $$x$$, so
we can interpret our prediction as a projection followed by a multiplication by
$$x$$. Suppose we want to move $$\theta$$ to place it in the set of vectors
whose projection gives exactly the right $$y$$. The prediction error is $$(y -
\theta^\top x) / ||x||$$, so we should add to $$\theta$$

\[ (y - \theta^\top x) / ||x|| \cdot x / ||x|| \]

More generally, replacing the constant ||x||^{-2} is a step in the right
direction, if not to exactly the right place.

### Gradient descent, generally

More generally, given a parametric model we usually want to find a parameter
setting $$\theta$$ that maximizes the likelihood of the data. (Why? Because the
frequentists say so! This minimizes Bayes risk for Hamming loss, but if we're
worried about some other loss function we should actually do some kind of
discriminitive training, even if we have a generative model. We can use that
objective instead in the following discussion.)

It's almost never the case that we have an analytic solution to our parameter
estimation problem---in these cases we want to use some kind of numerical method
to approximate the optimum. (Indeed, even when we have exact solutions, as in
linear regression, it's often faster to approximate than do a bunch of $$n^3$$
matrix arithmetic.)  "Approximate" usually just means follow the gradient.
First-order: gradient descent, SGD. Second-order: Newton's method or
quasi-Newton things (BFGS, OWLQN, ...). Some other non-gradient options, like
branch-and-bound, but these aren't much used.

### EM

I want to find the MLE for $$\theta$$ in a model of the form $$p(X,Z|\theta)$$,
where $$Z$$ is not observed---that is, I want $$\arg\max_\theta \log p(X|\theta)
= \arg\max_\theta \log \sum_Z p(X,Z|\theta)$$. In general this is not a
convenient function to work with analytically. The _Expectation--Maximization_
instead maximizes a lower bound to this function that is easier to work with.

First view: EM is an alternating coordinate ascent procedure of the form

- E step: $$q^{(t+1)} = \arg\max_q \mathcal{L}(q,\theta^{(t)})$$
- M step: $$\theta^{(t+1)} = \arg\max_\theta \mathcal{L}(q^{(t)}, \theta)$$

where

$$
\begin{align*}
\mathcal{L}(q,\theta) &= \sum_Z q(Z) \log \frac{P(X,Z|\theta)}{q(Z)} \\
&= E_q [\log p(X,Z|\theta)] + H(q)
\end{align*}
$$

Observe that $$\mathcal{L}$$ is a lower bound on the real log-likelihood
function; in fact, simple arithmetic shows that

$$
\log p(X|\theta) = \mathcal{L}(q,\theta) + KL(q\ ||\ p(Z|X,\theta))
$$

In the E step, it's easy to see that the optimal choice of $$q$$ is precisely
$$p(Z|X,\theta)$$---this causes the KL divergence to vanish, making
$$\mathcal{L}$$ equal to $$\log p(X|\theta)$$. So the E step really just
computes the marginal distribution over $$Z$$.

Then, solving the M step leads to an increase in the lower bound (unless we're
already at an optimum). Because the bound held with equality at the end of the
E step, we're guaranteed an increase in the like

Second view:

Recall that MLE is equivalent to minimizing the KL divergence between the
empirical distribution and the model:

$$
\begin{align*}
KL(\hat{p}(x)\ ||\ p(x|\theta)) &= \sum \hat{p}(x) \log (\hat{p}(x) /
p(x|\theta)) \\
&= H(\hat{p}) - \frac{1}{N} \log p(x | \theta)
\end{align*}
$$

Thus we can bound this divergence rather than the likelihood:

$$
\begin{align*}
D(\hat{p}(x)\ ||\ p(x|\theta)) &= -\sum \hat{p}(x) \log p(x|\theta) - H(\hat{p}) \\
&\leq -\sum \hat{p}(x) \mathcal{L}(q,\theta) - H(\hat{p}) \\
&= -\sum_x \hat{p}(x) \sum_z q(z|x) \log \frac{p(x,z|\theta)}{q(z|x)} - H(\hat{p}) \\
&= \sum_x \sum_z \hat{p}(x) q(z|x) \log\frac{\hat{p}(x)q(z|x)}{p(x,z|\theta)} \\
&= KL(\hat{p}(x)q(z|x)\ ||\ p(x,z|\theta))
\end{align*}
$$

Note that the optima of this function for $$q$$ and $$\theta$$ are the same as
before---all we've done is add a constant entropy term, and a sum over empirical
probabilities equal to one. So we can reinterpret the previous EM algorithm as
performing the alternate coodinate descent procedure:

- E step: $$q^{(t+1)} = \arg\min KL(q\ \vert\vert\ \theta^{(t)})$$
- M step: $$\theta^{(t+1)} = \arg\min_\theta KL(q^{(t)}\ \vert\vert\ \theta)$$

for $$KL(q\ \vert\vert\ \theta) = KL(\hat{p}(x)q(z\vert x)\ \vert\vert\
p(x,z\vert\theta))$$

### (Fancy Bayesian things)
