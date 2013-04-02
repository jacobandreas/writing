---
title: Steelmanning vector space semantics
layout: essay
categories: [nlp]
---

One of the two standard families of approaches to computational semantics is the
so-called "vector space" model, in which concepts are represented as points in,
subsets of or distributions on a prespecified vector space. Occasionally some
kind of composition operation is provided, typically in the form of a
matrix-like operator or a modified sum operation. Familiar examples are
distributional models of word meaning and TODO.

My basic intuition was that this is insane. We're trying to take concepts, with
which we typically associate all kinds of interesting structure
(compositionality, prototyping, quantification, etc.), and embed them in a
(typically finite-dimensional!) space which encodes none of that structure.

But there are also various appealing features of vector space models, and while
I'm still not convinced, upon closer inspection the whole project is less
unreasonable than I first thought. What follows is an attempt to mount a
plausible defense of vector space semantics over alternative machineries for
semantics. My objections, and responses:

## Where has all the structure gone?

We can represent interesting discrete data structures using only vectors and
matrices. (Paccanaro and Hinton 2001)

We can encode logical forms as distributional vectors. (Copestake and Herbelot,
2012)

If we allow operators more powerful than matrices, we can certainly embed
graph-shaped meaning representation on a manifold of our choosing.

## Surely brains don't work that way!

Fodor, etc.
