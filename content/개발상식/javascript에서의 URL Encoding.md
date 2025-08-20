---
title: javascript에서의 URL Encoding
date: 2025-08-20
tags:
  - 개발상식
  - URLEncoding
  - encoding
draft: false
---
###   
📘 URL Encoding이란?

**URL Encoding**은 URL에 포함될 수 없는 문자(공백, 한글, 특수문자 등)를 **퍼센트 인코딩(percent-encoding)** 방식으로 변환하는 것입니다.

### ✅ 왜 필요한가요?

URL은 오직 **ASCII 문자**만 허용되며,  
공백이나 한글, &, = 등의 문자가 있으면 **서버에서 URL을 잘못 해석**할 수 있습니다.

예를 들어 다음과 같은 문자열이 있다고 가정해봅시다:  
**"hello world&name=성재"**  
이 문자열을 URL에 그대로 넣으면 문제 발생 → **정상적인 HTTP 요청이 되지 않음**  
따라서 이를 안전하게 **인코딩**해야 합니다.

### 🔢 인코딩 방식

#### 퍼센트 인코딩 (Percent Encoding)

각 문자를 **UTF-8 바이트로 변환** 후, **16진수로 표시**하고 % 기호를 붙입니다.

문자 ASCII(또는 UTF-8) URL 인코딩 결과

|   |   |   |
|---|---|---|
|공백|0x20|%20 or +|
|한글 '성'|0xEC84B1 (UTF-8)|%EC%84%B1|
|&|0x26|%26|

  

### ⚖️ URL Encoding의 장단점

|   |   |
|---|---|
|✅ 장점|❌ 단점|
|URL에 특수문자/한글 등을 안전하게 포함 가능|인코딩된 문자열이 가독성이 떨어짐|
|서버가 올바르게 파라미터를 해석할 수 있음|실수로 잘못된 함수 사용 시 버그 유발|

  

  

## 🧪 JavaScript에서의 사용법

1. encodeURIComponent()

> URL 파라미터(값)에 사용하는 함수  
> 공백, 한글, 특수문자 등 대부분을 인코딩함

const keyword = "성재&hello world";
const encoded = encodeURIComponent(keyword);
console.log(encoded);
// 결과: %EC%84%B1%EC%9E%AC%26hello%20world

  

2. encodeURI()

> 전체 URL 문자열에 사용하는 함수  
> **경로 구분자(/) 등은 인코딩하지 않음**

const url = "https://example.com/search?query=성재&lang=ko";
const encoded = encodeURI(url);
console.log(encoded);
// 결과: https://example.com/search?query=%EC%84%B1%EC%9E%AC&lang=ko

  

3. decodeURIComponent() / decodeURI()

- 인코딩된 문자열을 다시 **원래 문자열로 복원**할 수 있음

decodeURIComponent("%EC%84%B1%EC%9E%AC") // "성재"

###   

### ✍️ 마무리 요약

- encodeURIComponent()는 **파라미터** 인코딩에, encodeURI()는 **전체 URL** 인코딩에 사용
- 한글, 공백, 특수문자 → %XX 형식으로 인코딩됨
- **URL 전송 오류, XSS 공격 방지**에도 도움이 됨