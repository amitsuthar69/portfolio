---
title: " Write you own LRU cache cause stdlib don't have any."
subtitle: ""
date: "2025-03-02"
tags: ["golang", "lru", "cache"]
---

[lrucache](https://github.com/amitsuthar69/libs/blob/master/lrucache/lrucache.go) is an efficient Least Recently Used (LRU) cache implementation with generics support, thread safety, and O(1) time complexity for operations.

### Data Structures:

1. Hash Map (map[K]\*list.Element)

- O(1) key lookups
- Stores pointers to linked list elements

2. Doubly Linked List (container/list)

- Maintains access order (MRU at front, LRU at back)
- O(1) insertions/moves/deletions

### Eviction Policy:

When capacity is exceeded:

- Remove last element from linked list (LRU)
- Delete corresponding entry from hash map
- Insert new item at list front (MRU)

---

![internal-structure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/efah7t1ota2tlpbgyrvn.png)

---

**Install the package:**

```bash
go get github.com/amitsuthar69/libs/lrucache
```

---

**Source code:**

```go
// lrucache is an in-memory key-value cache
package lrucache

import (
	"container/list"
	"sync"
)

// A CacheItem represents a cached item with its key and value.
type CacheItem[K comparable, V any] struct {
	key   K
	value V
}

// LRUCache is an in-memory cache for key to value mappings.
//
// It uses a hash map with a doubly linked list for LRU eviction.
type LRUCache[K comparable, V any] struct {
	// a read-write mutex
	cacheLock *sync.RWMutex

	// a map of string to linked list element
	cache map[K]*list.Element

	// doubly linked list to implmenent LRU
	lruList *list.List

	// max cache size
	capacity int
}

// NewLRUMap creates a new LRUCache with the specified capacity.
func NewLRUCache[K comparable, V any](capacity int) *LRUCache[K, V] {
	return &LRUCache[K, V]{
		cacheLock: &sync.RWMutex{},
		cache:     make(map[K]*list.Element),
		lruList:   list.New(),
		capacity:  capacity,
	}
}

// Get returns the corresponding value for the given key.
//
// If the value exists, it moves the node to the front of the LRU list.
func (c *LRUCache[K, V]) Get(key K) (V, bool) {
	c.cacheLock.RLock()
	defer c.cacheLock.RUnlock()

	if val, exists := c.cache[key]; exists {
		c.lruList.MoveToFront(val)
		item := val.Value.(*CacheItem[K, V])
		return item.value, true
	}

	var zero V
	return zero, false
}

// Set adds or updates a key-value pair in the cache.
//
// If the cache is full, it evicts the (LRU) least recently used item.
func (c *LRUCache[K, V]) Set(key K, value V) {
	c.cacheLock.Lock()
	defer c.cacheLock.Unlock()

	// If value already exists, move it to front and update the value
	if val, exists := c.cache[key]; exists {
		c.lruList.MoveToFront(val)
		item := val.Value.(*CacheItem[K, V])
		item.value = value
		return
	}

	// If lru list is full, remove the last item (least recently used) from the list
	if c.lruList.Len() >= c.capacity {
		toEvict := c.lruList.Back()
		if toEvict != nil {
			delete(c.cache, toEvict.Value.(*CacheItem[K, V]).key)
			c.lruList.Remove(toEvict)
		}
	}

	// push the newly added item in front
	c.cache[key] = c.lruList.PushFront(&CacheItem[K, V]{key, value})
}

// Delete removes the item from cache.
func (c *LRUCache[K, V]) Delete(key K) {
	c.cacheLock.Lock()
	defer c.cacheLock.Unlock()

	if val, exists := c.cache[key]; exists {
		delete(c.cache, key)
		c.lruList.Remove(val)
	}
}

// Contains checks if key exists in the cache.
func (c *LRUCache[K, V]) Contains(key K) bool {
	_, exists := c.cache[key]
	return exists
}

// Returns the current number fo items in cache.
func (c *LRUCache[K, V]) Len() int {
	return c.lruList.Len()
}
```

---

**Usage:**

```go
package main

import (
	"fmt"

	"github.com/amitsuthar69/libs/lrucache"
)

func LRU() {
	lc := lrucache.NewLRUCache[any, any](3)
	lc.Set("name", "amit")
	lc.Set("age", 20)
	lc.Set("height", 6)

	fmt.Println(lc.Get("name"))   // amit, true
	fmt.Println(lc.Get("age"))    // 20, true
	fmt.Println(lc.Get("height")) // 6, true

	fmt.Println("name", lc.Contains("name"))     // true
	fmt.Println("age", lc.Contains("age"))       // true
	fmt.Println("height", lc.Contains("height")) // true

	fmt.Println(lc.Len()) // 3

	lc.Set("package", 11)

	fmt.Println("name", lc.Contains("name"))       // false
	fmt.Println("age", lc.Contains("age"))         // true
	fmt.Println("height", lc.Contains("height"))   // true
	fmt.Println("package", lc.Contains("package")) // true
}

func main() {
	LRU()
}
```
