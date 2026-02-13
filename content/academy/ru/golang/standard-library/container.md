---
title: 'Пакет container'
description: 'Структуры данных в стандартной библиотеке: list, heap, ring.'
category: 'Golang'
date: '2026-02-02'
---

Пакет `container` предоставляет реализации некоторых общих структур данных.

## `container/list`

Реализует двусвязный список.

```go
import "container/list"

l := list.New()
l.PushBack(1)
l.PushFront("first")

for e := l.Front(); e != nil; e = e.Next() {
    fmt.Println(e.Value)
}
```

- `PushBack`, `PushFront`: O(1)
- `Remove`: O(1) (если есть ссылка на элемент)

## `container/heap`

Реализует кучу (приоритетную очередь) поверх любого типа, реализующего интерфейс `heap.Interface`.
Куча обычно используется для быстрого нахождения минимума (или максимума).

Для использования нужно определить тип и реализовать для него методы `sort.Interface` (`Len`, `Less`, `Swap`) плюс методы `Push` и `Pop`.

```go
heap.Init(&h)
heap.Push(&h, 3)
min := heap.Pop(&h)
```

## `container/ring`

Реализует кольцевой буфер (циклический список).

```go
import "container/ring"

r := ring.New(5) // Кольцо из 5 элементов
r.Value = 1
r = r.Next()
```

В отличие от `list`, кольцо имеет фиксированный размер (но его можно менять методами Link/Unlink), и у него нет явного начала или конца.
