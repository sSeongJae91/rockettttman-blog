---
title: Autowired와 RequiredArgsConstructor 비교
date: 2025-10-16
tags:
  - Java
  - Autowired
  - RequiredArgsConstructor
draft: false
---

`@Autowired`와 `@RequiredArgsConstructor`는 **둘 다 의존성 주입(Dependency Injection)** 에 사용되지만,
**방식과 시점, 코드 스타일**이 조금 달라집니다.

---

## 🧩 1️⃣ `@Autowired` — Spring의 전통적인 의존성 주입 방식

### ✅ 개요

`@Autowired`는 **Spring 프레임워크에서 제공하는 어노테이션**으로,
**필드, 생성자, 세터** 등에 의존성을 자동으로 주입해줍니다.

### ✅ 예제

```java
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail() {
        mailSender.send(...);
    }
}
```

📌 **설명**

* Spring이 `EmailService`를 Bean으로 만들 때, `JavaMailSender` 타입의 Bean을 찾아 자동으로 `mailSender` 필드에 넣어줍니다.
* 기본적으로 **타입 기준**으로 주입합니다. (`@Qualifier`로 이름 기반 지정도 가능)
* Reflection을 써서 주입하기 때문에 **final 필드에는 쓸 수 없습니다.**

---

## 🧩 2️⃣ `@RequiredArgsConstructor` — Lombok 기반의 생성자 주입 방식

### ✅ 개요

`@RequiredArgsConstructor`는 **Lombok이 제공하는 어노테이션**이에요.
**`final`이나 `@NonNull`이 붙은 필드만을 인자로 받는 생성자를 자동으로 만들어줍니다.**

### ✅ 예제

```java
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail() {
        mailSender.send(...);
    }
}
```

📌 **설명**

* `private final JavaMailSender mailSender;` 덕분에 **불변성(immutable)** 을 유지합니다.
* Lombok이 `public EmailService(JavaMailSender mailSender)` 생성자를 자동 생성.
* Spring은 생성자가 하나뿐인 경우, **자동으로 그 생성자에 의존성 주입**을 해줍니다.
* 따라서 `@Autowired`가 **필요하지 않습니다.**

---

## ⚖️ 비교 정리

| 구분             | @Autowired           | @RequiredArgsConstructor |
| -------------- | -------------------- | ------------------------ |
| 제공자            | Spring Framework     | Lombok                   |
| 주입 방식          | 필드, 세터, 생성자 모두 가능    | 생성자 주입 전용                |
| 코드 생성          | 런타임에 Reflection으로 주입 | Lombok이 컴파일 시점에 생성자 생성   |
| `final` 필드     | ❌ 불가능                | ✅ 가능                     |
| 불변성 보장         | ❌                    | ✅                        |
| boilerplate 코드 | 많음                   | 적음                       |
| 권장 여부          | 구식, 권장 X             | ✅ **현재 권장 방식**           |

---

## 💡 결론

> ✅ **지금은 `@RequiredArgsConstructor` + `final` 필드로 생성자 주입하는 방식이 표준입니다.**

그 이유는:

* 테스트 시 Mock 주입이 쉬움
* 필드가 `final`이라 런타임 변경 불가능 (안정성↑)
* Reflection 비용 없음
* 코드가 깔끔함

---
