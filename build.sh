#!/bin/bash
# NASO — 맥용 앱 빌드
# 결과물: src-tauri/target/release/bundle/macos/NASO.app
#         src-tauri/target/release/bundle/dmg/*.dmg
set -e
cd "$(dirname "$0")"

if ! command -v cargo >/dev/null 2>&1; then
  [ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"
fi
if ! command -v cargo >/dev/null 2>&1; then
  echo "Rust가 설치되어 있지 않습니다. README.md의 '준비' 단계를 먼저 해 주세요."
  exit 1
fi

if ! cargo tauri --version >/dev/null 2>&1; then
  echo "Tauri 빌드 도구를 설치합니다 (처음 한 번, 몇 분 걸립니다)..."
  cargo install tauri-cli --version "^2" --locked
fi

cd src-tauri
cargo tauri build
echo
echo "완료: $(pwd)/target/release/bundle/"
open target/release/bundle/macos
