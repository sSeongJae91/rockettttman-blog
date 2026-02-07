---
title: MSSQL Declare
date: 2025-02-07
tags:
  - DB
  - MSSQL
  - DECLARE
draft: false
---

회사 프로젝트 중 다른 차장님들께서 DECLARE를 많이 활용하는 모습을 보았고 **공통 변수**(예를 들면 환율이나 특정 단위 등 반복적인 숫자)나 **공통 임시테이블** 등에 활용하기 좋은 방법이라 아래와 같이 정리하였습니다.

## 🧩 기본 개념

### 📘 문법

```sql
DECLARE @변수명 데이터형 [= 초기값];
```

* `@` : SQL Server에서 변수를 나타냄 (항상 `@`로 시작)
* `변수명` : 변수 이름
* `데이터형` : INT, VARCHAR, DATETIME 등 SQL 데이터 타입
* `초기값` : 선택 사항. `SET`이나 `SELECT`로 나중에 값을 넣을 수도 있음.

---

## 🧮 예제 1: 단일 변수 선언

```sql
DECLARE @name NVARCHAR(50);
SET @name = '성재';

SELECT @name AS UserName;
```

✅ 실행 결과:

| UserName |
| -------- |
| 성재       |

---

## 🧮 예제 2: 여러 변수 한 번에 선언

```sql
DECLARE 
  @userId INT,
  @userName NVARCHAR(50),
  @joinDate DATETIME;

SET @userId = 1;
SET @userName = '홍길동';
SET @joinDate = GETDATE();

SELECT @userId AS ID, @userName AS Name, @joinDate AS JoinedAt;
```

---

## 🧮 예제 3: `SELECT`로 여러 변수 값 한 번에 세팅

```sql
DECLARE @name NVARCHAR(50), @age INT;

SELECT 
  @name = Name,
  @age = Age
FROM Users
WHERE Id = 1;

SELECT @name AS UserName, @age AS UserAge;
```

---

## 🧩 `DECLARE`로 테이블 변수 선언하기

MSSQL에서는 **테이블 형태의 변수**도 선언할 수 있습니다.
임시 테이블(`#temp`)과 비슷하지만 **스코프(scope)** 는 현재 실행 블록 내로 한정됩니다.

```sql
DECLARE @UserTable TABLE (
  Id INT,
  Name NVARCHAR(50)
);

INSERT INTO @UserTable VALUES (1, '홍길동'), (2, '이몽룡');

SELECT * FROM @UserTable;
```

✅ 결과:

| Id | Name |
| -- | ---- |
| 1  | 홍길동  |
| 2  | 이몽룡  |

---

## 🧠 정리

| 구분           | 설명                       |
| ------------ | ------------------------ |
| **DECLARE**  | 변수를 선언                   |
| **SET**      | 변수에 값 할당 (한 번에 하나만 가능)   |
| **SELECT**   | 여러 변수에 값을 한 번에 대입 가능     |
| **@**        | 사용자 정의 변수의 접두사           |
| **TABLE 변수** | 임시 데이터를 저장할 수 있는 변수형 테이블 |

---

## ⚠️ 주의할 점

* `DECLARE`로 선언된 변수는 **현재 batch, stored procedure, 함수 내에서만 유효**합니다.
  즉, **`GO` 문 이후에는 사라집니다.**
* SQL Server는 변수의 **스코프(scope)** 를 엄격히 구분합니다.

---