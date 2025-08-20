---
title: SOAP과 REST 연동
date: 2024-01-30
tags:
  - 개발상식
  - SOAP
  - REST
draft: false
---
SOAP과 REST는 다양한 기술로 개발된 어플리케이션 간의 인터넷 데이터 교환 방식이다.

먼저 차이점을 알아보기 전에 SOAP을 알아보자.

#### **SOAP이란**

SOAP은 애플리케이션 간에 통신할 수 있는 **프로토콜**이다. 프로토콜이기 때문에 복잡성과 오버헤드를 증가시키는 빌트인 룰을 적용하는데 이로 인해 페이지 로드 시간이 길어질 수 있다는 단점이 있다. 하지만 이러한 빌트인 룰은 빌트인 컴플라이언스를 제공하는데 컴플라이언스 표준에는 보안과 안정적인 데이터베이스 트랜잭션의 기본 속성인 원자성, 일관성, 격리성, 내구성(Atomicity, Consistency, Isolation and Durability, ACID)이 포함되어 기업에서 선호될 수 있다는 장점이 있다.

또한 SOAP은 엄격한 통신 규칙이 있어 아래와 같은 표준이 있다.

-   **웹 서비스 보안(WS-security)**: 토큰이라고 불리는 고유 식별자를 통해 메시지를 보호하고 전송하는 방식을 표준화한다.
-   **WS-ReliableMessaging**: 불안정한 IT 인프라로 전송되는 메시지 간 오류 처리를 표준화한다.
-   **웹 서비스 주소지정(WS-addressing)**: 심층 네트워크에 라우팅 정보를 유지관리하는 대신, SOAP 헤더 내에 메타데이터로 해당 정보를 패키징한다.
-   **웹 서비스 기술 언어(WSDL)**: 웹 서비스가 무엇을 하는지, 해당 서비스의 시작과 종료 위치를 기술한다.

SOAP API로 전송되는 경우에는 HTTP(웹 브라우저), SMTP(이메일), TCP 등의 다양한 애플리케이션 레이어 프로토콜을 통해 처리될 수 있고 인간과 기계가 모두 읽을 수 있는 XML 데이터 형식으로 메세지를 주고 받는다. 또한 SOAP은 REST와

다르게 브라우저에서 캐시할 수 없으므로 API를 재전송 하지 않은 한 이후에 접근할 수 없다.

#### **REST API란**

REST API는 작동 방식에 6가지 원칙을 가지고 있는 아키텍처 스타일로 아래와 같은 원칙을 가지고 있다.

1.  클라이언트-서버 간에 서로 기술, 플랫폼, 언어 등이 **독립적**이다.
2.  서버에 클라이언트 요청을 완료하기 위해 함께 동작하는 여러 중개자가 있을 순 있지만 클라이언트에게 보이지 않는 **계층화**의 특성을 가지고 있다.
3.  API는 전체적으로 완전히 사용할 수 있는 표준 형식으로 데이터를 반환하는 **균일한 인터페이스**
4.  API는 이전 요청과 독립적인 **STATELESS**
5.  모든 API 응답은 **캐싱** 가능
6.  필요한 경우 API 응답에 코드 스니펫 포함 가능(**온디멘드 코드**)

#### **SOAP과 REST의 유사점**

-   애플리케이션이 다른 애플리케이션의 데이터 요청을 작성, 처리 및 응답하는 방식에 대해 규칙과 표준을 설명
-   표준화된 인터넷 프로토콜인 HTTP를 사용하여 정보를 교환
-   안전하고 암호화된 SSL/TLS를 지원함

#### **SOAP과 REST의 차이점**

SOAP는 프로토콜이고 REST는 아키텍처 스타일로 SOAP API와 REST API의 동작 방식이 크게 달라진다.

-   설계  
    **_SOAP_** API는 함수 또는 작업을 노출하는 반면 REST API는 데이터 기반. SOAP의 경우에는 수행할 함수를 SOAP 메세지에 포함해야 하지만 **_REST_**는 URL로 구분
-   유연성  
    **_SOAP_** 은 애플리케이션간 XML 메세징만 허용하지만 **_REST_**의 경우 STATELESS하여 모든 요청을 이전 요청과 독립적으로 다양한(일반 텍스트, HTML, XML 및 JSON ) 데이터로 전송 가능
