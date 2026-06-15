---
title: DTO의 필드 네이밍 그대로 리턴하는 방법
date: 2026-06-15
tags:
  - Java
  - Spring
  - DTO
  - field
  - lombok
  - jackson
draft: false
---

프로젝트 중 SAP과 연동을 위해 EAI 연동을 진행하는데 이전 버전이라서 SOAP 연동이 필요했습니다.

ResponseDTO도 WSDL파일과 Axis 라이브러리를 통해 자동 생성해서 SOAP 연동을 이용하여 데이터를 리턴 받는데 필드 명이 모두 대문자이다 보니 

실제 연동 시에 크롬 개발자 도구를 통해 확인해보니 실제 리턴되는 JSON 데이터의 키값이 첫번째 언더바 앞으로 모두 소문자로 변경되는 현상이 발생했습니다.

WSDL을 통해 자동 생성된 DTO라서 직접 수정할 수 없는 상황이기에 DTO 필드에 직접 @JsonProperty를 추가하는 방법도 고려해보았으나 해당 방법은

빌드를 할 때마다 WSDL파일을 확인해서 추가를 해야하는 번거로움이 있어서 다른 방법을 찾던 도중 좋은 방법이 있어 정리해 보았습니다.

첫번째 생각 했던 방식은 잘 모르지만 AOP라는 개념과 Annotation을 합하면 되지 않을까 싶었는데 해당 방법도 가능하지만 ResponseBodyAdvice를 사용하는 것이 더 좋다고 하여 두가지 방식을 정리해 보았습니다.

원인부터 짚어보자면, Lombok이 생성한 Getter(`getId()`, `getE_EMPNO()`)를 Jackson이 JSON으로 직렬화하는 과정에서 자바 빈(Java Bean) 네이밍 규칙을 적용하기 때문에 앞글자가 소문자(`id`, `e_EMPNO`)로 변경되는 것입니다.

DTO 수정 없이 **특정 컨트롤러 메서드에서만** 대문자 필드명(`ID`, `E_EMPNO`)을 그대로 유지하도록 응답하는 가장 좋은 2가지 방법을 Gemini 도움으 받아 아래와 같이 정리해 보았습니다.

---

### 💡 핵심: 필드명을 그대로 읽는 커스텀 ObjectMapper 만들기

어떤 방식을 사용하든, 핵심은 Jackson이 Getter가 아닌 '필드(변수) 자체'를 읽도록 설정된 별도의 `ObjectMapper`를 사용하는 것입니다.

```java
ObjectMapper fieldMapper = new ObjectMapper();
// 모든 기본 접근자(Getter/Setter 등) 비활성화
fieldMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.NONE);
// 오직 필드(Field)만 읽도록 설정
fieldMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);

```

이 `fieldMapper`를 사용하여 DTO를 변환하면 Getter의 네이밍 규칙을 무시하고 `ID`, `E_EMPNO` 원형 그대로 추출할 수 있습니다.

---

### 방법 1. ResponseBodyAdvice + 커스텀 어노테이션 (추천 ⭐)

질문자님이 생각하신 AOP와 거의 같은 원리이지만, Spring MVC에서 **HTTP 응답값을 가로채서 조작할 때 가장 권장되는 표준 방식**입니다. AOP보다 HTTP 메시지 컨버팅 단계에 더 밀접하게 작동하여 안전합니다.

**1. 커스텀 어노테이션 생성**

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface KeepOriginalFieldName {
}

```

**2. ResponseBodyAdvice 구현**

```java
@RestControllerAdvice
public class FieldNamePreserveAdvice implements ResponseBodyAdvice<Object> {

    private final ObjectMapper fieldMapper;

    public FieldNamePreserveAdvice() {
        this.fieldMapper = new ObjectMapper();
        this.fieldMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.NONE);
        this.fieldMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
    }

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        // @KeepOriginalFieldName 어노테이션이 붙은 메서드만 가로챔
        return returnType.hasMethodAnnotation(KeepOriginalFieldName.class);
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        // 1. 기존처럼 필드(변수) 기준으로 JSON 트리 생성
        JsonNode rootNode = fieldMapper.valueToTree(body);

        // 2. 최상위 노드가 Object 형태일 경우 (배열 등이 아닐 경우) Level 1 키값 조작
        if (rootNode.isObject()) {
            ObjectNode objectNode = (ObjectNode) rootNode;
            ObjectNode modifiedNode = fieldMapper.createObjectNode(); // 새로운 JSON 객체 생성

            Iterator<Map.Entry<String, JsonNode>> fields = objectNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                String originalKey = field.getKey();
                
                // 맨 앞글자만 소문자라서 문제라면 앞글자만 대문자로 변경 (e_EMPNO -> E_EMPNO)
                String newKey = originalKey.substring(0, 1).toUpperCase() + originalKey.substring(1);
                
                // (참고) 만약 'id' 같은 변수 전체를 'ID'로 바꿔야 한다면 아래 코드 사용
                // String newKey = originalKey.toUpperCase();

                // 조작된 키값과 기존 값(Level 2 이하 데이터)을 새 노드에 세팅
                modifiedNode.set(newKey, field.getValue());
            }
            
            return modifiedNode; // 키값이 변경된 최종 JSON 리턴
        }

        // 만약 단일 객체가 아니면 그대로 리턴
        return rootNode;
    }
}

```

**3. 컨트롤러에 적용**

```java
@GetMapping("/api/employee")
@KeepOriginalFieldName // 이 어노테이션이 붙은 곳만 대문자 유지!
public GeneratedDto getEmployee() {
    return service.getEmployeeInfo();
}

```

---

### 방법 2. AOP (`@Around`) + 커스텀 어노테이션 (질문자님 아이디어)

만약 이미 프로젝트에 AOP 설정이 잘 되어 있어서 AOP로 통일하고 싶으시다면 이 방식도 완벽하게 작동합니다.

```java
@Aspect
@Component
public class FieldNamePreserveAspect {

    private final ObjectMapper fieldMapper;

    public FieldNamePreserveAspect() {
        this.fieldMapper = new ObjectMapper();
        this.fieldMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.NONE);
        this.fieldMapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
    }

    @Around("@annotation(com.example.annotation.KeepOriginalFieldName)")
    public Object preserveFieldName(ProceedingJoinPoint pjp) throws Throwable {
        Object result = pjp.proceed(); // 원래 메서드 실행 (DTO 리턴)
        
        if (result == null) return null;

        // DTO를 JsonNode(또는 Map)로 변환하여 컨트롤러의 반환값 자체를 바꿔치기함
        return fieldMapper.valueToTree(result);
    }
}

```

*주의: AOP 방식을 사용할 경우 컨트롤러의 리턴 타입이 `Object` 이거나 `JsonNode`를 허용해야 할 수 있습니다. 그래서 통상적으로 응답 조작에는 방법 1(`ResponseBodyAdvice`)**이 타입 충돌 없이 더 깔끔하게 떨어집니다.*