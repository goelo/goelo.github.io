---
layout: post
title: A Friendly Tour of Machine Learning Algorithms
date: 2018-06-30 20:46:48
author: Morgan
tags:
    - Machine Learning
---

> AI hype is everywhere, so I put together simple notes on the core algorithms I studied when getting started.

More and more companies deploy machine learning in production. Staying up to date helps us evolve alongside the industry. The examples below keep the maths light and focus on intuition.

<!-- more -->

### What is machine learning?

Computers learn from past observations instead of receiving step-by-step instructions. The three pillars are **data**, **algorithms**, and the resulting **model**. Train the algorithm on data to generate a model, then use the model to predict new cases.

### Decision trees

Imagine we know the age and gender of users who download certain apps. By repeatedly splitting the dataset on informative questions (e.g., “Is the user younger than 25?”) we grow a tree. Each leaf corresponds to a prediction. That structure is a decision tree.

### Naive Bayes

Label a set of emails as spam or not. If 20 out of 25 spam messages contain the word “cheap,” then any new email that includes “cheap” carries an 80% spam probability. Combine evidence from multiple words/features and you get a naive Bayes classifier.

### Linear regression

Given house prices and square footage, plot the points and draw a line that best fits the trend. Gradient descent plus the least squares objective finds that line. Now we can estimate the price of a home based on size—that’s linear regression.

### Gradient descent

Imagine standing on a hill wanting to reach the lowest valley. At each step you move downhill in the steepest direction until you can’t descend further. Gradient descent does the same thing mathematically to optimise parameters.

### Logistic regression

When we need a yes/no answer (admit or reject), we draw a boundary between the two classes. Logistic regression finds the best separating line (or curve) and produces probabilities.

### Neural networks

Complex patterns aren’t always separable by a straight line. Stack multiple layers of simple transformations and you can carve arbitrary shapes in the feature space. Those layered transformations form a neural network, which powers face recognition, speech recognition, AlphaGo, autonomous driving, and more.

### Support vector machines (SVM)

Multiple lines might separate two classes, but some are better than others. SVM searches for the hyperplane with the maximum margin—the widest buffer between classes—which usually generalises better. Gradient-based optimisation helps locate that plane.

### Final thoughts

Machine learning covers far more than these snapshots. Real projects demand large datasets, careful evaluation, and a solid foundation in statistics, linear algebra, and calculus. I’ll keep breaking concepts down in future posts—hope these notes help you get started.

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsm4bEbiagtDHGNe4xGcu4fIqmOwOzAErQ8USacxAU8C5gSxia0Jz1IPsO5kdibUkUzbibssbFlUMjPsEw/0?wx_fmt=jpeg)
