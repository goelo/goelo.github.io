---
layout: post
title: 100行代码实现电影推荐引擎系统
date: 2018-09-12 19:14:47
author: Morgan
tags: 
    - 机器学习
    - practice_project

---

推荐引擎是一个能预测用户兴趣点的模型。将推荐引擎应用于电影情境，便成为一个电影推荐引擎，应用到购物中，则成为购物推荐引擎。

<!-- more -->
通过预测当前用户可能会喜欢的内容，将相应的东西从数据库中筛选出来，这样有助于将用户和数据集中的内容连接起来,通过推荐合适的内容，可以增加用户消费。

推荐引擎通常用**协同过滤(CF)** 或**基于内容的过滤**来产生一组推荐。两种过滤方法不同之处在于挖掘推荐方式。协同过滤从当前用户过去的行为和其他用户对当前用户的评分来构建模型，然后使用这个模型来预测用户可能感兴趣的内容。而基于内容的过滤从商品本身的特征来给用户推荐更多商品，商品间的相似度是模型主要的关注点。本文内容的是基于协同过滤实现的。

接下来我们构建一个简易电影推荐引擎。

### 定义相似度指标

推荐引擎构建需要定义相似度指标，以便找到与数据库中特定用户相似的用户，一般使用**欧氏距离分数**或**皮尔逊相关系数**。

#### 皮尔逊相关系数
> 在统计学中, 皮尔逊相关系数通常情况下通过以下取值范围判断变量的相关强度：
>     0.8-1.0     极强相关
>    0.6-0.8     强相关
>  0.4-0.6     中等程度相关
>0.2-0.4     弱相关
>0.0-0.2     极弱相关或无相关
皮尔逊相关系数定义为两个变量之间的皮尔逊相关系数定义为两个变量之间的协方差和标准差的商，用公式表示为:

$$
\rho_x,_y = \frac{x 和 y 的协方差}{x 的标准差 * y 的标准差}
$$
期望值分别为 E[X]和 E[Y]的两个随机变量 X 与 Y 之间的**协方差**Cov(X, Y)定义为: Cov(X,Y) = E[XY] - E[X][Y] 

**标准差**即为**方差**的开方。离散型随机变量的**方差**公式为:

$$
D(X) = E(X^2) - [E(X)]^2
$$

明确了以上概念，我们来实现计算两个用户之间的皮尔逊相关系数的函数。首先判断用户是否在数据库中出现:若出现，则提取两个用户均评分的电影，如果没有两个用户共同评过分的电影，则说明两个用户之间没有相似度，此时返回 0。否则，计算相皮尔逊相关系数。

```python
import json
import numpy as np
def pearon_score(dataset, user1, user2):
    #判断用户是否在数据库中
    if user1 not in dataset:
        raise TypeError('User' + user1 + 'not present in the dataset')
    if user2 not in dataset:
        raise TypeError('User' + user2 + 'not present in the dataset')
    #提取用户均评过分的电影
    rated_both = {}
    
    for item in dataset[user1]:
        if item in dataset[user2]:
        rated_both[item] = 1

    num_ratings =len(rated_both)
    if num_ratings == 0:
        return 0

    #计算相同评分电影值的总和
    user1_sum = np.sum([dataset[user1][item] for item in rated_both])
    user2_sum = np.sum([dataset[user1][item] for item in rated_both])

    #计算所有相同评分电影的评分的平方和
    user1_squared_sum = np.sum([np.square(dataset[user1][item]) for item in rated_both])
    user2_squared_sum = np.sum([np.square(dataset[user2][item]) for item in rated_both])

    #计算相同评分电影数据集乘积之和
    total_sum = np.sum([dataset[user1][item] * dataset[user2][item] for item in rated_both])

    #根据皮尔逊公式计算
    #Cov(X,Y) = E[XY] - E[X]E[Y] 
    Sxy = total_sum - (user1_sum * user2_sum / num_ratings)
    # D(X) = E(X 的平方) - [E(X)]的平方
    Sxx = user1_squared_sum - np.square(user1_sum) / num_ratings
    Syy = user2_squared_sum - np.square(user2_sum) / num_ratings
    #考虑分母为 0 的情况
    if Sxx * Syy == 0:
        return 0
    
    return Sxy / np.sqrt(Sxx * Syy)
```

### 寻找相似用户
推荐引擎中一个非常重要的任务就是寻找相似的用户，也就意味着，为某位用户生成的推荐信息可以同时推荐给其他与之相似的用户。

首先定义一个函数，用于寻找与输入用户相似的用户。先判断用户是否在数据库中，如果已经存在，则计算该用户与数据库中其他用户的皮尔逊相关系数。然后提取所有得分中 k 个最高分并返回。代码如下:

```python
def find_similar_users(dataset, user, num_users):
    if user not in dataset:
        raise TypeError('User' + user1 + 'not present in the dataset')
    
    scores = np.array([[x, pearson_score(dataset, user, x)] for x in dataset if user != x])
    #评分按降序排列
    scores_sorted = np.argsort(scores[:, 1])
    scored_sorted_dec = scores_sorted[::-1]

    #提取 K 个最高分
    top_k = scored_sorted_dec[0:num_users]
    return scores[top_k[
```

### 完成电影推荐引擎

根据前面完成的部分，我们可以生成一个简单的电影推荐引擎系统了。简要流程图如下所示:

![](https://ws1.sinaimg.cn/large/006tNbRwly1fv6zcpszkbj30hi0qeacw.jpg)
推荐系统简要流程图

首先定义一个为用户生成电影推荐的函数，检查用户是否在数据库中，如果找到则计算与其他用户相关的皮尔逊相关系数，然后找到未被该用户评分的电影，最终根据皮尔逊相关系数列表，提取出推荐的电影。伪代码如下:
```
    1.  if 用户不在数据库中
            打印提示
        else:
            计算用户与其他用户皮尔逊相关系数
    2.  找到尚未被该用户评分的电影
        2.1 如果用户看过所有电影，则无法推荐电影，返回
    3.  根据皮尔逊生成电影评分标准化列表
    4.  提取推荐电影
```

最终将上述三部分代码合并，运行可得下图所示结果:
![](https://ws1.sinaimg.cn/large/006tNbRwly1fv6zdseqqrj30ie088gmg.jpg)

### 总结
至此，我们实现了一个简单的电影推荐引擎，当然了在实际工作中，推荐引擎远远比上述的复杂得多，但是我们可以通过这个小项目了解推荐引擎大概的思路。
具体的项目代码放在 github 上面，关注公众号『机器学习Club』回复**「MR」**获取源码链接。


