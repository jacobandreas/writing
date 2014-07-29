---
title: Mostly kernel methods
layout: essay
categories: [prelims]
---

## Preliminaries

Given a vector space over the reals, we say $$f$$ is _linear_ if $$f(cx) =
cf(x)$$ and $$f(x + y) = f(x) + f(y)$$. An _inner product space_ has a real
symmetric bilear map such that $$\langle x, x \rangle \geq 0$$, _strict_ if the
preceding inequality is strict. General norm, distance as in the Euclidean case.

A _Hilbert space_ is an inner product space that is also

1. complete: contains the limit of every Cauchy sequence (for which 
$$\sup_{m>n} ||h_n - h_m|| \to 0$$ as $$n \to \infty$$
).

2. separable: contains a countable dense subset (equiv: contains a countable
orthonormal basis).

A _kernel_ is a function $$k$$ such that $$k(x,y) = \langle \phi(x), \phi(y)
\rangle$$ for some feature function $$\phi$$ into a Hilbert space.

Note that it is often possible to compute the value of a kernel without
explicitly constructing $$\phi$$: consider $$\phi(x) = x_1^2 + x_2^2 +
\sqrt{2}x_1 x_2$$. Then $$k(x,y) = \langle x, y \rangle^2$$.

The _Gram matrix_ for a set of vectors $$\{x_i\}$$ and a kernel $$k$$ has
$$G_{ij} = k(x_i, x_j)$$. Claim: every Gram matrix is PSD---just observe that
$$G = P^\top P$$ for some $$P$$ so $$z^\top P^\top P z = ||Pz||^2$$, which is
nonnegative.

