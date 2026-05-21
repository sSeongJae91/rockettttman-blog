---
title: react에서의 code splitting
date: 2026-01-28
tags:
  - Frontend
  - react
  - code splitting
  - webpack
  - vite
  - lazy loading
draft: false
---

## 1️⃣ Code Splitting이란?

**한 번에 모든 JS 번들을 내려받지 말고**,
👉 **필요한 시점에 필요한 코드만 나눠서 로드**하는 전략

### 왜 필요하냐면

* 초기 로딩 JS 용량 ↓
* TTI(Time To Interactive) 빨라짐
* 모바일 / 저사양 환경에서 체감 성능 ↑

---

## 2️⃣ React에서 대표적인 Code Splitting 방법들

### ① `React.lazy` + `Suspense` (가장 기본)

#### 특징

* **컴포넌트 단위**로 분리
* 가장 많이 쓰이고 React 공식 권장
* 동적 import 기반

#### 예제

```tsx
import { lazy, Suspense } from "react";

const UserPage = lazy(() => import("./UserPage"));

function App() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <UserPage />
    </Suspense>
  );
}
```

#### 장단점

✅ 간단하고 직관적
✅ 라우트 단위 분리에 최적
❌ Suspense 없으면 렌더링 불가
❌ 로딩 UX를 신경 써야 함

📌 **언제 쓰나?**

* 페이지 단위
* 무거운 컴포넌트 (차트, 에디터 등)

---

### ② 라우터 기반 Code Splitting (실무 최강자)

#### React Router 예시

```tsx
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/profile" element={<Profile />} />
</Routes>
```

#### 특징

* **페이지 전환 시에만 로딩**
* 초기 번들 최소화
* 사용자 행동 기반 로딩

📌 **실무 팁**

> “모든 page 컴포넌트는 기본적으로 lazy로 간다”
> → 거의 표준 패턴

---

### ③ 동적 import (`import()`)

#### 특징

* 컴포넌트 말고 **함수 / 라이브러리**도 분리 가능
* 조건부 로딩 가능

#### 예제

```ts
async function loadChart() {
  const { drawChart } = await import("./chart");
  drawChart();
}
```

#### 활용 포인트

* 특정 버튼 클릭 시
* 관리자 기능
* 무거운 라이브러리 (chart.js, editor 등)

📌 **React.lazy와 차이**

* `lazy` → 컴포넌트용
* `import()` → 일반 JS 모듈용

---

### ④ 라이브러리 단위 분리 (실전에서 중요)

#### ❌ 나쁜 예

```ts
import _ from "lodash";
```

#### ✅ 좋은 예

```ts
import debounce from "lodash/debounce";
```

#### 특징

* 번들 크기 대폭 감소
* Tree Shaking과 함께 사용하면 효과 극대화

📌 **자주 분리 대상**

* lodash
* moment → dayjs
* chart.js
* editor 계열 (quill, monaco)

---

### ⑤ Prefetch / Preload (고급 최적화)

```ts
const Page = lazy(() =>
  import(/* webpackPrefetch: true */ "./Page")
);
```

#### 특징

* **다음에 필요할 가능성이 높은 코드 미리 로드**
* 네트워크 여유 있을 때만 실행

📌 **언제 쓰나**

* 탭 전환
* 다음 페이지가 거의 확정적인 경우

---

## 3️⃣ Webpack / Vite 관점에서의 Code Splitting

### Webpack

* `import()` → 자동 chunk 생성
* `SplitChunksPlugin`으로 공통 코드 분리

### Vite

* Rollup 기반
* **ESM + dynamic import가 자연스럽게 chunk 분리**
* 설정 거의 없이도 잘 됨

👉 요즘 React + Vite 조합이 쾌적한 이유 중 하나

---

## 4️⃣ 실무에서 추천하는 Code Splitting 전략

### ✅ 기본 원칙

1. **페이지 단위는 무조건 lazy**
2. 무거운 UI 컴포넌트는 lazy
3. 자주 안 쓰는 기능은 버튼 클릭 시 로드
4. 공통 UI는 쪼개지 말 것 (오히려 역효과)

### ❌ 피해야 할 패턴

* 너무 잘게 쪼개기 (네트워크 요청 폭증)
* 로딩 UI 없는 lazy
* 첫 화면에 필요한 컴포넌트 lazy 처리

---

## 5️⃣ 한 눈에 정리

| 방법          | 단위    | 주 사용처         |
| ----------- | ----- | ------------- |
| React.lazy  | 컴포넌트  | 페이지, 큰 컴포넌트   |
| import()    | 함수/모듈 | 버튼 클릭, 관리자 기능 |
| Router lazy | 페이지   | SPA 구조        |
| Library 분리  | 라이브러리 | 번들 최적화        |
| Prefetch    | chunk | UX 개선         |

