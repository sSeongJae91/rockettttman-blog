좋습니다 — 핵심 개념부터 React에서의 구체적 사용법·동작 원리·실전 팁·실패 사례까지 한 번에 정리해드릴게요. 최대한 실무에서 바로 쓰기 좋게 예제도 포함합니다.

# 메모이제이션(Memoization) — 개념 요약

* **정의**: 함수의 결과를 입력(인자)에 따라 캐시해 두고, 같은 입력이면 계산을 다시 하지 않고 캐시된 결과를 반환하는 기법.
* **전제조건**: 보통 **순수 함수(pure)**에 적합 — 같은 입력이면 항상 같은 출력.
* **장점**: 반복적·비용 큰 계산을 피해 성능 향상.
* **단점/주의**: 캐시 메모리 비용, 키 생성 오버헤드(객체 직렬화 등), 부수 효과 있는 함수에는 부적합.

간단한 JS 메모이제이션 예:

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args); // 단순한 방법 — 복잡한 객체/순환 참조엔 부적합
    if (cache.has(key)) return cache.get(key);
    const val = fn(...args);
    cache.set(key, val);
    return val;
  };
}
```

---

# React에서의 메모이제이션: 무엇을 '메모'하나?

React에는 주로 세 가지 관련 도구가 있습니다:

* `useMemo` — **값(value)**(계산 결과, 객체/배열 등)을 메모
* `useCallback` — **함수(function)** 참조(identity)를 메모
* `React.memo` — **컴포넌트 렌더 결과**를 props 얕은 비교로 메모(렌더 스킵)

> `React.useMemo`와 `useMemo`는 동일한 기능입니다. 단지 접근(import) 방식 차이일 뿐입니다 (`import { useMemo } from 'react'` vs `React.useMemo`).

---

# useMemo — 상세

**무엇에 쓰는가**

* 무거운 계산 결과를 캐시해서 매 렌더마다 다시 계산하지 않도록.
* 객체/배열을 매 렌더 새로 생성하지 않고 **stable identity**(동일한 참조)를 제공하려고.

**사용 예**

```jsx
const value = useMemo(() => expensiveComputation(a, b), [a, b]);
const stableObj = useMemo(() => ({ a, b }), [a, b]); // 객체 identity 고정
```

**중요한 동작 원리/주의**

* `useMemo`는 렌더 중에 콜백을 실행해서 값을 계산하고 그 결과를 내부적으로 보관함.
* **옵티마이저 힌트**: React는 메모된 값을 언제든지 버리고(특히 concurrent 모드에서) 필요하면 다시 계산할 수 있으므로 **정확성(behavior)을 보장하려고 쓰면 안 되고, 오직 성능 최적화용**으로만 사용해야 함.
* `useMemo`가 블로킹 작업을 비동기로 처리해 주는 건 아님. (즉 무거운 계산은 렌더를 블로킹) — 정말 비용 큰 작업이면 Web Worker, `useTransition` 등 고려.
* 의존성 배열이 정확해야 함. 잘못하면 stale value(오래된 값)가 생기거나 재계산이 필요할 때 재계산이 안 됨.

---

# useCallback — 상세

**무엇에 쓰는가**

* 컴포넌트가 렌더될 때마다 새로 생성되는 함수의 **참조(identity)** 를 고정해서, 그 함수를 prop으로 받은 자식 컴포넌트의 불필요한 재렌더링을 막거나 effect 의존성으로 넣을 때 유용.

**사실상 구현**

```text
useCallback(fn, deps) ≈ useMemo(() => fn, deps)
```

**사용 예**

```jsx
const handle = useCallback(() => setCount(c => c + 1), []); // 참조 고정
```

**주의점**

* `useCallback` 자체가 성능을 무조건 좋게 하진 않음 — 훅 호출/의존성 비교 오버헤드가 있어서 오히려 악영향일 수 있음. (프로파일링 권장)
* 자주 하는 실수: 콜백에서 외부 상태를 직접 읽고 deps에 넣지 않아서 stale closure 발생. `setCount(c => c + 1)` 같은 함수형 업데이트를 이용하면 deps를 줄일 수 있음.

---

# React.memo — 상세

**무엇에 쓰는가**

* 함수형 컴포넌트를 얕은 props 비교(shallow compare)로 감싸, props가 같으면 렌더를 건너뛰게 함.

**사용**

```jsx
const Child = React.memo(function Child({ data, onClick }) {
  /* 렌더 내용 */
});
```

**특징**

* 기본 비교는 얕은 비교(`Object.is`/`===`) — 객체/배열/함수 같은 참조형 prop은 참조가 바뀌면 다름으로 판단.
* 필요하면 두 번째 인자로 **커스텀 비교 함수**(areEqual(prevProps, nextProps))를 넣어 더 정교하게 제어 가능.

---

# 세 가지의 차이와 상호작용(요약)

* `useMemo`: 값(계산 결과, 배열/객체)을 메모 → **값 재생성 비용을 줄임 / identity 유지**.
* `useCallback`: 함수 참조를 메모 → **prop으로 전달되는 함수의 identity를 고정**.
* `React.memo`: 컴포넌트 레벨에서 props 얕은 비교로 렌더 스킵 → **자식 컴포넌트의 불필요 렌더링 방지**.

관계: `useCallback` / `useMemo`로 부모가 전달하는 함수나 객체의 참조를 안정화하면 `React.memo`가 효과를 보기 쉬워진다.

---

# 실전 예제 — Parent/Child 퍼포먼스 패턴

```jsx
const Child = React.memo(({ onClick, payload }) => {
  console.log('Child render');
  return <button onClick={onClick}>{payload.label}</button>;
});

