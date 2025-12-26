---
title: Java Exception
date: 2025-12-26
tags:
  - Java
  - stream
  - list
  - map
draft: false
---
Java **Stream API**는 **컬렉션(배열, List, Set, Map 등)의 데이터를 선언적(함수형) 방식으로 처리**하기 위한 API입니다.
Java 8부터 도입되었고, **데이터를 “어떻게 저장할지”가 아니라 “무엇을 할지”에 집중**하게 해줍니다.

---

## 1️⃣ Stream API 핵심 개념

### ✔ Stream이란?

* **데이터의 흐름**
* 컬렉션 자체가 아니라, **컬렉션으로부터 생성된 처리 파이프라인**
* **원본 데이터를 변경하지 않음 (Immutable)**

```java
list.stream()
    .filter(...)
    .map(...)
    .forEach(...);
```

---

## 2️⃣ Stream API의 특징

| 특징              | 설명                    |
| --------------- | --------------------- |
| 선언형 프로그래밍       | 반복문 대신 “의도”를 표현       |
| 내부 반복           | for문 대신 Stream이 반복 처리 |
| Lazy Evaluation | 최종 연산 전까지 실행되지 않음     |
| 불변성             | 원본 데이터 변경 ❌           |
| 병렬 처리 가능        | `.parallelStream()`   |

---

## 3️⃣ Stream 처리 흐름 (중요 ⭐)

```
데이터 소스 → 중간 연산 → 최종 연산
```

### 🔹 1. Stream 생성

* `stream()`
* `Arrays.stream()`
* `Stream.of()`

### 🔹 2. 중간 연산 (Intermediate Operation)

* Stream을 반환 (체이닝 가능)
* 실행 ❌ (지연 실행)

### 🔹 3. 최종 연산 (Terminal Operation)

* 결과를 반환하거나 소비
* 이 시점에 **모든 연산 실행**

---

## 4️⃣ 주요 중간 연산

| 메서드             | 설명            |
| --------------- | ------------- |
| `filter`        | 조건에 맞는 요소만 추출 |
| `map`           | 요소 변환         |
| `flatMap`       | 중첩 구조 평탄화     |
| `sorted`        | 정렬            |
| `distinct`      | 중복 제거         |
| `limit`, `skip` | 개수 제한         |

---

## 5️⃣ 주요 최종 연산

| 메서드                    | 설명       |
| ---------------------- | -------- |
| `forEach`              | 요소 소비    |
| `collect`              | 컬렉션으로 변환 |
| `count`                | 개수       |
| `reduce`               | 누적 계산    |
| `anyMatch`, `allMatch` | 조건 검사    |
| `findFirst`            | 첫 요소     |

---

## 6️⃣ 기본 예제

### 📌 for문 vs Stream

#### 🔸 기존 방식

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5);

for (int n : numbers) {
    if (n % 2 == 0) {
        System.out.println(n * 2);
    }
}
```

#### 🔸 Stream 방식

```java
numbers.stream()
       .filter(n -> n % 2 == 0)
       .map(n -> n * 2)
       .forEach(System.out.println);
```

---

## 7️⃣ collect 예제 (가장 많이 사용됨)

### ✔ List로 수집

```java
List<Integer> result =
    numbers.stream()
           .filter(n -> n > 3)
           .collect(Collectors.toList());
```

---

## 8️⃣ map / flatMap 차이

### 🔹 map

```java
List<String> names = List.of("java", "spring");

List<Integer> lengths =
    names.stream()
         .map(String::length)
         .collect(Collectors.toList());
```

### 🔹 flatMap

```java
List<List<String>> list = List.of(
    List.of("a", "b"),
    List.of("c", "d")
);

List<String> result =
    list.stream()
        .flatMap(Collection::stream)
        .collect(Collectors.toList());
```

👉 결과: `["a", "b", "c", "d"]`

---

## 9️⃣ reduce 예제

### ✔ 합계 구하기

```java
int sum =
    numbers.stream()
           .reduce(0, Integer::sum);
```

---

## 🔟 Optional과 함께 사용

```java
Optional<Integer> first =
    numbers.stream()
           .filter(n -> n > 10)
           .findFirst();

first.ifPresent(System.out::println);
```

---

## 1️⃣1️⃣ 병렬 스트림

```java
numbers.parallelStream()
       .map(n -> n * 2)
       .forEach(System.out::println);
