---
layout: post
title: Parsing Command-Line Arguments in Python
subtitle: "Make the most of the standard library"
date: 2018-06-25 22:28:25
author: "Morgan"
header-img: "img/post-bg-2015.jpg"
tags: 
    - python
    - Backend
---

### Overview

A recent project needed a simple way to tweak runtime options via the command line. Python’s standard library ships with exactly what we need: the `argparse` module. Here’s a quick tour.

<!-- more -->

From the official docs:

> The `argparse` module makes it easy to write user-friendly command-line interfaces. The program defines what arguments it requires, and `argparse` will figure out how to parse those out of `sys.argv`. The module automatically generates help and usage messages and raises errors when users provide invalid arguments.

In short, `argparse` handles positional and optional parameters, builds `--help` output, and validates user input for free.

The key APIs you’ll use most often:

```python
parser = argparse.ArgumentParser()  # create a parser
parser.add_argument()               # register command-line arguments
parser.parse_args()                 # parse argv
```

### Creating a parser

```python
argparse.ArgumentParser(
    prog=None, usage=None, description=None, epilog=None,
    parents=[], formatter_class=argparse.HelpFormatter,
    prefix_chars='-', fromfile_prefix_chars=None,
    argument_default=None, conflict_handler='error',
    add_help=True, allow_abbrev=True)
```

Don’t worry about every parameter—`description` is the one you’ll touch most frequently. It populates the text shown in the auto-generated help message.

### Adding arguments

```python
ArgumentParser.add_argument(
    name_or_flags, *, action=None, nargs=None, const=None,
    default=None, type=None, choices=None, required=None,
    help=None, metavar=None, dest=None)
```

Again, only a subset matters for day-to-day scripts:

- `name_or_flags` – required. Use positional names (`'file'`) or option flags (`--verbose`).
- `action` – controls how the parsed value is stored.
- `nargs` – how many values to consume after the flag.
- `const` – store a constant value (e.g., with `store_const` or optional arguments that default to a specific value when omitted).
- `default` – fallback value for optional arguments.
- `type` – convert the input to a specific type (int, float, custom callable).
- `choices` – restrict valid inputs to a fixed set.
- `required` – mark optional flags as mandatory.
- `help` – description displayed in `--help` output.
- `metavar` – label shown in usage text.
- `dest` – name of the attribute on the resulting namespace.

### Parsing arguments

```python
ArgumentParser.parse_args(args=None, namespace=None)
```

- `args` defaults to `sys.argv` when left as `None`.
- `namespace` lets you supply an existing object for storing results.

### Worked example

```python
import argparse

parser = argparse.ArgumentParser(description='Introduce how to use argparse')
parser.add_argument(
    'integers',
    metavar='number',
    type=int,
    nargs='+',
    help='one or more integers to accumulate')
parser.add_argument(
    '--test-para',
    required=False,
    default='this is just a test',
    help='add a short instruction here')
args = parser.parse_args()
print(args)
```

Running `python3 intro_parse.py -h` prints:

```
usage: intro_parse.py [-h] [--test-para TEST_PARA] number [number ...]

Introduce how to use argparse

positional arguments:
  number                one or more integers to accumulate

optional arguments:
  -h, --help            show this help message and exit
  --test-para TEST_PARA add a short instruction here
```

Omitting `--test-para` falls back to the default value automatically.

`argparse` can do far more—subcommands, custom actions, mutually exclusive groups, configuration files, and more. The best way to learn is to experiment alongside the documentation.

Thanks for reading! If you enjoy these bite-sized notes, stick around—more Python tips coming soon.
