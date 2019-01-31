---
layout: post
title: 笨办法学Golang(二)
date: 2019-01-14 20:56:20
author: Morgan
tags: 
    - 语言教程
    - Golang	
---

这是Go语言学习笔记的第二篇文章。

<!--more -->

> Go语言学习笔记参考书籍「Go语言编程」、Go官方标准库

### 前文提要

上篇文章中留了个练习，查询一下Go语言中fmt包下面`Print`,`Printf`,`Println`三个函数的使用。

```go
//Print采用默认格式将其参数格式化并写入标准输出。如果两个相邻的参数不只是字符串，则会在输出之间添加空格
func Print(a ...interface{}) (n int, err error)
//Printf根据format参数生成格式化字符串并写入标准输出
func Printf(format string, a...interface{}) (n int, err error)
//Println采用默认格式化将其参数格式化并写入标准输出，在相邻参数的输出之间添加空格并在输出结束后添加换行符
func Println(a ...interface{}) (n int, err error)
```

上面函数定义看不懂没关系，后面学到接口就懂了。我们先借助例子来看一下这三个函数的区别：

```go
a := "hello world"
b, c:= 123,456
fmt.Print(a,b,c, "\n")
fmt.Printf("%v%v%v\n", a,b,c) //一般使用%v来格式化输出
fmt.Println(a,b,c)
```

输出结果:

```go
hello world123 456
hello world123456
hello world 123 456
```

可以看出，

- `Print`需要手动添加换行符，并且只有相邻的参数不是字符串的情况下才会自动添加空格。
- `Printf`的入参是string类型，可以根据参数类型使用%s, %d来格式化输出。一般所有类型都可以使用%v来进行输出。
- `Println`会自动在相邻参数之间添加空格并自动添加换行符。

### 变量

#### 变量声明

Go语言中引入了关键字`var`,变量类型放在变量名之后。Go语言语句末尾不需要像C语言一样用`;`作为结束标记。

```go
var v1 int
var v2 string
var (
    v3 float64
    v4 *int
)//还可以将多个需要声明的变量放在一起，一般用于全局变量中
var v5, v6, v7 int //多变量声明
```

#### 变量初始化

变量声明完需要初始化变量，有三种方式：

```go
var v1 int = 10
var v2 = 11
v3 := 1.0
```

当不写变量类型的时候，Go语言可以从初始化表达式的右值推导出该变量的类型。如果变量初始化的时候未给变量指定初始值，则会程序会给变量一个的默认值，例如int型的默认值为0.

**注意**：第三种初始化方式中，变量(v3)必须是`未被声明过`的，否则会导致编译错误。

#### 变量赋值

Go语言中认为变量初始化和变量赋值是两个概念。看例子：

```go
var v1 string
v1 = "hello, world"
//Go语言中有类似python实现的多变量赋值功能
var i, j int = 1,2
i, j = j, i
```

同样的，Go语言函数也可以返回多个值。

#### 匿名变量

Go语言中还有一种变量，成为匿名变量。像上面提到的函数返回多个值，就可以使用匿名变量来优化调用。

```go
func getResult() (result string, err int){
    result := "success"
    err := 0
    return result, err
}
result, _ := getResult()
```

当我们只想得到`result`而不关心`err`, 匿名变量的优势就体现出来了，同样的也可以用在`for`循环中。

### 常量

#### 定义常量

1. 通过`const`关键字来定义常量，既可以指定常量类型，也可以不指定常量类型
2. 常量定义的右值不能是程序运行期才能获得的结果。

用例子说话：

```go
const myname string = "Morgan"
const zero = 0.0
const (
	number int64 = 1024
    result = "success"
)
const v1, v2, v3 = 1, 2.0, "good"
const offset = 3 >> 2
//以上都是正确的写法
const myPath = os.GetEnv("PATH")//build error, 因为os.GetEnv()只有运行期才能获得结果。
```

#### iota用法

`iota`是Go语言预定的常量,`iota`在每一个`const`关键字出现时被reset为0，然后在下一个iota出现之前，每出现一次`iota`,自动加1。

```go
const (
	v0 = iota				//v0 = 0, iota被reset为0
    v1 = iota				//v1 = 1
    v2 = iota				//v2 = 2
)
const (
	v3 = iota * 10			//v3 = 0, iota被reset为0
    v4 = iota * 10			//v4 = 10
    v5 float32 = iota * 10  //v5 = 20.0
)
```

如果多个`const`语句的赋值表达式是一样的，则可以简写如下：

```go
const (
	v0 = iota
	v1
	v2
)
```

今天学习了变量和常量的用法，尽管涉及的代码不多，但是编程语言的学习最忌眼高手低，因此我也按部就班的每一行都敲出来，并将程序运行。为此针对自己的学习中涉及的代码，整理了一个[repo](https://github.com/goelo/LearnGolangTheHardWay), 希望后续学习能使它变得充实起来。

