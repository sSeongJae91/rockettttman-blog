CORS(Cross-Origin Resource Sharing)는 **웹 브라우저의 보안 정책 중 하나**로,
**다른 출처(origin)**의 리소스(데이터, API 등)에 접근할 때 이를 **제한하거나 허용**하기 위한 메커니즘입니다.

---

## 🌍 1. 먼저 “출처(Origin)”란?

출처는 **URL의 세 가지 요소**로 구성됩니다.

| 요소   | 예시            |
| ---- | ------------- |
| 프로토콜 | `https://`    |
| 도메인  | `example.com` |
| 포트   | `:3000`       |

이 세 가지 중 **하나라도 다르면 다른 출처**로 간주합니다.
예를 들어:

| 요청 주소                      | 비교 대상                 | 같은 출처인가?       |
| -------------------------- | --------------------- | -------------- |
| `https://example.com`      | `https://example.com` | ✅ 같음           |
| `http://example.com`       | `https://example.com` | ❌ 다름 (프로토콜 다름) |
| `https://api.example.com`  | `https://example.com` | ❌ 다름 (도메인 다름)  |
| `https://example.com:3000` | `https://example.com` | ❌ 다름 (포트 다름)   |

---

## 🧱 2. CORS가 필요한 이유

브라우저는 **보안상** 기본적으로 **다른 출처로부터의 요청을 차단**합니다.
하지만, 실제로는 **서버(API)** 와 **프론트엔드(React, Vue 등)** 가 서로 다른 도메인일 때가 많죠.

예를 들어:

* 프론트: `http://localhost:3000`
* 백엔드: `http://localhost:8080`

이때 프론트에서 fetch를 하면:

```js
fetch("http://localhost:8080/api/data")
```

브라우저가 **CORS 정책 위반**으로 요청을 막습니다.

---

## 🔑 3. 서버가 CORS를 허용하는 방법

서버에서 **특정 출처를 허용하는 HTTP 헤더**를 설정하면 됩니다.

### ✅ 대표 헤더: `Access-Control-Allow-Origin`

```http
Access-Control-Allow-Origin: https://example.com
```

또는 개발 중엔 모든 출처 허용 (주의 필요)

```http
Access-Control-Allow-Origin: *
```

### 다른 관련 헤더들

| 헤더 이름                              | 설명                                        |
| ---------------------------------- | ----------------------------------------- |
| `Access-Control-Allow-Methods`     | 허용할 HTTP 메서드 (`GET, POST, PUT, DELETE`)   |
| `Access-Control-Allow-Headers`     | 허용할 요청 헤더 목록                              |
| `Access-Control-Allow-Credentials` | 인증 정보(쿠키, 토큰 등) 포함 여부 (`true` or `false`) |

---

## ⚙️ 4. Preflight 요청 (OPTIONS 요청)

CORS 요청 중 일부(`POST`, `PUT`, `DELETE` 등)는
실제 요청 전에 **“미리 확인 요청” (preflight)** 을 보냅니다.

브라우저가 자동으로 보냄 👇

```http
OPTIONS /api/data
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

서버는 이에 응답해야 함 👇

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type
```

이 응답이 정상적이면 브라우저가 실제 요청(`POST /api/data`)을 이어서 보냅니다.

---

## 🧩 5. 프레임워크별 설정 예시

### Node.js (Express)

```js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.get('/api/data', (req, res) => {
  res.json({ message: 'ok' });
});

app.listen(8080);
```

### Spring Boot

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ApiController {
    @GetMapping("/api/data")
    public String getData() {
        return "ok";
    }
}
```

---

## ⚠️ 6. 주의할 점

* `Access-Control-Allow-Origin: *` 와 `credentials: true` 는 **함께 사용할 수 없습니다.**
* CORS는 **서버가 허용해야만** 통과됩니다.
  → 클라이언트 쪽에서만 설정해도 소용 없음.
* 서버 간 통신(예: 백엔드 → DB)은 CORS와 무관합니다.
  → CORS는 “브라우저 보안 정책”임을 기억하세요.

---

## 🧠 한 줄 요약

> CORS는 브라우저가 **다른 출처의 리소스 요청을 제한**하는 정책이며,
> 서버가 **HTTP 헤더로 명시적으로 허용**해야 클라이언트가 정상적으로 데이터를 가져올 수 있다.

---
