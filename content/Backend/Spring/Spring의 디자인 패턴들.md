# Spring Framework에서 사용하는 디자인 패턴들
(싱글톤, 팩토리, 프록시, 전략(Strategy), 템플릿 메서드 패턴)

---

# 1. 싱글톤(Singleton) 패턴

**의도**: 애플리케이션 전역에서 단 하나의 인스턴스만 존재하도록 보장하고 그 인스턴스에 접근할 수 있게 합니다.

**언제 쓰나?**

* 로깅, 설정값 보관(Configuration), 커넥션 풀(관리 객체) 등 단일 인스턴스가 적절할 때.

**장점**

* 전역 접근 지점 제공.
* 상태 공유가 필요할 때 편리.

**단점**

* 전역 상태로 설계가 꼬일 수 있음(테스트/병렬성 문제).
* 잘못 구현하면 멀티스레드 이슈 발생.

**권장 구현(간단하고 안전한)**: `enum` 싱글톤 (직렬화/리플렉션 안전성 제공)

```java
public enum Config {
    INSTANCE;

    private String value = "default";

    public String getValue() { return value; }
    public void setValue(String v) { value = v; }
}

// 사용
Config.INSTANCE.setValue("hello");
String v = Config.INSTANCE.getValue();
```

**대안(지연 초기화가 필요할 때)**: Holder 패턴

```java
public class LazySingleton {
    private LazySingleton() {}
    private static class Holder {
        static final LazySingleton INSTANCE = new LazySingleton();
    }
    public static LazySingleton getInstance() {
        return Holder.INSTANCE;
    }
}
```

---

# 2. 팩토리(Factory) 패턴

**의도**: 객체 생성 로직을 캡슐화(은닉)하여 클라이언트 코드를 생성 방식으로부터 분리한다.
(팩토리는 여러 형태가 있음: Simple Factory(유틸성), Factory Method, Abstract Factory)

**언제 쓰나?**

* 객체 생성이 복잡하거나, 생성 시점에 서브클래스 선택 로직이 있을 때.
* 코드에서 직접 `new`를 많이 쓰면 결합도가 높아질 때.

**장점**

* 확장성: 새로운 제품(클래스) 추가 시 클라이언트 변경 최소화.
* 결합도 감소.

**단점**

* 팩토리 코드가 비대해질 수 있음(특히 Simple Factory).
* 필요 이상으로 추상화하면 복잡해짐.

**간단한 예 — Shape 팩토리 (Simple Factory)**

```java
// 제품 인터페이스
public interface Shape {
    void draw();
}

public class Circle implements Shape {
    public void draw() { System.out.println("Circle"); }
}
public class Rectangle implements Shape {
    public void draw() { System.out.println("Rectangle"); }
}

// 팩토리
public class ShapeFactory {
    public static Shape create(String type) {
        switch(type.toLowerCase()) {
            case "circle": return new Circle();
            case "rectangle": return new Rectangle();
            default: throw new IllegalArgumentException("Unknown");
        }
    }
}

// 사용
Shape s = ShapeFactory.create("circle");
s.draw();
```

**Factory Method (구현 아이디어)**: 서브클래스가 어떤 구체적 제품을 만들지 결정하도록 할 때 사용.

---

# 3. 프록시(Proxy) 패턴

**의도**: 다른 객체에 대한 접근을 제어하거나 추가 처리를 하기 위해 접근 지점(대리자)을 제공한다. (보안, 캐싱, 로깅, 지연로딩 등)

**언제 쓰나?**

* 실제 객체 접근 전에 보안/권한 검사
* 비용이 큰 객체를 필요할 때만 생성(lazy)
* 호출 전후에 로깅/측정 추가

**장점**

* 기존 코드를 변경하지 않고 기능 추가 가능.
* 접근 제어(보안) 용이.

**단점**

* 레이어가 하나 더 생겨 복잡성 증가.
* 성능 오버헤드(추가 호출).

**간단한 예 — 로깅 프록시 (정적 프록시)**

```java
public interface Service {
    void execute();
}

public class RealService implements Service {
    public void execute() {
        System.out.println("RealService 실행");
    }
}

// 프록시
public class LoggingProxy implements Service {
    private final Service real;
    public LoggingProxy(Service real) { this.real = real; }
    public void execute() {
        System.out.println("[LOG] 시작");
        real.execute();
        System.out.println("[LOG] 끝");
    }
}

// 사용
Service svc = new LoggingProxy(new RealService());
svc.execute();
```

