---
layout: post
title: Learning Go the Hard Way (Part 1)
date: 2018-01-13 21:35:45
author: Morgan
tags: 
    - Golang
    - Tutorials
catalog: true
---

### Introducing Go

Go (or Golang) is an open-source programming language created at Google in 2007 and released to the public on 10 November 2009. It is still a young language, designed to combine the productivity of a dynamic language such as Python with the performance and safety of a compiled language like C or C++.

<!-- more -->

Demand for Go has climbed steadily in recent years. Modern infrastructure projects—including container runtimes and Kubernetes—are written in Go, and job postings routinely list the language as a highly paid skill. Many well-known Chinese tech companies have adopted Go for backend services; Zhihu rewrote core systems with Go and ByteDance blends Go with Python across its stack. In short, there is no better time to learn it.

If you read Chinese, I recommend Left Ear Hearing the Wind’s article, [“Go, Docker, and the New Wave of Technology”](https://coolshell.cn/articles/18190.html), for a deeper look at the language’s strengths and weaknesses.

### How to approach learning Go

Like any language, Go rewards consistent practice. Theory without hands-on coding rarely sticks, so throughout this “Learning Go the Hard Way” series I’ll distil the fundamentals with concise examples and gradually move into more advanced use cases.

One more reminder: type the code yourself. Copying and pasting prevents the muscle memory that helps you debug and retain knowledge. Let’s get started.

### Installing Go

First, install Go. I’m working on macOS, so the steps below target that platform. Windows and Linux users can follow the official documentation; the process is straightforward.

```go
// Install Homebrew by running:
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
// Update the package manager
$ brew update
// Install Go
$ brew install go
// Confirm the installation
$ go version
go version go1.11.4 darwin/amd64 // seeing a version number means the install succeeded
// Go binaries live here (version number may vary)
$ /usr/local/Cellar/go/1.11.4/bin
// Configure GOPATH
$ mkdir ~/go
$ vim ~/.bash_profile
// Add this line at the end of the file
export GOPATH=/Users/$USER/go
```

With Go installed, let’s compile a quick program to make sure everything works.

### Your first Go program

Create a new file named `hello.go` in your `src` directory and enter:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}
```

Test it from the terminal in one of two ways:

1. Run `go run hello.go` and you should see “Hello, world!” printed immediately.
2. Run `go build hello.go`, which produces a `hello` binary, then execute `./hello` to print “Hello, world!”.

Both methods compile the code. The first handles compilation and execution in a single step. The second splits compilation from execution so you can keep the binary around.

### Choosing an editor

Pick any IDE or editor you’re comfortable with. GoLand, VS Code, Vim, and even Sublime Text all have excellent Go tooling. I primarily use GoLand—after completing the installation above it recognises the toolchain without extra configuration.

### Understanding the program structure

We’ve already written a tiny program, so let’s review its structure:

* `package main` declares that this file belongs to the `main` package. Every executable Go program needs a `main` package.
* `import "fmt"` pulls in Go’s standard formatting package, which provides convenience functions for printing.
* `func main()` is the entry point. Execution starts there. One important rule: opening braces `{` must sit on the same line as the function declaration—placing them on a new line will cause a compilation error.

### Exercise

Explore the difference between `fmt.Print`, `fmt.Printf`, and `fmt.Println`. Try them in the sample program and note how each handles spacing and newlines.
