---
layout: post
title: 看官，机器学习了解一下？
date: 2018-06-30 20:46:48
author: Morgan
tags:
    - 机器学习
---

>  随着人工智能的火热，学习机器学习知识已经迫在眉睫

越来越多的企业已经开始逐步在产品中应用机器学习的模型，当下人工智能火热，未来引发一场技术革命也说不准。身为程序员，需要时刻了解前沿的各种信息，这样才能保证自己不被时代所淘汰。

本文将自己在机器学习中的笔记内容分享出来，也记录自己的学习过程。

<!-- more -->

### 什么是机器学习？

机器学习顾名思义，就是人类教会计算机利用以往的经验来完成指定的任务，能够像人类一样学习。

机器学习有三个要素:数据，模型，算法。这三者之间的关系就是通过数据利用一定的算法生成模型，让机器可以按照模型去处理或者预测新的数据。

机器学习常用的算法主要有决策树，朴素贝叶斯，线性回归，逻辑回归，SVM(支持向量机)，神经网络等算法。此文先用简单的例子来逐一讲解各个算法概念，后续会详细介绍具体的原理和推导过程。

### 决策树

举个例子，我们有一些统计某些APP的下载情况的数据，如下图:

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWX4Z1seWZkEWPn1fMaUiaxWgecS0iaPP8wSCQl50eRkibg7ia7DTuxkCXNPQ/0?wx_fmt=jpeg)

现在我们需要根据这些数据预测新用户会下载哪类APP，来进行精准的APP广告投放。

通过分析数据得出，我们可以根据年龄和性别大概判断不同的用户会下载哪类APP。

这就类似我们提出一个问题，通过判断，将答案分成两类，然后重复以上步骤，继续提问回答，最终得到类似树杈的模型，如下图所示：

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXyLXXOh8eicF12HZvOxnKS1pLS2OodmgicNfnNwcF5MvludFjPgHsXYyQ/0?wx_fmt=jpeg)

这种预测的方式被称为决策树。

### 朴素贝叶斯

我们换个例子，现在我们需要制作一个垃圾邮件检测分类器，首先我们根据现有的邮件来手动标记垃圾邮件，找到垃圾邮件一般含有的特征。比如有100封邮件，我们手工找出垃圾邮件有25封，然后我们发现垃圾邮件中含有"cheap"这个单词有20封，这样可以推测如果一封邮件中含有“cheap”单词，那么它是垃圾邮件的概率为80%.

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXxDrmticcicQVoVZ0IL5yRJ4QjelFYXC9L00sC19Rrmicla74c4UY51kdA/0?wx_fmt=jpeg)

同理，我们也可以寻找其他的特征来预测，比如错别字，没有标题等等。这种通过打标签计算概率来分类事物的方式被称为朴素贝叶斯。

### 线性回归

再来个🌰，我们有一些大house，还有一些小居室，分别知道他们的面积和房价。现在需要预测一个面积位于他们之间的房子的价格。

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWX6POYa9Er5ZeokKH4iaATKuLzib4eH3mYEBGYf4nS8ibJ5TFCc4LquFSrw/0?wx_fmt=jpeg)

将这些数据用坐标系表示出来，横轴代表面积，纵轴代表房价：

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXjp4qARLoGyV9Meet3jApsljQDrKctbkkv9icS2560DLEAtK0Os60IEA/0?wx_fmt=jpeg)

然后找到某一条直线能够拟合所有的数据,这里寻找这条直线使用梯度下降法(后面会介绍), 通过找到所有数据点到直线距离的平方和的最小值(最小二乘法)，来确定最优拟合直线。

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXxuFId1Jh9kbL64CWa3XHjTicaTahUeGL3oav3tp6JPv6fS9KkPmwjZg/0?wx_fmt=jpeg)

这种方式被称为线性回归。

### 梯度下降法

上文提到梯度下降法，很容易理解，假设我们在某个山顶，目标是到达山底。

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWX5kl0m9ILAAyMHxz9jvm0TDaATFzlyu5va36jNGuMDp2IoZMuC8fIZA/0?wx_fmt=jpeg)

该怎么处理呢？一般来说我们会查看四周下山的路，找到下降距离最大的方向，然后朝这个方向下山，反复此步骤，直至到达山底，这种方式就是梯度下降法。

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXcBc3E3QSPpoVicdMIs7FL3Hp4hag8ibCMDosJbBr8KI1lEyEk5ibbZq1A/0?wx_fmt=jpeg)

在现实中我们可以把山顶想象成要解决的问题，到达山底可以当做对问题的解答。

### 逻辑回归

