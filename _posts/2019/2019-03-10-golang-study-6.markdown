---
layout: post
title: Go语言学习笔记(六)之结构体
date: 2019-03-10 19:18:00
author: Morgan
tags: 
    - Golang
    - 语言教程
header-img: "img/go-bg.jpg"
catalog: true
---

golang中结构体是由零个或多个任意类型的值组成的实体。一般在 golang 中用结构体来定义某个类。

### 基本使用

例如声明一个 Employee 的结构体：

```go
type Employee struct {
    Id 			int
    Name 		string
    Address		string
    DoB			time.Time
    Position 	string
    Salary		int
    ManagerID 	int
}
```

当需要实例化的时候：

```go
var dilbert Employee
dilbert.Id = xxx
dilbert.Name = "golang"
...
//或者
dilbert := &Employee{}
//或者
dilbert := new(Employee)
```

结构体成员的名字开头是大写字母，则表示该成员可导出。若小写，则表示不可导出。

可以通过点操作符来访问结构体成员，也可以先对成员取地址，然后通过指针访问：

```go
position := &dilbert.Position
*position = "Senior" + *position
//一般不会这样用，点操作符就满足需要
```

当定义一个名为 S 的结构体时，其内部不能再包含 S 类型的成员，因为一个聚合的值不能包含其自身。该限制同样适应于数组。但是 S 类型的结构体可以包含`*s`指针类型的成员，这样便可以创建递归的数据结构。

```go
type tree struct {
    value 		int
    left, rgiht *tree
}
```

结构体初始化时可以指定成员的初始值，如果被忽略则默认用零值。

```go
type Point struct {X, Y int}
p := Point{1,2}
```

这种写法要求值必须和定义结构体的变量保持一一对应，容易出错。一般只在定义结构体的包内部使用。另外一种写法：

```go
p := Point{
    X:1,
    Y:2,
}
```

如果结构体的全部成员都是可比较的，那么结构体也是可比较的，就可以用`==`或`!=`来进行比较。

### 嵌入结构体和匿名成员

golang 中提供了一种不寻常的结构体嵌入机制让一个命名的结构体包含另一个结构体类型的匿名成员，这样就可以通过点操作符来访问匿名成员中嵌套的成员，例如`x.f`实际上等于`x.d.e.f`.看一个🌰：

```go
type Point struct {
    X, Y int //相同类型的成员可以合并在一起书写
}
type Circle struct {
    Center Point
    Radius int
}

type Wheel struct {
    Circle Circle
    Spokes int
}
//实例化
var w Wheel
//此时如果按照经典规则来赋值的话
w.Circle.Center.X = 8
w.Circle.Center.Y = 9
//书写会很麻烦
```

Go语言提供了一个特性，我们只声明某个成员的数据类型，而不指定成员的名字，这种成员就叫**匿名成员**，其数据类型必须是命名的类型或者指向该类型的指针。因此上述代码就可以简写为：

```go
type Circle struct {
    Point
    Radius int
}

type Wheel struct {
    Circle
    Spokes int
}
```

在访问成员时，则可以简写：

```go
var w Wheel
w.X = 8		//等价于 w.Circle.Point.X = 8
w.Y = 9
w.Radius = 5
w.Spokes = 20
```

但结构体字面值没有这种表示语法，因此下面写法不能编译通过：

```go
w = Wheel{8,8,5,20}//unknown fields
w = Wheel{
	X:8,
	Y:8,
	Radius:5,
	Spokes:20
}//compile error: unknown fields
```

必须按照如下方式赋值：

```go
w = Wheel{
    Circle: Circle{
        Point: Point{
            X:8,
            Y:8,
        },
        Radius: 5,
    },
    Spokes:20
}
//也可以这样, 但不推荐，容易出错
w = Wheel{Circle{Point{8,8},5},20}
fmt.Printf("%#v\n", w)
//Wheel{Circle:Circle{Point:Point{X:8,Y:8}, Radius:5}, Spokes:20}
```

上面`Printf`中%v 参数包含的#副词，表示用和 Go 语言类似的语法打印。对于结构体，将包含每个成员的名字。

使用结构体匿名成员并不仅仅得到结构体的成员，还可以得到匿名类型的方法集，可以访问匿名成员的方法，后续的文章在介绍方法时，会详细说明。

如果想了解结构体T的一个实例占用了多大内存，可以使用:`size := unsafe.Sizeof(T{})`

### 标签

结构体中的字段除了变量名字和类型之外，还有一个可选的标签(tag)：它是一个附属于字段的字符串，可以是文档或者其他的重要标记。标签的内容只有包`reflect`能获取它。例如：

```go
type Employee struct {
    Id 			int		`json:"id"`
    Name 		string	`json:"name"`
}
```

上例中tag表示结构体转成 json 格式时的成员名字。

当需要获取tag时：

```go
var e Employee
t := reflect.TypeOf(e)
for i:=0; i< t.NumField();i++ {
    field := t.Field(i)
    fmt.Println(field.Tag.Get("json"))
}
//output:
//json:"id"
//json:"name"
```

Period.🤔

更多文章欢迎关注公众号：程序员Morgan.