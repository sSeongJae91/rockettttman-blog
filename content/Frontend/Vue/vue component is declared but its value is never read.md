---
title: vue component is declared but its value is never read
date: 2023-01-10
tags:
  - Frontend
  - vue3
  - volar
draft: false
---
vue3 setup방식에서 component를 선언 시 회색 글씨가 뜨면서 'component is declared but its value is never read'와 같은 메세지가 출력될 때가 있습니다. 컴포넌트가 선언되었으나 사용되지 않았다는 내용인데 오류는 아니지만 소스가 길어지면서 보기 불편해서 해결 방법을 찾아보던 도중 기존에 vetur이 아닌 [Volar](https://marketplace.visualstudio.com/items?itemName=vue.volar "Volar")라는 extension을 사용하라는 추천이 있어서 해당 extension으로 교체해 주었습니다.

![img](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FyzSCb%2FbtrVRCp4QXN%2FAAAAAAAAAAAAAAAAAAAAAHV26xLrIa7XQSEEHruco4OTZAt8rqxc65GDseYF_-dh%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1756652399%26allow_ip%3D%26allow_referer%3D%26signature%3D1oAVNuWIKUwUsOp5Anh%252FwbqjuD4%253D)

##### 참고자료
[https://stackoverflow.com/questions/69504924/how-to-avoid-component-is-declared-but-its-value-is-never-read-when-i-use-vue](https://stackoverflow.com/questions/69504924/how-to-avoid-component-is-declared-but-its-value-is-never-read-when-i-use-vue)