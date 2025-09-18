---
layout: post
title: Understanding Naive Bayes Classification
date: 2018-07-09 20:41:59
author: Morgan
tags: 
    - Machine Learning
    - Algorithms
---

> This walkthrough assumes you remember high-school probability.

### What is Naive Bayes?

Naive Bayes combines two ingredients: Bayes’ theorem and the assumption that features are conditionally independent. With those pieces we can build a simple yet effective classifier.

<!-- more -->

#### Bayes’ theorem refresher

Bayes’ theorem answers the question: *given that event B happened, what is the probability that event A also occurred?* We denote it as \(P(A \mid B)\), the **posterior probability**.

\[
P(A \mid B) = \frac{P(A) \cdot P(B \mid A)}{P(B)}
\]

- \(P(A)\) is the **prior**.
- \(P(B \mid A)\) is the likelihood of observing B when A is true.

We derive the formula from the definition of conditional probability: \(P(A \mid B) = P(A,B) / P(B)\). Expand \(P(A,B)\) using the chain rule and you get Bayes’ theorem. Substituting the law of total probability into the denominator yields the full expression:

\[
P(A \mid B) = \frac{P(A)P(B \mid A)}{\sum_{i=1}^n P(A_i)P(B \mid A_i)}
\]

#### Conditional independence assumption

Now assume each sample \(x\) has features \(x_1, x_2, ..., x_n\) and belongs to one of \(k\) classes. We want the class with the highest posterior probability.

Naive Bayes assumes features are independent given the class label:

\[
P(x_1, x_2, ..., x_n \mid y_k) = \prod_{i=1}^n P(x_i \mid y_k)
\]

Substitute into Bayes’ theorem:

\[
P(y_k \mid x) \propto P(y_k) \prod_{i=1}^n P(x_i \mid y_k)
\]

The denominator is constant across classes, so we ignore it and simply pick the label that maximises the product.

#### A spam-filter example

Suppose we have 100 labelled emails; 25 are spam. Within the spam set, 10 contain “cheap,” 15 contain “invoice,” and 20 contain garbled text. We compute:

- \(P(\text{spam}) = 0.25\)
- \(P(\text{"cheap"} \mid \text{spam}) = 10/25\)
- \(P(\text{"invoice"} \mid \text{spam}) = 15/25\)
- \(P(\text{"garbled"} \mid \text{spam}) = 20/25\)

Multiplying these values with the prior produces the spam posterior. We do the same for the “ham” class. The larger result determines the prediction. If any term drops to zero because we never observed a word in the training data, we apply Laplace smoothing to avoid wiping out the entire product.

#### Why “naive”?

The independence assumption is strong—it rarely holds perfectly in practice—yet it makes the model fast and easy to implement. Even with that simplification, Naive Bayes performs surprisingly well on tasks such as spam filtering, credit-card fraud detection, medical triage, and news categorisation.

Next time I’ll implement a SMS spam detector using this algorithm. Stay tuned!

Feel free to share this article with proper attribution.
