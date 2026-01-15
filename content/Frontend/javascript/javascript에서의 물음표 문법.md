---
title: javascript map에서 빠져나오기(every, some)
date: 2025-11-16
tags:
  - Frontend
  - javascript
  - optional chaining
  - nullish coalescing operator
draft: false
---
JavaScript에서 `?`가 들어가는 대표적인 두 문법은 **Optional Chaining**과 **Nullish Coalescing Operator**야. 둘 다 *에러 방지 + 가독성 향상*이 목적입니다.

---

## 1️⃣ Optional Chaining (`?.`)

👉 **값이 `null` 또는 `undefined`일 때 에러 없이 접근을 멈춤**

### ❌ 기존 방식

```js
const user = null;
console.log(user.profile.name); // ❌ TypeError
```

### ✅ Optional Chaining

```js
console.log(user?.profile?.name); // undefined
```

### 특징

* 중간 객체가 `null / undefined`면 즉시 `undefined` 반환
* 함수 호출, 배열 접근에도 가능

```js
user?.getName?.();
arr?.[0];
```

---

## 2️⃣ Nullish Coalescing Operator (`??`)

👉 **값이 `null` 또는 `undefined`일 때만 기본값 사용**

### ❌ OR 연산자 (`||`) 문제

```js
const count = 0;
console.log(count || 10); // 10 ❌ (0은 falsy)
```

### ✅ Nullish Coalescing

```js
console.log(count ?? 10); // 0 ✅
```

### 동작 기준

| 값 | `||` | `??` |
|---|---|---|
| `null` | 대체 | 대체 |
| `undefined` | 대체 | 대체 |
| `0` | 대체 ❌ | 유지 |
| `''` | 대체 ❌ | 유지 |
| `false` | 대체 ❌ | 유지 |

---

## 3️⃣ 같이 쓰는 패턴 (실무에서 자주 사용)

```js
const userName = user?.profile?.name ?? "게스트";
```

👉 의미

* `user` 또는 `profile`이 없으면 에러 없이
* `name`이 없을 때만 `"게스트"` 사용

---

## 한 줄 요약

* **`?.`** → *있으면 접근, 없으면 undefined*
* **`??`** → *null/undefined일 때만 기본값*
