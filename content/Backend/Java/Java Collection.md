---
title: Java Exception
date: 2025-12-26
tags:
  - Java
  - collection
  - list
  - map
  - set
draft: false
---
Java **Collection Framework**는
👉 *여러 개의 객체를 효율적으로 저장·검색·삭제·순회*하기 위한 **표준 자료구조 라이브러리**입니다.

프론트엔드 개발자로서 JS의 `Array`, `Map`, `Set`을 써봤다면,
Java Collection은 **그 개념을 훨씬 체계적으로 인터페이스 + 구현체로 분리**해 둔 구조라고 보면 이해가 빨라요.

---

## 1️⃣ Collection Framework 전체 구조

```
            Iterable
                ↑
           Collection (interface)
        ┌─────────┼─────────┐
      List       Set       Queue
       │          │          │
   ArrayList   HashSet   PriorityQueue
   LinkedList  TreeSet   ArrayDeque
```

> ⚠️ `Map`은 **Collection을 상속하지 않음** (별도 계층)

```
            Map (interface)
        ┌─────────┼─────────┐
     HashMap   TreeMap   LinkedHashMap
```

---

## 2️⃣ Collection 인터페이스

### 📌 Collection<E>

모든 컬렉션의 **최상위 인터페이스**

공통 기능 제공:

```java
add(E e)
remove(Object o)
size()
isEmpty()
contains(Object o)
iterator()
```

---

## 3️⃣ List 계열 (순서 O, 중복 O)

### ✔ 특징

* **저장 순서 유지**
* **중복 허용**
* 인덱스 접근 가능 (`get(index)`)

### 대표 구현체

| 구현체        | 특징              |
| ---------- | --------------- |
| ArrayList  | 배열 기반, 조회 빠름    |
| LinkedList | 노드 기반, 삽입/삭제 빠름 |
| Vector     | 동기화 지원(거의 안 씀)  |

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("A");
list.get(0); // "A"
```

📌 **언제 쓰나?**

* 데이터 조회가 많을 때 → `ArrayList`
* 중간 삽입/삭제 많을 때 → `LinkedList`

---

## 4️⃣ Set 계열 (순서 X, 중복 X)

### ✔ 특징

* **중복 불가**
* 순서 보장 안 함 (일부 예외)

### 대표 구현체

| 구현체           | 특징                     |
| ------------- | ---------------------- |
| HashSet       | 가장 빠름, 순서 없음           |
| LinkedHashSet | 입력 순서 유지               |
| TreeSet       | 정렬 유지 (Red-Black Tree) |

```java
Set<Integer> set = new HashSet<>();
set.add(1);
set.add(1); // 무시됨
```

📌 **언제 쓰나?**

* 중복 제거
* 존재 여부 체크 (`contains()`)

---

## 5️⃣ Queue / Deque 계열 (FIFO)

### ✔ 특징

* **선입선출(FIFO)** 또는 **양방향**

| 구현체        | 특징        |
| ---------- | --------- |
| Queue      | 단방향       |
| Deque      | 앞/뒤 삽입 가능 |
| ArrayDeque | 가장 많이 사용  |

```java
Queue<Integer> q = new ArrayDeque<>();
q.offer(1);
q.poll(); // 1
```

📌 **언제 쓰나?**

* 작업 큐
* BFS, 스케줄링

---

## 6️⃣ Map 계열 (Key-Value)

### ✔ 특징

* **Key 중복 불가**
* Value는 중복 가능
* Collection을 상속하지 않음

### 대표 구현체

| 구현체           | 특징        |
| ------------- | --------- |
| HashMap       | 가장 많이 사용  |
| LinkedHashMap | 입력 순서 유지  |
| TreeMap       | Key 정렬 유지 |

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 1);
map.get("apple"); // 1
```

📌 **JS와 비교**

```js
// JS
const map = new Map();

// Java
Map<String, Integer> map = new HashMap<>();
```

---

## 7️⃣ Iterator & for-each

```java
for (String s : list) {
    System.out.println(s);
}
```

내부적으로 `Iterator` 사용:

```java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    System.out.println(it.next());
}
```

---

## 8️⃣ 정렬 (Comparable / Comparator)

### ✔ Comparable (자기 자신 기준)

```java
class User implements Comparable<User> {
    int age;
    public int compareTo(User o) {
        return this.age - o.age;
    }
}
```

### ✔ Comparator (외부 기준)

```java
Collections.sort(list, (a, b) -> a.getAge() - b.getAge());
```

---

## 9️⃣ 언제 어떤 컬렉션을 써야 할까?

| 상황             | 추천                |
| -------------- | ----------------- |
| 순서 + 중복 필요     | List              |
| 중복 제거          | Set               |
| 빠른 조회 (key 기반) | Map               |
| FIFO 처리        | Queue             |
| 정렬 필요          | TreeSet / TreeMap |

---

## 🔥 핵심 요약

* **인터페이스 중심 설계** (List, Set, Map)
* **구현체는 상황에 맞게 선택**
* 성능 차이는 **자료구조 차이**
* 실무에선 `ArrayList`, `HashMap`이 80%

---
