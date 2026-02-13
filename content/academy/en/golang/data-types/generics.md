---
title: 'Generics in Go'
description: 'Introduction to Generics in Go 1.18+: type parameters, constraints, and examples.'
category: 'Golang'
date: '2026-02-02'
---

**Generic Programming (Generics)** in Go allows creating functions and types that work with any data types. Generics were introduced in Go 1.18.

## Why Generics?

Generics allow writing universal code, avoiding function duplication for different types and loss of type safety when using the empty interface `interface{}`.

## Core Concepts

1. **Type Parameters**: Specified in square brackets `[]`.
2. **Constraints**: `any`, `comparable`, or interfaces.

### Function Example

```go
func Min[T any](a, b T) T {
    // Note: for comparison < constraints.Ordered is needed, not any
    // But for structural examples, any demonstrates the syntax
    return a
}
```

Correct example with constraints:

```go
import "golang.org/x/exp/constraints"

func Min[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}
```

### Generic Types

```go
type Pair[T any] struct {
    First  T
    Second T
}
```

### Type Constraints

Go provides the `constraints` package (in `golang.org/x/exp/constraints` or built-in in newer versions).

- `constraints.Ordered`: Numbers and strings.
- `constraints.Integer`: Integers.

Custom constraints:

```go
type Addable interface {
    int | float64
}
```

## Benefits

1. **Code Reuse**.
2. **Type Safety** (unlike `interface{}`).
3. **Performance** (monomorphization by the compiler).

## Conclusion

Generics make Go more flexible, allowing the writing of universal algorithms and data structures.
