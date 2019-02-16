---
layout: post
title: 笨办法学Golang(四)
date: 2019-01-20 20:37:27
author: Morgan
tags: 
    - Golang
    - 语言教程
---

这是Go语言学习笔记的第四篇

<!--more -->

> Go语言学习笔记参考书籍「Go语言圣经」以及Go官方标准库

### 数组

数组是指一系列同类型元素的集合。Go语言中，数组使用前必须指定长度，数组长度在定义以后就**不可以更改**。

```go
//数组的声明
var arr1 [2] int
var arr2 [10] int
var arr3 [2][3]int		//二维数组
var arr4 [2]*int		//指针数组

//数组赋值
arr1[0] = 0
arr1[1] = 1
//指针数组赋值
v0 := 1
v1 := 2
arr4[0] = &v0
arr4[1] = &v1
//上述赋值适应于数组元素较少时，当数组元素较多，可以用for循环来处理
for i:=0; i<2; i++ {
    for j:=0; j<3; j++ {
        arr3[i][j] = i + j
    }
} 
//数组初始化
var arr5 = [5]float32{1.0, 2.0, 3.4, 5.6, 7.8}
arr6 := [2]int{0,1}
//[]中的数组可以忽略，编译器会根据元素个数来设置
var arr7 = [...]string{"first name", "second name", "third name"}
```

可以使用内置函数`len(arry)`来获取数组长度，如果想访问数组元素，一般使用数组下标。数组下标从0开始，`len(array)-1`表示最后一个元素。除此之外，还可以使用关键字`range`：

```go
for i, v := range array {
    fmt.Println("Array element[", i, "]=", v)
}
//range 具有两个返回值，第一个返回元素的数组下标，第二个返回元素值
```

需要特别注意，在Go语言中数组是一个值类型。值类型就是变量在赋值或作为参数传递时会产生copy动作。因此，若函数的参数类型是数组，则函数调用时会发生数据copy，传入函数的其实只是数组的一个副本，也就无法在函数内部更改数组内容。

```go
func modifyArray(arr [5]int) {
    for i:=0; i<len(arr); i++ {
        arr[i] = i + 1
    }
    fmt.Println("In modifyArray(), array values: ", arr)
}

func main() {
    arr := [5]int{1,2,3,4,5}
    
    modifyArray(arr)
    
    fmt.Println("In main(), array values")
}
```

程序执行结果为：

```go
In modify Array(), array values: [3 4 5 6 7]
In main(), array values: [1 2 3 4 5]
```

那么问题来了，如果想在函数内部修改数组内的数据怎么办呢？这时候则使用**数组切片**。

### 数组切片

数组切片初看就像一个指向数组的指针，实际上它也有自己的数据结构，数组切片抽象为3个变量：

- 一个指向原生数组的指针
- 数组切片中的元素个数
- 数组切片已分配的存储空间

基于数组，数组切片添加了一系列管理功能，可以随时动态扩展存储空间，并且可以被随意传递而不会导致管理的元素被重复复制。

#### 创建数组切片

创建数组切片有两种方式，基于数组(数组切片)和直接创建(使用内置函数`make()`)。我们通过例子来看两种创建方式：

```go
arr := [10]int{1,2,3,4,5,6,7,8,9,10}
var slice0 [] = arr[:5]//从数组创建
//创建个数为5，初始值为0的切片
var slice1 := make([]int, 5)
//创建个数为5，初始值为0，并预留10个存储空间的切片
var slice2 := make([]int, 5, 10)
//直接创建5个元素切片
var slice3 := []int{1,2,3,4,5}
```

从上面看出，Go语言使用array[first:last]方式来生成数组切片，例如下面几种都是合法的：