function Parent({ label }) {
  const [count, setCount] = useState(0);

  // BAD: payload 매 렌더마다 새 객체 → Child는 항상 render
  // const payload = { label };

  // GOOD: stable 객체(identity 유지)
  const payload = useMemo(() => ({ label }), [label]);

  // BAD: handle이 매 렌더 새로 생성 → Child 재렌더
  // const handle = () => setCount(c => c + 1);

  // GOOD: stable function
  const handle = useCallback(() => setCount(c => c + 1), []);

  return (
    <>
      <div>{count}</div>
      <Child onClick={handle} payload={payload} />
    </>
  );
}
```

이 패턴에서 `React.memo`만 쓰면 `payload`와 `handle`이 매 렌더 새 참조라서 Child가 계속 렌더됩니다. `useMemo`/`useCallback`으로 참조를 고정해야 `React.memo`의 이득을 볼 수 있습니다.

---

# 흔한 실수 & 디버깅 포인트

1. **의존성 누락 / 빈 deps 남용**: 빈 deps로 때우면 stale closure 버그 발생. ESLint 규칙(`react-hooks/exhaustive-deps`) 활성화 권장.
2. **과도한 사용**: 모든 함수/객체에 적용하면 오히려 성능이 나빠짐. 먼저 프로파일링.
3. **정확성에 의존**: `useMemo` 값이 항상 유지된다고 가정하면 안 됨 — React는 값을 버릴 수 있음.
4. **useMemo가 블로킹을 해결하진 않음**: 렌더를 차단하는 무거운 작업은 worker나 비동기 전략 필요.
5. **객체를 키로 비교할 때의 함정**: 매 렌더 새로 만들어지는 객체는 참조가 달라짐 — shallow compare에서 다른 것으로 간주.

---

# 실무 권장 가이드 (간단 체크리스트)

* 성능 문제(재렌더링·계산 비용)가 **확실히** 있을 때만 적용.
* 자식이 불필요하게 렌더된다면: `React.memo` 적용 → 그래도 렌더된다면 부모에서 전달하는 props(객체/함수)의 identity를 `useMemo`/`useCallback`으로 안정화.
* 콜백에서 상태를 읽을 때 stale 문제를 피하려면 functional update 패턴 사용: `setX(prev => ...)`.
* 매우 비용 큰 계산은 메인 스레드에서 처리하지 않는 방법을 고려(Web Worker, chunking, useTransition).
* 필요하면 `React.memo`에 커스텀 비교로 최적화 (주의: 비교 비용이 클 경우 역효과).

---

# 한눈에 보는 표

| 항목            |           메모 대상 | 반환값/역할             | 재계산 조건          | 주 용도                     |
| ------------- | --------------: | ------------------ | --------------- | ------------------------ |
| `useMemo`     | 값(계산 결과, 객체/배열) | 계산 결과(값)           | deps 변경 시       | 비싼 계산 캐시, 객체 identity 고정 |
| `useCallback` |              함수 | 함수 참조              | deps 변경 시       | 자식에 전달되는 함수의 참조 고정       |
| `React.memo`  |            컴포넌트 | 렌더 스킵(얕은 props 비교) | props가 달라지면 재렌더 | 자식 컴포넌트의 불필요 렌더 방지       |

