---
layout: post
title: Building a SMS Spam Classifier with Naive Bayes
date: 2018-07-15 20:02:54
author: Morgan
tags: 
    - Machine Learning
    - practice_project
---

In the previous post we explored Naive Bayes. This time we’ll apply it to a real dataset and build a text classifier for spam messages.

<!-- more -->

### Dataset and preprocessing

We’ll use the SMS Spam Collection dataset from UCL. Each row contains a label (`ham` or `spam`) and the message text. Read it with Pandas:

```python
import pandas as pd

df = pd.read_table('SMSSpamCollection', names=['label', 'sms_message'])
df.head()
```

Convert the labels to integers so scikit-learn can handle them cleanly:

```python
df['label'] = df.label.map({'ham': 0, 'spam': 1})
```

### Bag of words representation

For text classification we’ll turn each message into a bag of words. The `CountVectorizer` converts tokens into feature vectors where each column counts the times a word appears.

```python
from sklearn.feature_extraction.text import CountVectorizer

count_vector = CountVectorizer()
count_vector.fit(documents)
doc_array = count_vector.transform(documents).toarray()
```

This gives us a matrix with one row per message and one column per unique token.

### Train/test split

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    df['sms_message'], df['label'], random_state=1
)
```

### Training Naive Bayes

```python
from sklearn.naive_bayes import MultinomialNB

training_data = count_vector.fit_transform(X_train)
testing_data = count_vector.transform(X_test)

naive_bayes = MultinomialNB()
naive_bayes.fit(training_data, y_train)
predictions = naive_bayes.predict(testing_data)
```

`MultinomialNB` works well for discrete counts; use Gaussian variants for continuous features.

### Evaluation

Check accuracy, precision, recall, and F1-score:

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

print('Accuracy:', accuracy_score(y_test, predictions))
print('Precision:', precision_score(y_test, predictions))
print('Recall:', recall_score(y_test, predictions))
print('F1:', f1_score(y_test, predictions))
```

The results show strong performance on this dataset—precision and recall are both high, which matters when filtering spam.

### Sample output

You can print predictions alongside the true labels to sanity-check the model:

```python
category_map = {0: 'ham', 1: 'spam'}
for message, pred, truth in zip(X_test[50:100], predictions[50:100], y_test[50:100]):
    print('\nMessage:', message)
    print('Prediction:', category_map[pred], '— Actual:', category_map[truth])
```

When new messages arrive, simply vectorise them with `count_vector.transform(new_messages)` and call `naive_bayes.predict()` to obtain the spam/ham label.

Full source code lives on GitHub—feel free to experiment and extend it.
