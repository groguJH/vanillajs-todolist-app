# ToDo List
<img  width="500px" height="auto" alt="todolist1" src="https://github.com/user-attachments/assets/10810e5e-4cf8-48b2-b84f-15c2b47f849d" />
<img width="500" height="auto" alt="todolist2" src="https://github.com/user-attachments/assets/f55981f4-8be1-472f-ac42-24860c35a865" />

현재 위치의 날씨를 반영해 배경이 바뀌는 간단한 ToDo List 프로젝트입니다.  
Vanilla JavaScript로 DOM 조작, 로컬 스토리지 저장, 비동기 API 호출을 직접 구현했고, OpenWeather API 키는 서버 경유 방식으로 분리해 브라우저에 노출되지 않도록 개선했습니다.
<br/>
[🔗프로젝트 링크](https://todolist-app-flax-alpha.vercel.app/)
<br/>

## 프로젝트 소개

해당 프로젝트는 할 일을 입력하고 사용자의 현재 위치와 날씨 정보를 함께 보여주면서
작은 인터랙션을 더한 개인 프로젝트입니다.

- 할 일을 입력하고 관리할 수 있습니다.
- 완료한 항목은 체크 버튼으로 상태를 변경할 수 있습니다.
- 항목을 더블클릭하면 삭제할 수 있습니다.
- 전체 삭제 버튼을 누르면 Bootstrap Toast로 안내 메시지를 보여줍니다.
- 위치 정보를 기반으로 현재 지역명을 표시하고, 날씨에 따라 배경 이미지가 달라집니다.
- 할 일 목록과 마지막 날씨 정보는 `localStorage`에 저장되어 새로고침 후에도 유지됩니다.

## 기획 의도

- JavaScript만으로 사용자 입력과 DOM 상태를 관리할 수 있다.
- 로컬 스토리지를 활용한 브라우저 저장 방식 이해할 수 있다.
- 외부 API 호출과 에러 처리 흐름 경험
- 단순 기능 구현을 넘어, API 키 노출 문제를 인식하고 서버 경유 방식으로 개선한 경험

## 주요 기능

### 1. ToDo 기본 사용방법

- `Enter` 입력으로 할 일을 추가합니다.
- 버튼 클릭으로 완료 상태를 토글합니다.
- 더블클릭으로 개별 항목을 삭제합니다.
- 전체 삭제 버튼으로 리스트를 비우고 간단한 Toast 메시지를 확인할 수 있습니다.

### 2. 날씨 기반 배경 변경

- 브라우저의 Geolocation API로 현재 위치를 가져옵니다.
- 서버 경유 API(`/api/weather`)를 호출해 날씨 정보를 받아옵니다.
- 날씨 상태를 프로젝트 내부 규칙으로 정규화한 뒤 배경 이미지를 변경합니다.
- 위치명은 화면 상단 제목 영역에 표시합니다.

### 3. 새로고침 이후 상태 유지

- 할 일 목록은 `saved-items` 키로 저장합니다.
- 날씨 정보는 `saved-weather` 키로 저장합니다.

## 🛠️ 사용 기술

- HTML
- CSS
- Vanilla JavaScript
- Vite
- Bootstrap 5
- OpenWeather API
- Serverless Function

## 구현 포인트

### 1. 날씨 상태 정규화

OpenWeather의 응답값은 `Clear`, `Mist`, `Haze`처럼 다양하게 오기 때문에, 화면에 연결할 배경 이미지 규칙이 필요했습니다.  
이를 위해 날씨 값을 소문자로 변환한 뒤, 안개 계열 날씨는 `fog`로 묶고, 매칭되지 않는 값은 기본 이미지로 처리하도록 구현했습니다.

### 2. 로컬 스토리지 복원 처리

브라우저 저장값은 문자열이기 때문에, 저장/복원 과정에서 예외 처리가 없으면 앱이 쉽게 깨질 수 있습니다.  
그래서 `readStorage` 함수를 분리해 저장값이 없거나 JSON 파싱에 실패해도 기본값으로 안전하게 복구되도록 구성했습니다.

### 3. API 키 보안 개선

처음에는 클라이언트에서 OpenWeather API를 직접 호출하는 구조였기 때문에 API 키가 브라우저 번들에 포함되는 문제가 있었습니다.  
이를 개선하기 위해 다음과 같이 구조를 변경했습니다.

- 클라이언트는 `/api/weather`만 호출
- 서버 함수에서만 `WEATHER_API_KEY` 환경변수 사용
- 공통 로직은 `lib/weather.js`로 분리
- 로컬 개발 환경에서도 같은 경로를 사용할 수 있도록 Vite 미들웨어 추가

이 과정을 통해 단순히 기능 구현에 그치지 않고, 실제 배포 환경에서의 보안 문제까지 고려하는 경험을 했습니다.

## 프로젝트 구조

```bash
todoList
├─ api
│  └─ weather.js
├─ lib
│  └─ weather.js
├─ public
├─ src
│  └─ main.js
├─ styles
│  └─ index.css
├─ .env.example
├─ index.html
├─ package.json
└─ vite.config.js
```

## 실행 방법

### 1. 패키지 설치

```bash
yarn install
```

### 2. 환경변수 설정

`.env.example` 파일을 참고해 `.env.local` 파일을 생성한 뒤, OpenWeather API 키를 넣습니다.

```bash
WEATHER_API_KEY=your_openweather_api_key
```

### 3. 개발 서버 실행

```bash
yarn dev
```

### 4. 빌드

```bash
yarn build
```

## 배포 시 참고사항

- Vercel 환경변수에 `WEATHER_API_KEY`를 등록해야 합니다.
- 클라이언트 코드에서는 더 이상 API 키를 직접 사용하지 않습니다.
- 배포 환경에서도 `/api/weather` 경로를 통해서만 날씨 데이터를 조회합니다.

## 느낀 점

이 프로젝트를 통해 단순한 ToDo 앱도 사용자 경험, 상태 저장, 외부 API 연동, 보안 이슈까지 함께 고려해야 한다는 점을 배웠습니다.  
특히 API 키 노출 문제를 직접 수정하면서, 기능 구현뿐 아니라 배포 이후까지 생각하는 개발 습관이 중요하다는 것을 체감했습니다.
