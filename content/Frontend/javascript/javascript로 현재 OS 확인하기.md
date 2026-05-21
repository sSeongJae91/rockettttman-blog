---
title: javascript로 현재 OS 확인하기
date: 2025-06-26
tags:
  - Frontend
  - javascript
  - os
draft: false
---

#### ✅ 방법 1: navigator.userAgent 사용

```
function getOS() {
  const userAgent = window.navigator.userAgent;

  if (userAgent.includes("Windows NT")) {
    return "Windows";
  } else if (userAgent.includes("Mac OS X")) {
    return "Mac";
  } else if (userAgent.includes("Linux")) {
    return "Linux";
  } else {
    return "Unknown";
  }
}

console.log(getOS());
```

#### ✅ 방법 2: navigator.platform 사용 (더 간단)

```
function getOS() {
  const platform = window.navigator.platform.toLowerCase();

  if (platform.includes("win")) {
    return "Windows";
  } else if (platform.includes("mac")) {
    return "Mac";
  } else if (platform.includes("linux")) {
    return "Linux";
  } else {
    return "Unknown";
  }
}

console.log(getOS());
```

### ⚠️ 주의사항

-   모바일 환경(iOS, Android)에서는 다른 값을 반환할 수 있으며, navigator.userAgentData가 있는 경우 더 정교하게 판별 가능.
-   최신 브라우저에서는 userAgent가 deprecated될 예정이므로 가능하면 navigator.userAgentData를 사용하는 것이 좋습니다. 단, **지원 브라우저가 제한적**입니다.