---
title: useState와 useRef
date: 2026-02-19
tags:
  - Frontend
  - react
  - useState
  - useRef
draft: false
---

React에서 `useState`와 `useRef`는 **값을 저장한다**는 공통점이 있지만,
**렌더링에 영향을 주느냐**가 가장 큰 차이입니다.

---

## ✅ `useState`

### 📌 특징

* 상태(state)를 관리하는 Hook
* 값이 변경되면 **컴포넌트가 리렌더링됨**
* UI에 영향을 주는 데이터 관리에 사용
* 비동기적으로 동작 (배치 업데이트 가능)

### 기본 예시

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </>
  );
}
```

### 🔥 핵심 포인트

* `setCount()` 호출 → 리렌더링 발생
* 이전 값 기반 업데이트는 함수형 업데이트 권장

```js
setCount(prev => prev + 1);
```

---

## ✅ `useRef`

### 📌 특징

* `.current` 속성을 가진 객체 반환
* 값이 변경되어도 **리렌더링되지 않음**
* DOM 직접 접근 가능
* 렌더 간 값 유지 가능 (mutable 저장소)

### 기본 예시 (DOM 접근)

```jsx
import { useRef } from "react";

function InputFocus() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>포커스</button>
    </>
  );
}
```

### 값 저장 용도 예시

```jsx
const countRef = useRef(0);

countRef.current += 1; // 리렌더링 안됨
```

---

# 🎯 핵심 차이점 정리

| 구분          | useState    | useRef         |
| ----------- | ----------- | -------------- |
| 값 변경 시 리렌더링 | ✅ 발생        | ❌ 발생 안함        |
| UI 반영 목적    | O           | X              |
| DOM 접근      | X           | O              |
| 값 유지 (렌더 간) | O           | O              |
| 변경 방식       | setState 사용 | .current 직접 변경 |

---

# 💡 언제 무엇을 써야 할까?

### ✅ useState를 써야 하는 경우

* 화면에 표시되는 값
* 조건부 렌더링에 쓰이는 값
* 사용자 인터랙션으로 바뀌는 UI 상태

예:

* 모달 열림 여부
* 폼 입력값
* 토글 상태

---

### ✅ useRef를 써야 하는 경우

* DOM 조작
* 이전 값 저장
* 타이머 ID 저장
* 렌더와 상관없는 값 캐싱

예:

* `setTimeout` ID 저장
* 이전 props 비교
* 스크롤 위치 저장

---

# 🚨 실무에서 자주 하는 실수

### ❌ UI 값인데 useRef 사용

```js
const countRef = useRef(0);
countRef.current++;
// 화면 안 바뀜
```

→ UI에 반영해야 한다면 `useState` 사용해야 함

---

# 🧠 한 줄 요약

> 🔵 useState = “렌더링을 유발하는 상태”
> 🟢 useRef = “렌더링과 무관한 저장소”

---