A binary function is _finitely PSD_ if its restriction to every finite set of
finite vectors forms a PSD matrix. Claim: a function is a kernel iff it is
finitely PSD. ($$\Rightarrow$$) comes from preceding paragraph.
(For simplicity assume $$\mathcal{X}$$ is closed under scaling and linear
combination---otherwise there's a little extra work.)
($$\Leftarrow$$): for a function $$k$$ under consideration, consider the set of
functions $$k_x = k(x,\cdot)$$, with $$\langle k_x, k_y \rangle = k(x,y)$$. This
is clearly real-valued, symmetric, and bilinear; positivity follows from the
assumption that $$k$$ is finitely PSD. So we only need completeness and
separability of the function space containing the $$k_x$$. We get separability
if the input space is countable or the kernel is continuous (also see below).
For completeness, observe that $$(k_a(x) - k_b(x))^2 = \langle k_a - k_b, k_x
\rangle \leq ||k_a - k_b||^2 k(x,x)$$ by Cauchy-Schwarz, so it suffices to
additionally make our function space closed under such limits.

We call the space constructed above the _reproducing kernel Hilbert space_
associated with $$k$$.

Mercer's theorem: Suppose $$k$$ is a continuous kernel. We can associate with it
a linear operator $$T_k$$ of the form

<div>
\[ [T_k \phi](x) = \int_\mathcal{X} k(x,s) \phi(s) ds \]
</div>

for $$\phi$$ in $$L_2(\mathcal{X})$$. Then there is an orthonormal basis of
$$L_2(\mathcal{X})$$ of eigenfunctions $$T_k$$ with nonnegative eigenvalues, and
$$k$$ has the form

<div>
\[ k(s,t) \sum_{j=1}^\infty e_j(s) e_j(t) \]
</div>

Practical consequences: the RKHS constructed above has an orthonormal basis.
Indeed, every kernal can be expressed as a sum over some countable set of
functions of their product on pairs of inputs. In this view, every kernel is a
covariance from a distribution over a function class.

So the following are equivalent:

1. Every Gram matrix is PSD

2. The integral operator $$T_k$$ is PSD

3. We can express $$k(x,y)$$ as $$\sum \lambda \phi_i(x) \phi_i(y)$$

4. $$k$$ is the reproducing kernel of an RKHS.

## Kernel calculus

If $$k_1$$ and $$k_2$$ are kernels, $$f$$ is a function into $$\mathbb{R}$$,
$$\phi$$ is a function into $$\mathbb{R}^n$$ and $$B$$ is PSD, the following are kernels:

- &nbsp; $$k_1 + k_2$$
- &nbsp; $$c k_1$$
- &nbsp; $$k_1 \cdot k_2$$
- &nbsp; $$f(\cdot_1) f(\cdot_2)$$
- &nbsp; $$k(\phi(\cdot_1), \phi(\cdot_2))$$
- &nbsp; $$\cdot_1^\top B \cdot_2$$
- &nbsp; $$poly(k_1)$$
- &nbsp; $$\exp(k_1)$$

The last of these gives us the RBF kernel.

Norm of a feature representation: $$\sqrt{k(\cdot,\cdot)}$$. We can use this to
normalize kernels.

Distance between feature representations: $$k(x,x) + k(y,y) - 2k(x,y)$$.

## PCA and CCA

## Kernel machines

### Perceptron

A simple way to do online learning of a binary classifier: make a prediction
$$\textrm{sgn}(\theta^\top x_i)$$. If the prediction is wrong, $$\theta
\leftarrow \theta + y_i x_i$$.

Claim: if the data lies in some ball of radius $$D$$ and is linearly separable
with margin $$\gamma$$, the perceptron algorithm terminates after no more than
$$R^2 / \gamma^2$$ updates. Note that $$\gamma = \min_i \theta^\top x_i y_i /
||\theta||$$, which is the (sign-corrected) projection of $$x$$ onto $$\theta$$,
which lies perpendicular to the decision boundary.

General idea: we want to show that $$\theta^\top \theta^* / ||\theta||$$ grows
close to 1. In particular, at any timestep $$\theta_{t+1}^\top \theta^* =
(\theta_t + y_i x_i)^\top \theta^* \geq \theta_t^\top \theta^* + \gamma
||\theta^*||$$, so $$\theta_t^\top \theta^* \geq t\gamma||\theta^*||$$. But
$$||\theta_{t+1}||^2 = ||\theta_t + y_i x_i||^2 = ||\theta_t||^2 + ||x_i||^2 + 2
y_i \theta_t^\top x_i \leq ||\theta_t||^2 + R^2$$, so $$||\theta_t||^2 \leq tR^2$$.
Combining these, we have $$t\gamma||\theta^*|| \leq \theta_t^\top \theta^* \leq
||\theta_t||||\theta^*|| \leq \sqrt{t}R||\theta||$$, whence $$t \leq
R^2 / \gamma^2$$.

### Kernel perceptron

Easy observation: if $$\theta$$ is initially zero, our final prediction rule is
just a sum of observations. So all we need are dot products between previous
observations and the current example.

### Structured perceptron

Our "update only on mistakes" rule is implicitly a zero-one loss $$|y_i -
\theta^\top x_i|$$, and we can think of our update as taking a step in the
direction of the difference between features that fire on the best predicted
label and features that fire on the true label, multiplied by the loss (a little
trickiness here with pushing the class label into the feature vector, but it
works out).  Corresponds to a loss function which is the difference between the
model's score on the prediction and the right answer. Update is $$\theta
\leftarrow \theta + \phi(x, y) - \phi(x, y^*)$$ where $$y^*$$ is the model
prediction.

### SVM 

Rather than using a procedure which will find some acceptable split of the data
eventually, let's explicitly try to maximize the margin. Set up an optimization
problem of the form:

<div>
\[ \min_\theta ||\theta|| \]
s.t.
\[ \theta^\top x_i \cdot y_i \geq 1 \; \forall i \]
</div>

Note that the minimal $$\theta$$ will assign 1 or -1 to points on the margin (if
it gave a higher score then we could reduce it and still be feasible). But then
the margin is $$2 |\theta^\top x_i| / ||\theta|| = 2 / ||\theta||$$, so the
objective just wants to maximize the margin.

### Dual SVM

Let's form the Lagrangian dual of the above objective.

<div>
\[ L(\theta, \alpha) = \frac{1}{2}||\theta||^2 + \sum_i \alpha_i (1 - y_i
\theta^\top x_i) \]
</div>

Form the dual, and take the inf over $$\theta$$ first. Setting derivatives equal
to zero, we find

<div>
\[ \theta = \sum_i \alpha_i y_i x_i \]
</div>

from which (with a little algebra) we get

<div>
\[ g(\alpha) = \sum_i \alpha_i - \frac{1}{2} \sum_i \sum_j \alpha_i \alpha_j y_i
y_j x_i^\top x_j \]
</div>

so again, we only need inner products between previously-seen training examples
to make our prediction.

Useful fact from optimization: _complementary slackness_. If duality is tight, a
dual variable is zero iff the corresponding primal constraint is not tight. Thus
the $$\alpha$$s are _sparse_---only terms associated with support vectors are
greater than zero. (This is because $$\sum_i \lambda^*_i f_i(x^*) = 0$$, every
$$\lambda$$ is positive and $$f_i$$ is negative, so each term in the sum must be
zero.)

How do we know if duality is tight? KKT conditions (necessary): $$\theta$$ is
primal feasible, $$\alpha$$ are dual feasible, complementary slackness holds,
and all partial derivatives are zero.

### Soft-margin SVM

What if there's no feasible solution? New objective:

<div>
\[ \min_{\theta,\xi} \frac{1}{2}||\theta||^2 + \frac{C}{n}\sum_i \xi_i \]
s.t.
\[ \xi_i \geq 0 \]
\[ y_i \theta^\top x_i \geq 1 - \xi_i \]
New dual is:
\[ \max_\alpha \sum_i \alpha_i -\frac{1}{2} \sum_i \sum_j \alpha_i \alpha_j y_i
y_j x_i^\top x_j \]
s.t.
\[ 0 \leq \alpha \leq \frac{C}{n} \]
</div>

## The representer theorem

It's convenient that these optimization problems keep winding up with forms that
admit kernelization. How generally true is this? Theorem: fix a kernel $$k$$
associated with an RKHS $$\mathcal{H}$$. For any loss function $$L$$ and
nondecreasing $$\Omega$$,

<div>
\[ J(f) = L(f(x_1),\ \ldots,\ f(x_n)) + \Omega(||f||_\mathcal{H}^2) \]
</div>

is minimized by some

<div>
\[ f = \sum_{i=1}^n \alpha_i k(x_i, \cdot) \]
</div>

Moreover, if $$\Omega$$ is increasing, then _every_ minimizer of $$J(f)$$ can be
expressed in this form.

Proof of main claim: consider the projection of $$f$$ onto the subspace spanned by
RKHS elements associated with the training data. Decompose $$f$$ into this
projection (a parallel part $$f_{||}$$ and an orthogonal part $$f_\bot$$). Then
$$f(x_i) = \langle f, k(x_i,\cdot)\rangle = \langle f_{||}, k(x_i, \cdot)
\rangle = f_{||}(x_i)$$. But $$||f||^2 \geq ||f_{||}||^2$$, so $$J(f) = L(f) +
\Omega(||f||^2) \geq L(f_||) + \Omega(||f_{||}||^2)$$. So $$f_{||}$$ (which is a
linear combination of training points) is no worse than the best function in the
function space.
