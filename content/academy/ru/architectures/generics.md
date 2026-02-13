---
title: 'TypeScript Generics'
description: 'A guide to using generics in TypeScript.'
category: 'TypeScript'
date: '2025-01-28'
---

# TypeScript Generics

Generics allow you to create reusable components.

## Basic Syntax

```ts
function identity<T>(arg: T): T {
  return arg;
}
```

## Generic Classes

```ts
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}
```
