---
layout: post
title: Learning Go the Hard Way (Part 4)
date: 2018-01-20 20:37:27
author: Morgan
tags: 
    - Golang
    - Tutorials
header-img: "img/go-bg.jpg"
catalog: true
---

Welcome to the fourth entry in my Go learning notes.

<!--more -->

> References: *The Go Programming Language* and the official Go standard library.

### Arrays

An array stores a fixed-length sequence of elements of the same type. Arrays must declare their length, and once defined the length cannot change.

```go
// Declaration
var arr1 [2]int
var arr2 [10]int
var arr3 [2][3]int    // 2D array
var arr4 [2]*int      // array of pointers

// Assign values
arr1[0] = 0
arr1[1] = 1
// Assign pointers
v0, v1 := 1, 2
arr4[0] = &v0
arr4[1] = &v1
// Populate a 2D array with nested loops
for i := 0; i < 2; i++ {
    for j := 0; j < 3; j++ {
        arr3[i][j] = i + j
    }
}
// Initialisation
var arr5 = [5]float32{1.0, 2.0, 3.4, 5.6, 7.8}
arr6 := [2]int{0, 1}
// Compiler infers the length from the number of elements
var arr7 = [...]string{"first name", "second name", "third name"}
```

Use the built-in `len(array)` to determine length. Access elements with zero-based indices or iterate with `range`:

```go
for i, v := range array {
    fmt.Printf("Array element[%d] = %v\n", i, v)
}
// range yields the index and the value.
```

Arrays in Go are value types. Assigning them or passing them to functions copies the entire array, so modifications inside a function do not affect the original.

```go
func modifyArray(arr [5]int) {
    for i := 0; i < len(arr); i++ {
        arr[i] = i + 1
    }
    fmt.Println("In modifyArray(), array values:", arr)
}

func main() {
    arr := [5]int{1, 2, 3, 4, 5}

    modifyArray(arr)

    fmt.Println("In main(), array values:", arr)
}
```

Output:

```go
In modifyArray(), array values: [1 2 3 4 5]
In main(), array values: [1 2 3 4 5]
```

Because the function receives a copy, the original array remains unchanged. To modify data in place we turn to slices.

### Slices

A slice looks like a pointer to an array but carries additional metadata. Conceptually it consists of:

- A pointer to the underlying array
- The current length
- The capacity (allocated storage)

Slices add dynamic behaviour to arrays: they let you grow and shrink sequences, and you can pass them around without copying the elements.

#### Creating slices

Create slices from existing arrays—or other slices—or with the built-in `make()` function:

```go
arr := [10]int{1,2,3,4,5,6,7,8,9,10}
slice0 := arr[:5]             // from array
slice1 := make([]int, 5)      // length 5, zeroed
slice2 := make([]int, 5, 10)  // length 5, capacity 10
slice3 := []int{1,2,3,4,5}    // literal
```

Use the `array[first:last]` syntax to carve out ranges:

```go
myslice := arr[:]     // whole array
myslice = arr[:5]     // first five elements
myslice = arr[5:]     // elements from index 5 onward
myslice = arr[2:5]    // indices 2 through 4
myslice = slice2[2:7] // extend within capacity (extra slots fill with zero)
```

#### Growing slices dynamically

Slices support `len()` and `range`, just like arrays, and they add `cap()` to inspect capacity. The `append` function enlarges a slice (reallocating if needed):

```go
func main() {
    mySlice := make([]int, 5, 10)

    fmt.Println("len:", len(mySlice))
    fmt.Println("cap:", cap(mySlice))

    mySlice = append(mySlice, 1, 2, 3)

    mySlice2 := []int{8, 9, 10}
    mySlice = append(mySlice, mySlice2...)
    // The ellipsis expands mySlice2 so append receives individual ints.

    fmt.Println("mySlice:", mySlice)
    // Once capacity is exceeded, Go allocates a larger backing array automatically.
}
```

#### Copying slice contents

```go
slice1 := []int{1,2,3,4,5}
slice2 := []int{5,4,3}

copy(slice2, slice1) // copies the first three elements
copy(slice1, slice2) // copies the three elements back into slice1
```

The built-in `copy()` duplicates elements between slices. It only copies up to the smaller length.

### Maps

A map stores key-value pairs without guaranteed order. Consider this example:

```go
type bookInfo struct {
    ID    string
    Name  string
    Price string
}

func main() {
    bookDB := make(map[string]bookInfo)

    // Insert values
    bookDB["1"] = bookInfo{"1", "Harry Potter", "$20"}
    bookDB["123"] = bookInfo{"123", "Steve Jobs: A Biography", "$12"}

    // Look up a value
    book, ok := bookDB["1234"]

    if ok {
        fmt.Println("Found book:", book.Name, "price:", book.Price)
    } else {
        fmt.Println("Sorry, book not found.")
    }
}
```

This example covers declaration, initialisation, assignment, and lookup.

##### Declaration

The line `bookDB := make(map[string]bookInfo)` creates a map with string keys and `bookInfo` values.

##### Creating

You can reserve capacity during creation—`bookDB = make(map[string]bookInfo, 100)`—or initialise values inline:

```go
bookDB = map[string]bookInfo{
    "1": {ID: "1", Name: "Harry Potter", Price: "$20"},
}
```

##### Deleting entries

Call the built-in `delete(map, key)` to remove a key. `delete(bookDB, "123")` silently does nothing if the key is missing.

##### Looking up entries

Retrieving a key returns two values: the element and a boolean indicating whether it existed.

```go
value, ok := bookDB["123"]
if ok {
    // do something with value
}
```

All sample code for this series lives in the companion [GitHub repository](https://github.com/goelo/LearnGolangTheHardWay/blob/master/src/).
