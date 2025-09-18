---
layout: post
title: A 100-Line Movie Recommendation Engine
date: 2018-09-12 19:14:47
author: Morgan
tags: 
    - Machine Learning
    - practice_project
---

Recommendation engines predict what users might enjoy. Apply them to films and you get a movie recommender; apply them to shopping and you drive product discovery.

<!-- more -->

Two common approaches:

- **Collaborative filtering (CF):** learns from user behaviour—ratings, clicks, watch history.
- **Content-based filtering:** compares item attributes—genres, actors, descriptions.

This mini project uses collaborative filtering.

### Measuring similarity

We need a metric that captures how similar two users are. A popular choice is the **Pearson correlation coefficient**, defined as:

\[
\rho_{x,y} = \frac{\operatorname{cov}(x, y)}{\sigma_x \sigma_y}
\]

where covariance is \(\operatorname{cov}(X,Y) = E[XY] - E[X]E[Y]\) and the standard deviation is the square root of the variance.

Implementation outline:

1. Verify both users exist in the dataset.
2. Gather movies rated by both users.
3. Compute the sums, squared sums, and product sums.
4. Plug values into the Pearson formula, taking care with zero denominators.

The function returns a similarity score between -1 and 1.

### Finding similar users

Once we can compute correlations, we look for the top `k` neighbours:

```python
def find_similar_users(dataset, user, num_users):
    if user not in dataset:
        raise TypeError(f"User {user} not present in the dataset")

    scores = np.array([
        (other, pearson_score(dataset, user, other))
        for other in dataset if other != user
    ])
    top_indices = np.argsort(scores[:, 1])[::-1][:num_users]
    return scores[top_indices]
```

### Generating recommendations

To recommend movies:

1. Confirm the user exists.
2. Compute Pearson scores against other users.
3. Identify movies the user hasn’t rated.
4. Create a weighted score for each candidate movie based on neighbour similarity.
5. Return the top results.

A high-level flow looks like this:

```
if target user not in dataset:
    report error
else:
    similarities = pearson scores to other users
    unseen_movies = movies the user hasn’t rated
    for each unseen movie:
        score = weighted average from neighbours
    recommend the highest-scoring movies
```

### Wrap-up

This prototype barely scratches the surface but shows how collaborative filtering works under the hood. Real systems add matrix factorisation, implicit feedback, and large-scale infrastructure.

Full source code is available on GitHub—check the `MR` link in the public account if you’d like to explore further.