```

⚠️ 주의

* 순서 보장 ❌
* 작은 데이터에서는 오히려 느릴 수 있음

---

## 1️⃣2️⃣ 언제 Stream을 쓰면 좋을까?

✅ 데이터 변환/필터링/집계
✅ 가독성이 중요한 경우
❌ 단순 반복 + 성능 최우선
❌ 복잡한 예외 처리 필요할 때

---

## 🔚 한 줄 요약

> **Stream API = 컬렉션 데이터를 함수형 스타일로, 읽기 쉽게 처리하는 도구**

---


## 실무에서 **DTO가 아직 없거나**, **프론트로 바로 내려줄 데이터**를 만들 때

`List<Map<String, String>>` 형태로 Stream을 사용하는 경우가 꽤 많습니다.

아래 예제는 **“DB 조회 결과 → 가공 → List<Map<String, String>> 반환”** 패턴을 기준으로 설명할게요.

---

## 1️⃣ 기본 시나리오 (실무에서 자주 보는 형태)

### 📌 요구사항

* 사용자 목록이 있음
* 활성화된 사용자만 필터링
* 프론트에 내려줄 형태로 가공
* 결과 타입: `List<Map<String, String>>`

---

## 2️⃣ 예제용 User 클래스 (엔티티 or DTO)

```java
class User {
    private Long id;
    private String name;
    private int age;
    private boolean active;

    // 생성자, getter 생략
}
```

---

## 3️⃣ Stream으로 List<Map<String, String>> 만들기

### ✅ 핵심 예제

```java
List<User> users = List.of(
    new User(1L, "Alice", 25, true),
    new User(2L, "Bob", 30, false),
    new User(3L, "Charlie", 28, true)
);

List<Map<String, String>> result =
    users.stream()
         .filter(User::isActive) // 활성 사용자만
         .map(user -> {
             Map<String, String> map = new HashMap<>();
             map.put("id", String.valueOf(user.getId()));
             map.put("name", user.getName());
             map.put("age", String.valueOf(user.getAge()));
             return map;
         })
         .collect(Collectors.toList());
```

📌 **반환 결과**

```json
[
  { "id": "1", "name": "Alice", "age": "25" },
  { "id": "3", "name": "Charlie", "age": "28" }
]
```

---

## 4️⃣ Map.of()를 활용한 간결한 버전 (Java 9+)

```java
List<Map<String, String>> result =
    users.stream()
         .filter(User::isActive)
         .map(user -> Map.of(
             "id", String.valueOf(user.getId()),
             "name", user.getName(),
             "age", String.valueOf(user.getAge())
         ))
         .collect(Collectors.toList());
```

### ⚠️ 주의

* `Map.of()`는 **불변 Map**
* `null` 값 허용 ❌
* key/value 개수 제한 (10개)

---

## 5️⃣ 실무 패턴 ①: Enum으로 Key 관리

### 📌 하드코딩 방지 (추천 ⭐)

```java
enum UserField {
    ID("id"),
    NAME("name"),
    AGE("age");

    private final String key;
    UserField(String key) { this.key = key; }
    public String key() { return key; }
}
```

```java
.map(user -> {
    Map<String, String> map = new HashMap<>();
    map.put(UserField.ID.key(), String.valueOf(user.getId()));
    map.put(UserField.NAME.key(), user.getName());
    map.put(UserField.AGE.key(), String.valueOf(user.getAge()));
    return map;
})
```

---

## 6️⃣ 실무 패턴 ②: 조건에 따라 필드 다르게 내려주기

```java
.map(user -> {
    Map<String, String> map = new HashMap<>();
    map.put("id", user.getId().toString());
    map.put("name", user.getName());

    if (user.getAge() >= 30) {
        map.put("group", "SENIOR");
    } else {
        map.put("group", "JUNIOR");
    }

    return map;
})
```

---

## 7️⃣ 실무 패턴 ③: 정렬 + 가공 + 수집

```java
List<Map<String, String>> result =
    users.stream()
         .filter(User::isActive)
         .sorted(Comparator.comparing(User::getAge).reversed())
         .map(user -> Map.of(
             "name", user.getName(),
             "age", String.valueOf(user.getAge())
         ))
         .collect(Collectors.toList());
```

---

## 8️⃣ 실무에서 주의할 점 ⚠️

### ❌ 남용 케이스

* 필드가 많아질 때
* 구조가 자주 바뀔 때
* 타입 안정성이 중요한 경우

👉 이럴 땐 **DTO 권장**

---

## 9️⃣ 실무 기준 추천 전략

| 상황      | 추천                          |
| ------- | --------------------------- |
| 간단한 응답  | `List<Map<String, String>>` |
| 복잡한 구조  | DTO                         |
| 임시 API  | Map                         |
| 장기 유지보수 | DTO + Stream                |

---

## 🔚 한 줄 요약

> **Stream + Map은 “빠르게 응답 형태를 만들 때” 강력하지만, 장기적으로는 DTO가 더 안전**

