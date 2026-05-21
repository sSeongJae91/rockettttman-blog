---
title: vue3 router 404 error redirecting
date: 2023-03-06
tags:
  - Frontend
  - vue3
  - router
  - redirect
draft: false
---
router에서 404처리 시 아래와 같이 해주면 된다.

```javascript
const routes = [
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
  ....//route pages
]
```