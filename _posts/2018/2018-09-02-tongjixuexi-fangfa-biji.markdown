---
layout: post
title: k-Nearest Neighbours Explained
date: 2018-09-02 14:58:27
author: Morgan
tags: 
    - Machine Learning
    - Algorithms
---

> Notes from *Statistical Learning Methods* — the kNN algorithm.

### What is kNN?

k-nearest neighbours (kNN) is one of the simplest classification and regression algorithms. Given a labelled training set, kNN classifies a new sample based on the labels of its \(k\) closest neighbours—typically by majority vote.

<!-- more -->

Imagine two piles of fruit: oranges and grapefruits. A new fruit shows up. If the three closest items are grapefruits, kNN predicts that the new fruit is also a grapefruit.

### Algorithm

Given a training set \(T = \{(x_1, y_1), ..., (x_n, y_n)\}\), where \(x_i\) is a feature vector and \(y_i\) the corresponding label, kNN works as follows:

1. Choose \(k\) and a distance metric.
2. Find the \(k\) nearest neighbours of the query point \(x\); call this set \(N_k(x)\).
3. Assign the label that appears most frequently among the neighbours:

\[
y = \operatorname*{argmax}_{c_j} \sum_{x_i \in N_k(x)} I(y_i = c_j)
\]

where \(I\) is the indicator function. When \(k = 1\) the method reduces to nearest neighbour classification.

### Model components

Three choices define the model:

- **\(k\) value**
- **Distance metric**
- **Decision rule**

Once these are set, every new query has a unique prediction.

#### Distance metrics

The feature space is usually \(\mathbb{R}^n\). Common metrics include:

- **Euclidean distance** (\(p=2\))
- **Manhattan distance** (\(p=1\))
- **Chebyshev distance** (\(p=\infty\))

#### Choosing \(k\)

- Small \(k\): low bias, high variance. Models become sensitive to noise and risk overfitting.
- Large \(k\): high bias, low variance. Predictions blur across class boundaries and may underfit.

Cross-validation is typically used to pick \(k\).

#### Majority vote

When the loss function is 0-1 loss, majority voting minimises the empirical risk because it chooses the class with the highest posterior probability within the neighbourhood.

### kd-trees

A kd-tree partitions the space with axis-aligned hyperplanes, enabling efficient nearest-neighbour search. Building the tree recursively splits the dataset; each node stores a hyper-rectangle. The search algorithm descends to the leaf containing the query point, then backtracks, checking whether other branches might contain closer points. Average complexity is \(O(\log N)\) when the data dimension is modest relative to the number of samples.

### What’s next?

In the next post we’ll use kNN to build a simple recommendation engine. Stay tuned!
