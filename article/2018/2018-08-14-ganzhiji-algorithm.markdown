---
layout: post
title: 一文搞懂感知机算法
date: 2018-08-14 20:33:58
author: Morgan
tags: 
    - 机器学习
    - 算法
---

### 什么是感知机
感知机(preceptron)是线性分类的二分类模型，输入为实例的特征向量，输出为实例的类别，分别用 1 和 -1 表示。感知机将输入空间(特征空间)中的实例划分为正负两类分离的超平面，旨在求出将训练集进行线性划分的超平面，为此，导入基于误分类的损失函数，利用梯度下降法对损失函数进行极小化，求得最优解。感知机是神经网络和支持向量机的基础。

<!-- more -->
### 感知机模型
感知机的函数公式为：
$$
f(x) = sign(w\cdot x + b)
$$

其中， w和 b 为感知机模型参数，$w \in R^n$叫做**权值**或者**权值向量**，$b \in R$ 叫做**偏差**，$w \cdot x$表示 w 和 x 的**内积**, sign 是符号函数，即：
$$
sign\left( x\right) =\begin{cases}1,x\geq 0\\ -1,x <0\end{cases}
$$
感知机的**假设空间**是定义在特征空间中所有线性分类模型的函数集合，即$\{f|f(x) = w \cdot x + b\}$.

