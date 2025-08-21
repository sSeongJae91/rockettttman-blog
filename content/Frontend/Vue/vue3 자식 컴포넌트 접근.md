---
title: vue3 자식 컴포넌트 접근
date: 2023-03-08
tags:
  - Frontend
  - vue3
draft: false
---
quasar framework를 사용하는 프로젝트 중 공통 <input-basic/>이라는 공통 input 컴포넌트를 만들고 해당 input의 validate()이라는 함수를 사용하려고 했는데 계속 함수를 찾지 못하는 현상이 있었습니다. 자식  ref를 제대로 인식하지 못하여서 자식 함수에서 ref를 정의하여 defineExpose를 사용하여 부모 컴포넌트에서도 자식 컴포넌트에 접근하여 함수를 사용할 수 있도록 수정해주었습니다.

[DefineExpose](https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits)

```javascript
<template>
...
<input-basic
    ref="email"
    type="email"
    style="flex: 1"
    v-model="data.email"
    placeholder="이메일 형식으로 입력"
    hide-bottom-space
    lazy-rules
    :rules="[
      (val) => {
        if (!val || val.length < 1) {
          return '이메일을 입력해 주세요';
        } else if (!check_email) {
          return '중복체크를 해주세요';
        }
      },
    ]"
    @update:model-value="
      () => {
        check_email = false;
      }
    "
  />
...
</template>
<script setup>
...
const confirmEmail = () => {
  check_email.value = true;
  email.value.inputRef.validate();  // 자식 inputRef에 접근하여 validate()함수 사용 가능
};
...
</script>
```


```javascript
InputBasic.vue

<template>
  <q-input square outlined dense v-bind="attrs" ref="inputRef">
    <template v-slot:append>
      <slot></slot>
    </template>
  </q-input>
</template>
<script setup>
import { useAttrs, ref } from "vue";
const attrs = useAttrs();
const inputRef = ref(null);

defineExpose({
  inputRef,
});
</script>
<script></script>
```