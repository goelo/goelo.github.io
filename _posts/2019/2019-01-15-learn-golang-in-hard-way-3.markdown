---
layout: post
title: 笨办法学Golang(三)
date: 2019-01-15 21:05:09
author: Morgan
tags: 
    - Golang
    - 语言教程
---

这是Go语言学习笔记第三篇。

<!--more -->

> Go语言学习笔记参考书籍「Go语言圣经」以及Go官方标准库

Go语言基本类型主要有布尔类型，数字类型，字符串类型以及新增的错误类型。

#### 布尔(bool)类型

布尔类型的值只能是常量true或false.例如`var v bool = true`

```go
func mian() {
    var v1, v2 bool
	v1 = true
	v2 = 1 
	v3 := false
	v4 := (1 != 2)
	
    fmt.Printf("%v %v %v %v", v1, v2, v3, v4)
}
//为了节省篇幅，以后的示例代码自动省略package mian以及import包语句，不再赘述。
```

运行上述代码，会发现第4行报编译错误，原因是布尔类型不接受其他类型的赋值，不支持自动或强制类型转换。

#### 数字类型

数字类型主要分为整型、浮点型和复数类型。

**1.整型**

Go语言中将整型分为了`int8`,`uint8`,`int16`,`uint16`,`int32`,`uint32`,`int64`,`uint64`多种，还有和平台架构相关的`int`,`uint`,`uintptr`类型。

Go语言中也同样支持常规的运算符计算：+、-、*、/和%(求余)，以及支持比较运算符:`>`、`<`、`==`、`>=`、`<=`和`!=`, 同样也支持位运算:

| 运算符 | 含义 | 例子               |
| ------ | ---- | ------------------ |
| a << b | 左移 | 3 << 2  //结果 12   |
| a >> b | 右移 | 12 >> 2  //结果 3   |
| x ^ y  | 异或 | 3 ^ 2    //结果 1 |
| x & y  | 与   | 3 & 2   //结果 2  |
| x &#124; y | 或   | 3 &#124; 2     //结果 3|
| ^x     | 取反 | ^3        //结果 0 |

**注意**：int在Go语言中是单独的一种类型，如果数字不指定类型，编译器一般会自动推导为int类型。例如:

```go
var v1 int16
v2 := 16		//v2被自动推导为int型
v1 = v2 		//build error:cannot use v2 (type int) as type int16 in assignment
```

`v1 = int16(v2)`可以解决这种问题。

**2.浮点型**

浮点型分为float32和float64，浮点型同样有类似上面整型的问题，如果不指定类型，则编译器自动设为float64类型，需要强制转换才可以解决。

**3.复数类型**

复数类型分为complex64和complex128, 复数由实部和虚部组成。

```go
var cpx1 complex64       //表示由2个float32构成复数类型
cpx1 = 1.0 + 2i
cpx2 := 1.0 + 2i         //不同于cpx1, 因为自动推导为float64，因此是complex128类型
cpx3 := complex(1.0, 2)  //结果同cpx2
```

一个复数`z = complex(x, y)`, 可以通过内置函数`real(z)`和`imag(z)`来分别获得实部x和虚部y。复数的相关函数在`math/cmplx`标准库下。

#### 字符串类型

**① 声明和初始化**

我们来看例子：

```go
var first string 	//声明
first = "first"		//赋值
b := "hello world"	//初始化
f := first[0]

fmt.Printf("The first character of \"%s\" is %c.\n", first, f)
fmt.Printf("The length of \"%s\" is %d \n", b, len(b))
```

**注意**：字符串初始化以后不能修改。例如上述中b初始化以后，若`b[0] = H`，则会报编译错误。

**② 常见字符串操作**

常见的字符串操作主要有：

- 求字符串长度
- 查找某个字符串是否存在某个字符或者子字符串
- 字符串拼接
- 字符串遍历
- 字符串比较
- 大小写转换

```go
//求字符串长度
s := "LearnGolangTheHardWay"
fmt.Println(len(s))
//查找子串是否在字符串中, 有三种方法
fmt.Println(strings.Contains(s, "Hard"))
//注意第二个参数只要第一个匹配(例如L正确)正确，则返回true.
fmt.Println(strings.ConstainsAny(s, "L & z"))
//注意第二个参数是字符
fmt.Println(strings.ContainsRune(s, 'H'))
//字符串拼接
f := "find"
sf := "find"
fmt.Println(f + s)
//字符串遍历有两种方式，1种是按字节数组方式，1种是按Unicode字符方式
for i:=0; i<len(s); i++ {
    ch := s[i]
    fmt.Println(i, ch)
}
fmt.Println("======")
for j, ca := range s {
    fmt.Println(j, ca)
}
//比较
//Compare比较时区分大小写
fmt.Println(strings.Compare(f, s)) // 返回1或-1 表示不相等
fmt.Println(strings.Compare(f, sf))// 返回0 表示相等
fmt.Println(strings.EqualFold(f, s)) //返回false表示不相等
fmt.Println(strings.EqualFold(f, sf))//返回true表示相等
//EqualFold比较时忽略大小写
//大小写转换
fmt.Println(strings.ToUpper(f))
fmt.Println(strings.ToLower(strings.ToUpper(f)))
```

字符串并不是仅仅上述操作，具体更多的操作可以查看Go语言string标准库来查看学习。

本文中的代码均整合上传至github, **需要注意的是**，在Go语言中查看变量属于哪种数据类型，使用`reflect.TypeOf(x)`，具体的输出打印参考[源文件](https://github.com/goelo/LearnGolangTheHardWay/blob/master/src/three.go)。

