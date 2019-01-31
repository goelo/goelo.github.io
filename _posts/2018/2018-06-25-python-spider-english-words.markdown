---
layout: post
title: python爬虫爬取英文考研词汇
subtitle: "世界杯来了就不学习了吗"
date: 2018-06-25 22:01:21
author: Morgan
tags: 
    - python
    - 爬虫
    - practice_project
---


今年打算复习考在职研究生，这几天开始背诵考研单词，在网上查找英语考研必备词汇，发现都是长这样的：![image](http://upload-images.jianshu.io/upload_images/7793041-4e8b38f4a0bbb879.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
<!-- more -->
每一页的点击太费时费力了。因此萌生了为什么不能用爬虫把单词爬下来保存在本地呢？说干咱就干。首先点开搜索中的某个网页，分析网页的结构，找到其中的规律。例如，我找的是跨考考研的网站:![image](http://upload-images.jianshu.io/upload_images/7793041-ed85fe608a8591fc.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这是该网站*http://www.kuakao.com/english/ch/39183.html*的英语词汇链接起始.

安全起见，我们先查看网站的robots协议，可以看到并没有限制我们爬取词汇页面。![image](http://upload-images.jianshu.io/upload_images/7793041-ccecd1d41adf286e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

接下来使用chrome浏览器，右键点击view page source(ctrl-U)，也可以选择inspect(ctrl+shift+I),找到对应的词汇部分，![image](http://upload-images.jianshu.io/upload_images/7793041-0e4caf127dc443f5.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

分析发现，词汇部分开头是用*<div class="artTxt">*开始的。接下来就开始我们的coding过程了。我们程序使用的是python3, 系统是ubuntu，IDE选择的是pycharm，主要是pycharm可以在线调试，简单方便。
先实现爬取网页的过程：

```
import requests
try:
    base_url = 'http://www.kuakao.com/english/ch/39183.html'
    r = requests.get(base_url)
    print(r.content)
except Exception as e:
    print(e)
```
写完以后运行，从结果来看，我们成功获取到了该网页的内容，但是内容不够友好，会有一些**xb9\xe4\xba\x8e**这种字符，并没有显示中文内容，这里修改一下编码格式，增加一行code：
> r.encoding =  r.apparent_encoding, 

然后增加模拟浏览器登陆，另外从打印结果来看，网页内容没有实现自动排版，这里我们用*Beautifulsoup*库来优化解析网页内容，优化完的code如下：

```python
import requests
from bs4 import BeautifulSoup
try:
    base_url = 'http://www.kuakao.com/english/ch/39183.html'
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36'}
    r = requests.get(base_url, headers=headers)
    r.encoding = r.apparent_encoding
    soup = BeautifulSoup(r.content, 'lxml')
    print(soup)
except Exception as e:
    print(e)
```
尝试运行，从返回的结果来看，网页内容能够正常显示中文字符，也自动进行了排版。![image](http://upload-images.jianshu.io/upload_images/7793041-a0359e5adc0768fd.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

接下来我们需要提取网页中词汇的部分，使用*Beautifulsoup*的*find*方法查找*class=artTxt*的*div*，返回的结果中，我们发现除了英文词汇还有其余不想要的内容，这是由于*find*方法会按照我们的要求从开始查找， 找到结果以及后面的所有内容都会包含。这需要我们利用code来进行筛选，将尾巴去掉，只保留词汇部分。*Beautifulsoup*具体的使用方法在这里不做过多的概述了，放两个链接给大家：

[BeautifulSoup官方文档中文版](https://www.crummy.com/software/BeautifulSoup/bs4/doc.zh/)
[静觅的博客关于BeautifulSoup用法](https://cuiqingcai.com/1319.html)

学习爬虫迟早要学*Beautifulsoup*和正则表达式的，建议大概了解一下用法。

通过*Beautifulsoup*解析网页内容，拿到词汇以后，我们需要将其保存在文件中。保存文件的code如下：

```python
with open('word.txt', 'w') as f:
    f.write(word)
    f.write('\n')
```
文章开头的时候我们只是分析了第一页的内容，翻阅下去以后发现一共有66页内容，因此我们将*url*拆分一下:
```python
 base_url = 'http://www.kuakao.com/english/ch/39' + str(183 + page) + '.html'
```
改成通过遍历方式，可以抓取到每个网页的结构内容。

将code按照功能细分一下，总共两个方法就可以实现完整步骤了：
1. get_englist_word()
2. write_word_to_file(word_list)

最后为了能够让我们在运行爬虫程序的时候有所反馈，我增加了进度条的功能，使用了tqdm第三方库，效果如下：![image](http://upload-images.jianshu.io/upload_images/7793041-e64abc2ab0203c0f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

最终文件中效果图是长这样的：[图片上传失败...(image-c1ea62-1528535865293)]

到此为止，我们的程序就写完了。最后总结一下，写爬虫的code的时间其实很少，主要是对于要爬取内容的解析和清洗工作占用了大部分时间，以及后期的优化工作，这样也能锻炼我们分析解决问题的能力。

附录：[源代码](https://github.com/goelo/machine_learning/tree/master/project/crawling_english_words)


由于本人自身能力有限，code还有很多有待改进之处，欢迎大家指点建议，也希望大家能多多包涵。

如果大家喜欢这篇文章，还请大家点个赞，算是对我的鼓励，谢谢！