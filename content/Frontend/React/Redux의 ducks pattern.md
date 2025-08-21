---
title: Redux의 ducks pattern
date: 2023-01-10
tags:
  - Frontend
  - vue3
  - volar
draft: false
---
![img](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FM0Uik%2Fbtrb7axXK2K%2FAAAAAAAAAAAAAAAAAAAAAAr413WUGvabR9VJ7SVRE3wgA-miCHnQF-QK6gbJ5Z9B%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1756652399%26allow_ip%3D%26allow_referer%3D%26signature%3DBGWvqYBQ%252BCKXALEbCE9emHrtmzI%253D)

회사 프로젝트를 시작하면서 프로젝트 구조를 구축하면서 여느때와 다름없이 redux를 redux 하위 폴더로 actions, reducers, constants 등으로 나누던 중 프리랜서 분이 redux관리를 ducks pattern으로 하는게 어떻겠냐 의견을 주셔서 찾아보았습다.

기존의 구조대로 개발을 하게 되면 하나의 기능에 수정이 필요할 시에 action, reducer파일을 왔다갔다 해야 하지만 아래와 같이 Ducks Pattern으로 개발을 하게 될 시에 구조중심이 아닌 **기능중심**으로 개발되어 더욱 더 직관적일 뿐만 아니라 수정에 있어서도 용이하다고 합니다.

**_Ducks Pattern을 사용하기 위해서는 아래와 같이 지켜야 할 사항이 있습니다._**

1\. reducer는 reducer라는 이름으로 export default로 내보냅니다.  
2\. action 함수는 export로 내보냅니다.  
3\. 액션타입을 정의할 때 **reducer/ACTION\_TYPE**형태로 적어줘야 한다. 이렇게 접두사를 붙여주는 이유는 서로다른 리듀서에서 액션이름이 중첩되는것을 방지하기위해서 입니다.

```javascript
api.reducer.js  
  
//constants

const API_PENDING = 'front/apiApp/API_PENDING';
const API_SUCCESS = 'front/apiApp/API_SUCCESS';
const API_ERROR = 'front/apiApp/API_ERROR';

//state
const initialState = {
    pending: false,
    success: false,
    error: false,
    data: null,
};

//actions
export function apiPending() {
    return {
        type: API_PENDING,
    };
}

export function apiSuccess(payload) {
    return {
        type: API_SUCCESS,
        data: payload.data,
    };
}

export function apiError() {
    return {
        type: API_ERROR,
    };
}

//reducer
export default function reducer(state = initialState, action) {

    switch (action.type) {
        case API_PENDING:
            return {
                pending: true,
                success: false,
                error: false,
            };
        case API_SUCCESS:
            return {
                pending: false,
                success: true,
                error: false,
                data: action.data,
            };
        case API_ERROR:
            return {
                pending: false,
                success: false,
                error: true,
            };
        default:
            return state;
    }
}
```

#### 참고자료
[https://velog.io/@dolarge/React-Redux-Ducks-%ED%8C%A8%ED%84%B4](https://velog.io/@dolarge/React-Redux-Ducks-%ED%8C%A8%ED%84%B4)