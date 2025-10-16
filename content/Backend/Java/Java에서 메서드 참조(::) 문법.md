Java에서 `::` 는 **메서드 참조(Method Reference)** 라고 부르는 문법입니다.
이건 **람다(lambda)** 를 더 간결하게 표현하기 위한 문법이며, **Java 8 (2014)** 버전부터 지원됩니다.

---

## 🧠 1. `::` (메서드 참조)란?

`::` 는 **“람다 표현식에서 이미 존재하는 메서드를 그대로 쓰는 경우”** 에 사용돼요.
즉, 어떤 객체나 클래스의 메서드를 **그대로 참조해서 호출**할 때 사용됩니다.

예를 들어,

```java
list.forEach(s -> System.out.println(s));
```

이 코드는 `System.out::println` 으로 줄일 수 있어요 👇

```java
list.forEach(System.out::println);
```

---

## 📘 2. 메서드 참조의 4가지 유형

| 유형                    | 형태             | 설명                       | 예시                    |
| --------------------- | -------------- | ------------------------ | --------------------- |
| ① 정적 메서드 참조           | `클래스명::메서드명`   | 클래스의 static 메서드를 참조      | `Math::abs`           |
| ② 특정 객체의 인스턴스 메서드 참조  | `객체참조변수::메서드명` | 이미 존재하는 객체의 메서드 참조       | `System.out::println` |
| ③ 특정 클래스의 인스턴스 메서드 참조 | `클래스명::메서드명`   | 어떤 타입의 인스턴스에서 메서드를 호출할 때 | `String::toUpperCase` |
| ④ 생성자 참조              | `클래스명::new`    | 객체 생성시 생성자를 참조           | `ArrayList::new`      |

---

## 💡 3. 간단한 예제들

### (1) 정적 메서드 참조

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        String[] words = {"Java", "Python", "C++", "Go"};
        
        // 람다식
        Arrays.sort(words, (a, b) -> a.compareToIgnoreCase(b));
        
        // 메서드 참조로 변경
        Arrays.sort(words, String::compareToIgnoreCase);
        
        System.out.println(Arrays.toString(words));
    }
}
```

---

### (2) 인스턴스 메서드 참조

```java
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Kim", "Lee", "Park");

        // 람다식
        names.forEach(name -> System.out.println(name));

        // 메서드 참조
        names.forEach(System.out::println);
    }
}
```

---

### (3) 생성자 참조

```java
import java.util.function.Supplier;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // 람다식
        Supplier<ArrayList<String>> supplier1 = () -> new ArrayList<>();

        // 생성자 참조
        Supplier<ArrayList<String>> supplier2 = ArrayList::new;

        ArrayList<String> list = supplier2.get();
        list.add("Hello");
        System.out.println(list);
    }
}
```

---

## 🧩 4. 정리

| 항목       | 설명                                                             |
| -------- | -------------------------------------------------------------- |
| 문법 기호    | `::`                                                           |
| 명칭       | 메서드 참조 (Method Reference)                                      |
| 도입 버전    | **Java 8**                                                     |
| 주된 목적    | 람다식을 더 간결하게 표현                                                 |
| 자주 쓰는 형태 | `System.out::println`, `String::toUpperCase`, `ArrayList::new` |

---

원하면 제가 각 타입별로 **람다식 → 메서드 참조 변환 표** 정리도 깔끔하게 만들어드릴까요?
