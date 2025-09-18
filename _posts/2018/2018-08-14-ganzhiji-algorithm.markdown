---
layout: post
title: A Gentle Introduction to the Perceptron Algorithm
date: 2018-08-14 20:33:58
author: Morgan
tags: 
    - Machine Learning
    - Algorithms
---

The perceptron is a binary linear classifier. Each input is a feature vector; the output is either +1 or -1. The algorithm seeks a separating hyperplane, minimises misclassification error, and lays the groundwork for neural networks and support vector machines.

<!-- more -->

### Model definition

The decision function is:

\[
f(x) = \operatorname{sign}(w \cdot x + b)
\]

- \(w \in \mathbb{R}^n\) is the weight vector.
- \(b \in \mathbb{R}\) is the bias.
- \(w \cdot x\) denotes the inner product.
- `sign` returns +1 when its argument is non-negative and -1 otherwise.

Geometrically, \(w \cdot x + b = 0\) describes a hyperplane with normal vector \(w\) and intercept \(b\). That plane divides the feature space into two regions, one for each class.

### Learning objective

Assuming the data are linearly separable, the goal is to find parameters \(w, b\) that perfectly separate positive and negative examples. We use a loss function based on misclassified points:

\[
L(w, b) = - \sum_{x_i \in M} y_i (w \cdot x_i + b)
\]

Here \(M\) is the set of misclassified samples. The loss is always non-negative and drops to zero when no mistakes remain.

### Algorithm

Training uses stochastic gradient descent. At each step we pick a misclassified sample and update the weights:

\[
w \leftarrow w + \eta y_i x_i \\
b \leftarrow b + \eta y_i
\]

with learning rate \(0 < \eta \le 1\). For linearly separable data the perceptron converges in a finite number of updates, though multiple solutions exist depending on the order of samples and initial values.

### Example with scikit-learn

Let’s classify the Iris dataset:

```python
from sklearn import datasets
from sklearn.linear_model import Perceptron
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, fbeta_score
from sklearn.utils import shuffle

iris = datasets.load_iris()
X, y = shuffle(iris.data, iris.target, random_state=7)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=7
)

scaler = StandardScaler()
X_train_std = scaler.fit_transform(X_train)
X_test_std = scaler.transform(X_test)

clf = Perceptron(random_state=7)
clf.fit(X_train_std, y_train)
y_pred = clf.predict(X_test_std)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("F0.5 score:", fbeta_score(y_test, y_pred, beta=0.5, average='weighted'))
```

To improve performance we can tune hyperparameters using grid search:

```python
from sklearn.model_selection import GridSearchCV

parameters = {'eta0': [0.1, 1, 10], 'max_iter': [30, 40, 50]}
scorer = make_scorer(fbeta_score, beta=0.5, average='weighted')

grid = GridSearchCV(clf, parameters, scoring=scorer)
grid.fit(X_train_std, y_train)

best_clf = grid.best_estimator_
base_pred = clf.predict(X_test_std)
best_pred = best_clf.predict(X_test_std)

print("\nUnoptimised model")
print("Accuracy:", accuracy_score(y_test, base_pred))
print("F0.5 score:", fbeta_score(y_test, base_pred, beta=0.5, average='weighted'))

print("\nOptimised model")
print("Accuracy:", accuracy_score(y_test, best_pred))
print("F0.5 score:", fbeta_score(y_test, best_pred, beta=0.5, average='weighted'))
```

You should see a noticeable boost after tuning. The perceptron remains a valuable baseline and offers insight into more advanced linear models.

Thanks for reading—and happy experimenting!
