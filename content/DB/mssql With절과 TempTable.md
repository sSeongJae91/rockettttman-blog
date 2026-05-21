---
title: MSSQL Declare
date: 2026-05-01
tags:
  - DB
  - MSSQL
  - WITH
  - TempTable
draft: false
---

MSSQL에서 **CTE(Common Table Expression)** 와 **TEMP TABLE(#임시테이블)** 은 둘 다 임시 데이터를 다룰 때 쓰지만, **목적·수명·성능 특성**이 다릅니다. 실무 면접에서도 자주 나오는 질문입니다.

---

# 한눈에 비교

| 항목               | CTE                 | TEMP TABLE                                |
| ---------------- | ------------------- | ----------------------------------------- |
| 생성 방식            | `WITH ... AS (...)` | `CREATE TABLE #T` 또는 `SELECT ... INTO #T` |
| 저장 위치            | 논리적 결과 집합(쿼리 범위)    | `tempdb` 실제 임시 테이블                        |
| 사용 범위            | **바로 다음 1개 문장**     | 세션/프로시저 내 여러 문장에서 사용                      |
| 인덱스 생성           | 직접 생성 불가            | 가능 (`CREATE INDEX`)                       |
| 통계정보(Statistics) | 제한적/없음              | 있음 (옵티마이저 활용 가능)                          |
| 재사용성             | 낮음                  | 높음                                        |
| 재귀 쿼리            | **가능**              | 직접 기능 없음                                  |
| 대량 데이터 중간 저장     | 비추천                 | 유리                                        |
| 가독성              | 매우 좋음               | 보통                                        |

---

# 1. CTE란?

쿼리 안에서 잠깐 쓰는 **이름 있는 서브쿼리** 느낌입니다.

```sql id="8lq8c0"
;WITH EMP AS (
    SELECT *
    FROM EMPLOYEE
    WHERE DEPT = 'IT'
)
SELECT *
FROM EMP
WHERE SALARY >= 6000;
```

### 특징

* 코드가 깔끔해짐
* 복잡한 쿼리 분리 가능
* 재귀 가능
* 한 번의 SQL 문장에서만 사용 가능

---

# 2. TEMP TABLE란?

실제로 `tempdb`에 만들어지는 **임시 테이블**입니다.

```sql id="udq8t8"
SELECT *
INTO #EMP
FROM EMPLOYEE
WHERE DEPT = 'IT';

SELECT *
FROM #EMP
WHERE SALARY >= 6000;

DROP TABLE #EMP;
```

### 특징

* 여러 번 조회 가능
* JOIN 반복 사용 가능
* 인덱스 생성 가능
* 대용량 중간 결과 처리에 강함

---

# 3. 가장 큰 차이: 재사용 여부

## CTE는 한 번만 사용 가능

```sql id="2lg8wc"
;WITH A AS (
    SELECT * FROM EMPLOYEE
)
SELECT * FROM A;

-- 아래는 오류
SELECT * FROM A;
```

## TEMP TABLE은 여러 번 사용 가능

```sql id="0g6lzh"
SELECT * INTO #A FROM EMPLOYEE;

SELECT COUNT(*) FROM #A;
SELECT * FROM #A;
SELECT * FROM #A WHERE SALARY > 5000;
```

---

# 4. 성능 차이

## CTE가 유리한 경우

* 단순 필터링
* 읽기 쉬운 SQL 작성
* 한 번만 사용하는 중간 결과
* 재귀 트리 구조 조회

## TEMP TABLE이 유리한 경우

* 대량 데이터
* 같은 결과를 여러 번 JOIN
* 복잡한 통계/집계 반복
* 인덱스 필요

---

# 5. 실무 예시

## CTE 추천

페이징 처리:

```sql id="qqzxlt"
;WITH DATA AS (
    SELECT ROW_NUMBER() OVER(ORDER BY ID DESC) RN, *
    FROM BOARD
)
SELECT *
FROM DATA
WHERE RN BETWEEN 1 AND 10;
```

---

## TEMP TABLE 추천

매출 데이터를 여러 번 분석:

```sql id="d9rjlwm"
SELECT *
INTO #SALES
FROM SALES
WHERE SALE_DATE >= '2026-01-01';

SELECT DEPT, SUM(AMOUNT) FROM #SALES GROUP BY DEPT;
SELECT EMP_ID, COUNT(*) FROM #SALES GROUP BY EMP_ID;
```

한 번 저장 후 여러 번 재활용 가능.

---

# 6. 면접 답변 스타일 한 줄 정리

> CTE는 쿼리 가독성과 일회성 중간 결과 처리에 적합하고,
> TEMP TABLE은 대량 데이터를 여러 단계로 재사용하거나 인덱싱이 필요할 때 적합합니다.

---

# 7. 실무 팁 (중요)

복잡한 쿼리 느릴 때:

* CTE 여러 겹 중첩 → 느려질 수 있음
* 중간 결과를 `#TEMP`로 끊어서 저장하면 빨라지는 경우 많음

즉,

> **읽기 좋으면 CTE**
> **속도 중요하면 TEMP TABLE 검토**

---

# 8. 언제 뭘 쓰냐?

### CTE 사용

* 조회 SQL 깔끔하게 만들기
* 조직도/댓글 트리
* 페이징

### TEMP TABLE 사용

* 배치 작업
* 리포트 쿼리
* 수십만 건 이상 가공
* 여러 단계 JOIN

---

# 9. 실무자들이 자주 하는 선택

```sql id="r85znd"
1차 필터링 -> #TEMP 저장
2차 JOIN
3차 집계
4차 결과 출력
```

복잡한 리포트성 SQL은 보통 TEMP TABLE 많이 씁니다.
