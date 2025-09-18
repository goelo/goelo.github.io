---
layout: post
title: Go Study Notes (Part 5)
date: 2018-02-27 17:37:27
author: Morgan
tags: 
    - Golang
    - Tutorials
header-img: "img/go-bg.jpg"
catalog: true
---

This is the fifth entry in my Go study notes.

### Conditionals

The basic `if` statement looks like this:

```go
if condition {
    statement
} else {
    statement
}
```

Things to remember:

- Parentheses are unnecessary around the condition.
- Braces are required.
- The opening brace must appear on the same line as `if` or `else`.
- You can include an initialiser before the condition, separated by `;`.
- In a function that returns a value, you cannot hide the final `return` inside an `if...else`—the compiler requires a guaranteed return path.

```go
func example(x int) int {
    if x == 0 {
        return 1
    }
    return x
}
```

### Switch statements

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

Notes on `switch`:

- The expression after `switch` is optional.
- The opening brace must share the line with `switch`.
- Expressions are not limited to constants or integers.
- Multiple values can share one `case`.
- `break` is implicit at the end of each `case`.
- Use `fallthrough` to continue into the next `case`.

### Loops

Go offers only the `for` loop—no `while` or `do...while` keywords. Two common forms:

```go
sum := 0
// Classic three-part loop
for i := 0; i < 10; i++ {
    sum += i
}
// Infinite loop with manual break
for {
    sum++
    if sum > 100 {
        break
    }
}
```

Use `range` to iterate over arrays, slices, maps, or channels:

```go
nums := []int{2, 3, 4}
for i, num := range nums {
    fmt.Println(i, num)
}
```

For slices and arrays, `range` returns the index and value. For maps, it returns the key and value.

Additional loop pointers:

- The opening brace must be on the same line as `for`.
- Parallel assignment is supported, but you cannot separate multiple assignments with commas alone—use full parallel forms.
- `continue` and `break` work as expected. `break` can target a labelled loop.

```go
ILoop:
for i := 0; i < 5; i++ {
    for j := 0; j < 10; j++ {
        if j > 5 {
            break ILoop // breaks out of the outer loop
        }
    }
}
// more statements here
```

### Goto

`goto` jumps to a label within the same function:

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

### Functions

#### Declaring functions

The general form is `func name(parameter-list) (result-list) { body }`. Arguments and results can be named or anonymous. If a function declares return values it must eventually execute a `return`, unless execution never reaches the end (for example, due to an infinite loop).

```go
func add(x int, y int) int { return x + y }
func sub(x, y int) (z int) { z = x - y; return }
func first(x int, _ int) int { return x }
func zero(int, int) int { return 0 }
```

#### Multiple return values

Functions may return multiple values. When return parameters are named, an empty `return` sends back the current values. Be explicit if you shadow the return variable inside a block.

```go
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return
}
```

#### Error handling

Go encodes errors through the `error` interface. `nil` indicates success; anything else signals failure. Common patterns include:

1. Propagate the error upward:

   ```go
   resp, err := http.Get(url)
   if err != nil {
       return nil, err
   }
   ```

2. Retry with sensible backoff or maximum attempt limits.
3. Log the error and exit when recovery is impossible.
4. Ignore the error intentionally if it’s harmless.

A simple example: reading runes from standard input and stopping at end-of-file. The `io` package guarantees that end-of-file failures return `io.EOF`.

```go
in := bufio.NewReader(os.Stdin)

for {
    r, _, err := in.ReadRune()
    if err == io.EOF {
        break
    }
    if err != nil {
        return fmt.Errorf("read failed: %v", err)
    }
    _ = r // process the rune here
}
```

#### Anonymous functions and closures

Anonymous functions omit a name and can be defined inline:

```go
func main() {
    var v func(a int) int

    v = func(a int) int {
        a++
        return a
    }

    fmt.Println(v(10))
}
```

Functions are first-class values—you can assign them to variables or pass them around.

Closures are related but not identical. In Go, closures are built with anonymous functions that capture free variables from their surrounding scope.

```go
func main() {
    j := 5

    a := func() func() {
        i := 10
        return func() {
            fmt.Printf("i, j: %d, %d\n", i, j)
        }
    }()

    a()
    j *= 2
    a()
}
```

Output:

```
i, j: 10, 5
i, j: 10, 10
```

Variable `i` is enclosed within the closure and cannot be changed externally. When we mutate `j` and call `a()` again, the new value is visible.

**Beware** of the following pattern:

```go
var funcs []func()
words := []string{"Hello", "Learn", "the", "Go", "Language"}
for _, word := range words {
    funcs = append(funcs, func() {
        fmt.Println(word)
    })
}

for _, f := range funcs {
    f()
}
```

Every closure captures the same loop variable, so the output prints `Language` five times. Fix it by introducing a new variable inside the loop:

```go
for _, word := range words {
    w := word
    funcs = append(funcs, func() {
        fmt.Println(w)
    })
}
```

For a deeper dive into closures, read [“Closures in Go”](http://sunisdown.me/closures-in-go.html).

More notes coming soon—follow along if you’d like to keep learning with me.
