---
title: vue router-link에서 click event적용
date: 2023-03-08
tags:
  - Frontend
  - vue3
  - router-link
draft: false
---
로그아웃 시 토큰도 삭제하고 로그인 페이지를 이동 시 함수 내에서 동작하기 위해 아래와 같이 사용해 주었습니다. to="/"를 안쓰면 에러가 나서 넣어주긴 했는데 to="#"와 같이 사용해도 됩니다.

```javascript

<router-link class="user_link" to="/" @click.native="logout">로그아웃</router-link>
```