---
layout: post
title: Learning Go the Hard Way (Part 3)
date: 2018-01-15 21:05:09
author: Morgan
tags: 
    - Golang
    - Tutorials
catalog: true
---

This is the third instalment of my Go learning notes.

<!--more -->

> References: *The Go Programming Language* and the official Go standard library.

Go’s basic types include booleans, numbers, strings, and the dedicated `error` type.

#### Boolean (`bool`)

A boolean can only be `true` or `false`, e.g. `var v bool = true`.

```go
func main() {
    var v1, v2 bool
    v1 = true
    v2 = 1 
    v3 := false
    v4 := (1 != 2)

    fmt.Printf("%v %v %v %v", v1, v2, v3, v4)
}
// To keep later snippets brief I’ll omit package/import statements.
```

The compiler flags line four because Go will not implicitly convert the integer `1` into a boolean. There is no automatic or forced casting.

#### Numeric types

Numbers fall into integers, floating-point numbers, and complex numbers.

**1. Integers**

Go offers signed and unsigned integers: `int8`, `uint8`, `int16`, `uint16`, `int32`, `uint32`, `int64`, and `uint64`, plus architecture-dependent types `int`, `uint`, and `uintptr`.

All the standard arithmetic operators are available (`+`, `-`, `*`, `/`, `%`), as are the comparison operators (`>`, `<`, `==`, `>=`, `<=`, `!=`) and bitwise operators:

| Operator | Meaning | Example |
| ------ | ---- | ------------------ |
| a << b | left shift | 3 << 2  // 12 |
| a >> b | right shift | 12 >> 2  // 3 |
| x ^ y  | XOR | 3 ^ 2    // 1 |
| x & y  | AND | 3 & 2   // 2 |
| x &#124; y | OR | 3 &#124; 2     // 3|
| ^x     | bitwise NOT | ^3        // 0 |

**Note:** `int` is its own type. If you omit a type annotation, the compiler usually defaults to `int`.

```go
var v1 int16
v2 := 16        // v2 is inferred as int
v1 = v2         // build error: cannot use v2 (type int) as type int16
```

Casting fixes the issue: `v1 = int16(v2)`.

**2. Floating-point numbers**

Go exposes `float32` and `float64`. As with integers, omitting the type causes the compiler to infer `float64`, so cast explicitly if you need `float32`.

**3. Complex numbers**

Complex numbers come in `complex64` and `complex128`. They combine a real and an imaginary part.

```go
var cpx1 complex64       // composed of two float32 values
cpx1 = 1.0 + 2i
cpx2 := 1.0 + 2i         // inferred as complex128 (two float64 values)
cpx3 := complex(1.0, 2)  // same result as cpx2
```

Given `z := complex(x, y)` you can retrieve its parts with `real(z)` and `imag(z)`. The `math/cmplx` package contains helper functions for complex arithmetic.

#### Strings

**1. Declaring and initialising**

```go
var first string      // declaration
first = "first"        // assignment
b := "hello world"     // initialisation
f := first[0]

fmt.Printf("The first character of \"%s\" is %c.\n", first, f)
fmt.Printf("The length of \"%s\" is %d\n", b, len(b))
```

**Note:** strings are immutable. Attempting `b[0] = 'H'` causes a compile error.

**2. Common operations**

Typical tasks include:

- Measuring length
- Checking whether a rune or substring exists
- Concatenating
- Iterating over bytes or runes
- Comparing
- Changing case

```go
// Length
s := "LearnGolangTheHardWay"
fmt.Println(len(s))
// Checking for substrings (three variants)
fmt.Println(strings.Contains(s, "Hard"))
// Returns true if any of the supplied characters appear.
fmt.Println(strings.ContainsAny(s, "L & z"))
// The second argument here is a rune.
fmt.Println(strings.ContainsRune(s, 'H'))
// Concatenation
f := "find"
sf := "find"
fmt.Println(f + s)
// Iterate by byte index
for i := 0; i < len(s); i++ {
    ch := s[i]
    fmt.Println(i, ch)
}
fmt.Println("======")
// Iterate by rune
for j, ca := range s {
    fmt.Println(j, ca)
}
// Comparison
// Compare is case-sensitive.
fmt.Println(strings.Compare(f, s))  // 1 or -1 means not equal
fmt.Println(strings.Compare(f, sf)) // 0 means equal
fmt.Println(strings.EqualFold(f, s))  // false means not equal
fmt.Println(strings.EqualFold(f, sf)) // true means equal
// EqualFold ignores case.
// Case conversion
fmt.Println(strings.ToUpper(f))
fmt.Println(strings.ToLower(strings.ToUpper(f)))
```

The `strings` package offers far more utilities—scan the docs as you need them.

All of the snippets above live in the [accompanying GitHub repo](https://github.com/goelo/LearnGolangTheHardWay/blob/master/src/three.go). To inspect a variable’s dynamic type at runtime, use `reflect.TypeOf(x)`.
