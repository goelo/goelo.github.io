---
layout: post
title: 笨办法学Golang(一)
date: 2019-01-13 21:35:45
author: Morgan
tags: 
    - Golang
    - 语言教程
catalog: true
---

### Golang简介

Go语言(或`Golang`)是 Google 在 2007 年开发的一种开源编程语言，于 2009 年 11 月 10 日向全球公布。Go 是非常年轻的一门语言，它的主要目标是“兼具 Python 等动态语言的开发速度和 `C/C++`等编译型语言的性能与安全性”。

<!-- more -->

经过这几年的发展，Go语言的需求逐渐升高，目前比较火的容器和Kubernetes都是用Go语言开发完成的。下图我是随便在招聘网站搜索得到的，我们也可以看到Go语言的就业范围以及薪资也是比较优秀的。

![image-20190113201904955](https://ws1.sinaimg.cn/large/006tNc79ly1fz582cc5ixj31ce0rgtcm.jpg)

可见国内的很多互联网公司已经开始使用`Golang`来开发，例如知乎也使用Golang重构核心业务，头条使用`Golang`和`Python`开发完成的。学习`Golang`，刻不容缓！

这里有篇左耳听风的文章[「GO语言、DOCKER 和新技术」](https://coolshell.cn/articles/18190.html)，大家可以通过点击阅读原文跳转链接了解其对Go语言优缺点的分析。

### 如何学习Go语言

学习编程语言相信大家都知道，切忌眼高手低。理论的学习一定要配合实践才能有效果。因此在接下来的golang学习笔记中，我也尝试通过用例子的方式来总结Golang的基础以及进阶的应用，力求言简意赅，让大家在学习Golang语言中不那么枯燥。

最后再强调一遍，编程语言的学习一定要动手敲出来，只有敲出来才是自己的，才能发现别人遇不到的问题，记忆才会更深刻。

接下来，let's get started!

### Golang安装

首先需要先安装Go语言，由于我使用的是mac电脑，因此这里的安装教程仅涉及mac电脑，windows或者linux的同学请自行搜索，不难。

```go
//先安装homebrew, 终端输入一下命令
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
//安装完成以后可以尝试更新一下
$ brew update
//然后安装go语言包
$ brew install go
//验证是否安装完成
$ go version
go version go1.11.4 darwin/amd64 //显示go版本号，表示安装成功
//配置go环境变量， 数字表示对应go语言的版本号
$ /usr/local/Cellar/go/1.11.4/bin
//配置GOPATH
$ mkdir ~/go
$ vim ~/.bash_profile
//在文件末尾添加
export GOPATH=/Users/$USER/go
```

至此go语言算是安装完成了，保险起见，我们可以写个程序验证是否安装成功。

### 第一个程序

在src文件夹新建一个hello.go的文件，敲入以下代码：

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}
```

输入完成在终端有两种方法测试：

1. `go run hello.go`可以看到终端输出:“Hello, world!”
2. 先`go build hello.go`,会发现文件夹下面多了一个hello的二进制文件，然后使用`./hello`运行，终端输出:“Hello, world!”

以上两种方式均可，第一种方式后台直接编译运行显示结果，第二种方式相当于将第一种方式拆分，先进行编译，生成二进制文件，然后我们通过运行二进制文件来查看结果。

### 开发环境的选择

`Golang`的IDE有很多，大家按个人喜好选择即可，可是使用集成的，也可以自己通过VIM、Atom或者sublime text自行搭建。这里我选用的是Goland。按上述步骤安装完Golang以后不需要配置其他，打开Goland即可识别。这里就不一一讲解了。

### 程序分析

其实，不知不觉我们已经实现了一个小程序，就是打印`Hello, world!`。接下来我们分析一下代码结构。

第一行`package main`表示这个文件属于`main`包，每一个Go程序都包含一个`main`包。

第三行表示我们导入了`fmt`这个外部包，`fmt`包实现了格式化输入输出的函数。

第五行是我们`main`程序入口，表示程序从该处开始运行。该处需要**注意**，在Go语言中，`{`强制规定不能单独放在一行中，否则会报编译错误。

### 练习

在这里给大家留一个小作业，搜索一下fmt包的打印方法`Print`,`Printf`,`Println`这三个打印函数的区别。