```go
//基于arr的所有元素创建数组切片
var mySlice = arr[:]
//基于arr的前5个元素创建
var mySlice = arr[:5]
//基于从第5个开始创建后面所有的数组切片
var mySlice = arr[5:]
//创建从第2个到第5个的数组切片
var mySlice = arr[2:5]
//甚至创建的数组切片元素可以超过原数组元素个数，只要不超过原数组的存储能力(cap()返回的值)，超出部分会填0
var mySlice = slice2[2:7] //slice2数组有5个元素，储存能力为10
```

#### 动态扩展元素

数组的所有操作同样适应于数组切片，例如`len()`获取元素个数，`range()`快速遍历：

数组切片还有一个重要的功能就是可动态增减元素。数组切片支持内置的`cap()`函数，返回数组切片分配空间的大小。看个例子：

```go
func main() {
    mySlice := make([]int, 5, 10)
    
    fmt.Println("len(mySlice): ", len(mySlice))
    fmt.Println("cap(mySlice): ", cap(mySlice))
    
    //往mySlice元素后追加新元素，形成新数组切片
    mySlice = append(mySlice, 1,2,3)
    
    mySlice2 := []int{8,9,10}
    
    mySlice = append(mySlice, mySlice2...)
    /* 上面这行代码mySlice2后面的三个点如果缺少，会编译错误。*/
    /* 原因是append的函数定义从第二个参数起，都是可增加参数。*/
    /* mySlice的元素类型是init, 直接传递的mySlice2是数组切片，类型错误。*/
    /* 加上省略号即三个点相当于把mySlice2包含的所有元素打散后传入 */
    /* 相当于 mySlice = append(mySlice, 8,9,10) */
    fmt.Println("mySlice: ", mySlice)
    /*上面追加的元素超过了原来的10个元素容量，此时数组切片会重新自动处理存储空间不足，自动分配一块足够大的内存*/
    
}
```

#### 内容复制

```go
slice1 := []int{1,2,3,4,5}
slice2 := []int{5,4,3}

copy(slice2, slice1) 	//只复制slice1的前三个元素
copy(slice1, slice2)	//只复制slice2的3个元素到slice1的前三个位置
```

数组切片支持内置函数`copy()`， 用于将内容在数组切片之间复制。上面的例子表明：如果两个数组切片不一样大，就会按照其中较小的数组切片的元素个数进行复制。

### map

map是一堆键值对的未排序集合。先看一个例子：

```go
//定义一个struct
type bookInfo struct {
    ID string
    Name string
    Price string
}
func main() {
    var bookDB map[string] bookInfo
    bookDB = make(map[string] bookInfo)
    
    //插入数据
    bookDB["1"] = bookInfo{"1", "Harry Potter", "$20"}
    bookDB["123"] = bookInfo{"123", "Steve Jobs:A Biography","$12"}
    
    //在map中查找
    book, ok := bookDB["1234"]
    
    if ok {
        fmt.Println("find the book: ", book.Name, "the price is: ", book.Price)
    } else {
        fmt.Println("sorry, didn't find the book.")
    }
}
```

上面例子涉及到了map的声明、初始化、赋值，查找。

##### 变量声明

第8行声明了一个map, 其中变量名为bookDB, map的键类型为string, 存放的值类型为bookInfo.

##### 创建

用内置函数`make()`创建一个map，像第9行代码。也可以在创建的时候指定map的存储能力：

`bookDB = make(map[string]bookInfo, 100)`, 同样也可以在创建map的时候初始化：

`bookDB = map[string]bookInfo{"1": bookInfo{"1", "Harry Potter", "$20"}}`

##### 删除元素

使用内置函数`delete()`来删除map中的元素。例如:`delete(bookDB, "123")`，如果“123”不存在，则什么都不会发生，如果存在，则会删除key为“123”的value。

##### 查找元素

go语言中查找map中值非常方便，代码如下：

```go
value, ok := bookInfo["123"]
if ok {
    //找到了，处理找到的value
}
```

本文中的代码均整合上传至github, 请参考[源文件](https://github.com/goelo/LearnGolangTheHardWay/blob/master/src/)

