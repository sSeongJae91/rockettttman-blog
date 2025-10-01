# 1) **메모이제이션(Memoization)** — 핵심 개념

메모이제이션은 **함수 호출 결과를 입력(인자)에 따라 캐시**해서, 같은 입력에 대해선 계산을 다시 하지 않고 저장된 결과를 반환하는 기법입니다.

* 조건: 함수가 **순수 함수(pure)** 여야 효과적 — 같은 입력에 대해 항상 같은 출력.
* 장점: 반복 계산(특히 비용 큰 계산) 회피 → 성능 향상.
* 단점/주의: 캐시 비용(메모리), 인자를 키로 만드는 비용(예: 객체 직렬화), 부수효과 있는 함수엔 사용 불가.

간단한 JS 예시 (순수 함수 + 인자 문자열화 방식 — 단점도 주석으로 표기):

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args); // 단순하지만 복잡한 객체/순환 참조엔 부적합
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const slowAdd = (a, b) => { /* 무거운 연산 */ return a + b; };
const fastAdd = memoize(slowAdd);
```

---

# 2) **React에서의 메모이제이션: useMemo, useCallback, React.useMemo**

먼저 짧게 요약:

* `useMemo(() => value, deps)` : **값(value)** 을 메모(캐시) — 무거운 계산 결과나 객체/배열의 안정적(identity) 생성을 위해 사용.
* `useCallback(fn, deps)` : **함수(fn)** 의 참조(identity)를 메모 — 자식 컴포넌트에 전달하는 함수 등에서 재생성을 막기 위해 사용.
* `React.useMemo` vs `useMemo` : 둘은 **같은 함수**입니다. `import { useMemo } from 'react'` 로 가져오면 `useMemo`를 쓰고, `import React from 'react'` 후 `React.useMemo` 로 접근하는 것의 차이만 있습니다(동일한 동작).

핵심 차이(요약 표)

```
useMemo     -> 값(value)을 메모. 계산 비용 절감, 객체/배열의 stable identity 생성.
useCallback -> 함수의 identity를 메모. 자식 컴포넌트 re-render 방지나 effect deps 용.
React.useMemo == useMemo (단지 import/참조 방식의 차이)
```

---

# 3) **정확한 동작 & 주의사항**

* `useMemo`/`useCallback`은 **성능 힌트**입니다. React는 내부적으로 메모된 값을 버릴 수 있으므로(특히 concurrent 모드에서) **정확성(behavior)을 보장하기 위한 수단으로 사용하면 안 됩니다**. 오직 성능 최적화용으로 사용하세요.
* 둘 다 **의존성 배열(deps)** 에 따라 재계산됩니다. deps가 바뀌면 새 값을 만듭니다.
* 의존성 관리는 중요(ESLint의 `react-hooks/exhaustive-deps` 권장). **빠르게 “빈 deps 배열로 때우기”는 종종 stale closure(오래된 변수 캡처)** 버그를 만듭니다.
* `useCallback(fn, deps)`는 내부적으로 `useMemo(() => fn, deps)`와 **동일한 의미**입니다. (즉, useMemo 와 useCallback은 반환 타입만 다르다고 생각하면 됨)
* **과유불급**: 모든 함수/객체에 적용하면 오히려 비용(메모·복잡성)이 커집니다. 먼저 프로파일링하고 병목일 때만 적용.

---

# 4) **코드 예제와 실전 패턴**

### 1) `useMemo`로 무거운 계산 캐시

```jsx
import React, { useState, useMemo } from 'react';

function heavyCompute(n) {
  // 예시용 무거운 루프
  let s = 0;
  for (let i = 0; i < 5e7; i++) s += (i % (n + 1));
  return s;
}

function Comp({ n }) {
  const result = useMemo(() => {
    console.log('heavyCompute 실행');
    return heavyCompute(n);
  }, [n]);

  return <div>Result: {result}</div>;
}
```

* `n`이 바뀔 때만 계산 수행. 콘솔로 재계산 여부 확인 가능.

### 2) `useCallback`으로 자식 re-render 방지

```jsx
import React, { useState, useCallback } from 'react';

const Child = React.memo(({ onClick }) => {
  console.log('Child 렌더');
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // 안정적인 함수(identity 유지) — 자식이 불필요하게 다시 렌더링 안함
  const handleClick = useCallback(() => {
    setCount(c => c + 1); // functional update로 count 의존성 제거 가능
  }, []); // 빈 deps: handleClick은 항상 같은 참조

  return (
    <div>
      <div>count: {count}</div>
      <Child onClick={handleClick} />
    </div>
  );
}
```

* 만약 `handleClick`을 매 렌더마다 새로 만들면 `Child`는 prop이 바뀌었다고 판단해 다시 렌더됩니다.

### 3) 객체/배열의 identity 고정

```jsx
function Parent({ a, b }) {
  // 객체를 매번 새로 만들면 React.memo된 Child가 항상 다시 렌더된다
  const stableObj = useMemo(() => ({ a, b }), [a, b]);

  return <Child data={stableObj} />;
}
```

---

# 5) **React.memo(컴포넌트 메모)과의 차이**

* `React.memo(Component)` : **컴포넌트 자체의 렌더 결과를 메모**(shallow props 비교).
  예: `const Child = React.memo(({x}) => ...)` — `x`가 동일(얕은 비교)하면 렌더 스킵.
* `useMemo`/`useCallback` : **컴포넌트 내부에서 값/함수의 재생성**을 제어.
* 결론: **함수(identity)나 객체(identity)를 안정화(useMemo/useCallback)** → `React.memo`가 제대로 동작하게 함.

---

# 6) **실무에서의 권장 사용 가이드(체크리스트)**

1. **먼저 측정하라** — 성능 문제가 확실할 때만 최적화.
2. **무거운 계산**이면 `useMemo`로 캐시.
3. **자식을 불필요히 랜더링시키는 콜백/객체**면 `useCallback` / `useMemo`로 identity 고정 + `React.memo` 이용.
4. **의존성 정확히 관리**: ESLint 훅 규칙을 따르고, 필요한 deps는 모두 넣기.
5. **stale closure 주의**: 상태를 읽는 콜백에 상태 변수를 직접 참조하면 deps에 포함하거나 functional update(setState(prev=>...))를 사용.
6. **과도한 사용 금지**: 많은 useMemo/useCallback은 코드 복잡성만 높이고 이득이 거의 없음.
7. **대체로 useRef**로 재렌더링 없이 값 보관 가능 — 경우에 따라 더 적합.

---

# 7) **간단 요약 — 언제 뭘 쓸까?**

* `useMemo`: 값(특히 무거운 계산 결과, 또는 객체/배열의 stable identity)이 필요할 때.
* `useCallback`: 자식에 전달되는 함수의 identity를 고정해야 할 때(또는 effect 의존성으로 함수를 넣어야 할 때).
* `React.useMemo` === `useMemo` : 사용 방식(임포트 스타일) 차이일 뿐 동일.
* `React.memo`: 컴포넌트 레벨에서 props 얕은 비교로 렌더 스킵.

---

필요하면 예제 프로젝트(간단한 부모→자식 퍼포먼스 데모) 코드나, **자주 하는 실수(의존성 빈배열로 인한 stale state 등)** 를 중심으로 더 깊게 설명/디버깅 해드릴게요 — 어떤 예제가 더 좋을까요? 😄
