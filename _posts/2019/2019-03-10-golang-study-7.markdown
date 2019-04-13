---
layout: post
title: Go语言学习笔记(七)之方法
date: 2019-04-13 9:56:00
author: Morgan
tags: 
    - Golang
    - 语言教程
header-img: "img/go-bg.jpg"
catalog: true
---

在面对对象编程(OOP)，我们常把某个对象实现的具体行为的函数称作方法。例如 C++中A类的某个函数实现了某种行为，我们就叫做 A 的方法。在 golang 中如果要定义一个方法，只需要在函数声明时，在函数名前加上某个变量，即该变量实现了某个方法。

##### 方法声明

```go
type Point struct{
    X, Y float64
}
//按照传统方法,我们可能会按照下面的方式来写
func Distance(p, q Point) float64 {
    return math.Hypot(q.X - p.X, q.Y - p.Y)
}

//但在 go 语言中则是这样
func (p Point) Distance(q Point) float64 {
	return math.Hypot(q.X-p.X, q.Y-p.Y)
}
```

参数 p 我们一般称为方法接收器(receiver), 按照早期 OOP 的说法, 调用一个方法称为"向一个对象发送消息", 这里的 p 类似C++中的 this 指针, python 中的 self.

方法调用是这样的:

```go
p := Point{1, 2}
q := Point{4, 6}
fmt.Println(p.Distance(q))
```

`p.Distance`这种表达式叫做选择器, 因为编译器会自动选择适合 p 这个对象的 Distance 方法来执行.可以理解为 C++中每个类都有对应自己的方法, 尽管名字相同,但都有自己所属的命名空间.

比如我们可以再定义一个同样的 Distance 方法:

```go
type Path []Point

func (path Path)Distance() float64 {
    sum := 0.0
    for i := range path {
        if i > 0 {
           sum += path[i-1].Distance(path[i]) //此处调用了上面 Point 的 Distance 方法
        }
    }
}
```

##### 基于指针对象的方法

我们知道, go 语言中函数调用的参数值都是值拷贝, 如果需要更改入参的值, 则需要用指针来处理.同样, 声明方法时,也可以将接收器定义为指针类型. 例如:

```go
func (p *Point) ScaleBy(factor float64) {
    p.X *= factor
    p.Y *= factor
}
```

 但是需要注意的是, **一般约定如果某个类(比如 Point)有一个指针作为接收器的方法, 那么所有的方法都必须定义为指针接收器.** 这里只是为了展示两种方法.

另外,**如果类型本身是一个指针, 则不允许其出现在接收器中**, 例如:

```go
type P *int //P是一个 int 型的指针
func (P) f() {...} //此处会编译出错
```

在 go 语言中调用指针的方法,有多种写法:

```go
r := &Point{1,2}
p := Point{1,2}
pptr := &p
r.ScaleBy(2)
pptr.ScaleBy(2)
(&p).ScaleBy(2)
```

幸运的是, 我们不需要牢记这么多写法, go 语言中编译器会帮忙做类型转换, 无论接收器是指针类型还是非指针类型,都可以调用.

总结一下共三种方式:

```go
//1. 接收器实参与接收器形参相同
//此处为形参为 Point, 如果写 Point{1,2}.ScaleBy(2)则会报错
//原因是Point{1,2}是一个临时变量, 无法获取内存地址
Point{1,2}.Distance(q) 
//pptr为一个指针,实参也是指针
pptr.ScaleBy(2)


//2. 接收器形参为类型 T, 实参为类型*T
//此处p为类型 T, 调用的*T 的方法, 编译器隐式转换了
p.ScaleBy(2)

//3. 接收器形参为*T, 实参为类型 T
//同样编译器做隐式转换
pptr.Distance(q)
```

##### 含有匿名结构体的方法

在上一篇文章中提到过匿名结构体, 如果某个结构体A中含有匿名结构体B， 则在调用 B 结构体的方法`func()`时,可以直接使用`A.func()`.例如：

```go
type Point struct { X, Y float64}

type ColoredPoint struct {
  Point
  Color color.RGBA
}

//Point 实现了 Distance 方法, 则
red := color.RGBA{255,0,0,255}
blue := color.RGBA{0,0,255,255}
var p = ColoredPoint{Point{1,1}, red}
var q = ColoredPoint{Point{5,4}, blue}
fmt.Println(p.Distance(q.Point))//"5"
p.ScaleBy(2)
```

**注意**：一个 ColoredPoint 并不是一个 Point， 可以看成它“has a” Point, 并且有从 Point 类引入的 Distance 和 ScaleBy 方法。

也可以在结构体中声明一个匿名指针，用来共享结构内存并动态的改变对象之间的关系。下例：

```go
type ColoredPoint struct {
  *Point
  Color color.RGBA
}

p:= ColoredPoint{&Point{1,1}, red}
q:= ColoredPoint{&Point{5,4}, blue}
fmt.Println(p.Distance(*q.Point)) // "5"
q.Point = p.Point // p、q现在共享内存
p.ScaleBy(2)
fmt.Println(*p.Point, *q.Point)
```

##### 方法值和方法表达式

之前的例子`p.Distance`叫做**选择器**，对于 `Point.Distance`则称为**方法表达式**，它们返回的“值”成为**方法值**。

大多数情况，人们习惯于使用选择器来调用一个方法。使用方法表达式调用方法的话，函数的第一个参数会被用作接收器。例如：

```go
p := Point{1,2}
q := Point{4,6}
distance := Point.Distance //method expression
fmt.Println(distance(p,q)) //"5"
fmt.Printf("%T\n", distance) //func(Point, Point) float64
```

方法表达式的好处在于当根据一个变量来决定调用同一个类型的哪个函数时，就可以来使用方法表达式。比如说：

```go
type Point struct{X, Y float64}
func (p Point) Add(q Point) Point {return Point{p.X + q.X, p.Y + q.Y}}
func (p Point) Sub(q Point) Point {return Point{p.X - q.X, p.Y - q.Y}}

type Path []Point

func (path Path)TranslateBy(offset Point, add bool) {
  var op func(p, q Point) Point
  if add {
    op = Point.Add
  } else {
    op = Point.Sub
  }
  for i := range path {
    //call either path[i].Add(offset) or path[i].Sub(offset).
    path[i] = op(path[i], offset)
  }
}
```

👆的例子，变量 op 代表加法或者减法，二者都是属于 Point 类型，使用方法表达式就会变的很简洁。

Period.🤔

更多文章欢迎关注公众号：程序员 Morgan。

聚焦程序人生，关注自我管理，不给自己人生设限！