-   성능  
    **_SOAP_** 은 메시지는 더 크고 복잡하기 때문에 전송 및 처리 속도가 느려지고 이로 인해 페이지 로드 시간이 늘어날 수 있는 반면 **_REST_**는 메시지 크기가 작거 캐싱이 가능하여 SOAP보다 빠르고 효율적이다.
-   확장성  
    **_SOAP_** 프로토콜을 사용하려면 애플리케이션이 요청 간에 상태를 저장해야 하므로 대역폭과 메모리 요구 사항이 증가해서 애플리케이션 비용이 많이 들고 확장하기가 어려워지고 **_REST_**의 경우 무상태 및 계층화된 아키텍처를 허용하므로 확장성이 뛰어난다.
-   보안  
    **_SOAP_**를 HTTPS와 함께 사용하려면 추가 WS-Security 계층이 필요합니다. WS-Security는 추가 헤더 콘텐츠를 사용하여 지정된 서버의 지정된 프로세스만 SOAP 메시지 콘텐츠를 읽도록 합니다. 이로 인해 통신 오버헤드가 추가되고 성능에 부정적인 영향을 미치는 반면 **_REST_**는 추가 오버헤드 없이 HTTPS를 지원
-   신뢰성  
    SOAP에는 오류 처리 로직이 내장되어 있으며 더 높은 신뢰성을 제공하는 반면 **_REST_**는 통신 장애 발생 시 다시 시도해야 하며 안정성이 떨어진다.

#### **차이점 요약**

|   | SOAP | REST |
| --- | --- | --- |
| 의미 | Simple Object Access Protocol | Representational State Transfer |
| 무엇인가 | 애플리케이션 간 통신을 위한 프로토콜 | 통신 인터페이스를 설계하기 위한 아키텍처 스타일 |
| 설계 | 작업을 노출 | 데이터를 노출 |
| 전송 프로토콜 | 독립적이며 모든 전송 프로토콜과 함께 작동할 수 있다. | HTTPS에서만 작동 |
| 데이터 형식 | XML 데이터 교환만 지원 | XML, JSON, 일반 텍스트, HTML을 지원 |
| 성능 | 메시지가 커서 통신 속도가 느림 | 작은 메시지와 캐싱 지원으로 더 빠름 |
| 확장성 | 어려움   서버는 클라이언트와 교환한 이전 메세지를 모두 저장하여 상태 유지 | 쉬움   STATELESS하여 모든 메세지가 이전 메세지와 독립적 |
| 보안 | 추가 오버헤드가 있는 암호화를 지원 | 성능에 영향을 주지 않고 암호화를 지원 |
| 사용 사례 | 레거시 애플리케이션 및 프라이빗 API에서 유용 | 최신 애플리케이션 및 공개 API에서 유용 |

출처[SOAP와 REST 비교 - API 기술 간의 차이점 - AWS (amazon.com)](https://aws.amazon.com/ko/compare/the-difference-between-soap-rest/)

 [SOAP와 REST 비교 - API 기술 간의 차이점 - AWS

Amazon Web Services(AWS)는 API 요구 사항을 지원하는 Amazon API Gateway를 제공합니다. API Gateway는 어떤 규모에서든 개발자가 API를 손쉽게 생성, 게시, 유지 관리, 모니터링 및 보안 유지할 수 있도록 하는

aws.amazon.com](https://aws.amazon.com/ko/compare/the-difference-between-soap-rest/)

[REST vs SOAP: REST와 SOAP 개념, 특징, 차이점, 장단점 비교 (redhat.com)](https://www.redhat.com/ko/topics/integration/whats-the-difference-between-soap-rest)

 [REST vs SOAP: REST와 SOAP 개념, 특징, 차이점, 장단점 비교

REST와 SOAP가 사용 사례와 요구사항을 충족시키는 방식을 상세히 비교하여, 기술 전문가들이 어떤 상황에서 어떤 프로토콜을 선택하는 것이 적합한지 제시합니다.

www.redhat.com](https://www.redhat.com/ko/topics/integration/whats-the-difference-between-soap-rest)