---
layout: post
title: How to Use Go Interfaces Gracefully
date: 2018-04-21 9:56:00
author: Morgan
tags: 
    - Golang
    - Tutorials
header-img: "img/go-bg.jpg"
catalog: true
---

Encapsulation, inheritance, and polymorphism are the three pillars of object-oriented programming. In Go we model data with structs and achieve polymorphism through interfaces.

### What is an interface?

An interface is both a set of methods and a type. Go relies on **implicit implementation**: a concrete type satisfies an interface simply by defining the required methods—no explicit `implements` declaration needed.

The key idea is that types should be described by the operations they support rather than the data they hold.

### Declaring and satisfying an interface

```go
type Human interface {
    Say()
}

type Woman struct{}
type Man struct{}

func (w *Woman) Say() {
    fmt.Println("I'm a woman")
}

func (m *Man) Say() {
    fmt.Println("I'm a man")
}

func main() {
    w := new(Woman)
    w.Say()
    m := new(Man)
    m.Say()
}
```

A concrete type implements an interface only if it defines **all** the methods listed by that interface.

### Interface values and the empty interface

The empty interface `interface{}` is often misunderstood. Every type implements it, but the value itself is still an interface value, not an arbitrary type:

```go
func Say(s interface{}) {
    // ...
}
```

Inside `Say`, the static type of `s` is `interface{}`. At runtime the value carries two pointers: one to the concrete type information and one to the underlying data. These internal representations live in Go’s runtime (`runtime2.go`):

```go
type iface struct {
    tab  *itab
    data unsafe.Pointer
}

type eface struct {
    _type *_type
    data  unsafe.Pointer
}
```

This detail explains why the following code fails to compile:

```go
func PrintAll(vals []interface{}) {
    for _, val := range vals {
        fmt.Println(val)
    }
}

func main() {
    names := []string{"stanley", "david", "oscar"}
    PrintAll(names) // compile error
}
```

`[]string` does not automatically convert to `[]interface{}`. Fix it by copying the elements into a slice of interfaces:

```go
func main() {
    names := []string{"stanley", "david", "oscar"}
    vals := make([]interface{}, len(names))
    for i, v := range names {
        vals[i] = v
    }
    PrintAll(vals)
}
```

### Pointer versus value receivers

Consider the subtle difference between pointer and value receivers:

```go
type Human interface { Say() }

type Man struct{}
type Woman struct{}

func (m Man) Say() {
    fmt.Println("I'm a man")
}

func (w *Woman) Say() {
    fmt.Println("I'm a woman")
}
```

This slice literal does **not** compile:

```go
func main() {
    humans := []Human{Man{}, Woman{}}
    for _, human := range humans {
        human.Say()
    }
}
```

The `Woman` value fails to satisfy `Human` because its `Say` method is defined with a pointer receiver. Change the slice to hold pointers:

```go
func main() {
    humans := []Human{&Man{}, &Woman{}}
    for _, human := range humans {
        human.Say()
    }
}
```

`Man` still works because passing an address lets the compiler call either pointer or value receiver methods. Value types don’t automatically promote to pointer receivers because a value might have many aliasing pointers, whereas a pointer refers to a single value.

### Type assertions

Type assertions operate on interface values:

```go
value, ok := expr.(TargetType) // safe; no panic
value := expr.(TargetType)     // panics if the assertion fails
```

Example:

```go
type Shape interface { Area() float64 }
type Object interface { Volume() float64 }
type Skin interface { Color() float64 }

type Cube struct { side float64 }

func (c Cube) Area() float64 { return c.side * c.side }
func (c Cube) Volume() float64 { return c.side * c.side * c.side }

func main() {
    var s Shape = Cube{3.0}
    value1, ok1 := s.(Object)
    fmt.Printf("Does %v implement Object? %v\n", value1, ok1)
    value2, ok2 := s.(Skin)
    fmt.Printf("Does %v implement Skin? %v\n", value2, ok2)
}
```

Type assertions let you branch on an interface’s dynamic type. The standard library uses this pattern extensively. `fmt.Println` is a great example:

```go
func Println(a ...interface{}) (n int, err error) {
    return Fprintln(os.Stdout, a...)
}

func (p *pp) printArg(arg interface{}, verb rune) {
    switch f := arg.(type) {
    case bool:
        p.fmtBool(f, verb)
    case float64:
        p.fmtFloat(f, 64, verb)
    case int:
        p.fmtInteger(uint64(f), signed, verb)
    // many more cases trimmed for brevity
    }
}
```

### Key takeaways

- Design interfaces around shared behaviour, not shared data fields.
- `interface{}` is still an interface type; it simply accepts any concrete value.
- Interface values contain both type information and a pointer to data.
- Pointer receivers can call value methods, but not the other way around.
- Everything in Go is passed by value.
- Use safe type assertions to check dynamic types and keep your code robust.

That’s it—happy interface hunting!