🌰是个好东西，能够帮助我们理解概念。假设一所学校的招生办，有一些往年学校招生的成绩数据。现在有位学生申请学校，入学考试为7分，在校成绩为6分，需要判断该学生是否达标。

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXFkw9eDiaCGwLAOfkIHgugQ2icUNBd6GibTFsgZHDd5ZPic0qhT2q7mlCbg/0?wx_fmt=jpeg)

观察往年的招生数据，我们会发现招生和未被招进的数据大概可以用直线分割，使用最小二乘法找到最拟合的分割线，通过梯度下降法来寻找，找到以后将该学生成绩带入坐标系中来查看结果。如图所示：

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXmIZlFGB965qDAeHicNwJS31a74coy6LuIoaicpGSt2GaxaKhnFRbKxZw/0?wx_fmt=jpeg)

可以预测该学生可以被录取，这种算法被称为逻辑回归。

### 神经网络

还是用上面的例子，假如我们有一名同学入学成绩是9分，但是在校成绩书是1分，按照上面的预测，该学生可以入学。但是实际上这是不合理的，因为在校成绩太低，此时模型已经不能覆盖类似这种数据。

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWX5IaRjdfFHmPoUbbnkMZzBubqF1WDlgYRLmHoVp2pMNjIEdYGbgxVNQ/0?wx_fmt=jpeg)

这种情况下该如何处理呢？可能实际录取学生的数据是这样的：

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXQc6Xp41D1dFGicDGbhHGI08Hod6YictRR665ljOV6caQvsQOh0Pov0Qg/0?wx_fmt=jpeg)

此时一条直线已经不能完全将录取和未被录取的学生分割了，可以用两条直线来区分这些数据，这样会分成4个区域，这样可以根据不同的成绩来将数据写入坐标系，然后判定数据在直线上方标记为YES，在直线下方标记为NO，就可以得到下图的模型：

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXLia3cR1qejsQiafb1Ob9G26AqicJpT7L7tic82BFAic5eJ5ZicTM9YEtDo6w/0?wx_fmt=jpeg)

最后将该学生数据带入模型中，入学成绩为9，在校成绩为1的数据应该写在右下方区域，分别为YES和NO。根据"和"原则，结果应该为NO，即不能录取。

这种判断方式就是神经网络，输入数据根据"和"原则来判断输出结果为“YES”还是“NO”。

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWX5UY3ARLwDvxiaOvjwXkIH7jzEsuXYtRbv1EQporhOW8HhrrCJibxRNicQ/0?wx_fmt=jpeg)

由于和人类的神经处理方式极为相似，因此被称为神经网络。神经网络在很多方面都有应用，比如面部识别，语音识别，AlphaGo以及无人驾驶。

### SVM(支持向量机)

假设我们有几个点的数据，现在需要使用线条分割这些数据，从图中看出我们可以找到至少两条直线都能将数据分割开来。

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXpTOPSxRvN1PXKUDib92V1CtpomF1e4HIvrp8Q25KBy6UPU14czjIbzw/0?wx_fmt=jpeg)

我们目标是找到一条最优直线，在这个过程中，首先需要去掉离直线最远的点，这些点会有较大干扰。然后找到剩余的点到直线的距离，查看这些点到哪条直线的最小距离最大，我们的目标就是让这个最小值尽可能的大，同样这个过程也会使用梯度下降法来找到这条最优直线。

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsnmicU9XAsicGkibZv0S84XAWXpeqmlW7T5IV9M8LKp12ibOczeocxZHbSqSDGPs5u96S5hm23gdm2enA/0?wx_fmt=jpeg)

从上图中可以看出，最终黄线的效果要比蓝线的效果好，这种方式被称为SVM(支持向量机)。

### 题后话

机器学习并不仅仅局限于上述提到的算法，也并不像所说的那样简单，现实中会有大量的数据和各种问题需要处理，本文总结的内容都尽量避免了数学的内容，但想搞懂机器学习原理最终都要回归到数学上，例如概率与统计学，线性代数，微积分这些都是少不了的(大学欠下的债迟早要还的)。

后续的文章中我会尽量用通俗的语言来总结，但是如果想入门机器学习，数学是一定需要的，这是理解原理必备的理论基础。

最后，欢迎大家关注我的公众号，让我们一起学习分享，努力实现开挂的人生！

![](https://mmbiz.qpic.cn/mmbiz_jpg/Oj91SdUwtsm4bEbiagtDHGNe4xGcu4fIqmOwOzAErQ8USacxAU8C5gSxia0Jz1IPsO5kdibUkUzbibssbFlUMjPsEw/0?wx_fmt=jpeg)












