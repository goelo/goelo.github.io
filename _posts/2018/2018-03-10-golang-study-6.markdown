---
layout: post
title: Go Study Notes (Part 6): Structs
date: 2018-03-10 19:18:00
author: Morgan
tags: 
    - Golang
    - Tutorials
header-img: "img/go-bg.jpg"
catalog: true
---

In Go, a struct is a composite type that groups zero or more values of any type. It’s the building block you use to model objects.

### Basic usage

Declare an `Employee` struct like this:

```go
type Employee struct {
    Id        int
    Name      string
    Address   string
    DoB       time.Time
    Position  string
    Salary    int
    ManagerID int
}
```

Instantiate and assign values:

```go
var dilbert Employee
dilbert.Id = 123
dilbert.Name = "Gopher"
// ...

// or allocate on the heap
dilbert := &Employee{}
// or
another := new(Employee)
```

Capitalised field names are exported; lowercase names remain package-private.

Access members with the dot operator. You can also take addresses, though it’s rarely necessary:

```go
position := &dilbert.Position
*position = "Senior " + *position
```

A struct cannot contain a field of its own type (that would recurse infinitely), but it can hold a pointer to its type. That’s how you build recursive structures:

```go
type tree struct {
    value int
    left, right *tree
}
```

Initialise structs with literals. If you list values without names they must follow the field order:

```go
type Point struct { X, Y int }
p := Point{1, 2}
```

Named literals are safer because order no longer matters:

```go
p := Point{
    X: 1,
    Y: 2,
}
```

A struct is comparable if all of its fields are comparable, which lets you use `==` or `!=` directly.

### Embedded structs and anonymous fields

Go lets one struct embed another without giving the embedded value an explicit field name. Consider:

```go
type Point struct {
    X, Y int
}

type Circle struct {
    Center Point
    Radius int
}

type Wheel struct {
    Circle Circle
    Spokes int
}
```

Assigning through nested structs can get verbose:

```go
var w Wheel
w.Circle.Center.X = 8
w.Circle.Center.Y = 9
```

Instead, embed the structs anonymously:

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

Now the fields flatten:

```go
var w Wheel
w.X = 8          // equivalent to w.Circle.Point.X
w.Y = 9
w.Radius = 5
w.Spokes = 20
```

Struct literals still require full qualification—you cannot rely on the flattened field names there:

```go
w = Wheel{
    Circle: Circle{
        Point: Point{X: 8, Y: 8},
        Radius: 5,
    },
    Spokes: 20,
}
// This compact form works but is harder to read:
w = Wheel{Circle{Point{8, 8}, 5}, 20}
fmt.Printf("%#v\n", w)
// Wheel{Circle:Circle{Point:Point{X:8, Y:8}, Radius:5}, Spokes:20}
```

Printing with `%#v` shows field names, mirroring Go’s literal syntax.

Anonymous fields grant not only their data but also their methods. We’ll dive into embedding and method promotion in a later post. To inspect how much memory an instance occupies, use `unsafe.Sizeof(T{})`.

### Tags

Fields can include optional tags—string metadata retrievable via reflection. A common pattern is defining JSON keys:

```go
type Employee struct {
    Id   int    `json:"id"`
    Name string `json:"name"`
}
```

Access tags with the `reflect` package:

```go
var e Employee
t := reflect.TypeOf(e)
for i := 0; i < t.NumField(); i++ {
    field := t.Field(i)
    fmt.Println(field.Tag.Get("json"))
}
// Output:
// id
// name
```

That’s it for structs. More Go notes are on the way—stay tuned!
