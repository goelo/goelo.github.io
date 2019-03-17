---
layout: post
title: Go语言学习笔记(五)
date: 2019-02-27 17:37:27
author: Morgan
tags: 
    - Golang
    - 语言教程
header-img: "img/go-bg.jpg"
catalog: true
---

这是Go语言学习笔记的第五篇

### 条件语句

条件语句格式：

```go
if condition {
    statement
} else {
    statement
}
```

几点注意的地方：

- 不需要使用括号`()`将条件包含起来

- 花括号`{}`必须存在

- 左花括号`{`必须与if或else处于同一行

- 在`if`之后，条件语句之前可以添加变量初始化语句, 使用`;`间隔

- 在有返回值的函数中，不允许将“最终的”`return`语句包含在`if...else...`结构中，否则会编译失败。例如：

```go
func example(x int) int {
    if x == 0 {
        return 1
    } else {
        return x
    }
}
```

### 选择语句

选择语句格式：

```go
switch i {
    case 0:
    	fmt.Println("0")
    case 1:
    	fmt.Println("1")
    case 2:
    	fmt.Println("2")
    case 3:
    	fallthrough
    default:
    	fmt.Println("default")
}
```

`switch`几点注意的地方：

- `switch`后面的条件表达式不是必需的。

- 左花括号`{`必需与switch处于同一行

- switch的条件表达式不限制为常量或者整数

- 单个case中可以有多个结果选项

- 不需要用`break`来明确退出一个`case`
- `case`后面明确添加`fallthrough`关键字，则会继续执行紧跟的下一个`case`

### 循环语句

Go语言中循环语句只支持`for`关键字，不支持`while`和`do-while`。for基本用法如下:

```go
sum := 0
//第一种
for i:= 0; i < 10; i++ {
    sum += i
}
//第二种
for {
    sum++
    if sum > 100 {
        break
    }
}
```

`for`循环还可以配合`range`关键字来迭代数组，切片，通道以及集合`map`中的元素。如下：

```go
nums := []int{2,3,4}
for i, num := range nums {
    fmt.Println(i, num)
}
```

在数组和切片中它返回元素的索引和索引对应的值，在集合中返回 key-value 对的 key 值。

`for`循环几点需要注意的地方：

- 左花括号`{`必须和`for`处于同一行

- Go语言中`for`循环同样支持多重赋值，但Go语言不支持以逗号为间隔的多个赋值语句，必须使用平行赋值的方式来初始化多个变量

- `for`循环同样支持`continue`和`break`来控制循环，但`break`更高级，可以选择中断哪一个循环。例如：

  ```go
  for i:=0; i < 5; i++ {
      for j:= 0; j < 10; j++ {
          if j > 5 {
              break ILoop //此处break终止的是ILoop标签处的外层循环
          }
      } 
  }
  ILoop:
  	statement
  ```

### 跳转goto语句

`goto`语句表示跳转到本函数的某个标签。如：

```go
func myfunc() {
    i := 0
    HERE:
    fmt.Println(i)
    i++
    if i < 10 {
        goto HERE
    }
}
```

### 函数

##### 函数声明

函数一般按照如下格式声明：`func name(parameter-list)(result-list) { body }`。`parameter-list`表明函数的参数以及类型，`result-list`描述函数返回值名字以及类型，函数的返回值不是必须的，但是如果一个函数声明包含返回值，则必须以`return`语句结尾，除非函数无法运行至结尾，例如函数中有无限循环等情况。下面的4中声明方法都是正确的：

```go
func add(x int, y int) int {return x+y}
func sub(x, y int) (z int) {z = x - y; return}
func first(x int, _ int) int { return x}
func zero(int, int) int {return 0}
```

##### 多返回值

在前面已经了解，Go中函数可以有多个返回值。如果命名了返回值参数，一个没有参数的`return`语句，会将当前的值作为返回值返回。但如果遇到`if`等代码块和返回值同名，则需要显式写出返回值。

```go
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return 
}
```

#####  错误处理

Go语言定义了关于错误处理的标准模式，即`error`接口。

`error`的类型可能是nil或non-nil, nil意味着运行成功，non-nil表示失败。当函数调用返回错误时，一般常用的处理方式：

1. 最常用的方式是将错误直接返回给调用方。如：

   ```go
   resp, err := http.Get(url)
   if err != nil {
       return nil, err
   }
   ```

2. 重新尝试失败的操作，但是注意限制重试的时间间隔或者重试次数

3. 如果错误发生，程序无法继续运行，则需要输出错误信息并结束程序

4. 如果错误不严重，可以直接忽略掉错误。

看一个例子，例子展示如何从标准输入中读取字符，以及判断文件结束。io包保证任何由文件结束引起的读取失败都返回同一个错误-`io.EOF`

```go
in := bufio.NewReader(os.Stdin)

for {
    r, _, err := in.ReadRune()
    if err == io.EOF {
        break
    }
    if err != nil {
        return fmt.Errorf("read failed:%v", err)
    }
}
```

##### 匿名函数和闭包

匿名函数顾名思义，就是不带函数名的函数，在Go语言中，可以随时在代码里定义匿名函数。例如：

```go
func main() {
    var v func(a int) int
    
    v = func(a int) int {
        return a++
    }
}
```

函数可以像普通变量一样被传递或引用。

闭包和匿名函数不太一样，但是在Go中闭包必须由匿名函数实现。闭包中包含自由变量的代码块，自由变量指的是未绑定到特定对象的变量。同时闭包还包含自由变量当时的环境，即作用域。我们看一个例子：

```go
func main() {
	var j int = 5
    
    a := func()(func()) {
        var i int = 10
        return func() {
            fmt.Println("i, j: %d, %d\n", i, j)
        }
    }()
    
    a()
    j *= 2
    a()
}
```

运行结果是：

```
i, j: 10, 5
i, j: 10, 10 
```

由于变量a指向的闭包函数引用了局部变量i和j, i的值被隔离，在闭包外不能被修改，改变j的值以后，再次调用a, 发现结果是修改的值。

**需要注意的地方是**:下面的代码是有问题的

```go
var strs []func()
var strSlice = []string{"Hello", "Learn", "the", "Go", "Language"} 
for _, str := range strSlice {
    strs = append(strs, func() {
        fmt.Println(str)
    })
}

for _, str1 := range strs {
    str1()
}
```

问题原因在于循环变量的作用域。在第一个for循环中闭包记录的是循环变量str的内存地址，并不是每次循环变量str的值。因此在调用`str1()`的时候，`strs`里面其实保存的值已经是循环迭代完的值，即“Language”。

Go底层实现闭包的原理：其实是闭包返回的函数指针指向的内存区域是一个结构体，该结构体包含了匿名函数的指针和自由变量的指针。

解决办法就是每次复制变量`str`然后传到匿名函数中，让闭包的环境变量不相同。即：

```go
for _, str := range strSlice {
    s := str
    strs = append(strs, func() {
        fmt.Println(s)
    })
}
```

关于闭包的解释，这里推荐一篇文章：「[Closures in Go](http://sunisdown.me/closures-in-go.html)」，看完以后感觉对闭包会有更深的理解。

更多文章可以关注公众号：程序员Morgan.