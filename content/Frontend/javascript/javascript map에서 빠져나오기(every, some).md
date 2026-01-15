---
title: javascript map에서 빠져나오기(every, some)
date: 2025-11-16
tags:
  - Frontend
  - javascript
  - every
  - some
draft: false
---

`Array.prototype.some()`과 `Array.prototype.every()`는 **배열 요소를 순회하면서 조건을 검사**하는 데 사용되는 JavaScript의 대표적인 고차 함수입니다.
둘은 **"조건을 만족하는지 여부"를 판별한다는 공통점**이 있지만, **검사 방식과 결과가 반대**입니다.

---

## 🧩 1. `some()`

> 배열의 **하나라도** 조건을 만족하면 `true`를 반환합니다.

### 📘 문법

```js
arr.some(callback(element, index, array))
```

* **callback**: 각 요소마다 실행되는 함수
* **element**: 현재 요소
* **index**: 현재 인덱스
* **array**: 원본 배열

### 📗 동작 예시

```js
const numbers = [1, 2, 3, 4, 5];

const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true (짝수가 존재함)

const greaterThan10 = numbers.some(num => num > 10);
console.log(greaterThan10); // false (10보다 큰 값 없음)
```

✅ **요약**

* 조건을 만족하는 **요소가 하나라도 있으면** `true`
* 없으면 `false`
* 조건을 만족하는 순간 순회를 **즉시 중단** (효율적)

---

## 🧩 2. `every()`

> 배열의 **모든 요소가** 조건을 만족해야 `true`를 반환합니다.

### 📘 문법

```js
arr.every(callback(element, index, array))
```

### 📗 동작 예시

```js
const numbers = [2, 4, 6, 8];

const allEven = numbers.every(num => num % 2 === 0);
console.log(allEven); // true (모두 짝수)

const allLessThan10 = numbers.every(num => num < 10);
console.log(allLessThan10); // true

const allGreaterThan5 = numbers.every(num => num > 5);
console.log(allGreaterThan5); // false (2, 4는 조건 불만족)
```

✅ **요약**

* **모든 요소가 조건을 만족해야** `true`
* 하나라도 조건을 만족하지 않으면 `false`
* 조건 불만족 시 순회를 **즉시 중단**

---

## 🔍 비교 정리표

| 구분               | some()             | every()       |
| ---------------- | ------------------ | ------------- |
| 반환값              | boolean            | boolean       |
| 조건               | 하나라도 만족            | 전부 만족         |
| 첫 번째 조건 만족/불만족 시 | 순회 중단              | 순회 중단         |
| 빈 배열의 결과         | `false`            | `true`        |
| 사용 예             | 유효한 값이 하나라도 있는지 검사 | 모든 값이 유효한지 검사 |

---

## 💡 실전 예제

```js
const users = [
  { name: "Kim", active: true },
  { name: "Lee", active: false },
  { name: "Park", active: true },
];

// 1️⃣ 하나라도 비활성화된 유저가 있는지
const hasInactive = users.some(user => !user.active);
console.log(hasInactive); // true

// 2️⃣ 모든 유저가 활성화 상태인지
const allActive = users.every(user => user.active);
console.log(allActive); // false
```

---
