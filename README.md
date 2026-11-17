# NASO — macOS판 · 웹앱

윈도우용 `NAI 메타 갤러리.exe`(Tauri 2, 현재 이름 NASO)에서 화면 코드와 아이콘을 꺼내고,
백엔드(Rust)를 맥용으로 다시 작성한 프로젝트입니다.

## 폴더 구성

| 경로 | 내용 |
|---|---|
| `src/index.html`, `src/app.js`, `src/styles.css` | exe에서 그대로 꺼낸 화면 코드 (수정 없음, index.html에 mac.css 한 줄만 추가) |
| `src/mac.css` | 맥 앱 전용 보정: 신호등 버튼 자리, 자체 창 버튼·가장자리 크기조절 숨김, 한글 글꼴 |
| `src/web-backend.js`, `src/web.css` | 웹앱(아이폰) 전용: 브라우저 저장소에 보관, zip 백업, 좁은 화면 보정 |
| `src/manifest.webmanifest`, `src/sw.js`, `src/icons/` | 홈 화면 앱 설정, 오프라인 동작, 아이콘 |
| `src-tauri/src/lib.rs` | 새로 작성한 백엔드. 원래 앱과 같은 명령 이름·인자를 씀 |
| `src-tauri/tauri.conf.json` | 창 설정, 번들(.app / .dmg) 설정 |
| `src-tauri/icons/` | exe 아이콘으로 만든 맥 아이콘(.icns) |

## 준비 (처음 한 번)

1. Xcode 명령줄 도구 — 이 맥에는 이미 설치되어 있습니다.
2. Rust 설치:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## 빌드

```bash
./build.sh
```

끝나면 `src-tauri/target/release/bundle/macos/NASO.app`이 생깁니다.
응용 프로그램 폴더로 끌어다 놓으면 설치 끝입니다. `.dmg`도 함께 만들어집니다.

인텔·애플 실리콘 맥 모두에서 돌아가는 버전이 필요하면:

```bash
rustup target add x86_64-apple-darwin aarch64-apple-darwin
```

```bash
cd src-tauri && cargo tauri build --target universal-apple-darwin
```

## 윈도우판과 달라진 점

- **창 버튼**: 맥의 신호등 버튼(왼쪽 위)을 씁니다. 헤더를 끌면 창이 움직이고, 더블클릭하면 확대됩니다.
- **크기조절**: 맥 창 테두리로 조절합니다. 환경설정의 크기조절 잠금도 그대로 동작합니다.
- **데이터 위치**: `~/Library/Application Support/com.naimetagallery.app/`
  (`appdata.json`, `images/`, `images/thumbs/`, `window_state.json`).
  환경설정 → 백업 → "데이터 폴더 열기"로 Finder에서 열 수 있습니다.

## 윈도우에서 쓰던 데이터 옮기기

1. 윈도우판에서 환경설정 → 백업 → **내보내기**로 zip을 만듭니다.
2. 그 zip을 맥으로 옮기고, 맥판에서 환경설정 → 백업 → **불러오기**로 고릅니다.

백업 형식(`appdata.json` + `images/` + `images/thumbs/`)이 같아서 그대로 복원됩니다.

## 아이폰 (웹앱)

`src/` 폴더가 그대로 웹앱이기도 합니다. 웹에 올린 뒤 아이폰 Safari로 열고
**공유 버튼 → 홈 화면에 추가**하면 앱처럼 쓸 수 있습니다.

- 데이터와 이미지는 **아이폰 안(브라우저 저장소)**에만 저장됩니다. 서버로 올라가지 않습니다.
- 인터넷 없이도 열립니다 (처음 한 번 열어 둔 뒤).
- iOS 16.4 이상 권장 (압축된 백업을 풀 때 필요).

### 웹에 올리기 (둘 중 하나)

- **Netlify Drop** (가입 후 끌어다 놓기만): https://app.netlify.com/drop 에 `src` 폴더를 끌어다 놓으면 주소가 생깁니다.
- **GitHub Pages**: 저장소를 만들고 `src` 폴더 내용을 올린 뒤, Settings → Pages에서 켭니다.

https 주소여야 홈 화면 앱·오프라인 기능이 동작합니다. 위 두 곳은 기본으로 https입니다.

화면 코드를 고친 뒤 다시 올릴 때는 `src/sw.js`의 `CACHE` 이름(`...-v1`)의 숫자를 올려 주세요.
그래야 아이폰이 새 버전을 받습니다.

### 맥 ↔ 아이폰 데이터 옮기기

| 방향 | 방법 |
|---|---|
| 맥 → 아이폰 | 맥판 환경설정 → 백업 → **내보내기** → zip을 AirDrop 또는 iCloud Drive로 → 아이폰판 **불러오기**에서 그 파일 선택 |
| 아이폰 → 맥 | 아이폰판 **내보내기** → **공유·저장** → AirDrop 또는 "파일에 저장"(iCloud Drive) → 맥판 **불러오기** |

윈도우판 백업도 같은 방법으로 불러올 수 있습니다.
불러오기는 **덮어쓰기**라서, 양쪽에서 따로 고친 내용이 합쳐지지는 않습니다. 마지막으로 고친 쪽에서 내보내세요.

### 로컬에서 미리 보기

```bash
python3 -m http.server 8765 --directory src
```

브라우저에서 http://localhost:8765 를 열면 웹앱 모드로 동작합니다.

## 다른 맥에 나눠줄 때

서명(Apple Developer 인증서) 없이 만든 앱이라, 다른 맥에서 처음 열면 "확인되지 않은 개발자" 경고가 뜹니다.
Finder에서 앱을 **우클릭 → 열기**로 한 번 열면 그 뒤로는 그냥 열립니다.
