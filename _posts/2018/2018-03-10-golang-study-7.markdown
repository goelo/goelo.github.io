---
layout: post
title: Go Study Notes (Part 7): Methods
date: 2018-04-13 9:56:00
author: Morgan
tags: 
    - Golang
    - Tutorials
header-img: "img/go-bg.jpg"
catalog: true
---

In object-oriented programming we describe behaviour with methods. Go follows the same idea: a function becomes a method when we define it with a receiver.

#### Declaring methods

```go
type Point struct {
    X, Y float64
}

// A standalone helper
func Distance(p, q Point) float64 {
    return math.Hypot(q.X-p.X, q.Y-p.Y)
}

// The same behaviour as a method on Point
func (p Point) Distance(q Point) float64 {
    return math.Hypot(q.X-p.X, q.Y-p.Y)
}
```

The receiver (`p` here) plays a role similar to `this` in C++ or `self` in Python. Call it like this:

```go
p := Point{1, 2}
q := Point{4, 6}
fmt.Println(p.Distance(q))
```

The expression `p.Distance` is a selector; the compiler resolves it to the appropriate method for the value’s type.

We can define another `Distance` method on a different type:

```go
type Path []Point

func (path Path) Distance() float64 {
    sum := 0.0
    for i := range path {
        if i > 0 {
            sum += path[i-1].Distance(path[i])
        }
    }
    return sum
}
```

#### Pointer receivers

Function arguments in Go are passed by value. To mutate the receiver inside a method, define it as a pointer:

```go
func (p *Point) ScaleBy(factor float64) {
    p.X *= factor
    p.Y *= factor
}
```

By convention, if any method on a type uses a pointer receiver, all methods should. One exception: the type itself cannot be a pointer alias.

```go
type P *int
func (P) f() {} // compile error
```

You can call pointer receiver methods in several ways:

```go
r := &Point{1, 2}
p := Point{1, 2}
pptr := &p

r.ScaleBy(2)
pptr.ScaleBy(2)
(&p).ScaleBy(2)
```

Thankfully the compiler handles many conversions for us:

```go
Point{1, 2}.Distance(q) // receiver and argument types match
pptr.ScaleBy(2)          // pointer receiver with pointer argument
p.ScaleBy(2)             // value promoted to pointer automatically
pptr.Distance(q)         // pointer automatically dereferenced
```

The only case that fails is calling a pointer method on an unnamed temporary, because the compiler cannot take its address.

#### Embedding and promoted methods

When a struct embeds another struct anonymously, it inherits that type’s methods:

```go
type ColoredPoint struct {
    Point
    Color color.RGBA
}

red := color.RGBA{255, 0, 0, 255}
blue := color.RGBA{0, 0, 255, 255}

p := ColoredPoint{Point{1, 1}, red}
q := ColoredPoint{Point{5, 4}, blue}
fmt.Println(p.Distance(q.Point)) // "5"
p.ScaleBy(2)
```

A `ColoredPoint` isn’t literally a `Point`, but it *has* one, so methods from `Point` promote to `ColoredPoint`.

You can also embed a pointer to share storage:

```go
type ColoredPoint struct {
    *Point
    Color color.RGBA
}

p := ColoredPoint{&Point{1, 1}, red}
q := ColoredPoint{&Point{5, 4}, blue}
fmt.Println(p.Distance(*q.Point))
q.Point = p.Point // share the same underlying Point
p.ScaleBy(2)
fmt.Println(*p.Point, *q.Point)
```

#### Method values and expressions

Selectors such as `p.Distance` are **method values**. When you refer to the method on the type directly—`Point.Distance`—you create a **method expression**.

```go
p := Point{1, 2}
q := Point{4, 6}
distance := Point.Distance
fmt.Println(distance(p, q))
fmt.Printf("%T\n", distance) // func(Point, Point) float64
```

Method expressions are handy when you want to choose a method dynamically:

```go
func (p Point) Add(q Point) Point { return Point{p.X + q.X, p.Y + q.Y} }
func (p Point) Sub(q Point) Point { return Point{p.X - q.X, p.Y - q.Y} }

type Path []Point

func (path Path) TranslateBy(offset Point, add bool) {
    var op func(p, q Point) Point
    if add {
        op = Point.Add
    } else {
        op = Point.Sub
    }
    for i := range path {
        path[i] = op(path[i], offset)
    }
}
```

In the snippet above the variable `op` holds either the addition or subtraction method, letting us reuse the loop body.

That wraps up methods for now. More Go notes soon!
