---
title: Web Storage - Local Storage, Session Storage
date: 2021-05-10
tags:
  - 개발상식
  - Storage
  - LocalStorage
  - SessionStorage
draft: false
---
HTML5부터 웹 데이터를 client에 저장할 수 있는 storage가 추가되었다. 영구 저장소인 Local Storage와 임시 저장소인 Session Storage로 구성되어 있으며 key-value로 저장되는 기존 웹의 Cookie와 유사한 속성을 가지고 있다.

> Cookie와 차이점

- 쿠키는 매번 서버로 전송된다.  
    - 쿠키는 매번 request 요청 시 전달되며 Web Storage는 서버로의 전송이 이루어지지 않아 웹 트래픽의 비용을 줄여준다.
- 용량제한이 있는 Cookie와 달리 제한이 없다.
    - Cookie는 4kb의 용량 제한이 있다.
- 영구적으로 데이터 저장이 가능하다.
    - 쿠키는 만료일자를 지정하여 언젠간 만료되지만 Web Storage는 만료기간 설정이 없으며 영구적으로 저장 가능하다.
- 쿠키와 다르게 서버 쪽에서 Web Storage의 데이터 조작이 불가능하다.  
    - Web Storage 조작은 모두 자바스크립트 내에서 수행된다.

#### **Local Storage**

Window 전역 객체의 Local Storage를 통해 저장/조회/삭제 등이 가능하며 명시적으로 삭제하지 않는 이상 영구적으로 지속된다. null과 undefined도 저장할 수 있으며 문자열로 저장이 된다.

또한 Local Storage는 브라우저를 종료해도 데이터가 보관되어 다음번 접속에도 그 데이터를 활용 가능하다.

#### **Session Storage**

Window 전역 객체의 Session Storage를 통해 저장/조회/삭제 등이 가능하며 데이터의 지속성과 액세스 범위에 따라 Local Storage와 차이점이 있다.

Session Storage는 브라우저가 종료되면 데이터도 같이 종료된다. 또한 도메인이 같더라도 브라우저(IE, Chrome...)에 따라 서로 다른 영역이 된다.

> 참고  
> - https://velog.io/@ejchaid/localstorage-sessionstorage-cookie%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90  
> - https://ko.javascript.info/localstorage  
> - https://www.zerocho.com/category/HTML&DOM/post/5918515b1ed39f00182d3048