**동적 프록시(Java Reflection)**: 인터페이스 기반이면 `java.lang.reflect.Proxy`로 런타임에 프록시 생성 가능 — AOP 스타일 구현에 적합.

---

# 4. 전략(Strategy) 패턴

**의도**
* 알고리즘(또는 행위)을 캡슐화하여 런타임에 교체할 수 있게 합니다. (행위의 다형성)
* 자신의 기능 맥락에서 필요에 따라 변경이 필요한 알고리즘(독립적인 책임으로 분리가 가능한 기능)을 인터페이스를 통해 통째로 외부로 분리시키고, 이를 구현한 구체적인 알고리즘 클래스를 필요에 따라 바꿔서 사용할 수 있게 하는 디자인 패턴입니다.

**언제 쓰나?**

* 동일 문제에 대해 여러 알고리즘(정렬, 결제, 할인 정책 등)을 교체해서 사용해야 할 때.
* 조건문(switch/case, if-else)을 줄이고 싶을 때.

**장점**

* 알고리즘 교체 용이(확장성).
* 단위 테스트, 재사용성 향상.

**단점**

* 클래스 수 증가(전략 클래스들).
* 런타임 연결 책임이 필요함(컨텍스트).

**간단한 예 — 결제 전략**

```java
public interface PaymentStrategy {
    void pay(int amount);
}

public class CreditCardPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("신용카드로 " + amount + "원 결제");
    }
}
public class PayPalPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("PayPal로 " + amount + "원 결제");
    }
}

// 컨텍스트
public class PaymentContext {
    private PaymentStrategy strategy;
    public PaymentContext(PaymentStrategy strategy) { this.strategy = strategy; }
    public void setStrategy(PaymentStrategy s) { this.strategy = s; }
    public void pay(int amount) { strategy.pay(amount); }
}

// 사용
PaymentContext ctx = new PaymentContext(new CreditCardPayment());
ctx.pay(10000);
ctx.setStrategy(new PayPalPayment());
ctx.pay(5000);
```

---

# 5. 템플릿 메서드(Template Method) 패턴

**의도**: 알고리즘의 뼈대(골격)를 정의하고, 일부 단계를 서브클래스가 구현하게 하여 알고리즘 구조는 변하지 않게 하되 세부는 확장 가능하게 만든다.

**언제 쓰나?**

* 전체 흐름은 고정인데 일부 단계가 클래스마다 다를 때 (데이터 파싱, 작업흐름 등).

**장점**

* 공통 로직의 재사용.
* 코드 중복 감소.

**단점**

* 상속 사용으로 유연성 감소(구성 방식보다 덜 유연).
* 하위클래스가 슈퍼클래스 내부 구현에 의존할 수 있음.

**간단한 예 — 데이터 파서**

```java
public abstract class DataParser {
    // 템플릿 메서드(변하지 않는 골격)
    public final void parseAndPrint() {
        readData();
        parseData();
        print();
    }

    protected abstract void readData();
    protected abstract void parseData();
    protected void print() {
        System.out.println("출력(기본)");
    }
}

public class CsvParser extends DataParser {
    protected void readData() { System.out.println("CSV 읽기"); }
    protected void parseData() { System.out.println("CSV 파싱"); }
}

public class JsonParser extends DataParser {
    protected void readData() { System.out.println("JSON 읽기"); }
    protected void parseData() { System.out.println("JSON 파싱"); }
}

// 사용
DataParser p1 = new CsvParser();
p1.parseAndPrint();

DataParser p2 = new JsonParser();
p2.parseAndPrint();
```

---

# 패턴들 간 관계 및 선택 가이드 (짧게)

* **싱글톤**은 인스턴스 수 제어(전역) 필요할 때.
* **팩토리**는 객체 생성 책임을 분리하고 싶을 때.
* **프록시**는 대상 접근을 제어하거나 기능(로깅/캐시/보안)을 추가할 때.
* **전략**은 알고리즘을 캡슐화하고 런타임 교체가 필요할 때.
* **템플릿 메서드**는 알고리즘의 뼈대는 같고 일부 단계만 변할 때(상속 기반).

실무에서는 이 패턴들을 조합해서 사용합니다. 예: 팩토리로 객체 생성 → 싱글톤으로 관리 → 프록시로 접근 제어 → 전력 전략으로 행위 교체 등.

---

