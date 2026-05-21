---
title: Tab이나 Select 선택 시 Element 못찾을 때
date: 2026-03-09
tags:
  - Frontend
  - vuejs
  - vue
  - nexttick
  - settimeout
draft: false
---

Vue.js **2.x 버전**에서 `select`의 `v-model`을 `watch`로 감지할 때 **DOM이 아직 업데이트되기 전에 watch가 먼저 실행**되는 경우가 있습니다. 그래서 `watch` 안에서 DOM을 조회하면 아직 `v-if`나 `v-show`로 렌더된 `div`가 없어서 `setTimeout`을 쓰면 동작하는 것처럼 보입니다.

이건 **Vue의 비동기 DOM 업데이트 큐** 때문입니다.
`watch` → 상태 변경 → **다음 tick에서 DOM 업데이트**

따라서 **`setTimeout` 대신 `nextTick`을 사용하는 것이 정석 해결 방법**입니다.

---

# 1️⃣ 가장 권장되는 방법: `$nextTick` 사용

```javascript
watch: {
  selectedValue() {
    this.$nextTick(() => {
      const el = this.$refs.targetDiv
      console.log(el)
    })
  }
}
```

또는

```javascript
import Vue from "vue"

watch: {
  selectedValue() {
    Vue.nextTick(() => {
      const el = this.$refs.targetDiv
    })
  }
}
```

### 이유

* `nextTick`은 **DOM 업데이트가 끝난 다음 실행**
* `setTimeout`보다 **Vue lifecycle에 맞는 안전한 방법**

---

# 2️⃣ 예시 구조

```html
<select v-model="type">
  <option value="a">A</option>
  <option value="b">B</option>
</select>

<div v-if="type === 'b'" ref="targetDiv">
  보여야 하는 영역
</div>
```

```javascript
watch: {
  type() {
    this.$nextTick(() => {
      console.log(this.$refs.targetDiv)
    })
  }
}
```

---
