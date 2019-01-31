---
layout: post
title: 实战：垃圾短信分类器
date: 2018-07-15 20:02:54
author: Morgan
tags: 
    - 机器学习
    - practice_project
---

上次我们讲到朴素贝叶斯分类，忘记的同学参考[一文搞懂朴素贝叶斯分类](http://morgansays.com/2018/07/09/%E4%B8%80%E6%96%87%E6%90%9E%E6%87%82%E6%9C%B4%E7%B4%A0%E8%B4%9D%E5%8F%B6%E6%96%AF%E5%88%86%E7%B1%BB/)，今天就通过朴素贝叶斯分来来实现一个简单的垃圾短信分类器。

<!-- more -->
### 数据预处理
实现这个分类器我们使用的数据集来自伦敦大学学院的机器学习数据集(UCL machine learning)，图中所示为该数据集的部分数据：
![](https://www.markeditor.com/file/get/b2bd235a2f318942261da398d24706de)

一般用 pandas 模块来处理数据, 在这里需要用到 pandas 的`read_table()`方法，原因是文档集两列之间用了tab键来分割.如果对于`read_table()`该选择哪些参数不明确的话，需要先阅读 pandas 的官方 API 文档，这里就不详细介绍了，很容易就搜索到。提一点，`read_table()`默认分隔符就是以 tab 键来分割数据。
```python
import pandas as pd
#读取数据
df = pd.read_table("yourfilepath", names=['label', 'sms_message'])
df.head()
```
通过上述代码可以读取数据并把前 5 行数据打印出来：
![](https://www.markeditor.com/file/get/8484979b0674d9d0e215c855a7276eb1)

接下来，进行数据预处理，将 ham 和 spam 分别用 1 和 0 表示，为什么这么做呢？原因是机器只能识别机器语言，不能识别自然语言，如果把 label 用 string 类型来表示的话，scikit-learn 最后会自动转换成不识别的 float 型的值。
如果 label 按照 string 类型来表示，模型也照样有能力预测，不过通常在计算性能指标的时候会出现问题，比如召回率，精度等。代码如下：
```python
# 做一个 map 表，0 表示‘ham'，1 表示’spam‘
df['label'] = df.label.map({'ham':0, 'spam':1})
df.head()
```
### 词袋方法
在处理文本信息中，选用的是词袋方法，词袋方法的思路就是每当输入一个文档片段，就会来计算这个片段中单词出现的次数。就像将词语放入一个袋子中，然后统计看看袋子中不同的词语出现的次数，而不会考虑单词出现的顺序，在文本处理中会把单词出现次数当做训练分类器的特征。
比如说：现在有 4 句话:
> 1.Hello, how are you!!
> 2.Country road, takes me home..
> 3.Shall we have a dinner tonight?
> 4.Hi, how is going your homework?

我们用词袋模型将上面四句话转成一个频率分布的矩阵，一句话代表一行，列表示每个单词。如下图所示：

![](https://www.markeditor.com/file/get/2059e89030b8e786a0b1c8f037771b8d)

要实现这个 有两种办法，第一种自己实现一个词袋模型，第二中是用 sklearn 的 `CountVectorizer()`方法，该方法会将文档集标记化(将每个文档片段分割成单个单词)并为每个标记提供一个整数 ID，同时会记录每个标记出现的次数。
#### <span id="jump">自己造轮子</span>
```python
import string
import pprint
from collections import Counter
from sklearn.feature_extraction.text import CountVectorizer
documents = ['Hello, how are you!',
                'Country road, takes me home.',
                'Shall we have a dinner tonight?',
                'Hi, how is going your homework?']
frequency_list = []
for i in documents:
    # 转换小写，移除标点
    remove_punc = i.lower().translate(str.maketrans('','', string.punctuation))
    # 将句子分割成单个单词
    result = remove_punc.split(' ')
    # 计算每句中每个单词的频率
    word = Counter(result)
    frequency_list.append(word)
pprint.pprint(frequency_list)

count_vector = CountVectorizer()
count_vector.fit()
```
上述代码中有主要做了 3 件事：
1. 将所有的单词都转换为小写，为了便于统计
2. 去除每一句中的标点符号，只需要关心单词
3. 计算单词出现的次数

运行结果如图：
![](https://www.markeditor.com/file/get/407c7ef0f95c82dcbc5d1dc844db22e8)

#### 用 sklearn 库解决
先放 code：
```python
from sklearn.feature_extraction.text import CountVectorizer
count_vector = CountVectorizer()
# 训练文档集
count_vector.fit(documents)
# 获取文档集中的不重复的单词
count_vector.get_feature_names()
# 将文档集向量化
doc_array = count_vector.transform(documents).toarray()
frequency_matrix = pd.DataFrame(doc_array,                      columns=count_vector.get_feature_names())
```
上面代码提到的 CountVectorizer() 方法有几个参数需要注意。
- `lowercase`会将所有单词转化为小写，默认为True
- `token_pattern`可以去掉所有标点符号，默认值为正则表达式：‘(?u)\\b\\w\\w+\\b’
- `stop_words`参数默认为‘None’,如果设置成‘english’,那么会按照sklearn定义的英语停用侧列表来匹配我们数据集中的所有单词，考虑到我们的数据集比较小，因此保留默认值即可。
`fit()`方法用来训练文档集，`get_feature_names()`用来将文档集归类，也就是将不重复的单词都统计下来。`transform()`方法会将文档集转成矩阵的形式，矩阵的行是文档集的单词，列表示单词的次数。`toarray()`将结果转成数组的形式。最后把得到的结果用 pandas 的 DataFrame 的形式显示出来。
这样就成功用sklearn 实现了词袋模型。最终得到刚开始的图片效果:
![](https://www.markeditor.com/file/get/2059e89030b8e786a0b1c8f037771b8d)

### 训练模型并测试

训练和测试模型直接使用 sklearn 提供的 api 即可。先分割训练和测试集：
```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(df['sms_message'], 
                                                    df['label'], 
                                                    random_state=1)

print('Number of rows in the total set: {}'.format(df.shape[0]))
print('Number of rows in the training set: {}'.format(X_train.shape[0]))
print('Number of rows in the test set: {}'.format(X_test.shape[0]))
```
#### 使用 sklearn 实现朴素贝叶斯定理
分割完训练集和数据集以后，我们利用 sklearn 中的贝叶斯分类器来训练模型并进行预测。
```python
from sklearn.naive_bayes import MultinomialNB
# 初始化实例
count_vector = CountVectorizer()
# 训练数据转成矩阵
training_data = count_vector.fit_transform(X_train)
# 转化测试集为矩阵
testing_data = count_vector.transform(X_test)
naive_bayes = MultinomialNB()
naive_bayes.fit(training_data, y_train)
predictions = naive_bayes.predict(testing_data)
```
需要注意的是，上述代码使用的`MultinomialNB()`只是适应于离散数据(就像我们例子中文本分类是根据单词计数实现的)。如果是连续数据，则需要用其他方法，例如高斯朴素贝叶斯方法，不过数据也需要假设符合高斯分布才可以。
### 评估模型
评估模型主要用到四种指标：准确率(Accuracy)、精度(Precision)、召回率(Recall)和 F1 分数。后面有专门的文章来详细介绍评估指标。
上文已经预测数据，现在根据评估指标来看一下模型是否满足预测需求。将上面四种指标分别打印出来：

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
print('Accuracy score: ', format(accuracy_score(y_test, predictions)))
print('Precision score: ', format(precision_score(y_test, predictions)))
print('Recall score: ', format(recall_score(y_test, predictions)))
print('F1 score: ', format(f1_score(y_test, predictions)))
```
结果如下：
![](https://www.markeditor.com/file/get/a112c6e0351f0bff776ecf84764f02da)

### 打印结果
最后 可以将模型预测的测试集的结果打印出来。
```python
category_map = {0:'ham', 1:'spam'}
for message, category, real in zip(X_test[50:100], predictions[50:100], y_test[50:100]):
    print('\n recevie message:', message, '\n prediction:', category_map[category], 'true value:', category_map[real])
```

限于篇幅原因只显示部分结果：
![](https://www.markeditor.com/file/get/c9ba0f72f0020b62ab6f3d05b1835ed4)

至此，垃圾短信分类已经完成。可能有人会疑问，如果新来数据该如何处理呢？上文中的
`predictions = naive_bayes.predict(testing_data)`这行代码是用来预测数据结果，当新来一个文档集(本例中是短信)时，只需要将文档集转成词袋模型，例如前面在**[自己造轮子](#jump)**环节中的例句，我们将变量`doc_array`代入，即可得到结果为`[0,0,0,0]`, 表示这 4 个文档集均为非垃圾邮件。

PS: 在本文中使用的是 python3, 以及截图在 jupyter notebook 下面运行的，这样便于数据分析。完整的代码已提交 github, 关注机器学习club公众号后台回复『贝叶斯算法』即可获取全部源码。

原创文章，欢迎转载，转载请声明作者和出处，谢谢！

欢迎关注机器学习club ，在这里我将持续输出机器学习原创文章，尽量用朴实的语言带你领略技术的美妙。
