---
layout: post
title: Learning Go the Hard Way (Part 2)
date: 2018-01-14 20:56:20
author: Morgan
tags: 
    - Tutorials
    - Golang
catalog: true
---

This is the second entry in my Go learning notes.

<!--more -->

> References: *The Go Programming Language* and the official Go standard library docs.

### Recap

Last time I asked you to explore the differences among `fmt.Print`, `fmt.Printf`, and `fmt.Println`.

```go
// Print formats arguments with default verbs and writes to standard output.
func Print(a ...interface{}) (n int, err error)
// Printf formats according to a format specifier.
func Printf(format string, a ...interface{}) (n int, err error)
// Println formats with spaces between operands and a trailing newline.
func Println(a ...interface{}) (n int, err error)
```

Try them:

```go
a := "hello world"
b, c := 123, 456
fmt.Print(a, b, c, "\n")
fmt.Printf("%v%v%v\n", a, b, c)
fmt.Println(a, b, c)
```

Output:

```
hello world123 456
hello world123456
hello world 123 456
```

Key takeaways:

- `Print` requires manual newlines and only inserts spaces when adjacent arguments aren’t strings.
- `Printf` uses format verbs—`%v` prints most types readably.
- `Println` adds spaces and a newline automatically.

### Variables

#### Declarations

Go uses the `var` keyword with the type after the name. No semicolons needed.

```go
var v1 int
var v2 string
var (
    v3 float64
    v4 *int
)
var v5, v6, v7 int
```

#### Initialisation

Three common patterns:

```go
var v1 int = 10
var v2 = 11
v3 := 1.0
```

When you omit the type, Go infers it from the right-hand side. Skip the value entirely and you get the type’s zero value (`0` for integers, `""` for strings, etc.). The short declaration `:=` only works for new variables.

#### Assignment

Initialisation and assignment are distinct. Go supports multiple assignment like Python:

```go
var v1 string
v1 = "hello, world"
var i, j int = 1, 2
i, j = j, i
```

Functions can also return multiple values.

#### Blank identifier

Use the blank identifier `_` to ignore values you don’t need:

```go
func getResult() (string, error) {
    return "success", nil
}

result, _ := getResult()
```

### Constants

Define constants with `const`. Values must be known at compile time.

```go
const myName string = "Morgan"
const zero = 0.0
const (
    number int64 = 1024
    result        = "success"
)
const v1, v2, v3 = 1, 2.0, "good"
const offset = 3 >> 2
// const myPath = os.GetEnv("PATH") // compile error: runtime value
```

#### `iota`

`iota` resets to 0 in each `const` block and increments automatically:

```go
const (
    v0 = iota // 0
    v1        // 1
    v2        // 2
)

const (
    v3 = iota * 10 // 0
    v4 = iota * 10 // 10
    v5 = iota * 10 // 20
)
```

### Wrap-up

Today’s focus was variables and constants. It may seem basic, but typing every line solidifies your understanding. I’m collecting all examples in a [GitHub repo](https://github.com/goelo/LearnGolangTheHardWay); feel free to follow along.