感知机的几何解释:线性方程$w \cdot x + b = 0$对应特征空间$R^n$中的一个超平面 S，其中 w 是超平面的法向量，b 是超平面的截距。该超平面将特征空间分为两个部分，将特征向量分为正负两类。因此，超平面 S 成为分离超平面。
![](http://pdeat67zx.bkt.clouddn.com/2018-08-12-11-34-41.jpg)

### 感知机学习策略

假设训练数据集是线性可分的，感知机的学习目标就是找到能够将正负实例点完全分开的超平面，即**确定感知机模型参数 w 和 b**，因此就是确定(经验)损失函数并求损失函数的最优解，即最小化。

感知机 $sign(w\cdot x + b)$学习的损失函数 定义为:
$$
L(w, b) = - \sum_{x \in M}y_i(w \cdot x_i + b)     公式(1)
$$
下面给出推导:
1.首先写入输入空间$R^n$中任意点 $x_0$到超平面 S 的距离:
$$
\dfrac {1}{\left\| w\right\| }\left| w\cdot x_0 +b\right|
$$
其中，$\left\|\left\| w\right\|\right\|$是 w 的 L2 范数。

2.当$w \cdot x_i + b > 0$时, $y_i = -1$, 而当$w \cdot x_i + b <0$时，$y_i = 1$。因此，对于误分类的数据$(x_i, y_i)$来说，$- y_i(w \cdot x_i + b) > 0$成立。
3.另外，误差分类点到超平面 S 的距离是
$$
- \dfrac {1}{\left\| w\right\| }y_i (w\cdot x_i +b)
$$
设 M 为超平面 S 的误分类点的集合，则所有误分类点到超平面 S 的总距离为：
$$
- \dfrac {1}{\left\| w\right\| }\sum_{x \in M}y_i(w \cdot x_i + b) 
$$
不考虑$\dfrac {1}{\left\| w\right\| }$,则得到感知机的损失函数 L(w, b)，即公式(1)

显然，损失函数 L(w, b)是非负的。如果有所分类都正确，则损失函数值为 0。而且，分类越正确，则误分类的点离超平面越近，损失函数值越小。

因此，一个特定的样本的损失函数，在误分类时时参数 w, b 的线性函数，正确分类时时 0，可以得出给定训练数据集 T，损失函数 L(w, b)是 w，b 的连续可导函数。
### 感知机学习算法
下面我们来看感知机的学习算法。给定一个训练数据集$T=\{(x_1,y_1), (x_2, y_2), ..., (x_N, y_N)\}$
感知机的算法是误分类驱动的，具体采用 随机梯度下降法(stochastic gradient descent). 在极小化目标函数的过程中，并不是一次使 M 中所有误分类的点梯度下降，而是每次随机一个误分类的点使其梯度下降。
具体步骤为:
1.假设误分类点的集合为 M，那么损失函数L(w, b)的梯度为:
$$
\nabla_wL(w, b) = - \sum_{x \in M}y_ix_i 
$$
$$
\nabla_bL(w, b) = - \sum_{x \in M}y_i
$$
2.随机选取一个误分类的点$(x_i, y_i)$，对 w, b 更新:
$$
w \leftarrow w + \eta y_ix_i
$$
$$
b \leftarrow b + \eta y_i
$$
式中$\eta(0<\eta\leq1)$是步长，又称为**学习率(learning_rate)**，这样，通过迭代可以使损失函数不断减小，直到为 0.

当训练数据集线性可分的时候，感知机学习算法是收敛的，并且存在无穷多个解，解会由于不同的初值或不同的迭代顺序不同而有所不同。

### 实战
下面使用 sklearn 包中感知机来训练和分类 Iris(鸢尾花) 数据集。
```python
from sklearn import datasets
import pandas as pd
from sklearn import Perceptron
from sklearn.cross_validation import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
from sklearn.utils import shuffle

iris = datasets.load_iris()
```
先导入数据，然后使用`shuffle`打乱数据顺序,
```python
X, y = shuffle(iris.data, iris.target,random_state=7)
```
接下来分割训练集和测试集：
```python
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=7)
```
然后进行样本特征的标准化缩放，为了让特征同步变化。标准化缩放就是将样本特征转化成均值为 0 ，方差为 1 的正态分布。
```python
sc_X = StandardScaler()
X_train_std = sc_X.fit_transform(X_train)
X_test_std = sc_X.fit_transform(X_test)
```
创建感知机模型，进行训练，最终对测试集预测结果。
```python
model = Perceptron()
model.fit(X_train_std, y_train)
y_pred = model.predict(X_test_std)
```
训练完成以后评价一下训练结果，
```python
print ("Accuracy score on test data: {:.4f}".format(accuracy_score(y_test, y_pred)))
print ("F-score on test data: {:.4f}".format(fbeta_score(y_test, y_pred, beta = 0.5,average='weighted')))
```
结果如下：
![](http://pdeat67zx.bkt.clouddn.com/2018-08-14-20-16-12.jpg)

效果不太好，我们尝试用网格搜索法来优化一下，设置好参数集，代码如下：
```python
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import make_scorer
from sklearn.metrics import fbeta_score, accuracy_score
clf = Perceptron(random_state=7)
parameters = {'eta0':[0.1,1,10], 'max_iter':[30,40,50]}
scorer = make_scorer(fbeta_score, beta=0.5, average='weighted')
#在分类器上使用网格搜索，使用'scorer'作为评价函数
grid_obj = GridSearchCV(clf, parameters, scoring=scorer)
grid_obj.fit(X_train_std, y_train)
# 得到estimator
best_clf = grid_obj.best_estimator_
# 使用没有调优的模型做预测
predictions = (clf.fit(X_train_std, y_train)).predict(X_test_std)
best_predictions = best_clf.predict(X_test_std)
```
最后我们将优化前和优化后的结果打印出来比较一下效果：
```python
# 汇报调参前和调参后的分数
print ("\nUnoptimized model\n------")
print ("Accuracy score on test data: {:.4f}".format(accuracy_score(y_test, predictions)))
print ("F-score on test data: {:.4f}".format(fbeta_score(y_test, predictions, beta = 0.5,average='weighted')))
print ("\nOptimized Model\n------")
print ("Final accuracy score on the test data: {:.4f}".format(accuracy_score(y_test, best_predictions)))
print ("Final F-score on the test data: {:.4f}".format(fbeta_score(y_test, best_predictions, beta = 0.5,average='weighted')))
```
运行一下，得到下图:
![](http://pdeat67zx.bkt.clouddn.com/2018-08-14-20-19-48.jpg)

最终可以看到，我们的模型预测效果已经有明显进步了。

如果你喜欢我的文章，欢迎扫码关注公众号:机器学习Club.聚焦机器学习，关注自我管理。
<p align="center">
  <img src="http://pdeat67zx.bkt.clouddn.com/%E8%8A%B1%E9%92%B1%E4%B9%B0%E7%9A%84%E4%BA%8C%E7%BB%B4%E7%A0%81.jpg">
</p>
