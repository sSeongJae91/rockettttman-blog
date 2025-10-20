---
title: Java Exception
date: 2025-10-20
tags:
  - Java
  - exception
  - try catch
  - throw
  - throws
draft: false
---

**Java의 예외 처리(Exception Handling)** 전반을 체계적으로 정리해볼게요.
그림과 표를 포함해서 시각적으로 이해하기 쉽게 설명하겠습니다.

---

## 💡 1. 예외(Exception)란?

> **프로그램 실행 중에 발생하는 비정상적인 상황(오류)을 말함**

예:

* 파일이 없는데 열려고 할 때
* 0으로 나누는 경우
* 네트워크 연결이 끊긴 경우

자바에서는 이런 예외를 **객체로 다룸**
즉, `Exception` 클래스나 그 하위 클래스의 인스턴스로 표현됨.

---

## ⚙️ 2. 예외 처리 방식 (`try-catch`, `throw`, `throws`)

| 구문                          | 역할                                     | 예시                                                 |
| --------------------------- | -------------------------------------- | -------------------------------------------------- |
| `try { ... } catch { ... }` | 예외가 발생할 가능성이 있는 코드를 감싸고, 발생 시 처리       | `try { int a = 5/0; } catch (Exception e) { ... }` |
| `throw`                     | 예외를 **직접 발생시킬 때** 사용                   | `throw new IllegalArgumentException("잘못된 입력")`     |
| `throws`                    | 메서드 선언부에서 **예외를 미룰 때(호출한 쪽에서 처리하게 함)** | `void readFile() throws IOException { ... }`       |

---

### ✅ 예시 코드

```java
import java.io.*;

public class ExceptionExample {
    public static void main(String[] args) {
        try {
            readFile("test.txt");
        } catch (IOException e) {
            System.out.println("파일을 읽는 중 오류 발생: " + e.getMessage());
        }
    }

    // 메서드가 IOException을 던질 수 있다고 선언
    public static void readFile(String fileName) throws IOException {
        FileReader reader = new FileReader(fileName); // 파일이 없으면 예외 발생
        reader.close();
    }
}
```

---

## 🌳 3. 예외 클래스 계층 구조

자바의 `Throwable` 계층은 다음과 같이 구성되어 있어요 👇

```
Throwable
├── Error                ← 시스템 레벨의 오류 (개발자가 처리하지 않음)
│   ├── OutOfMemoryError
│   └── StackOverflowError
│
└── Exception            ← 개발자가 처리해야 하는 예외
    ├── Checked Exception
    │   ├── IOException
    │   ├── SQLException
    │   └── ClassNotFoundException
    │
    └── Unchecked Exception (RuntimeException)
        ├── NullPointerException
        ├── IllegalArgumentException
        ├── ArithmeticException
        └── IndexOutOfBoundsException
```

---

## 📊 4. Checked vs Unchecked 예외 비교표

| 구분       | Checked Exception                                       | Unchecked Exception                                                       |
| -------- | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| 상속 클래스   | `Exception` (단, `RuntimeException` 제외)                  | `RuntimeException` 및 그 하위 클래스                                             |
| 컴파일 시점   | 반드시 처리해야 함 (`try-catch` or `throws`)                    | 컴파일러가 강제하지 않음                                                             |
| 발생 시점    | 외부 요인 (파일, 네트워크, DB 등)                                  | 주로 프로그래밍 실수                                                               |
| 예시       | `IOException`, `SQLException`, `ClassNotFoundException` | `NullPointerException`, `IllegalArgumentException`, `ArithmeticException` |
| 처리 권장 여부 | 명시적으로 처리해야 함                                            | 코드 논리로 예방하는 것이 좋음                                                         |

---

### 📘 예시 비교

#### ✅ Checked Exception

```java
try {
    FileReader fr = new FileReader("file.txt");
} catch (IOException e) {
    e.printStackTrace();
}
```

> 파일이 없을 수 있으므로 반드시 처리 필요

#### ⚠️ Unchecked Exception

```java
String str = null;
System.out.println(str.length());  // NullPointerException 발생
```

> 이런 경우는 코드 논리로 예방 (`if (str != null)` 등)

---

## 🎨 시각적 요약 (계층 구조 그림)

```
            Throwable
           /        \
       Error       Exception
                    /       \
          Checked (컴파일러 강제)
                        \
                        Unchecked (Runtime)
```

* **Error** → JVM 자체 문제 (메모리 부족, 스택 오버플로우)
* **Checked Exception** → 외부 자원 문제 (파일, DB, 네트워크)
* **Unchecked Exception** → 프로그래머 실수 (null, 인덱스, 수학적 오류)

---

## 🧭 5. 예외 처리 전략 요약

| 전략              | 설명                                                         |
| --------------- | ---------------------------------------------------------- |
| 1️⃣ `try-catch` | 직접 처리 가능한 경우 (ex. 기본적인 복구, 로그)                             |
| 2️⃣ `throws`    | 상위 호출자에게 예외를 위임                                            |
| 3️⃣ `throw`     | 명시적으로 예외를 발생시켜 로직 제어                                       |
| 4️⃣ 커스텀 예외      | `extends Exception` 또는 `extends RuntimeException`으로 사용자 정의 |

예시:

```java
class InvalidUserException extends RuntimeException {
    public InvalidUserException(String msg) {
        super(msg);
    }
}
```

---

## 💬 정리 요약

| 항목       | Checked                   | Unchecked                                 |
| -------- | ------------------------- | ----------------------------------------- |
| 강제 처리    | ✅                         | ❌                                         |
| 주로 발생 이유 | 외부 자원                     | 프로그래머 실수                                  |
| 대표 클래스   | IOException, SQLException | NullPointerException, ArithmeticException |
| 처리 방법    | try-catch 또는 throws       | 논리적 예방                                    |

---