---
title: vue3 setup에서의 slot react children과 비교
date: 2022-12-31
tags:
  - Frontend
  - vue3
  - react
  - slot
  - children
draft: false
---
프로젝트 공통 컴포넌트를 만드는 방식 중 

vue 3 setup

>attr - 부모 컴포넌트에서 자식 컴포넌트로 속성들을 전달하기 위해 사용
>slot - 부모 컴포넌트 안에 자식 컴포넌트 삽입

```javascript
--App.vue
<main>
    <my-button :label="blue" @click="myFunction">
      버튼
    </my-button>
</main>
```

```javascript
--MyButton.vue
<template>
  <div>
    <h3>
      라벨
    </h3>
    <button v-bind="attrs">
      <slot></slot>
    </button>
  </div>
</template>
<script setup>
  import { useAttrs, computed } from 'vue'
  const attrs = useAttrs();
</script>
<script>
export default {
  inheritAttrs: false, //attr이 h3라벨이 아닌 button에만 적용될 수 있도록
  customOptions: {}
}
</script>
```

react

>props - 부모 컴포넌트에서 자식 컴포넌트로 속성들을 전달하기 위해 사용
>children - 부모 컴포넌트 안에 자식 컴포넌트 삽입

```javascript
--App.jsx
import MyButton from './MyButton';

export default function App() {

  const onclick = () => {
    alert('!!!');
  }
  
  return (
    <main>
      <MyButton onClick={onclick}>
        <span>버튼</span>
      </MyButton>
    </main>
  )
}
```

```javascript
--MyButton.jsx
export default function MyButton({children, ...props}) {
  console.log(children, props);
  return (
    <div>
      <div>
        <h3>
          sdfsfsdfds
        </h3>
      </div>
      <button {...props}>
        {children}
      </button>
    </div>
    
  )
}
```