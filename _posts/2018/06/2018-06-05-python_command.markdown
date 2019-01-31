---
title: python命令行参数解析库
date: 2018-06-25 22:28:25
tags: python
categories: 技术积累
copyright: true
---

### 简介

最近公司项目需要加个小功能，就是python程序运行的时候可以通过命令行输入参数，增加某些选项可配置的功能。在开发过程中，如果遇到希望能够增加命令行参数这种需求，python提供了对应的库argparse, 针对这个task做个小总结

<!-- more -->
官方文档是这样介绍argparse库的。

> The argparse module makes it easy to write user-friendly command-line interfaces. The program defines what arguments it requires, and argparse will figure out how to parse those out of sys.argv. The argparse module also automatically generates help and usage messages and issues errors when users give the program invalid arguments.

可以看到，argparse库提供了可选和必选参数的设置，而且还可以自动生成help和usage的文档并且还提供错误解答，可以说是非常友好了。
argparse的常用API有如下几个：

```python
parser = argparse.ArgumentParser() #创建一个解析器
parser.add_argument()#增加命令行参数和选项
parser.parse_args()#解析命令行参数
```

### creating a parser

官方定义：

> class argparse.ArgumentParser(prog=None, usage=None, description=None, epilog=None, parents=[], formatter_class=argparse.HelpFormatter, prefix_chars='-', fromfile_prefix_chars=None, argument_default=None, conflict_handler='error', add_help=True, allow_abbrev=True)

是不是有点眼花了，其实这么多参数，基本都用不到。就记住**description**是用来描述输入**-h**或者**--help**时显示的文字就行了

### Adding arguments

> ArgumentParser.add_argument(name or flags…[, action][, nargs][, const][, default][, type][, choices][, required][, help][, metavar][, dest])

又是一堆参数，我也很烦，这么多参数看着都头大, 其实一般常用的也就几个。 但是阅读官方文档是程序员必备的一种能力，所以要注意刻意练习锻炼自己的阅读能力。

*   name or flags 必须的参数，分选项参数和位置参数。选项参数类似于**--para**，位置参数可以是文件名，例如**parser.add_argument('filename')**

*   action 表示参数应该如何被处理

*   nargs 表示填写的参数后面跟几个取值。

*   const 用来存储常量值，最常用的两种情况就是：

    1.  当action='store_const'或append_const的时候，参数的取值就从const里面读取
    2.  当增加可选参数并且nargs='?'的时候，解析的时候参数会取const的值
*   default表示选项参数的默认值(`常用`)

*   type表示参数类型

*   choice 表示参数的取值范围

*   required一般是用来表示选项参数是否在输入的时候必须填写(`常用`)

*   help表示输入`-h`的时候显示该参数的提示信息(`常用`)

*   metavar 表示参数在usage里面显示的名字

*   dest 表示指定参数为另外一个名字

### Parsing arguments

> ArgumentParser.parse_args(args=None, namespace=None)

最后这个就比较简单了，总共两个参数。

*   args 表示要解析的字符串列表，默认是从sys.argv来的
*   namespace 表示对象可取的属性值。默认为空。

说这么多没用，做起来才有用，废话不多说，我们来举个🌰：

```python
import argparseparser = argparse.ArgumentParser('introduce how to use')#创建一个解析器
parser.add_argument('integers', #必选参数                            
                    metavar='number', #'usage'显示成'number'                    
                    type=int, #整形变量                    
                    nargs='+', #至少有一个参数值                    
                    help='an inter for the accumulator')#帮助文档显示
parser.add_argument('--test-para',#可选参数                    
                    required=False,#是否必须携带                    
                    default='this is just a test',#默认值                    
                    help='wirte some instruction here')#帮助文档
args = parser.parse_args()#解析
print(args)
```

运行**python3 intro_parse.py -h**结果如下：

![image](http://upload-images.jianshu.io/upload_images/7793041-38ae29b519f956ca.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到我们增加的number和--test-para都已经正确显示出来了。
再运行python3 intro_prase.py 8, 并没有携带--test-para,结果如下：

![](http://upload-images.jianshu.io/upload_images/7793041-c9e63c46df263b67.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


由于篇幅以及时间匆忙，没有做深入的研究，感兴趣的同学可以根据官方文档详细的尝试一下，多干而不是多看，做技术嘛，切忌眼高手低。

最后还是老样子，如果大家喜欢并认可我，请点个赞，顺手关注一下我的公众号：Morgan的小屋，关注于自我管理和知识学习方面，感谢大家的支持与鼓励，我会一直坚持写下去的。
