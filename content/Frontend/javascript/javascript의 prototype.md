---
title: javascript의 prototype
date: 2025-02-20
tags:
  - Frontend
  - javascript
  - prototype
draft: false
---

**자바스크립트에서 객체를 상속하기 위하여 프로토타입이라는 방식을 사용하고 모든 객체는 자신의 부모(역할) 객체와 연결되어 있는데 이 부모 객체를 프로토타입(객체) 라고 한다.**

```
var foo = {
  name: 'foo',
  age: 30
}

console.log(foo.toString());
 //[object Object]
 foo 객체의 프로토타입에 toString() 메서드가 정의되어 있음.
```
![polling](assets/prototype1.png "위에 생성한 foo 객체의 프로토타입")
![polling](assets/prototype2.png "Object 객체의 프로토타입")

크롬 브라우저에서는 **\_\_proto\_\_프로퍼티** 형태로 구현되어 있다.

#### 프로토타입 수정하기

아래와 같이 프로토타입에 메소드를 추가하면 해당 생성자로 생성된 모든 객체에서 사용 가능하다.

```
function Person(first, last, age, gender, interests) {
    this.first = first;
    this.last = last;
    this.age = age;
    this.gender = gender;
    this.interests = interests;
}

var person1 = new Person("Tammi", "Smith", 32, "neutral", [
  "music",
  "skiing",
  "kickboxing",
]);

Person.prototype.farewell = function () {
  alert(this.first + " has left the building. Bye for now!");
};

person1.farewall();
// alert 호출
```