---


## lazy를 남발할 경우

ㅋㅋ 이거 진짜 **실무에서 한 번쯤 다 겪는 함정**이라 딱 짚어볼 가치 있음 😅
“lazy = 무조건 성능 좋다”라고 믿고 남발하면 **오히려 UX·성능·유지보수 다 깨짐**.

아래를 보면 *왜 문제인지* 바로 감 올 거야.

---

## 1️⃣ 네트워크 요청 폭증 (가장 흔함)

### 무슨 일이 생기냐면

* 컴포넌트 하나당 **JS chunk 하나**
* 화면 렌더링 시점에

  ```
  chunk-1.js
  chunk-2.js
  chunk-3.js
  chunk-4.js
  ```

  줄줄이 요청됨

### 결과

* HTTP 요청 수 증가
* 모바일 / 느린 네트워크에서 체감 성능 ↓
* 초기 화면이 “툭툭 끊겨 보임”

📌 **특히 위험한 경우**

* 리스트 아이템
* 공통 UI 컴포넌트
* layout 내부 컴포넌트

👉 **lazy는 “덜 자주 쓰는 것”에만**

---

## 2️⃣ 화면이 로딩 스피너 지옥이 됨 😵‍💫

```tsx
<Suspense fallback={<Spinner />}>
  <Header />
</Suspense>

<Suspense fallback={<Spinner />}>
  <Sidebar />
</Suspense>

<Suspense fallback={<Spinner />}>
  <Content />
</Suspense>
```

### 문제점

* 스피너가 여기저기서 튀어나옴
* 레이아웃이 계속 바뀜 (Layout Shift)
* UX 급락

📌 **실무에서 보이는 증상**

> “페이지가 뭔가 계속 깜빡거려요…”

### 해결 패턴

* **Suspense는 큰 덩어리로**
* 페이지 단위로 한 번만 감싸기

---

## 3️⃣ First Paint는 빨라졌는데 체감은 더 느림

### 이유

* JS 다운로드는 나중
* 실행 시점이 분산됨
* **CPU가 여러 번 일함**

특히:

* 저사양 모바일
* 구형 안드로이드

👉 **JS는 다운로드 + 파싱 + 실행까지 비용**

📌 lazy 남발 = 실행 비용 분산 = 체감 느림

---

## 4️⃣ 상태 공유 / Context 구조가 꼬임

### 흔한 사고

```tsx
const UserProfile = lazy(() => import("./UserProfile"));
```

* Context Provider는 상위에 있음
* lazy 컴포넌트 로딩 지연
* 초기 렌더 시 context 의존 로직 꼬임

### 결과

* undefined 에러
* 조건 분기 증가
* useEffect 지옥

📌 **특히 위험**

* Auth
* Theme
* i18n
* Feature Flag

---

## 5️⃣ 에러 핸들링 복잡도 폭증

lazy는 **비동기 import**라서…

```tsx
<Suspense>
  <LazyComponent />
</Suspense>
```

### 실제로는

* 네트워크 에러
* chunk 로딩 실패
* 캐시 깨짐

👉 **ErrorBoundary 없으면 흰 화면**

```tsx
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <Page />
  </Suspense>
</ErrorBoundary>
```

📌 남발하면 ErrorBoundary도 남발됨 → 구조 복잡

---

## 6️⃣ 디버깅 & 유지보수 난이도 상승

### 실무 체감

* 파일 열었는데 어디서 로드되는지 헷갈림
* 의존성 추적 어려움
* “이거 왜 처음에 안 불러와지지?” 😐

### 특히 힘든 경우

* 신규 입사자
* 급한 버그 핫픽스

---

## 7️⃣ SEO / 크롤링 이슈 (특히 SSR 아닐 때)

* CSR + lazy 남발
* 크롤러가 chunk 못 가져옴
* 콘텐츠 비어 보임

📌 Next.js라도:

* **Client Component lazy 남발하면 동일 문제**

---

## 8️⃣ 그래서 실무에서의 황금 규칙 ✨

### ✅ lazy 써도 되는 것

* 페이지 단위
* 관리자 화면
* 모달 / 드로어
* 차트 / 에디터
* 거의 안 쓰는 기능

### ❌ lazy 쓰면 안 되는 것

* Header / Footer
* Layout
* 공통 버튼, 폼
* 리스트 아이템
* 첫 화면 핵심 UI

---

## 9️⃣ 한 줄 요약

> **lazy는 성능 최적화 도구지, 기본값이 아니다**

* “항상 필요한 것” → **즉시 로드**
* “가끔 필요한 것” → **lazy**
* “무거운 것” → **lazy + prefetch**

---