---
title: Well-behavedness of self-normalizing models (pt. 1)
layout: essay
categories: [ml]
---

Models that end with a softmax (either log-linear or fancy neural things) show
up everywhere, but getting normalized probabilities out of them is expensive if,
like in language modeling, you have a large label space (& consequently lots of
terms in the denominator).

If we just want to plug in the model score as a feature in some downstream task
(e.g. MT) it seems fine if the scores don't actually sum to 1 over all outputs
(though we want them to be reasonably close, so that scores from different
contexts are on basically the same scale). Thus it would be nice if we could
encourage the denominator to be 1 everywhere---then we could just treat the
numerator (a single dot product) as a "normalized" score.

There are models (e.g. NCE) that promise to do this automatically, if you just
neglect to normalize your predictions, but people (e.g. Devlin NNJM paper) also
seem to get reasonable results by just adding a penalty term to the objective
which encourages the denominator to be one _only on training samples_, which
initially seemed to me like it might mean nothing at all.

Obviously we can't expect this to work perfectly in either case---if we imagine
explicitly encoding a sum-to-one constraint for every subset of $$d$$ features,
we wind up with $$2^d$$ equations in only $$d$$ unknowns. But maybe we can do
this approximately (DLWH says: "within a nat is pretty good").

So two questions we should ask:

1. For what distributions over observations should we actually expect this to
work?

2. Regardless of distributional assumptions, if I _observe_ that I'm mostly
fitting my training normalizers pretty well, how close should I expect to get to
1 at test time?

We'll return to 1 some other day.

2 has the form of a kind of weird empirical risk minimization problem, where my
goal is to produce the _same_ output on all training examples. We can use most
of the standard tools for ERM here. We want to know, in particular, how quickly
(and indeed whether)

<div>
\[ \sup_{\theta \in \mathbb{R}^{d \times k}} \left| \hat{\mathbb{E}}\left[R\left(\sum_i \exp(\theta_i^\top
X)\right)\right] - \mathbb{E}\left[R\left(\sum_i \exp(\theta_i^\top X)\right)\right] \right| \]
</div>

where $$R(\cdot) = (1 - \cdot)^2$$ or $$\log^2(\cdot)$$ or something.

We can bound this quantity in terms of the Rademacher complexity of the
normalizer, which we can in turn bound by a "scale-sensitive" dimension
$$P_\gamma$$. In particular (this is due to Alon et al.), call the above quantity
$$\Delta(R)$$. Then for all $$\epsilon, \delta > 0$$

<div>
\[
Pr[\Delta(R) > \epsilon] \leq \delta
\]
</div>

for

<div>
\[
n \in O\left( \frac{1}{\epsilon^2} \left(d\ \log^2 \frac{d}{\epsilon} +
\log\frac{1}{\delta}\right)\right)
\]
</div>

where $$d$$ is the $$P_{\epsilon/24}$$-dimension of the function class. So all
we need is a bound on $$P_\gamma$$.

Super-crude way of doing this: there's a standard way of getting VC bounds on
parametric families involving basic arithmetic operations and conditionals, with
$$d_{VC} \in O(dt)$$ for $$d$$ dimensions and $$t$$ operations. If we
allow exponentials as well, the complexity becomes $$O(d^2 t^2)$$. For
our denominator, we have $$kd$$ parameters, $$O(kd)$$ multiplications and
additions (inside exponents), and then an additional $$O(k)$$ exponentials and
additions (for a total of $$O(kd)$$ operations). Thus we get an upper bound on
VC dimension of $$O((kd)^2 \cdot (kd)^2) \in O(k^4 d^4)$$. Plugging this in
above gives a PAC-style sample complexity of $$O(k^4 d^4 \log(k + d))$$. We need
to do a little extra work to show that this also gives a scale-sensitive
dimension for all choices of $$\gamma$$, but that's straightforward. 

This is pretty dreadful, as in applications we expect $$d$$ to be quite large,
but at least we have concentration.

It's almost certainly possible to get a tighter bound, but I'm too lazy to do it
right now. Intuition: the level sets of the normalizer are basically "soft"
unions of $$k$$ halfspaces, which have dimension $$O(d\ k \log k)$$. I don't
think the softness buys you anything, so $$O(d\ k \log k)$$ seems right here
as well---for a much more civilized sample complexity of $$O(d\ k\log k (\log k +
\log d + \log \log k))$$. We also know that the arithmetic method given above _way_
overestimates the complexity of single halfspaces, so it's not surprising that
it's pretty sloppy here as well.

So questions left to answer: what's the real sample complexity? And from above:

1. For what distributions over observations should we actually expect this to
work?
