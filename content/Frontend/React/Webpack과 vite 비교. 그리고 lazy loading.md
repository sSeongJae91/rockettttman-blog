---
title: Webpack과 vite 비교. 그리고 lazy loading
date: 2026-01-28
tags:
  - Frontend
  - react
  - webpack
  - vite
  - lazy loading
draft: false
---

## 한 줄 요약부터

* **Webpack**: 전통적인 “모든 걸 다 할 수 있는” 강력한 번들러 (설정은 지옥)
* **Vite**: 개발 경험(Dev UX)에 올인한 차세대 번들러 (빠름 그 자체)
* **Lazy Loading**: 번들러와 무관하게 **초기 로딩 성능을 개선하는 전략**

---

## 1️⃣ Webpack

### 🔹 특징

* **모든 리소스를 번들링** (JS, CSS, 이미지, 폰트 등)
* Loader / Plugin 기반의 확장 구조
* SPA, MPA, 레거시 브라우저 대응에 강함
* React, Vue, Angular 등 거의 모든 프레임워크의 기반

### ✅ 장점

* ✅ 생태계 압도적 (플러그인, 레퍼런스, 사례)
* ✅ 커스터마이징 자유도 최상
* ✅ 레거시 환경 대응 (IE 포함 가능)
* ✅ 대규모 엔터프라이즈 프로젝트에 안정적

### ❌ 단점

* ❌ 설정 복잡도 높음 (`webpack.config.js` 지옥)
* ❌ Dev 서버 느림 (전체 번들 다시 빌드)
* ❌ 설정 이해까지 러닝커브 큼

### 🔥 잘 맞는 경우

* 대규모 레거시 프로젝트
* 커스터마이징이 매우 많은 경우
* 오래된 브라우저 지원 필요

---

## 2️⃣ Vite

### 🔹 특징

* **Dev 서버에서 번들링을 거의 안 함**
* ES Module 기반 (`import`를 브라우저가 직접 처리)
* 내부적으로 **Rollup**을 사용해 프로덕션 빌드
* React / Vue / Svelte에 최적화

### ✅ 장점

* ⚡ 개발 서버 속도 미쳤음 (HMR 거의 즉시)
* ⚡ 설정이 단순함
* ⚡ 최신 표준(ESM)에 충실
* ⚡ 개인/사이드 프로젝트에 최고

### ❌ 단점

* ❌ IE 지원 불가 (ESM 필수)
* ❌ Webpack 대비 플러그인 생태계 작음
* ❌ 특이한 빌드 커스터마이징은 제약 있음

### 🔥 잘 맞는 경우

* 신규 프로젝트
* React / Vue SPA
* 개발 속도 & DX가 중요한 팀
* 개인 프로젝트, 스타트업

---

## 3️⃣ Lazy Loading (Code Splitting)

> ⚠️ 이건 **번들러가 아니라 “전략”** 이야

### 🔹 특징

* **필요한 시점에만 코드/리소스 로딩**
* 초기 번들 사이즈 감소 → 첫 로딩 빨라짐
* Webpack, Vite, Next.js 모두 지원

### 예시 (React)

```tsx
const AdminPage = React.lazy(() => import('./AdminPage'));

<Suspense fallback={<Loading />}>
  <AdminPage />
</Suspense>
```

### ✅ 장점

* 🚀 초기 로딩 속도 개선
* 🚀 대규모 SPA에서 필수 전략
* 🚀 사용자 경험 개선 (특히 모바일)

### ❌ 단점

* ❌ 네트워크 상태 안 좋으면 체감 느려질 수 있음
* ❌ 로딩 UI 관리 필요
* ❌ 과도하면 오히려 UX 악화

### 🔥 잘 맞는 경우

* 라우트 단위 페이지
* 관리자 페이지 / 잘 안 쓰는 기능
* 무거운 라이브러리 (차트, 에디터 등)

---

## 🔥 셋을 같이 보면 이렇게 정리됨

| 구분       | Webpack | Vite  | Lazy Loading |
| -------- | ------- | ----- | ------------ |
| 역할       | 번들러     | 번들러   | 로딩 전략        |
| Dev 속도   | 느림      | 매우 빠름 | 영향 없음        |
| 설정 난이도   | 높음      | 낮음    | 중간           |
| 초기 로딩 개선 | ❌       | ❌     | ✅            |
| 레거시 대응   | ✅       | ❌     | 번들러 의존       |

---

## 🎯 실무 추천 조합 (시니어 픽)

* **신규 React 프로젝트**
  👉 `Vite + Lazy Loading` (라우트 단위)

* **대규모 레거시**
  👉 `Webpack + Code Splitting`

* **Next.js**
  👉 내부는 Webpack/Turbopack + `dynamic import`

---
