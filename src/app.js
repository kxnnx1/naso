(function(){
'use strict';
window.__APP_LOADED__ = true;

// ---------- 기본 헬퍼 ----------
const $ = id => document.getElementById(id);
const E = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// 공통 아이콘 (SVG, 교체 시 여기만 수정)
const ICONS = {
  rename: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/><path d="M13.5 6.5l4 4"/></svg>', // 이름/제목 변경 (연필)
  settings: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/></svg>', // 톱니(설정 메뉴)
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M21 21l-6 -6"/></svg>', // 헤더 검색
  winMin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0"/></svg>', // 창 최소화
  winMax: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -10"/></svg>', // 창 최대화
  winClose: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>', // 창 닫기
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>', // 닫기/삭제 공용
  grip: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M8 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M8 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M14 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M14 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M14 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/></svg>', // 드래그 손잡이
  prev: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6"/></svg>', // 라이트박스 이전
  next: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6"/></svg>', // 라이트박스 다음
  add: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg>', // 플로팅 등록
  up: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.293 7.293a1 1 0 0 1 1.32 -.083l.094 .083l6 6l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059l-.002 .059l-.005 .058l-.009 .06l-.01 .052l-.032 .108l-.027 .067l-.07 .132l-.065 .09l-.073 .081l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002h-12c-.852 0 -1.297 -.986 -.783 -1.623l.076 -.084l6 -6z"/></svg>', // 접기
  down: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z"/></svg>', // 펼치기
  edit: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"/><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415"/><path d="M16 5l3 3"/></svg>', // 메뉴: 편집 모드
  lock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6"/><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/><path d="M8 11v-4a4 4 0 1 1 8 0v4"/></svg>', // 메뉴: 편집 종료
  viewCard: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -10"/><path d="M7 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M15 8l2 0"/><path d="M15 12l2 0"/><path d="M7 16l10 0"/></svg>', // 보기: 카드형
  viewThumb: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4"/><path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4"/><path d="M14 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4"/><path d="M14 7l6 0"/><path d="M17 4l0 6"/></svg>', // 보기: 팝업형
  heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"/></svg>', // 북마크 (하트)
  memo: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9h8"/><path d="M8 13h6"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12"/></svg>', // 카드: 메모 보기
  stats: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"/><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2"/><path d="M9 17v-5"/><path d="M12 17v-1"/><path d="M15 17v-3"/></svg>', // 톱니 메뉴: 태그 통계
  copy: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"/><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/></svg>', // 태그 통계: 전체 복사
  galMeta: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01"/><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12"/><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"/><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"/></svg>', // 갤러리 전환: 메타
  galArtist: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25"/><path d="M7.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M11.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M15.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/></svg>', // 갤러리 전환: 작가
  meta: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01"/><path d="M11.5 21h-5.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5"/><path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M20.2 20.2l1.8 1.8"/><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l2 2"/></svg>', // 카드: 메타데이터 보기
};

function toast(m) { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast._tm); toast._tm = setTimeout(() => t.classList.remove('show'), 1600); }
// 오래 걸리는 일 동안 계속 떠 있는 알림. 끝나면 toast()로 덮어쓴다
function busyToast(m) { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast._tm); }

function showFatal(msg) {
  let b = document.getElementById('fatalBanner');
  if (!b) {
    b = document.createElement('div');
    b.id = 'fatalBanner';
    b.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#dc2626;color:#fff;font-size:12px;padding:8px 14px;z-index:9999;white-space:pre-wrap;word-break:break-all;font-family:monospace;';
    overlayHost().appendChild(b);
  }
  b.textContent = '오류 발생: ' + msg;
}
// 앱 밖에서 끼어든 스크립트(브라우저 확장, 콘텐츠 차단기, 카톡 같은 앱 내 브라우저 등)의 오류는
// 브라우저가 내용을 가린 채 "Script error."로만 알려 준다. 앱과 무관하므로 화면에 띄우지 않는다.
function isForeignError(e) {
  if (/^Script error\.?$/i.test(e.message || '')) return true;
  if (!e.message && !e.error) return true;
  if (e.filename) { try { return new URL(e.filename, location.href).origin !== location.origin; } catch (_) { } }
  return false;
}
window.addEventListener('error', e => {
  if (isForeignError(e)) { console.warn('외부 스크립트 오류 무시:', e.message, e.filename || ''); return; }
  showFatal((e.message || '알 수 없는 오류') + (e.lineno ? ` (줄 ${e.lineno})` : ''));
});
window.addEventListener('unhandledrejection', e => showFatal(String(e.reason && e.reason.message || e.reason)));

function overlayHost() { return document.getElementById('app') || document.body; }

function isTauri() { return typeof window.__TAURI__ !== 'undefined'; }

async function tauriInvoke(cmd, args) {
  if (!isTauri()) return window.WebBackend ? window.WebBackend.invoke(cmd, args) : browserShim(cmd, args);
  try {
    if (window.__TAURI__.core?.invoke) return await window.__TAURI__.core.invoke(cmd, args);
    if (window.__TAURI__.invoke) return await window.__TAURI__.invoke(cmd, args);
    if (window.__TAURI__.tauri?.invoke) return await window.__TAURI__.tauri.invoke(cmd, args);
    return null;
  } catch (e) { console.error(`Tauri invoke 실패 [${cmd}]:`, e); throw e; }
}

const memImgs = {};
function browserShim(cmd, args) {
  switch (cmd) {
    case 'save_data': localStorage.setItem('nmg_' + args.key, args.value); return '';
    case 'load_data': return localStorage.getItem('nmg_' + args.key) || '';
    case 'save_image_base64': memImgs[args.name] = 'data:application/octet-stream;base64,' + args.data; return args.name;
    case 'read_image_base64': return (memImgs[args.name] || '').split(',')[1] || '';
    case 'delete_image': delete memImgs[args.name]; return null;
    case 'list_images': return Object.keys(memImgs);
    case 'cleanup_images': { let n = 0; Object.keys(memImgs).forEach(k => { if (!args.keep.includes(k)) { delete memImgs[k]; n++; } }); return n; }
    case 'export_backup': return 0; // 브라우저에서는 백업을 만들지 않는다
    case 'import_backup': return ''; // 브라우저에서는 백업을 읽지 않는다
    case 'get_data_path': return '(브라우저 모드)';
    default: return null;
  }
}

// ---------- 커스텀 팝업 ----------
function customConfirm(msg) {
  return new Promise(resolve => {
    const bk = E('div', 'prompt-bk');
    const box = E('div', 'prompt-box');
    const t = E('div', 'prompt-title'); t.textContent = msg;
    const btns = E('div', 'prompt-btns');
    const no = E('button', 'prompt-btn'); no.textContent = '취소';
    const yes = E('button', 'prompt-btn primary'); yes.textContent = '확인';
    btns.appendChild(no); btns.appendChild(yes);
    box.appendChild(t); box.appendChild(btns);
    bk.appendChild(box);
    overlayHost().appendChild(bk);
    const close = v => { bk.remove(); resolve(v); };
    no.onclick = () => close(false);
    yes.onclick = () => close(true);
    let dn = null;
    bk.addEventListener('mousedown', e => { dn = e.target; });
    bk.addEventListener('mouseup', e => { if (dn === e.target && e.target === bk) close(false); dn = null; });
  });
}

function customPrompt(title, defVal = '') {
  return new Promise(resolve => {
    const bk = E('div', 'prompt-bk');
    const box = E('div', 'prompt-box');
    const t = E('div', 'prompt-title'); t.textContent = title;
    const body = E('div', 'prompt-body');
    const inp = E('input', 'prompt-input'); inp.value = defVal; inp.autocomplete = 'off';
    body.appendChild(inp);
    const btns = E('div', 'prompt-btns');
    const no = E('button', 'prompt-btn'); no.textContent = '취소';
    const yes = E('button', 'prompt-btn primary'); yes.textContent = '확인';
    btns.appendChild(no); btns.appendChild(yes);
    box.appendChild(t); box.appendChild(body); box.appendChild(btns);
    bk.appendChild(box);
    overlayHost().appendChild(bk);
    inp.focus(); inp.select();
    const close = v => { bk.remove(); resolve(v); };
    no.onclick = () => close(null);
    yes.onclick = () => close(inp.value);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') close(inp.value); if (e.key === 'Escape') close(null); });
    let dn = null;
    bk.addEventListener('mousedown', e => { dn = e.target; });
    bk.addEventListener('mouseup', e => { if (dn === e.target && e.target === bk) close(null); dn = null; });
  });
}

async function confirmDel(msg, fn) { if (settings.confirmDelete) { const ok = await customConfirm(msg); if (!ok) return; } fn(); }

// ---------- 상태 ----------
let D = { sets: [], filters: [], artists: [], artistFilters: [] };
// ── 메타 갤러리 ──
// filters(폴더): {id, type:'folder', name, tags:[{id, name}]}
// filters(단독 태그): {id, type:'tag', name}   ← 폴더 없이 홀로 존재
// sets: {id, title, tags:[tagId], images:[{name,thumb,w,h,fields}], collapsed, created}
//   fields: 이미지의 NAI 메타데이터 (등록 시 파싱 저장, 없으면 null, 미파싱이면 undefined)
// ── 작가 갤러리 (항목·필터·목록 모두 메타와 완전히 분리) ──
// artistFilters: filters와 같은 모양
// artists: {id, title, tags:[tagId], images:[...], created}   ← title이 작가 이름

// ── 모델 ──
// 위 D 한 벌을 통째로 담는 그릇. 모델끼리는 완전히 끊겨 있다.
// MODELS: [{ id, name, D, view }]   view = 그 모델에서 보고 있던 상태
let MODELS = [];
let curModel = null;
// 모델마다 기억하는 것: 어떻게 보고 있었나(보기 형태·정렬·타일 크기).
// 무엇을 걸러 보고 있었나(갤러리 종류·필터·북마크)는 기억하지 않는다.
const MODEL_VIEW_KEYS = ['viewMode', 'sortKey', 'sortDir',
                         'artistSortKey', 'artistSortDir',
                         'layout', 'artistLayout'];
const DEFAULT_VIEW = () => ({
  gallery: 'meta', viewMode: 'card', sortKey: 'order', sortDir: 'desc', activeTags: [],
  artistSortKey: 'order', artistSortDir: 'desc', artistActiveTags: [],
  bookmarkOnly: false, artistBookmarkOnly: false,
  // 갤러리형 타일: 비율(0=세로 832x1216 … 1=가로 1216x832)과 크기
  layout: { ratio: 0, size: 180 },
  artistLayout: { ratio: 0, size: 180 },
});
function emptyD() { return { sets: [], filters: [], artists: [], artistFilters: [] }; }
function newModel(name) { return { id: uid(), name, D: emptyD(), view: DEFAULT_VIEW() }; }

// 퀄리티 태그의 기본값. 처음 켜면 이대로 등록되어 있고,
// 프로그램은 이것을 따로 구분하지 않는다 (직접 등록한 것과 완전히 같다).
const DEFAULT_QUALITY_TAGS = [
  '1990\'s (style)', '1990s (style)', '2000s (style)', '2010s (style)', '2024', '2025', '2coma', '2koma',
  '3d', '3d asset', '3koma', '4k', '4koma', '8k', '8k image', '8k wallpaper', '@_@', 'abstract', 'absurd',
  'absurdres', 'accessories', 'acne', 'acrylic paint (medium)', 'aegyo sal', 'aged up', 'ahoge', 'ai generated',
  'ai generation', 'ai-generated', 'akatsuki no yona', 'album cover redraw', 'aliasing', 'amateur', 'amateur unsatisfactory',
  'amazing quality', 'ambient light', 'ambient lighting', 'ambiguous gender', 'amputee', 'analogous colors',
  'anatomical nonsense', 'anatomical structure error', 'animal', 'animal.shiny skin', 'animals', 'animated',
  'animation error', 'anime 2d', 'anime 3d', 'anime coloring', 'anime screencap', 'anime screenshot', 'anime style',
  'anime style 1990s', 'animification', 'another character', 'approximate', 'arched back', 'arm hair',
  'art nouveau style', 'artifacts', 'artist collaboration', 'artist logo', 'artist name', 'artist signature',
  'artistic error', 'asymmetrical eyes', 'asymmetrical face', 'atmospheric depth', 'autograph', 'background not matching monochrome or lighting',
  'background people', 'backlight', 'backlighting', 'bad', 'bad anatomy', 'bad anotomy', 'bad arm', 'bad arms',
  'bad aspect ratio', 'bad ass', 'bad detail body', 'bad drawn body', 'bad eyes', 'bad face', 'bad feet',
  'bad finger', 'bad fingers', 'bad glabella', 'bad hand', 'bad hand structure', 'bad hands', 'bad illustration',
  'bad leg', 'bad legs', 'bad limb', 'bad limbs', 'bad link', 'bad neck', 'bad nose', 'bad perspective',
  'bad portrait', 'bad proportion', 'bad proportions', 'bad pupils', 'bad quality', 'bad quality background',
  'bad reflection', 'bad shadow', 'bad source', 'bad teeth', 'balanced body proportion', 'bar censor',
  'bara', 'beard', 'beautiful detailed eyes', 'beautiful detailed face', 'beautiful eyes', 'beautiful lighting',
  'ben-day dots', 'best anatomy', 'best finished', 'best illumination', 'best illustration', 'best quality',
  'best quality characters', 'best shadow', 'big eyes', 'big hands', 'big head', 'big nose', 'bishoujo',
  'black and white', 'black background', 'black lineart', 'black outline', 'black pupils', 'black sclera',
  'blank eyes', 'blank page', 'blender (medium)', 'blender (style)', 'blending', 'bloom', 'blue atmosphere',
  'blue background', 'blue sclera', 'blue shaded', 'blunt bangs', 'blunt hair', 'blurry', 'blurry background',
  'blurry clothing', 'blurry eyes', 'blurry foreground', 'blurry hand details', 'blurry hands', 'blush',
  'blush ear', 'blush ears', 'blushed ears', 'blusher', 'blushing', 'blushing ears', 'body color', 'body hair',
  'bokeh', 'bold', 'bold outline', 'border', 'braid hair', 'breasts', 'brush (medium)', 'bystanders', 'c olored lips',
  'cartoon', 'cartoonized', 'cel shading', 'censor', 'censored', 'chain', 'chaotic background', 'character and background disconnected',
  'character drawn with impasto', 'character drawn with oil painting', 'character drawn with textured canvas',
  'character drawn with thick paint', 'character sheet', 'cheesy', 'chibi', 'chibi inset', 'chibi only',
  'chick', 'chiibi', 'child', 'chromatic aberration', 'cinematic atmosphere', 'cinematic cutscene', 'cinematic lighting',
  'clean lineart', 'clean lines', 'clean shading', 'clean text', 'clear eyes', 'clothes pattern', 'cloudy eyes',
  'color line', 'colored background', 'colored eyelashes', 'colored inner hair', 'colored lips', 'colored pencil (medium)',
  'colored sclera', 'colored skin', 'colorful', 'colorful eyes', 'colorful hair', 'colorful palette', 'comic',
  'comic shading', 'commission', 'compact face', 'concept design', 'conjoined', 'cool colors', 'crayon (medium)',
  'creature', 'creatures', 'cropped', 'cross-eyed', 'crossed eyes', 'crowd', 'crowded', 'crumpled hands',
  'crushed background', 'curvy', 'dark', 'dark outlines', 'dark sclera', 'dark skin', 'darkness', 'dated',
  'dead eyes', 'deep tone', 'deficient', 'deformed', 'deformed difference', 'deformed fingers', 'deformed hands',
  'deformed limbs', 'deformed neck', 'delicate', 'delicate and ethereal beauty', 'depth blur', 'depth of field',
  'desaturated colors', 'detailed background', 'detailed body', 'detailed clothes', 'detailed clothes texture',
  'detailed eyes', 'detailed face', 'detailed hair', 'detailed light', 'detailed lineart', 'detailed lines',
  'detailed lips', 'detailed nose', 'detailed pixels', 'detailed shade', 'detailed shade and light', 'detailed shadow',
  'detailed texture', 'detailed under eyelash', 'diffraction spikes', 'digital art', 'digital dissolve',
  'disfigured', 'disgustingly adorable', 'disorganized colors', 'displeasing', 'distinct image', 'distorted',
  'distorted anatomy', 'distorted composition', 'distorted face', 'dithering', 'doll', 'doodle', 'doodle inset',
  'dot nose', 'down lighting', 'dramatic lighting', 'drawing', 'drawing (object)', 'drawing(object)', 'dreamy',
  'drill hair', 'duet night abyss', 'duplicate', 'dynamic folds', 'dynamic lighting', 'ear blush', 'earring',
  'earrings', 'east asian architecture', 'elf', 'empty eyes', 'equally', 'equally detailed', 'error', 'ery aesthetic',
  'exaggerated expression', 'exaggerated features', 'expensive illustration', 'expression', 'exquisite detail',
  'ext', 'extra', 'extra arm', 'extra arms', 'extra breasts', 'extra digit', 'extra digits', 'extra ears',
  'extra eyebrows', 'extra eyes', 'extra faces', 'extra fingers', 'extra hands', 'extra leg', 'extra legs',
  'extra mouth', 'extra teeth', 'extra toes', 'extra tongue', 'extremely detailed', 'eye makeup', 'eyelash',
  'eyelashes', 'eyeshadows', 'face detailed', 'faded color', 'fat', 'fat legs', 'fat thighs', 'faux figurine',
  'faux retro artstyle', 'feet', 'fewer', 'fewer details', 'fewer digits', 'film grain', 'fine line', 'finely beautiful detailed face',
  'finely detaild beautiful eyes', 'finely detailed beautiful eyes', 'finely detailed eyes', 'finished',
  'flat color', 'frame', 'frame (object)', 'frame(object)', 'freckle', 'freckles', 'ftm', 'fuchsia', 'furry',
  'gangbang', 'gigantic breasts', 'gloss', 'glossy eyes', 'glossy lip', 'glowing', 'glowing eyes', 'gold wall',
  'gradation', 'grass', 'gray sclera', 'grayscale', 'great anatomy', 'great quality', 'green atmosphere',
  'green hair', 'green tint', 'grey sclera', 'grey skin', 'greyscale', 'grotesque', 'guro', 'hair buns',
  'hair detail', 'hair flaps', 'hair vent', 'halftone', 'halo', 'hat', 'hatching (texture)', 'headdress',
  'heavy', 'heavy film grain', 'heterochromia', 'high contrast', 'high detail', 'high detailed', 'high quality',
  'high resolution illustration', 'highly aesthetic', 'highly detailed', 'highly finished', 'highres',
  'hue shifting', 'human in background', 'humans in background', 'hyper detail', 'hyper detailed', 'hyper-detailed rendering',
  'igne claire', 'illustration', 'imperfect feet', 'imperfect fingers', 'imperfect toes', 'impressionism',
  'inaccurate human body', 'inadequate', 'incomplete', 'incredibly absurdres', 'ink (medium)', 'inner light',
  'interlocked fingers', 'intricate details', 'ismatched pupils', 'jaggy lines', 'japanese anime-style',
  'jelly fish cut', 'jellyfish hair', 'jewelry', 'jpeg artifacts', 'lack of depth', 'large areolae', 'large breasts',
  'large pixels', 'large variant set', 'leaf', 'leaves', 'leaves light and shade', 'lens flare', 'letterboxed',
  'light', 'ligne claire', 'limited palette', 'limited pallette', 'lineart', 'lip gloss', 'lip shadow',
  'lips', 'lips color', 'lipstick', 'lively composition', 'location', 'logo', 'loli', 'long ears', 'long eyelashes',
  'long face', 'long finger', 'long neck', 'looking at viewer', 'low contrast', 'low detail', 'low detail hands',
  'low details', 'low quality', 'low resolution', 'low-detail clothing', 'lowres', 'machoke', 'magenta',
  'make up', 'makeup', 'manga', 'manhwa', 'mark', 'marker (medium)', 'mascot', 'mascots', 'masterpiece',
  'masterpiece level', 'mature', 'mature female', 'mature man', 'messy background', 'messy lines', 'messy sketch',
  'millipen (medium)', 'mismatched pupils', 'missing', 'missing arms', 'missing ear', 'missing eye', 'missing finger',
  'missing fingers', 'missing hands', 'missing limb', 'missing tooth', 'mob face', 'mole', 'monochrome',
  'monochrome (medium)', 'monochrome background', 'monster', 'mosaic censor', 'mosaic censoring', 'mtf',
  'mud color', 'multiple angles', 'multiple arms', 'multiple boys', 'multiple face', 'multiple faces',
  'multiple girls', 'multiple hands', 'multiple human', 'multiple legs', 'multiple others', 'multiple panels',
  'multiple view', 'multiple views', 'muscular body', 'muscular woman', 'mutated', 'mutation', 'muted color',
  'muted colors', 'mutlple others', 'nail art', 'nail polish', 'narrow brow', 'natural skintone', 'necklace',
  'negative space', 'neon color', 'neon colors', 'neon palette', 'neon theme', 'newest', 'nib pen (medium)',
  'nipple', 'no accessories', 'no chibi', 'no human in background', 'no humans', 'no jewelries', 'no lineart',
  'no lip', 'no necklace', 'no nose', 'no pupils', 'no tattoos', 'no text', 'normal quality', 'nostril',
  'nostrils', 'novel illustration', 'nsfw', 'object', 'oekaki', 'oil painting (medium)', 'old', 'one-hour drawing challeng',
  'one-hour drawing challenge', 'orange atmosphere', 'orange atomosphere', 'orange blonde', 'orange skin',
  'oriental clothes', 'outline', 'outside border', 'overly flat shading', 'painterly', 'painting (medium)',
  'painting (object)', 'pale color', 'pale palette', 'pale screen tone', 'panel', 'partially colored',
  'passersby', 'pastel (medium)', 'pastel color', 'pastel color (medium)', 'pastel colors', 'pastel drawing',
  'pastel theme', 'patterns', 'pc-98', 'peeking out', 'pen (medium)', 'pencil (medium)', 'pencil texture',
  'penis hair', 'people', 'perfect anatomy', 'perfect finish', 'pet', 'petite', 'photo', 'photo (medium)',
  'photo (object)', 'photorealistic', 'photoshop (medium)', 'picture (object)', 'picture frame', 'piercing',
  'pink atmosphere', 'pink lip', 'pink scales', 'pink skin', 'pink tint', 'pink tongue', 'pinkscale', 'pixel art',
  'pixelated', 'plants', 'pochita', 'point colors', 'pointy chin', 'pointy ears', 'pokemon', 'poor', 'poor fabric detail',
  'poor fingers', 'poor hand detail', 'poorly drawn', 'poster', 'precise lineart', 'pretty face', 'printing clothes',
  'professional style', 'proportional anatomy', 'pubic hair', 'purple atmosphere', 'purple tint', 'purplescale',
  'pussy', 'rating: general', 'rating:explicit', 'rating:general', 'rating:sensitive', 'real life insert',
  'realistic', 'realistic background', 'realistic texture', 'recent', 'red atmosphere', 'red background',
  'red ear', 'red ears', 'red eye effect', 'red eyeshadow', 'red lips', 'red pupils', 'red reflection',
  'red skin', 'red tint', 'red-eye effect', 'reference', 'reference sheet', 'rendered', 'retro', 'retro art style',
  'retro artstyle', 'rim lighting', 'rolled hair', 'rough', 'rough ink outlines', 'rough line', 'rough lines',
  'rough outlines', 'sallow', 'sanpaku', 'saturated', 'saturated color', 'scan', 'scan artifacts', 'scanlines',
  'scar', 'scenery', 'screentone', 'screentones', 'sd', 'seal', 'seam', 'semi realistic', 'semi-realistic',
  'sensitive', 'sepia', 'sex', 'shaded face', 'shading face', 'sharp chin', 'sharp eyes', 'sharp highlight',
  'shimmering', 'shiny body', 'shiny clothes', 'shiny eyes', 'shiny hair', 'shiny skin', 'short', 'short height',
  'shortstack', 'shota', 'sidelighting', 'sign', 'signature', 'simple', 'simple backgorund', 'simple background',
  'simple illust', 'simple illustration', 'six finger', 'six fingers', 'size error', 'sketch', 'sketch line',
  'sketch lines', 'sketchup style', 'skin blemishes', 'skin spots', 'sloppy and crude drawing', 'small eyeball',
  'small eyes', 'small pixels', 'small pupils', 'smooth shading', 'soft color', 'soft focus', 'soft glow',
  'soft light', 'soft lighting', 'soft shade', 'soft shading', 'soft shadow', 'solo artist', 'spatial composition',
  'split screen', 'spot color', 'square shaped iris', 'squiggly', 'sticker', 'stickers', 'stiff pose',
  'stylized shading', 'subpar', 'super deformed', 'surreal', 'sweat', 'syringe', 'tall', 'tall height',
  'tan', 'tatoo', 'tattoo', 'teeth', 'text', 'text-only page', 'textless version', 'the wrong limb', 'thick eyebrows',
  'thick eyelashes', 'thick lines', 'thick lips', 'thick outlines', 'thick painted', 'thick thighs', 'thin eyelashes',
  'thin hair', 'thin outlines', 'threesome', 'tight clothes', 'tiny iris', 'tiny pupils', 'toliet', 'too many watermarks',
  'toon (style)', 'top aesthetic', 'toy', 'tsurime', 'turnaround', 'turtleneck', 'twist', 'twisted torso',
  'twitter username', 'ugly', 'ugly face', 'ugly man', 'ugly nose', 'uhd', 'uhd sharpnss', 'ultra detailed',
  'ultra-detailed', 'uncensored', 'unclear eyes', 'undetailed eyes', 'unfinished', 'unfinished lines',
  'unnatural hair', 'unnatural hand pose', 'unsatisfactory', 'upscaled', 'user mark', 'user name', 'username',
  'vamazing quality', 'variant set', 'vertical banding', 'vertical lines', 'very aesthetic', 'very awa',
  'very beautiful', 'very displeasing', 'veryaesthetic', 'vibrant colors', 'vivid', 'volumetric lighting',
  'warm color', 'warm colored', 'warm colors', 'washed out colors', 'water', 'water mark', 'watercolor (medium)',
  'watercolor effect', 'watercolor pencil (medium)', 'watermark', 'watermarks', 'weird fingers', 'well-proportione',
  'white background', 'white blank page', 'white frame', 'white-corner', 'wide hip', 'wide hips', 'wide-eyed',
  'worst quality', 'wrong', 'wrong anatomy', 'wrong feet', 'wrong fingers', 'wrong hand', 'wrong hands',
  'year 1990', 'year 1996', 'year 1997', 'year 2021', 'year 2022', 'year 2023', 'year 2024', 'year 2025',
  'yellow atmosphere', 'yellow sclera', 'yellow skin', 'yellow theme', 'yellow tint', 'young',
];

let settings = {
  mode: 'edit',
  ...DEFAULT_VIEW(),
  confirmDelete: true, resizeLock: false,
  qualityTags: [...DEFAULT_QUALITY_TAGS], // 퀄리티 태그 (모델과 무관하게 전체 공용)
  theme: 'glacier', // 테마 (전체 공용)
  analyzeSort: 'order', // 분석 팝업 정렬: order | weight
  statKind: 'pos', // 태그 통계: pos | neg
  statExcludeQuality: true, // 태그 통계에서 퀄리티 태그 제외
};
let dataDir = '';
let saveTimer = null;
let expandedAttr = null; // 설정에서 펼쳐진 필터 폴더
let filtersExpanded = false; // 툴바 필터 줄 펼침 여부
// 스크롤 위치는 모델·갤러리마다 따로 기억한다 (오갈 때 보던 자리를 유지)
const scrollPos = {};
function scrollKey() { return (curModel ? curModel.id : '') + ':' + settings.gallery + ':' + settings.viewMode; }
// 검색어도 모델·갤러리마다 따로 기억한다 (스크롤 위치와 같은 방식).
// 걸러보던 상태이므로 저장하지 않는다 — 껐다 켜면 아무것도 걸러지지 않은 상태로 시작한다.
const searchText = {};
function searchKey() { return (curModel ? curModel.id : '') + ':' + settings.gallery; }
function curSearch() { return searchText[searchKey()] || ''; }
function setCurSearch(v) { searchText[searchKey()] = v; }
let filterAddKind = 'folder'; // 설정에서 마지막으로 고른 추가 종류

function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveAll, 400); }

// 보고 있던 상태를 현재 모델에 담아두고, 모델을 바꿀 때 꺼내 쓴다
function syncModelView() {
  if (!curModel) return;
  curModel.view = {};
  MODEL_VIEW_KEYS.forEach(k => { curModel.view[k] = settings[k]; });
  curModel.D = D;
}
function applyModelView() {
  const v = Object.assign(DEFAULT_VIEW(), (curModel && curModel.view) || {});
  MODEL_VIEW_KEYS.forEach(k => { settings[k] = v[k]; });
}
function switchModel(id) {
  const m = MODELS.find(x => x.id === id);
  if (!m || m === curModel) return;
  syncModelView();
  curModel = m;
  D = m.D;
  applyModelView();
  migrate();
  filtersExpanded = false;
  scheduleSave();
  render();
}

// 걸러보던 상태(갤러리 종류·필터·북마크)는 저장하지 않는다.
// 다음에 켤 때 아무것도 걸러지지 않은 상태로 시작한다.
const UNSAVED_KEYS = ['gallery', 'activeTags', 'artistActiveTags', 'bookmarkOnly', 'artistBookmarkOnly'];
function saveableSettings() {
  const o = { ...settings };
  UNSAVED_KEYS.forEach(k => delete o[k]);
  return o;
}
function loadableSettings(src) {
  const o = { ...src };
  UNSAVED_KEYS.forEach(k => delete o[k]);
  return o;
}

async function saveAll() {
  syncModelView();
  try {
  await tauriInvoke('save_data', {
    key: 'appdata',
    value: JSON.stringify({
      models: MODELS.map(m => ({ id: m.id, name: m.name, D: m.D, view: m.view })),
      curModel: curModel && curModel.id,
      settings: saveableSettings(),
    }),
  });
  } catch (e) { console.error('저장 실패', e); toast('저장 실패'); }
}

// 빠진 값 채우기 (구조 변환이 아니라 기본값 보정)
function migrate() {
  // 새 디자인(글레이셔)을 처음 한 번은 기본으로 보여 준다. 이후엔 고른 테마를 따른다
  if (!settings.glacierIntro) { settings.theme = 'glacier'; settings.glacierIntro = true; }
  if (!Array.isArray(D.filters)) D.filters = [];
  if (!Array.isArray(D.artists)) D.artists = [];
  if (!Array.isArray(D.artistFilters)) D.artistFilters = [];
  D.sets.forEach(s => { if (!Array.isArray(s.tags)) s.tags = []; });
  D.artists.forEach(s => { if (!Array.isArray(s.tags)) s.tags = []; if (!Array.isArray(s.images)) s.images = []; });
  if (!Array.isArray(settings.activeTags)) settings.activeTags = [];
  if (!Array.isArray(settings.artistActiveTags)) settings.artistActiveTags = [];
  if (!Array.isArray(settings.qualityTags)) settings.qualityTags = [];
  if (settings.gallery !== 'artist') settings.gallery = 'meta';
  if (settings.sortDir !== 'asc' && settings.sortDir !== 'desc') settings.sortDir = 'desc';
  if (settings.artistSortDir !== 'asc' && settings.artistSortDir !== 'desc') settings.artistSortDir = 'desc';
}

function normalizeD(d) { return Object.assign(emptyD(), d || {}); }

let loadFailed = false;
async function loadAll() {
  let obj = null;
  try {
    const raw = await tauriInvoke('load_data', { key: 'appdata' });
    if (raw) obj = JSON.parse(raw);
  } catch (e) { console.error('불러오기 실패', e); loadFailed = true; }

  if (obj && obj.settings) settings = Object.assign(settings, loadableSettings(obj.settings));

  if (obj && Array.isArray(obj.models) && obj.models.length) {
    MODELS = obj.models.map(m => ({
      id: m.id || uid(), name: m.name || '모델',
      D: normalizeD(m.D), view: Object.assign(DEFAULT_VIEW(), m.view || {}),
    }));
    curModel = MODELS.find(m => m.id === obj.curModel) || MODELS[0];
  } else {
    MODELS = [newModel('v4.5F'), newModel('v5F')];
    curModel = MODELS[0];
  }

  D = curModel.D;
  applyModelView();
  migrate();
  applyTheme();
  scheduleSave();
}

// ---------- 이미지 파일 IO ----------
function imgURL(name) {
  if (!name) return '';
  if (!isTauri()) return window.WebBackend ? window.WebBackend.url(name) : (memImgs[name] || '');
  const folder = name.endsWith('_t.jpg') ? 'images/thumbs' : 'images';
  const p = dataDir.replace(/[\\/]+$/, '') + '/' + folder + '/' + name;
  const conv = window.__TAURI__.core?.convertFileSrc || window.__TAURI__.convertFileSrc;
  return conv ? conv(p) : '';
}

function bufToB64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  return btoa(bin);
}

function loadImageEl(src) {
  return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
}

async function saveImageFile(file) {
  const buf = await file.arrayBuffer();
  let fields = null;
  try { fields = await parseNaiMetadata(buf); } catch (e) { }
  const ext = (file.name.match(/\.(png|jpe?g|webp|gif|bmp)$/i) || ['', 'png'])[1].toLowerCase();
  const id = uid();
  const name = `${id}.${ext}`;
  const thumb = `${id}_t.jpg`;
  await tauriInvoke('save_image_base64', { name, data: bufToB64(buf) });
  const url = URL.createObjectURL(new Blob([buf]));
  let w = 0, h = 0;
  try {
    const im = await loadImageEl(url);
    w = im.naturalWidth; h = im.naturalHeight;
    const maxW = 520;
    const scale = Math.min(1, maxW / im.naturalWidth);
    const cw = Math.max(1, Math.round(im.naturalWidth * scale));
    const ch = Math.max(1, Math.round(im.naturalHeight * scale));
    const cv = document.createElement('canvas');
    cv.width = cw; cv.height = ch;
    const cx = cv.getContext('2d');
    cx.fillStyle = '#fff'; cx.fillRect(0, 0, cw, ch);
    cx.drawImage(im, 0, 0, cw, ch);
    const dataURL = cv.toDataURL('image/jpeg', 0.85);
    await tauriInvoke('save_image_base64', { name: thumb, data: dataURL.split(',')[1], thumb: true });
  } finally { URL.revokeObjectURL(url); }
  return { name, thumb, w, h, fields, buf };
}

async function deleteFiles(names) {
  for (const n of names) { if (n) { try { await tauriInvoke('delete_image', { name: n }); } catch (e) { console.error('파일 삭제 실패', n, e); } } }
}

function filePairs(img) { return [img.name, img.thumb]; }

// 모델 하나가 가진 모든 이미지 파일 이름
function modelFiles(m) {
  const d = m.D || {};
  return [...(d.sets || []), ...(d.artists || [])]
    .flatMap(st => (st.images || []).flatMap(filePairs)).filter(Boolean);
}

// ---------- PNG NAI 메타데이터 파서 ----------
async function inflateBytes(bytes) {
  try {
    const ds = new DecompressionStream('deflate');
    const stream = new Blob([bytes]).stream().pipeThrough(ds);
    const buf = await new Response(stream).arrayBuffer();
    return new Uint8Array(buf);
  } catch (e) { return null; }
}

async function parseNaiMetadata(buf) {
  const u8 = new Uint8Array(buf);
  const sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  if (u8.length < 8 || !sig.every((b, i) => u8[i] === b)) return null;
  const dv = new DataView(buf);
  const latin = new TextDecoder('latin1');
  const utf8 = new TextDecoder('utf-8');
  const texts = {};
  let pos = 8;
  while (pos + 8 <= u8.length) {
    const len = dv.getUint32(pos);
    const type = latin.decode(u8.subarray(pos + 4, pos + 8));
    const dataStart = pos + 8;
    const dataEnd = dataStart + len;
    if (dataEnd > u8.length) break;
    if (type === 'tEXt') {
      const chunk = u8.subarray(dataStart, dataEnd);
      const z = chunk.indexOf(0);
      if (z > 0) {
        const key = latin.decode(chunk.subarray(0, z));
        texts[key] = utf8.decode(chunk.subarray(z + 1));
      }
    } else if (type === 'iTXt') {
      const chunk = u8.subarray(dataStart, dataEnd);
      const z1 = chunk.indexOf(0);
      if (z1 > 0 && z1 + 2 < chunk.length) {
        const key = latin.decode(chunk.subarray(0, z1));
        const compFlag = chunk[z1 + 1];
        const z2 = chunk.indexOf(0, z1 + 3); if (z2 < 0) { pos = dataEnd + 4; continue; }
        const z3 = chunk.indexOf(0, z2 + 1); if (z3 < 0) { pos = dataEnd + 4; continue; }
        let body = chunk.subarray(z3 + 1);
        if (compFlag === 1) { const inf = await inflateBytes(body); if (!inf) { pos = dataEnd + 4; continue; } body = inf; }
        texts[key] = utf8.decode(body);
      }
    } else if (type === 'zTXt') {
      const chunk = u8.subarray(dataStart, dataEnd);
      const z = chunk.indexOf(0);
      if (z > 0 && z + 2 <= chunk.length) {
        const key = latin.decode(chunk.subarray(0, z));
        const inf = await inflateBytes(chunk.subarray(z + 2));
        if (inf) texts[key] = utf8.decode(inf);
      }
    } else if (type === 'IEND') break;
    pos = dataEnd + 4;
  }
  let comment = null;
  if (texts['Comment']) { try { comment = JSON.parse(texts['Comment']); } catch (e) { } }
  if (!comment && !texts['Description']) return null;
  const g = (k) => (comment && comment[k] !== undefined && comment[k] !== null) ? comment[k] : null;
  return {
    prompt: g('prompt') ?? texts['Description'] ?? null,
    uc: g('uc') ?? (comment?.v4_negative_prompt?.caption?.base_caption ?? null),
    steps: g('steps'),
    sampler: g('sampler'),
    scale: g('scale'),
    cfg_rescale: g('cfg_rescale'),
  };
}

// ============================================================
//  NAI 프롬프트 파서 (태그 이름 + 가중치)
// ============================================================
// 규칙 (공식 문서 기준)
//  · 숫자 뒤 :: 부터 오른쪽 전부가 그 가중치를 받고, 숫자 없는 :: 를 만나면 끝난다
//  · { } 는 1.05배, [ ] 는 1.05로 나눈다. 겹치면 매번 곱해진다
//  · 숫자 없는 :: 는 열려 있는 괄호도 함께 닫는다
//  · 음수는 숫자 표기로만 나온다 ({ } [ ] 로는 0 아래로 내려가지 않는다)
const BRACE_MUL = 1.05;

// 화면에 나타낼 때의 통일 규칙: 밑줄은 띄어쓰기로, 대문자는 소문자로.
// 저장된 값이나 복사되는 내용은 건드리지 않는다. 보일 때만 이렇게 보인다.
function displayTagName(v) {
  let t = String(v || '').trim();
  t = t.replace(/^artist:/i, '');
  t = t.replace(/\\([()])/g, '$1');
  t = t.replace(/_/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  return t;
}
// 같은 것으로 볼지 판단하는 열쇠. 띄어쓰기는 이름의 일부라 abc123과 abc 123은 다른 작가다.
function normalizeTagName(v) { return displayTagName(v); }

function round2(n) { return Math.round(n * 100) / 100; }

function tagMatchKey(v) { return displayTagName(v); }

function parsePromptTags(text) {
  const src = String(text || '');
  const out = [];
  let buf = '';
  let mul = 1;              // { } [ ] 누적
  let numStack = [];        // { weight, mulAtOpen }
  let order = 0;
  // 태그는 글자가 시작된 시점의 배율을 쓴다.
  // ({{abc}} 처럼 태그 도중에 괄호가 닫히면, 끝난 뒤의 배율은 이미 1로 돌아가 있다)
  let bufMul = 1, bufNum = 1;

  const topNum = () => (numStack.length ? numStack[numStack.length - 1].weight : 1);
  const flush = () => {
    const name = normalizeTagName(buf);
    buf = '';
    if (!name) return;
    out.push({ name, weight: round2(bufNum * bufMul), order: order++ });
  };
  const put = c => {
    if (!buf.trim() && c.trim()) { bufMul = mul; bufNum = topNum(); }
    buf += c;
  };

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === ':' && src[i + 1] === ':') {
      // 가중치 숫자는 태그 맨 앞에 홀로 있을 때만 인정한다.
      // (def456 의 456, "mgmg 1012" 의 1012 는 이름의 일부다)
      const m = buf.trim().match(/^(-?\d+(?:\.\d+)?)$/);
      if (m) {
        buf = '';
        numStack.push({ weight: parseFloat(m[1]), mulAtOpen: mul });
      } else {
        flush();
        const sc = numStack.pop();
        mul = sc ? sc.mulAtOpen : 1; // :: 는 열린 괄호도 닫는다
      }
      i++;
      continue;
    }
    if (c === '{') { mul *= BRACE_MUL; continue; }
    if (c === '}') { mul /= BRACE_MUL; continue; }
    if (c === '[') { mul /= BRACE_MUL; continue; }
    if (c === ']') { mul *= BRACE_MUL; continue; }
    if (c === ',') { flush(); continue; }
    put(c);
  }
  flush();
  return out;
}

// 퀄리티 태그로 등록된 것은 작가 후보에서 뺀다
function qualitySet() { return new Set((settings.qualityTags || []).map(tagMatchKey)); }

// 첫 번째 이미지의 메타데이터에서 작가 태그를 뽑는다
function analyzeArtists(fields) {
  const q = qualitySet();
  const base = parsePromptTags(fields && fields.prompt).filter(t => !q.has(tagMatchKey(t.name)));
  const uc = parsePromptTags(fields && fields.uc).filter(t => !q.has(tagMatchKey(t.name)));
  // 부정 = 베이스에서 가중치가 0보다 작거나, 부정 프롬프트에 있는 것
  const pos = base.filter(t => t.weight >= 0);
  // 베이스에 있었는데 음수 가중치라서 넘어온 것에만 표시를 붙인다
  const neg = [...base.filter(t => t.weight < 0).map(t => ({ ...t, movedFromBase: true })),
               ...uc.map(t => ({ ...t, order: t.order + 10000 }))];
  // 같은 이름이 여러 번 쓰였으면 쓰인 만큼 전부 남긴다 (가중치가 각각 다르다)
  return { pos, neg };
}

// 인기순 점수: 메타 갤러리에서 BP에 쓰이면 +1, UC에 쓰이면 -1
// (UC로만 쓰인 작가는 한 번도 안 쓰인 작가보다 아래로 간다)
function artistUseScores() {
  const map = new Map();
  const add = (name, v) => {
    const k = tagMatchKey(name);
    map.set(k, (map.get(k) || 0) + v);
  };
  D.sets.forEach(st => {
    const img = (st.images || [])[0];
    if (!img || !img.fields) return;
    const { pos, neg } = analyzeArtists(img.fields);
    pos.forEach(t => add(t.name, 1));
    neg.forEach(t => add(t.name, -1));
  });
  return map;
}

// 작가 갤러리에 같은 이름으로 등록된 것을 찾는다
function findArtist(name) {
  const n = tagMatchKey(name);
  return D.artists.find(a => tagMatchKey(a.title) === n) || null;
}

function setTitleTaken(title, excludeId) { return curList().some(s => s.title === title && s.id !== excludeId); }

// ---------- 클립보드 ----------
async function copyText(text, label) {
  try { await navigator.clipboard.writeText(text); }
  catch (e) {
    const ta = E('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  toast(`복사: ${label}`);
}

// ---------- 지연 로딩 ----------
let lazyObserver = null;
const loadedImgs = new Set(); // 한 번 로드된 이미지는 다시 그릴 때 즉시 표시 (깜빡임 방지)
function setupLazy() {
  if (lazyObserver) lazyObserver.disconnect();
  lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const img = en.target;
        if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
        lazyObserver.unobserve(img);
      }
    });
  }, { rootMargin: '600px' });
}
// rec: 이미지 데이터 객체({w,h} 보유/백필용). 비율을 미리 잡아 로드 전에도 정확한 높이를 차지한다.
function lazyImg(cls, srcName, rec) {
  const img = E('img', cls);
  if (rec && rec.w && rec.h) img.style.aspectRatio = `${rec.w} / ${rec.h}`;
  const url = imgURL(srcName);
  img.addEventListener('load', () => {
    loadedImgs.add(srcName);
    if (rec && (!rec.w || !rec.h) && img.naturalWidth) {
      rec.w = img.naturalWidth; rec.h = img.naturalHeight;
      img.style.aspectRatio = `${rec.w} / ${rec.h}`;
      scheduleSave();
    }
  }, { once: true });
  if (loadedImgs.has(srcName)) { img.src = url; return img; }
  img.dataset.src = url;
  requestAnimationFrame(() => lazyObserver.observe(img));
  return img;
}

// ---------- 드래그앤드롭 (nai태그복사기 방식: 고스트 + 삽입 표시선, 놓을 때 이동) ----------
// opts: { onCommit(orderIdx[]), onClick(idx, ev), handle: 핸들 선택자 }
function makeSortable(container, itemSelector, opts = {}) {
  container.querySelectorAll(itemSelector).forEach(el => {
    const grip = opts.handle ? el.querySelector(opts.handle) : el;
    if (!grip) return;
    grip.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      if (!opts.handle && e.target.closest('button')) return;
      const sx = e.clientX, sy = e.clientY;
      const fromIdx = +el.dataset.idx;
      const rect0 = el.getBoundingClientRect();
      const offX = sx - rect0.left, offY = sy - rect0.top;
      let dragging = false, ghost = null, ind = null, target = null;
      const onMove = ev => {
        if (!dragging) {
          const dx = ev.clientX - sx, dy = ev.clientY - sy;
          if (dx * dx + dy * dy < 49) return;
          dragging = true;
          el.classList.add('drag-src');
          ghost = el.cloneNode(true);
          ghost.classList.remove('drag-src');
          ghost.classList.add('drag-ghost');
          ghost.style.width = rect0.width + 'px';
          ghost.style.height = rect0.height + 'px';
          document.body.appendChild(ghost);
          ind = E('div', 'drop-indicator');
          ind.style.display = 'none';
          document.body.appendChild(ind);
        }
        ghost.style.left = (ev.clientX - offX) + 'px';
        ghost.style.top = (ev.clientY - offY) + 'px';
        // 삽입 위치 계산: 각 아이템의 모서리(그리드=좌우, 리스트=상하) 중 커서와 가장 가까운 곳
        let best = null;
        container.querySelectorAll(itemSelector).forEach(cd => {
          if (cd === el) return;
          const cr = cd.getBoundingClientRect();
          const idx = +cd.dataset.idx;
          const row = cr.width > cr.height * 2;
          if (row) {
            const midX = (cr.left + cr.right) / 2;
            const sT = Math.hypot(ev.clientX - midX, ev.clientY - cr.top);
            const sB = Math.hypot(ev.clientX - midX, ev.clientY - cr.bottom);
            if (!best || sT < best.score) best = { idx, before: true, x: cr.left, y: cr.top - 3, len: cr.width, row, score: sT };
            if (sB < best.score) best = { idx, before: false, x: cr.left, y: cr.bottom + 1, len: cr.width, row, score: sB };
          } else {
            const midY = (cr.top + cr.bottom) / 2;
            const sL = Math.hypot(ev.clientX - cr.left, ev.clientY - midY);
            const sR = Math.hypot(ev.clientX - cr.right, ev.clientY - midY);
            if (!best || sL < best.score) best = { idx, before: true, x: cr.left - 4, y: cr.top, len: cr.height, row, score: sL };
            if (sR < best.score) best = { idx, before: false, x: cr.right + 2, y: cr.top, len: cr.height, row, score: sR };
          }
        });
        target = best;
        if (best) {
          ind.style.display = 'block';
          ind.style.left = best.x + 'px';
          ind.style.top = best.y + 'px';
          ind.style.width = (best.row ? best.len : 3) + 'px';
          ind.style.height = (best.row ? 3 : best.len) + 'px';
        } else ind.style.display = 'none';
      };
      const onUp = ev => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (!dragging) { if (opts.onClick) opts.onClick(fromIdx, ev); return; }
        el.classList.remove('drag-src');
        if (ghost) ghost.remove();
        if (ind) ind.remove();
        if (!target) return;
        let to = target.idx + (target.before ? 0 : 1);
        const n = container.querySelectorAll(itemSelector).length;
        const order = [...Array(n).keys()];
        order.splice(fromIdx, 1);
        if (to > fromIdx) to--;
        order.splice(to, 0, fromIdx);
        if (order.some((v, i) => v !== i) && opts.onCommit) opts.onCommit(order);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    });
  });
}

// ---------- 공용 드롭다운 (정렬/필터/톱니 메뉴 공용, 재클릭 시 닫힘) ----------
let ddState = null;
function closeDD() { if (ddState) { ddState.el.remove(); ddState = null; } }
// at: {x,y}를 주면 그 좌표에 띄운다 (우클릭 메뉴용)
function toggleDD(anchor, items, at) {
  if (!at && ddState && ddState.anchor === anchor) { closeDD(); return; }
  closeDD();
  const dd = E('div', 'dd');
  items.forEach(it => {
    if (it.sep) { dd.appendChild(E('div', 'dd-sep')); return; }
    const b = E('button', 'dd-item' + (it.on ? ' on' : '') + (it.clear ? ' clear' : ''));
    if (it.icon) { const ic = E('span', 'svgi'); ic.innerHTML = it.icon; b.appendChild(ic); }
    b.appendChild(document.createTextNode(it.label));
    b.onclick = () => { closeDD(); it.fn(); };
    dd.appendChild(b);
  });
  document.body.appendChild(dd);
  const r = anchor ? anchor.getBoundingClientRect() : { left: at.x, bottom: at.y, right: at.x };
  dd.style.left = Math.min(r.left, window.innerWidth - dd.offsetWidth - 8) + 'px';
  const top = r.bottom + 4;
  dd.style.top = top + 'px';
  // 화면 하단을 넘지 않도록 가용 높이에 맞춰 제한 (CSS max-height와 함께 더 작은 값)
  const avail = window.innerHeight - top - 8;
  dd.style.maxHeight = Math.max(120, Math.min(340, avail)) + 'px';
  ddState = { anchor: anchor || dd, el: dd };
}

// ============================================================
//  렌더링 공통
// ============================================================
function isEdit() { return settings.mode === 'edit'; }

// 헤더 이름 오른쪽에 모델을 나란히 두고 눌러서 전환한다
function renderModelTabs() {
  const host = $('modelTabs'); if (!host) return;
  host.innerHTML = '';
  MODELS.forEach(m => {
    const b = E('button', 'model-tab' + (curModel && m.id === curModel.id ? ' on' : ''));
    b.textContent = m.name;
    b.onclick = () => switchModel(m.id);
    host.appendChild(b);
  });
}

// 검색칸은 헤더에 붙박이라 다시 만들지 않는다. 지금 보고 있는 곳의 검색어만 비춰준다
function syncSearchBox() {
  const si = $('searchInput'); if (!si) return;
  const v = curSearch();
  if (si.value !== v) si.value = v;
  const cl = $('searchClear');
  if (cl) cl.style.display = v ? 'inline-flex' : 'none';
}

function render() {
  closeDD();
  closeMemo();
  setupLazy();
  const ct = $('content');
  document.body.classList.toggle('view-mode', !isEdit());
  $('appName').textContent = galName();
  renderModelTabs();
  $('galleryBtn').innerHTML = isArtist() ? ICONS.galMeta : ICONS.galArtist;
  syncSearchBox();
  tauriInvoke('set_title', { title: galName() });
  renderGalleryToolbar();
  renderGallery();
  const fab = $('fab');
  if (fab) fab.style.display = isEdit() ? 'flex' : 'none';
  if (ct) ct.scrollTop = scrollPos[scrollKey()] || 0;
}

// ============================================================
//  세트 메타데이터 뷰어 (첫 번째 이미지 기준, 순서를 바꾸면 대상도 바뀜)
// ============================================================
const META_FIELD_DEFS = [
  ['prompt', 'Base Prompt'],
  ['uc', 'Undesired Content'],
];

function metaField(label, value) {
  const wrap = E('div', 'mf');
  const text = value === null || value === undefined || value === '' ? '' : String(value);
  const lb = E('div', 'mf-label'); lb.textContent = label;
  const bd = E('div', 'mf-body'); bd.textContent = text || '—';
  wrap.appendChild(lb); wrap.appendChild(bd);
  if (text) {
    wrap.classList.add('copyable');
    wrap.onclick = () => copyText(text, label);
  }
  return wrap;
}

function b64ToBuf(b64) {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8.buffer;
}

async function openSetMeta(setId) {
  const st = D.sets.find(x => x.id === setId); if (!st) return;
  const img = (st.images || [])[0];
  if (!img) { toast('이미지가 없습니다'); return; }
  // 저장된 파싱 결과가 없으면(구버전 등록분) 원본에서 즉석 파싱 후 저장
  if (img.fields === undefined) {
    try {
      const b64 = await tauriInvoke('read_image_base64', { name: img.name });
      img.fields = b64 ? await parseNaiMetadata(b64ToBuf(b64)) : null;
    } catch (e) { img.fields = null; }
    scheduleSave();
  }
  const f = img.fields || {};

  const bk = E('div', 'pp-bk');
  const p = E('div', 'pp pp-wide');
  const hd = E('div', 'pp-hd');
  const t = E('span', 'pp-t'); t.textContent = st.title; hd.appendChild(t);
  const x = E('button', 'pp-x'); x.innerHTML = ICONS.x; x.onclick = () => bk.remove(); hd.appendChild(x);
  p.appendChild(hd);
  const bd = E('div', 'pp-bd meta-detail');

  const imgCol = E('div', 'md-img');
  const im = E('img'); im.src = imgURL(img.thumb);
  im.onclick = () => openLightbox(st.images, 0);
  imgCol.appendChild(im);
  const anBtn = E('button', 'md-analyze');
  const anIc = E('span', 'svgi'); anIc.innerHTML = ICONS.galArtist; anBtn.appendChild(anIc);
  anBtn.appendChild(document.createTextNode('작가 태그 분석'));
  anBtn.onclick = () => openAnalyze(st.title, img.fields);
  imgCol.appendChild(anBtn);
  bd.appendChild(imgCol);

  const fields = E('div', 'md-fields');
  fields.appendChild(metaField('Base Prompt', f.prompt));
  fields.appendChild(metaField('Undesired Content', f.uc));
  const row = E('div', 'mf-row');
  row.appendChild(metaField('Steps', f.steps));
  row.appendChild(metaField('Sampler', f.sampler));
  fields.appendChild(row);
  const row2 = E('div', 'mf-row');
  row2.appendChild(metaField('Prompt Guidance', f.scale));
  row2.appendChild(metaField('Prompt Guidance Rescale', f.cfg_rescale));
  fields.appendChild(row2);
  bd.appendChild(fields);

  p.appendChild(bd);
  bk.appendChild(p);
  overlayHost().appendChild(bk);
  let dn = null;
  bk.addEventListener('mousedown', e => { dn = e.target; });
  bk.addEventListener('mouseup', e => { if (dn === e.target && e.target === bk) bk.remove(); dn = null; });
}

// ============================================================
//  작가 태그 분석 (첫 번째 이미지 기준)
// ============================================================
function openAnalyze(title, fields) {
  const bk = E('div', 'pp-bk');
  const p = E('div', 'pp pp-wide');
  const hd = E('div', 'pp-hd');
  const t = E('span', 'pp-t'); t.textContent = `작가 태그 분석 · ${title}`; hd.appendChild(t);
  const x = E('button', 'pp-x'); x.innerHTML = ICONS.x; x.onclick = () => bk.remove(); hd.appendChild(x);
  p.appendChild(hd);
  const bd = E('div', 'pp-bd an-body');

  const bar = E('div', 'an-bar');
  const lb = E('span', 'tb-label'); lb.textContent = '정렬';
  const sChip = E('button', 'chip cat-chip');
  const SORTS = [['order', '작성순'], ['weight', '가중치순']];
  bar.appendChild(lb); bar.appendChild(sChip);
  bd.appendChild(bar);

  const host = E('div', 'an-host');
  bd.appendChild(host);

  const draw = () => {
    const key = settings.analyzeSort === 'weight' ? 'weight' : 'order';
    sChip.textContent = SORTS.find(o => o[0] === key)[1];
    const { pos, neg } = analyzeArtists(fields);
    // 가중치순은 큰 것부터, 같으면 작성순서
    const sorter = key === 'weight'
      ? (a, b) => (b.weight - a.weight) || (a.order - b.order)
      : (a, b) => a.order - b.order;
    host.innerHTML = '';
    host.appendChild(section('작가 태그', [...pos].sort(sorter)));
    host.appendChild(section('부정 작가 태그', [...neg].sort(sorter)));
  };
  sChip.onclick = () => toggleDD(sChip, SORTS.map(([v, l]) => ({
    label: l, on: settings.analyzeSort === v,
    fn: () => { settings.analyzeSort = v; scheduleSave(); draw(); },
  })));

  function section(label, list) {
    const sec = E('div', 'an-sec');
    const h = E('div', 'an-sec-title'); h.textContent = `${label} (${list.length})`;
    sec.appendChild(h);
    if (!list.length) {
      const em = E('div', 'set-empty'); em.textContent = '없음';
      sec.appendChild(em);
      return sec;
    }
    const rows = E('div', 'an-rows');
    list.forEach(tg => {
      const row = E('div', 'an-row');
      const found = findArtist(tg.name);
      const th = E('div', 'an-thumb');
      const first = found && (found.images || [])[0];
      if (first) {
        const im = lazyImg('', first.thumb);
        th.classList.add('has');
        th.onclick = () => openArtistPopup(found.id, { fromAnalyze: true });
        th.appendChild(im);
      } else {
        th.classList.add('none');
      }
      row.appendChild(th);
      const nm = E('span', 'an-name' + (found ? ' linked' : '')); nm.textContent = tg.name;
      row.appendChild(nm);
      row.appendChild(E('span', 'attr-spacer'));
      const w = E('span', 'an-weight' + (tg.weight < 0 ? ' neg' : ''));
      w.textContent = tg.weight;
      row.appendChild(w);
      if (tg.movedFromBase) { const u = E('span', 'an-src'); u.textContent = 'BP'; row.appendChild(u); }
      rows.appendChild(row);
    });
    sec.appendChild(rows);
    return sec;
  }

  draw();
  p.appendChild(bd);
  bk.appendChild(p);
  overlayHost().appendChild(bk);
  let dn = null;
  bk.addEventListener('mousedown', e => { dn = e.target; });
  bk.addEventListener('mouseup', e => { if (dn === e.target && e.target === bk) bk.remove(); dn = null; });
}

// ============================================================
//  태그 통계 (메타 갤러리, 각 세트의 첫 번째 이미지만)
// ============================================================
function collectTagStats() {
  const q = qualitySet();
  const skip = n => settings.statExcludeQuality && q.has(tagMatchKey(n));
  const pos = new Map(), neg = new Map();
  const bump = (map, name) => {
    // name은 파서에서 이미 다듬어진 이름이다. 여기서 또 다듬으면 이름이 깎인다
    const k = tagMatchKey(name);
    const cur = map.get(k);
    if (cur) cur.count++;
    else map.set(k, { name, count: 1 });
  };
  D.sets.forEach(st => {
    const img = (st.images || [])[0];
    if (!img || !img.fields) return;
    const base = parsePromptTags(img.fields.prompt);
    const uc = parsePromptTags(img.fields.uc);
    // 베이스의 음수 가중치는 부정 쪽으로 합산한다
    base.forEach(t => { if (skip(t.name)) return; bump(t.weight < 0 ? neg : pos, t.name); });
    uc.forEach(t => { if (skip(t.name)) return; bump(neg, t.name); });
  });
  const sortByCount = m => [...m.values()].sort((a, b) => (b.count - a.count) || cmpName(a.name, b.name));
  return { pos: sortByCount(pos), neg: sortByCount(neg) };
}

function openTagStats() {
  const bk = E('div', 'pp-bk');
  const p = E('div', 'pp');
  const hd = E('div', 'pp-hd');
  const t = E('span', 'pp-t'); t.textContent = '태그 통계'; hd.appendChild(t);
  const x = E('button', 'pp-x'); x.innerHTML = ICONS.x; x.onclick = () => bk.remove(); hd.appendChild(x);
  p.appendChild(hd);
  const bd = E('div', 'pp-bd an-body');

  const bar = E('div', 'an-bar');
  const seg = E('div', 'seg');
  const KINDS = [['pos', 'BP'], ['neg', 'UC']];
  const host = E('div', 'stat-host');
  const draw = () => {
    [...seg.children].forEach((b, i) => b.classList.toggle('active', KINDS[i][0] === settings.statKind));
    const { pos, neg } = collectTagStats();
    const list = settings.statKind === 'neg' ? neg : pos;
    host.innerHTML = '';
    if (!list.length) {
      const em = E('div', 'set-empty'); em.textContent = '없음';
      host.appendChild(em);
      return;
    }
    const rows = E('div', 'stat-rows');
    list.forEach((tg, i) => {
      const found = findArtist(tg.name);
      const row = E('div', 'stat-row' + (found ? ' linked' : ''));
      const rk = E('span', 'stat-rank'); rk.textContent = i + 1; row.appendChild(rk);
      const nm = E('span', 'stat-name'); nm.textContent = tg.name; row.appendChild(nm);
      if (found) { const ic = E('span', 'svgi stat-go'); ic.innerHTML = ICONS.galArtist; row.appendChild(ic); }
      row.appendChild(E('span', 'attr-spacer'));
      const ct = E('span', 'stat-count'); ct.textContent = tg.count; row.appendChild(ct);
      if (found) row.onclick = () => openArtistPopup(found.id, { fromAnalyze: true });
      rows.appendChild(row);
    });
    host.appendChild(rows);
  };
  KINDS.forEach(([v, l]) => {
    const b = E('button', 'seg-btn seg-text');
    b.textContent = l;
    b.onclick = () => { settings.statKind = v; scheduleSave(); draw(); };
    seg.appendChild(b);
  });
  bar.appendChild(seg);
  bar.appendChild(E('span', 'attr-spacer'));
  const qLb = E('span', 'set-label'); qLb.textContent = '퀄리티 태그 제외';
  const qSw = E('div', 'tsw' + (settings.statExcludeQuality ? ' on' : ''));
  qSw.onclick = () => {
    settings.statExcludeQuality = !settings.statExcludeQuality;
    qSw.classList.toggle('on', settings.statExcludeQuality);
    scheduleSave(); draw();
  };
  bar.appendChild(qLb); bar.appendChild(qSw);
  // 지금 보고 있는 쪽(BP/UC)의 태그를 화면에 뜬 순서 그대로 한 줄에 하나씩 복사한다
  const cpB = E('button', 'icon-btn'); cpB.innerHTML = ICONS.copy;
  cpB.onclick = () => {
    const { pos, neg } = collectTagStats();
    const kind = settings.statKind === 'neg' ? 'neg' : 'pos';
    const list = kind === 'neg' ? neg : pos;
    if (!list.length) return;
    copyText(list.map(t => t.name).join('\n'), kind === 'neg' ? 'UC 태그' : 'BP 태그');
  };
  bar.appendChild(cpB);
  bd.appendChild(bar);
  bd.appendChild(host);
  draw();

  p.appendChild(bd);
  bk.appendChild(p);
  overlayHost().appendChild(bk);
  let dn = null;
  bk.addEventListener('mousedown', e => { dn = e.target; });
  bk.addEventListener('mouseup', e => { if (dn === e.target && e.target === bk) bk.remove(); dn = null; });
}

// ============================================================
//  공간 2: 갤러리
// ============================================================

// ---------- 테마 (모델과 무관하게 전체 공용) ----------
// 색은 styles.css 맨 위 변수 한 곳에 모여 있고, 테마는 그 변수만 갈아끼운다.
const THEMES = [
  { id: 'glacier', name: '글레이셔', dot: '#629bb5' },
  { id: 'default', name: '핑크', dot: '#f7a6ca' },
  { id: 'apricot', name: '주황', dot: '#f0c19c' },
  { id: 'sky', name: '파랑', dot: '#9fcef2' },
  { id: 'lavender', name: '보라', dot: '#d8a9f7' },
  { id: 'cream', name: '크림', dot: '#d6d0b7' },
  { id: 'matcha', name: '말차', dot: '#bac8a7' },
  { id: 'white', name: '흰색', dot: '#d1ccce' },
];
function applyTheme() {
  const id = THEMES.some(t => t.id === settings.theme) ? settings.theme : 'glacier';
  settings.theme = id;
  document.documentElement.dataset.theme = id;
}

// ---------- 갤러리 구분 ----------
// 두 갤러리는 목록도 필터도 완전히 따로다. 아래 헬퍼가 지금 보고 있는 쪽을 가리킨다.
function isArtist() { return settings.gallery === 'artist'; }
function galName() { return 'NASO'; }
function curList() { return isArtist() ? D.artists : D.sets; }
function curFilters() { return isArtist() ? D.artistFilters : D.filters; }
function setCurFilters(v) { if (isArtist()) D.artistFilters = v; else D.filters = v; }
function curActive() { return isArtist() ? settings.artistActiveTags : settings.activeTags; }
function setCurActive(v) { if (isArtist()) settings.artistActiveTags = v; else settings.activeTags = v; }
function curSortKey() { return isArtist() ? settings.artistSortKey : settings.sortKey; }
function curBookmarkOnly() { return isArtist() ? settings.artistBookmarkOnly : settings.bookmarkOnly; }
function toggleBookmarkOnly() {
  if (isArtist()) settings.artistBookmarkOnly = !settings.artistBookmarkOnly;
  else settings.bookmarkOnly = !settings.bookmarkOnly;
  scheduleSave(); render();
}
function curLayout() { return (isArtist() ? settings.artistLayout : settings.layout) || { ratio: 0, size: 180 }; }
// 비율 0 → 832x1216(세로), 0.5 → 정사각형, 1 → 1216x832(가로)
const RATIO_MIN = 832 / 1216, RATIO_MAX = 1216 / 832;
function ratioValue(t) { return t <= 0.5 ? RATIO_MIN + (1 - RATIO_MIN) * (t / 0.5) : 1 + (RATIO_MAX - 1) * ((t - 0.5) / 0.5); }
function ratioLabel(t) {
  if (Math.abs(t) < 0.001) return '세로형 832 × 1216';
  if (Math.abs(t - 0.5) < 0.001) return '정사각형';
  if (Math.abs(t - 1) < 0.001) return '가로형 1216 × 832';
  return '';
}
function curSortDir() { return isArtist() ? settings.artistSortDir : settings.sortDir; }

function folderList() { return curFilters().filter(f => f.type === 'folder'); }
function looseTags() { return curFilters().filter(f => f.type === 'tag'); }
// 화면 표시 순서 = 필터 목록에 놓인 순서
function allTags() {
  const out = [];
  curFilters().forEach(f => { if (f.type === 'tag') out.push(f); else (f.tags || []).forEach(t => out.push(t)); });
  return out;
}
function tagById(id) { return allTags().find(t => t.id === id); }
// 태그 하나를 켜고 끈다 (툴바 공용)
function toggleTag(id) {
  const a = curActive();
  const i = a.indexOf(id);
  if (i >= 0) a.splice(i, 1); else a.push(id);
  scheduleSave(); render();
}

// ---------- 이름순 ----------
// 숫자 → 영어 → 한글 순. 대소문자는 구분하지 않고, 숫자는 크기로 비교한다(2번 < 10번).
const NAME_COLLATOR = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });
function nameRank(v) {
  const c = String(v || '').trim().charAt(0);
  if (!c) return 3;
  if (c >= '0' && c <= '9') return 0;
  if (/[a-zA-Z]/.test(c)) return 1;
  return 2;
}
function cmpName(a, b) {
  const ra = nameRank(a), rb = nameRank(b);
  if (ra !== rb) return ra - rb;
  return NAME_COLLATOR.compare(String(a || ''), String(b || ''));
}


function visibleSets() {
  // 사라진 태그는 정리
  setCurActive((curActive() || []).filter(id => tagById(id)));
  const src = curList();
  let list = src.map((s, i) => ({ s, i }));
  // 이름 검색. 필터·북마크와 겹쳐서 걸린다 (서로 풀지 않는다)
  const q = tagMatchKey(curSearch());
  if (q) list = list.filter(({ s }) => tagMatchKey(s.title).includes(q));
  if (curBookmarkOnly()) list = list.filter(({ s }) => !!s.bookmark);
  const act = curActive();
  // 고른 태그를 전부 가진 것만
  if (act.length) list = list.filter(({ s }) => act.every(id => (s.tags || []).includes(id)));
  let key = curSortKey();
  const valid = key === 'order' || key === 'name' || (isArtist() && key === 'use');
  if (!valid) { key = 'order'; if (isArtist()) settings.artistSortKey = 'order'; else settings.sortKey = 'order'; }
  const mul = curSortDir() === 'desc' ? -1 : 1;
  if (key === 'order') {
    list.sort((a, b) => (a.i - b.i) * mul);
  } else if (key === 'name') {
    list.sort((a, b) => (cmpName(a.s.title, b.s.title) || (a.i - b.i)) * mul);
  } else if (key === 'use') {
    const sc = artistUseScores();
    const v = st => sc.get(tagMatchKey(st.title)) || 0;
    list.sort((a, b) => ((v(a.s) - v(b.s)) || cmpName(a.s.title, b.s.title) || (a.i - b.i)) * mul);
  }
  return list.map(x => x.s);
}

function renderGalleryToolbar() {
  const tb = $('toolbar'); tb.innerHTML = '';
  let filterWrap = null;

  const bmWrap = E('div', 'tb-group');
  const bmBtn = E('button', 'bm-filter' + (curBookmarkOnly() ? ' on' : ''));
  bmBtn.innerHTML = ICONS.heart;
  bmBtn.onclick = () => toggleBookmarkOnly();
  bmWrap.appendChild(bmBtn);
  tb.appendChild(bmWrap);

  const sortWrap = E('div', 'tb-group');
  const sl = E('span', 'tb-label'); sl.textContent = '정렬';
  const opts = [['name', '이름순'], ['order', '등록순']];
  if (isArtist()) opts.push(['use', '인기순']);
  const setKey = v => { if (isArtist()) settings.artistSortKey = v; else settings.sortKey = v; scheduleSave(); render(); };
  const setDir = v => { if (isArtist()) settings.artistSortDir = v; else settings.sortDir = v; scheduleSave(); render(); };
  const curKey = opts.some(o => o[0] === curSortKey()) ? curSortKey() : 'order';
  const curLabel = opts.find(o => o[0] === curKey)[1];
  const sChip = E('button', 'chip cat-chip');
  sChip.textContent = curLabel;
  sChip.onclick = () => {
    const items = opts.map(([v, l]) => ({ label: l, on: v === curKey, fn: () => setKey(v) }));
    items.push({ sep: true });
    items.push({ label: '내림차순', on: curSortDir() === 'desc', fn: () => setDir('desc') });
    items.push({ label: '오름차순', on: curSortDir() === 'asc', fn: () => setDir('asc') });
    toggleDD(sChip, items);
  };
  sortWrap.appendChild(sl); sortWrap.appendChild(sChip);
  tb.appendChild(sortWrap);

  if (curFilters().length) {
    const fw = E('div', 'tb-group filters collapsed');
    const fl = E('span', 'tb-label'); fl.textContent = '필터';
    fw.appendChild(fl);
    curFilters().forEach(f => {
      if (f.type === 'folder') {
        const tags = f.tags || [];
        const chip = E('button', 'chip cat-chip');
        chip.textContent = f.name;
        chip.onclick = () => {
          const items = tags.map(t => ({
            label: t.name, on: curActive().includes(t.id),
            fn: () => toggleTag(t.id),
          }));
          if (tags.some(t => curActive().includes(t.id))) {
            items.push({
              label: '해제', clear: true,
              fn: () => {
                setCurActive(curActive().filter(id => !tags.some(t => t.id === id)));
                scheduleSave(); render();
              },
            });
          }
          toggleDD(chip, items);
        };
        fw.appendChild(chip);
        // 고른 태그는 폴더 칩 오른쪽에 하나씩 이어 붙는다
        tags.forEach(t => {
          if (!curActive().includes(t.id)) return;
          const tc = E('button', 'chip cat-chip on');
          tc.textContent = t.name;
          tc.onclick = () => toggleTag(t.id);
          fw.appendChild(tc);
        });
      } else {
        const on = curActive().includes(f.id);
        const chip = E('button', 'chip cat-chip' + (on ? ' on' : ''));
        chip.textContent = f.name;
        chip.onclick = () => toggleTag(f.id);
        fw.appendChild(chip);
      }
    });
    if (curActive().length) {
      const clr = E('button', 'chip clear-chip'); clr.textContent = '초기화';
      clr.onclick = () => { setCurActive([]); scheduleSave(); render(); };
      fw.appendChild(clr);
    }
    tb.appendChild(fw);
    filterWrap = fw;
  }

  const right = E('div', 'tb-group right');
  // 작가 갤러리는 갤러리 형태 하나뿐이라 보기 전환이 없다
  let vm = null;
  if (!isArtist()) {
    vm = E('div', 'seg');
    [['card', ICONS.viewCard], ['thumb', ICONS.viewThumb]].forEach(([v, ic]) => {
      const b = E('button', 'seg-btn' + (settings.viewMode === v ? ' active' : ''));
      b.innerHTML = ic;
      b.onclick = () => { settings.viewMode = v; scheduleSave(); render(); };
      vm.appendChild(b);
    });
    right.appendChild(vm);
  }
  tb.appendChild(right);

  // 툴바를 전부 채운 뒤에 재야 실제 필터 폭이 나온다.
  // (오른쪽 덩어리를 넣기 전에 재면 필터가 넓게 퍼진 상태라 넘침을 놓친다)
  if (filterWrap) updateFilterOverflow(filterWrap, right, vm);
}

// 한 줄 높이를 실제 칩에서 재고, 전체가 그보다 크면 넘친 것으로 본다.
// 값을 박지 않으므로 글꼴·배율이 달라져도 어긋나지 않는다.
function updateFilterOverflow(fw, right, vm) {
  fw.style.maxHeight = '';
  fw.style.paddingTop = '';
  fw.classList.add('collapsed');
  const chipH = Math.max(0, ...[...fw.children].map(c => c.offsetHeight));
  if (!chipH) return;
  // 첫 줄 높이는 덩어리 중 가장 큰 것을 따른다 (보기 전환이 칩보다 크다)
  const lineH = Math.max(chipH, right.offsetHeight);
  fw.parentElement.style.setProperty('--tb-row', lineH + 'px');
  // 칩이 작을 때 첫 줄 중심선을 맞춰준다
  fw.style.paddingTop = Math.max(0, Math.round((lineH - chipH) / 2)) + 'px';
  const over = fw.scrollHeight > lineH + 1;
  const prev = right.querySelector('.tb-more');
  if (prev) prev.remove();
  if (!over) {
    filtersExpanded = false;
    fw.classList.remove('collapsed');
    return;
  }
  const more = E('button', 'tb-more' + (filtersExpanded ? ' open' : ''));
  more.innerHTML = ICONS.down;
  more.onclick = () => { filtersExpanded = !filtersExpanded; render(); };
  if (vm) right.insertBefore(more, vm); else right.appendChild(more); // 보기 전환 바로 왼쪽
  if (filtersExpanded) fw.classList.remove('collapsed');
  else fw.style.maxHeight = lineH + 'px';
}

// 편집 모드에서는 빈 하트도 보이고 눌러서 켜고 끈다. 뷰어 모드에서는 켜진 것만 보인다.
// 누른 자리에서 바로 바뀌도록 화면 전체를 다시 그리지 않는다.
function makeBookmark(s, cls) {
  const on = !!s.bookmark;
  if (!isEdit() && !on) return null;
  const b = E(isEdit() ? 'button' : 'span', cls + (on ? ' on' : ''));
  b.innerHTML = ICONS.heart;
  if (isEdit()) {
    b.onclick = e => {
      e.stopPropagation();
      s.bookmark = !s.bookmark;
      // 같은 항목의 하트가 여러 곳(갤러리·팝업)에 있을 수 있으므로 전부 맞춘다
      syncBookmarks(s);
      scheduleSave();
      if (curBookmarkOnly()) render(); // 걸러보는 중이면 목록이 달라진다
    };
  }
  b.dataset.bmk = s.id;
  return b;
}

function syncBookmarks(s) {
  document.querySelectorAll(`[data-bmk="${s.id}"]`).forEach(el => el.classList.toggle('on', !!s.bookmark));
}
function bookmarkMark(s) { return makeBookmark(s, 'bmk'); }
function tileBookmark(s) { return makeBookmark(s, 'tile-bmk'); }


// onClose: 팝업으로 열렸을 때만 전달. 제목줄 버튼 맨 오른쪽에 닫기를 붙인다.
// 메모가 있을 때만 버튼을 만든다. 누르면 버튼 아래에 작은 창이 뜬다
function memoButton(memo) {
  const txt = (memo || '').trim();
  if (!txt) return null;
  const b = E('button', 'icon-btn'); b.innerHTML = ICONS.memo;
  b.onclick = e => { e.stopPropagation(); toggleMemo(b, txt); };
  return b;
}

let memoState = null;
function closeMemo() {
  if (!memoState) return;
  memoState.el.remove();
  memoState.anchor.classList.remove('active');
  memoState = null;
  document.removeEventListener('mousedown', memoOutside, true);
}
function memoOutside(e) {
  if (!memoState) return;
  if (memoState.el.contains(e.target) || memoState.anchor.contains(e.target)) return;
  closeMemo();
}
function toggleMemo(anchor, txt) {
  if (memoState && memoState.anchor === anchor) { closeMemo(); return; }
  closeMemo();
  const box = E('div', 'memo-pop');
  box.textContent = txt;
  document.body.appendChild(box);
  const r = anchor.getBoundingClientRect();
  const w = box.offsetWidth;
  let left = r.right - w;
  left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
  box.style.left = left + 'px';
  const top = r.bottom + 6;
  if (top + box.offsetHeight > window.innerHeight - 8) box.style.top = Math.max(8, r.top - box.offsetHeight - 6) + 'px';
  else box.style.top = top + 'px';
  anchor.classList.add('active');
  memoState = { anchor, el: box };
  document.addEventListener('mousedown', memoOutside, true);
}

function renderCard(s, { inPopup = false, onClose = null } = {}) {
  const card = E('div', 'card' + (inPopup ? ' in-popup' : ''));
  card.id = inPopup ? '' : 'set-' + s.id;

  const hd = E('div', 'card-hd');
  const tWrap = E('div', 'card-title-wrap');
  const bar = E('span', 'card-bar');
  const title = E('span', 'card-title'); title.textContent = s.title;
  tWrap.appendChild(bar); tWrap.appendChild(title);
  const bmk = bookmarkMark(s);
  if (bmk) tWrap.appendChild(bmk);
  if (!inPopup) tWrap.onclick = () => { s.collapsed = !s.collapsed; scheduleSave(); render(); };
  hd.appendChild(tWrap);
  const actions = E('div', 'card-actions');
  const memoB = memoButton(s.memo); if (memoB) actions.appendChild(memoB);
  if ((s.images || []).length) {
    const mb = E('button', 'icon-btn'); mb.innerHTML = ICONS.meta;
    mb.onclick = e => { e.stopPropagation(); openSetMeta(s.id); };
    actions.appendChild(mb);
  }
  if (isEdit()) {
    const ed = E('button', 'icon-btn'); ed.innerHTML = ICONS.rename;
    ed.onclick = e => { e.stopPropagation(); openSetEditor(s.id); };
    actions.appendChild(ed);
  }
  // 카드형에는 붙지 않는다 (onClose가 없으므로 실행되지 않음)
  if (inPopup && onClose) {
    const cb = E('button', 'icon-btn'); cb.innerHTML = ICONS.x;
    cb.onclick = e => { e.stopPropagation(); onClose(); };
    actions.appendChild(cb);
  }
  hd.appendChild(actions);
  card.appendChild(hd);

  const chips = E('div', 'card-chips');
  allTags().forEach(t => {
    if (!(s.tags || []).includes(t.id)) return;
    const c = E('button', 'chip chip-act'); c.textContent = t.name;
    c.onclick = e => {
      e.stopPropagation();
      setCurActive([t.id]); // 교체
      scheduleSave(); render();
    };
    chips.appendChild(c);
  });
  if (chips.childNodes.length) card.appendChild(chips);

  if (!s.collapsed || inPopup) {
    const mas = E('div', 'masonry');
    (s.images || []).forEach((img, i) => {
      const cell = E('div', 'mas-cell');
      const im = lazyImg('mas-img', img.thumb, img);
      im.onclick = () => openLightbox(s.images, i);
      cell.appendChild(im);
      mas.appendChild(cell);
    });
    card.appendChild(mas);
  }
  return card;
}

// 갤러리형 타일 격자에 지금 모델의 비율·크기를 입힌다
function applyTileLayout(grid) {
  const L = curLayout();
  grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${L.size}px, 1fr))`;
  grid.style.setProperty('--tile-ratio', ratioValue(L.ratio));
}

function renderGallery() {
  const ct = $('content'); ct.innerHTML = '';
  const list = visibleSets();
  if (!list.length) {
    // 검색해서 아무것도 안 나왔을 때만 알린다 (팝업에서 쓰는 '없음'과 같은 표시)
    if (curSearch().trim()) { const em = E('div', 'set-empty'); em.textContent = '없음'; ct.appendChild(em); }
    return;
  }
  if (isArtist()) { renderArtistGallery(ct, list); return; }
  if (settings.viewMode === 'card') {
    const wrap = E('div', 'card-list');
    list.forEach(s => wrap.appendChild(renderCard(s)));
    ct.appendChild(wrap);
  } else {
    const grid = E('div', 'thumb-grid');
    list.forEach(s => {
      const tile = E('div', 'set-tile');
      tile.id = 'set-' + s.id;
      const first = (s.images || [])[0];
      if (first) tile.appendChild(lazyImg('set-tile-img', first.thumb));
      else tile.appendChild(E('div', 'set-tile-ph'));
      const ov = E('div', 'set-tile-ov');
      const tt = E('div', 'set-tile-title'); tt.textContent = s.title;
      ov.appendChild(tt);
      tile.appendChild(ov);
      const bmk = tileBookmark(s);
      if (bmk) tile.appendChild(bmk);
      tile.onclick = () => openCardPopup(s.id);
      grid.appendChild(tile);
    });
    applyTileLayout(grid);
    ct.appendChild(grid);
  }
}

// ---------- 작가 갤러리 ----------
// 메타 갤러리의 갤러리형(썸네일)과 같은 틀을 쓰되 우클릭 복사가 붙는다.
function renderArtistGallery(ct, list) {
  const grid = E('div', 'thumb-grid');
  list.forEach(s => {
    const tile = E('div', 'set-tile');
    tile.id = 'artist-' + s.id;
    const first = (s.images || [])[0];
    if (first) tile.appendChild(lazyImg('set-tile-img', first.thumb));
    else tile.appendChild(E('div', 'set-tile-ph'));
    const ov = E('div', 'set-tile-ov');
    const tt = E('div', 'set-tile-title'); tt.textContent = s.title;
    ov.appendChild(tt);
    tile.appendChild(ov);
    const bmk = tileBookmark(s);
    if (bmk) tile.appendChild(bmk);
    tile.onclick = () => openArtistPopup(s.id);
    tile.addEventListener('contextmenu', e => {
      e.preventDefault(); e.stopPropagation();
      openArtistMenu(s.title, e.clientX, e.clientY);
    });
    grid.appendChild(tile);
  });
  applyTileLayout(grid);
  ct.appendChild(grid);
}

// 복사 문자열. 가중치를 쓸 때 ::앞이 숫자로 끝나면 붙어 읽히므로 한 칸 띄운다.
function artistCopyText(name, { artist = false, weight = false } = {}) {
  const body = artist ? `artist:${name}` : name;
  if (!weight) return body + ', ';
  const sp = /[0-9]$/.test(body) ? ' ' : '';
  return `1.0::${body}${sp}::, `;
}

function openArtistMenu(name, x, y) {
  const items = [
    { label: '복사', fn: () => copyText(artistCopyText(name), name) },
    { label: '아티스트 복사', fn: () => copyText(artistCopyText(name, { artist: true }), name) },
    { label: '가중치 복사', fn: () => copyText(artistCopyText(name, { weight: true }), name) },
    { label: '가중치 아티스트 복사', fn: () => copyText(artistCopyText(name, { artist: true, weight: true }), name) },
  ];
  toggleDD(null, items, { x, y });
}

function openArtistPopup(id, { fromAnalyze = false } = {}) {
  const s = D.artists.find(x => x.id === id); if (!s) return;
  const bk = E('div', 'pp-bk');
  bk.dataset.artist = id;
  const p = E('div', 'pp pp-card');
  const bd = E('div', 'pp-bd');

  const card = E('div', 'card in-popup');
  const hd = E('div', 'card-hd');
  const tWrap = E('div', 'card-title-wrap');
  const bar = E('span', 'card-bar');
  const title = E('span', 'card-title'); title.textContent = s.title;
  tWrap.appendChild(bar); tWrap.appendChild(title);
  const abmk = bookmarkMark(s);
  if (abmk) tWrap.appendChild(abmk);
  hd.appendChild(tWrap);
  const actions = E('div', 'card-actions');
  const memoB = memoButton(s.memo); if (memoB) actions.appendChild(memoB);
  const ub = E('button', 'icon-btn'); ub.innerHTML = ICONS.galMeta;
  ub.onclick = e => { e.stopPropagation(); openArtistUsage(s); };
  actions.appendChild(ub);
  if (isEdit() && !fromAnalyze) {
    const ed = E('button', 'icon-btn'); ed.innerHTML = ICONS.rename;
    ed.onclick = e => { e.stopPropagation(); openSetEditor(s.id); };
    actions.appendChild(ed);
  }
  const cb = E('button', 'icon-btn'); cb.innerHTML = ICONS.x;
  cb.onclick = e => { e.stopPropagation(); bk.remove(); };
  actions.appendChild(cb);
  hd.appendChild(actions);
  card.appendChild(hd);

  const chips = E('div', 'card-chips');
  // 작가 갤러리의 필터에서 이름을 찾는다 (메타 갤러리에서 열려도 올바르게 나오도록)
  const aTags = [];
  D.artistFilters.forEach(f => { if (f.type === 'tag') aTags.push(f); else (f.tags || []).forEach(t => aTags.push(t)); });
  aTags.forEach(t => {
    if (!(s.tags || []).includes(t.id)) return;
    if (fromAnalyze) { const c = E('span', 'chip'); c.textContent = t.name; chips.appendChild(c); return; }
    const c = E('button', 'chip chip-act'); c.textContent = t.name;
    c.onclick = e => { e.stopPropagation(); setCurActive([t.id]); scheduleSave(); bk.remove(); render(); };
    chips.appendChild(c);
  });
  if (chips.childNodes.length) card.appendChild(chips);

  const mas = E('div', 'masonry');
  (s.images || []).forEach((img, i) => {
    const cell = E('div', 'mas-cell');
    const im = lazyImg('mas-img', img.thumb, img);
    im.onclick = () => openLightbox(s.images, i);
    cell.appendChild(im);
    mas.appendChild(cell);
  });
  card.appendChild(mas);

  bd.appendChild(card);
  p.appendChild(bd);
  bk.appendChild(p);
  bk.addEventListener('contextmenu', e => {
    e.preventDefault(); e.stopPropagation();
    openArtistMenu(s.title, e.clientX, e.clientY);
  });
  overlayHost().appendChild(bk);
  let dn = null;
  bk.addEventListener('mousedown', e => { dn = e.target; });
  bk.addEventListener('mouseup', e => { if (dn === e.target && e.target === bk) bk.remove(); dn = null; });
}

// 메타 갤러리의 지금 정렬 순서대로 세트를 늘어놓는다 (거르지는 않는다)
function metaSortedSets() {
  const list = D.sets.map((s, i) => ({ s, i }));
  const key = settings.sortKey;
  const mul = settings.sortDir === 'desc' ? -1 : 1;
  if (key === 'order') list.sort((a, b) => (a.i - b.i) * mul);
  else if (key === 'name') list.sort((a, b) => (cmpName(a.s.title, b.s.title) || (a.i - b.i)) * mul);
  else list.sort((a, b) => (a.i - b.i) * mul);
  return list.map(x => x.s);
}

// 이 작가를 쓴 메타 갤러리 항목을 찾는다 (각 세트의 첫 번째 이미지 기준)
function findArtistUsage(artist) {
  const key = tagMatchKey(artist.title);
  const out = [];
  // 메타 갤러리에서 보고 있는 정렬 순서를 그대로 따른다
  metaSortedSets().forEach(st => {
    const img = (st.images || [])[0];
    if (!img || !img.fields) return;
    const { pos, neg } = analyzeArtists(img.fields);
    const hitPos = pos.find(t => tagMatchKey(t.name) === key);
    const hitNeg = neg.find(t => tagMatchKey(t.name) === key);
    if (!hitPos && !hitNeg) return;
    const hit = hitPos || hitNeg;
    out.push({ set: st, img, weight: hit.weight, negative: !hitPos });
  });
  return out;
}

function openArtistUsage(artist) {
  const list = findArtistUsage(artist);
  const bk = E('div', 'pp-bk');
  const p = E('div', 'pp pp-wide');
  const hd = E('div', 'pp-hd');
  const t = E('span', 'pp-t'); t.textContent = `태그 포함 그림체 · ${displayTagName(artist.title)}`; hd.appendChild(t);
  const x = E('button', 'pp-x'); x.innerHTML = ICONS.x; x.onclick = () => bk.remove(); hd.appendChild(x);
  p.appendChild(hd);
  const bd = E('div', 'pp-bd');

  if (!list.length) {
    const em = E('div', 'set-empty'); em.textContent = '없음';
    bd.appendChild(em);
  } else {
    const grid = E('div', 'use-grid');
    grid.style.setProperty('--tile-ratio', ratioValue((settings.layout || {}).ratio || 0));
    list.forEach(u => {
      const cell = E('div', 'use-cell');
      const thumb = E('div', 'use-thumb');
      thumb.appendChild(lazyImg('', u.img.thumb, u.img));
      if (u.negative) { const nb = E('span', 'use-neg'); nb.textContent = 'UC'; thumb.appendChild(nb); }
      cell.appendChild(thumb);
      const nm = E('div', 'use-name'); nm.textContent = u.set.title;
      cell.appendChild(nm);
      const w = E('div', 'use-weight' + (u.weight < 0 ? ' neg' : '')); w.textContent = u.weight;
      cell.appendChild(w);
      cell.onclick = () => openCardPopup(u.set.id);
      grid.appendChild(cell);
    });
    bd.appendChild(grid);
  }

  p.appendChild(bd);
  bk.appendChild(p);
  overlayHost().appendChild(bk);
  let dn = null;
  bk.addEventListener('mousedown', e => { dn = e.target; });
  bk.addEventListener('mouseup', e => { if (dn === e.target && e.target === bk) bk.remove(); dn = null; });
}

function openCardPopup(id) {
  const s = D.sets.find(x => x.id === id); if (!s) return;
  const bk = E('div', 'pp-bk');
  bk.dataset.card = id;
  const p = E('div', 'pp pp-card');
  const bd = E('div', 'pp-bd');
  bd.appendChild(renderCard(s, { inPopup: true, onClose: () => bk.remove() }));
  p.appendChild(bd);
  bk.appendChild(p);
  overlayHost().appendChild(bk);
  let dn = null;
  bk.addEventListener('mousedown', e => { dn = e.target; });
  bk.addEventListener('mouseup', e => { if (dn === e.target && e.target === bk) bk.remove(); dn = null; });
}

function flashEl(el) { if (!el) return; el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1600); }

// ---------- 라이트박스 ----------
function openLightbox(images, idx) {
  let cur = idx;
  const bk = E('div', 'lightbox');
  const im = E('img');
  const cnt = E('div', 'lb-count');
  const show = () => { im.src = imgURL(images[cur].name); cnt.textContent = `${cur + 1} / ${images.length}`; };
  const nav = d => { cur = (cur + d + images.length) % images.length; show(); };
  const prev = E('button', 'lb-nav lb-prev'); prev.innerHTML = ICONS.prev; prev.onclick = e => { e.stopPropagation(); nav(-1); };
  const next = E('button', 'lb-nav lb-next'); next.innerHTML = ICONS.next; next.onclick = e => { e.stopPropagation(); nav(1); };
  const x = E('button', 'lb-x'); x.innerHTML = ICONS.x; x.onclick = () => close();
  const onKey = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') nav(-1); if (e.key === 'ArrowRight') nav(1); };
  const close = () => { bk.remove(); document.removeEventListener('keydown', onKey); };
  document.addEventListener('keydown', onKey);
  bk.appendChild(im);
  if (images.length > 1) { bk.appendChild(prev); bk.appendChild(next); }
  bk.appendChild(cnt); bk.appendChild(x);
  bk.addEventListener('click', e => { if (e.target === bk || e.target === im) close(); });
  overlayHost().appendChild(bk);
  show();
}

// ============================================================
//  세트 편집기
// ============================================================
function openSetEditor(editId) {
  const artist = isArtist();
  const isNew = !editId;
  const orig = isNew ? null : curList().find(x => x.id === editId);
  if (!isNew && !orig) return;
  const tmp = isNew
    ? { id: uid(), title: '', tags: [], images: [], collapsed: false, created: Date.now() }
    : JSON.parse(JSON.stringify(orig));
  if (!Array.isArray(tmp.tags)) tmp.tags = [];
  const origFiles = isNew ? [] : orig.images.flatMap(filePairs);
  // 팝업 위에서 편집을 열었다면, 편집이 끝난 뒤 그 팝업을 새 내용으로 다시 그린다
  const popupSel = artist ? `[data-artist="${editId}"]` : `[data-card="${editId}"]`;
  const backPopup = () => (isNew ? null : document.querySelector('.pp-bk' + popupSel));
  const refreshBack = () => {
    const el = backPopup();
    if (!el) return;
    el.remove();
    if (artist) openArtistPopup(editId); else openCardPopup(editId);
  };
  const closeBack = () => { const el = backPopup(); if (el) el.remove(); };
  const newFiles = [];

  const bk = E('div', 'pp-bk');
  const p = E('div', 'pp pp-editor');
  const hd = E('div', 'pp-hd');
  const unit = artist ? '작가' : '세트';
  const ht = E('span', 'pp-t'); ht.textContent = isNew ? `${unit} 등록` : `${unit} 편집`;
  hd.appendChild(ht);
  const x = E('button', 'pp-x'); x.innerHTML = ICONS.x;
  x.onclick = async () => { await deleteFiles(newFiles); bk.remove(); };
  hd.appendChild(x);
  p.appendChild(hd);

  const bd = E('div', 'pp-bd editor-body');

  const tRow = E('div', 'ed-row');
  const tl = E('div', 'ed-label'); tl.textContent = '이름'; tRow.appendChild(tl);
  const tIn = E('input', 'ed-input'); tIn.value = tmp.title;
  tRow.appendChild(tIn);
  bd.appendChild(tRow);

  if (curFilters().length) {
    const fRow = E('div', 'ed-row');
    const fl = E('div', 'ed-label'); fl.textContent = '필터'; fRow.appendChild(fl);
    const box = E('div', 'tag-pick');
    // 폴더 라벨 아래에 태그를 늘어놓고 눌러서 여러 개 고른다
    const tagBtn = t => {
      const b = E('button', 'chip cat-chip' + (tmp.tags.includes(t.id) ? ' on' : ''));
      b.textContent = t.name;
      b.onclick = () => {
        const i = tmp.tags.indexOf(t.id);
        if (i >= 0) tmp.tags.splice(i, 1); else tmp.tags.push(t.id);
        b.classList.toggle('on', tmp.tags.includes(t.id));
      };
      return b;
    };
    folderList().forEach(f => {
      const grp = E('div', 'tag-grp');
      const lb = E('div', 'tag-grp-label'); lb.textContent = f.name; grp.appendChild(lb);
      const row = E('div', 'tag-row');
      const tags = f.tags || [];
      if (tags.length) tags.forEach(t => row.appendChild(tagBtn(t)));
      else { const em = E('span', 'set-empty'); em.textContent = '없음'; row.appendChild(em); }
      grp.appendChild(row);
      box.appendChild(grp);
    });
    const loose = looseTags();
    if (loose.length) {
      const grp = E('div', 'tag-grp');
      const row = E('div', 'tag-row');
      loose.forEach(t => row.appendChild(tagBtn(t)));
      grp.appendChild(row);
      box.appendChild(grp);
    }
    fRow.appendChild(box);
    bd.appendChild(fRow);
  }

  const mRow = E('div', 'ed-row');
  const mLb = E('div', 'ed-label'); mLb.textContent = '메모'; mRow.appendChild(mLb);
  const mIn = E('textarea', 'ed-input ed-memo');
  mIn.rows = 3; mIn.value = tmp.memo || '';
  mRow.appendChild(mIn);
  bd.appendChild(mRow);

  const iRow = E('div', 'ed-row');
  const iHd = E('div', 'ed-label-row');
  const il = E('div', 'ed-label'); il.textContent = '이미지'; iHd.appendChild(il);
  const addBtn = E('button', 'icon-btn'); addBtn.innerHTML = ICONS.add;
  iHd.appendChild(addBtn);
  iRow.appendChild(iHd);
  const iGrid = E('div', 'ed-img-grid');
  iRow.appendChild(iGrid);
  bd.appendChild(iRow);

  function drawImages() {
    iGrid.innerHTML = '';
    tmp.images.forEach((img, idx) => {
      const cell = E('div', 'ed-img-cell');
      cell.dataset.idx = idx;
      const im = E('img'); im.src = imgURL(img.thumb); im.draggable = false;
      cell.appendChild(im);
      const num = E('span', 'ed-img-num'); num.textContent = idx + 1; cell.appendChild(num);
      const del = E('button', 'tile-del'); del.innerHTML = ICONS.x;
      del.addEventListener('mousedown', e => e.stopPropagation());
      del.onclick = e => { e.stopPropagation(); tmp.images.splice(idx, 1); drawImages(); };
      cell.appendChild(del);
      iGrid.appendChild(cell);
    });
    makeSortable(iGrid, '.ed-img-cell', { onCommit: order => { tmp.images = order.map(i => tmp.images[i]); drawImages(); } });
  }
  drawImages();

  addBtn.onclick = () => {
    const inp = E('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
    inp.onchange = async () => {
      const files = [...inp.files]; if (!files.length) return;
      // 이름이 비어 있으면 첫 파일 이름(확장자 제외)으로 채운다. 그대로 고칠 수 있다
      if (!tIn.value.trim()) tIn.value = files[0].name.replace(/\.[^.]+$/, '');
      addBtn.disabled = true;
      for (const f of files) {
        try {
          const saved = await saveImageFile(f);
          newFiles.push(saved.name, saved.thumb);
          tmp.images.push({ name: saved.name, thumb: saved.thumb, w: saved.w, h: saved.h, fields: saved.fields });
        } catch (e) { console.error(e); toast(`첨부 실패: ${f.name}`); }
      }
      addBtn.disabled = false;
      drawImages();
    };
    inp.click();
  };

  p.appendChild(bd);

  const ft = E('div', 'pp-ft');
  const left = E('div');
  if (!isNew) {
    const del = E('button', 'btn btn-d'); del.textContent = '삭제';
    del.onclick = () => confirmDel(`"${orig.title}" ${unit}를 삭제할까요?`, async () => {
      const all = [...new Set([...origFiles, ...newFiles])];
      await deleteFiles(all);
      if (artist) D.artists = D.artists.filter(z => z.id !== orig.id);
      else D.sets = D.sets.filter(z => z.id !== orig.id);
      closeBack();
      scheduleSave(); bk.remove(); render();
    });
    left.appendChild(del);
  }
  ft.appendChild(left);
  const right = E('div', 'ft-right');
  const cancel = E('button', 'btn btn-c'); cancel.textContent = '취소';
  cancel.onclick = async () => { await deleteFiles(newFiles); bk.remove(); };
  const save = E('button', 'btn btn-p'); save.textContent = '저장';
  save.onclick = async () => {
    const title = tIn.value;
    if (!title) { toast('이름을 입력하세요'); return; }
    if (setTitleTaken(title, tmp.id)) { toast('이미 존재하는 이름입니다'); return; }
    tmp.title = title;
    // 비어 있으면 아예 담지 않는다 (메모가 없었던 것과 같은 상태)
    const memo = mIn.value.trim();
    if (memo) tmp.memo = memo; else delete tmp.memo;
    const finalFiles = new Set(tmp.images.flatMap(filePairs));
    const toDelete = [...new Set([...origFiles, ...newFiles])].filter(n => !finalFiles.has(n));
    await deleteFiles(toDelete);
    const arr = artist ? D.artists : D.sets;
    if (isNew) arr.push(tmp);
    else { const i = arr.findIndex(z => z.id === orig.id); if (i >= 0) arr[i] = tmp; }
    scheduleSave(); bk.remove(); render(); refreshBack();
  };
  right.appendChild(cancel); right.appendChild(save);
  ft.appendChild(right);
  p.appendChild(ft);

  bk.appendChild(p);
  overlayHost().appendChild(bk);
}

// ============================================================
//  설정
// ============================================================
function openSettings() {
  const bk = E('div', 'pp-bk');
  const p = E('div', 'pp pp-settings');
  const hd = E('div', 'pp-hd');
  const ht = E('span', 'pp-t'); ht.textContent = '설정'; hd.appendChild(ht);
  // 어느 모델의 설정을 볼지 고른다 (헤더와 같은 방식, 헤더 선택과는 별개)
  const mTabs = E('div', 'model-tabs');
  hd.appendChild(mTabs);
  const closeSettings = () => { bk.remove(); render(); };
  const x = E('button', 'pp-x'); x.innerHTML = ICONS.x; x.onclick = closeSettings; hd.appendChild(x);
  p.appendChild(hd);
  const bd = E('div', 'pp-bd set-body');
  // 설정은 지금 보고 있는 갤러리에 묶이지 않는다. 항목 관리에서 알약으로 골라 본다.
  let sGal = 'meta';
  const sArtist = () => sGal === 'artist';
  const sFilters = () => sArtist() ? sD().artistFilters : sD().filters;
  const setSFilters = v => { if (sArtist()) sD().artistFilters = v; else sD().filters = v; };
  const sList = () => sArtist() ? sD().artists : sD().sets;
  const sView = () => (sModel === curModel ? settings : (sModel.view = sModel.view || DEFAULT_VIEW()));
  const sActive = () => sArtist() ? (sView().artistActiveTags || []) : (sView().activeTags || []);
  const setSActive = v => { const vw = sView(); if (sArtist()) vw.artistActiveTags = v; else vw.activeTags = v; };
  // 설정에서 보고 있는 모델 (헤더에서 보는 모델과 따로 움직인다)
  let sModel = curModel;
  const sD = () => sModel.D;
  const nav = E('div', 'set-nav');
  const pageHost = E('div', 'set-page');
  bd.appendChild(nav); bd.appendChild(pageHost);

  // ----- 항목 관리: 필터 -----
  const sec1f = E('div', 'set-sec');
  const st1f = E('div', 'set-sec-title'); st1f.textContent = '필터'; sec1f.appendChild(st1f);
  const listF = E('div', 'attr-list');

  // 폴더 안의 태그 목록
  function drawTags(folder, host) {
    host.innerHTML = '';
    const oList = E('div', 'opt-list');
    (folder.tags || []).forEach((t, oi) => {
      const row = E('div', 'attr-row opt-row');
      row.dataset.idx = oi;
      const grip = E('span', 'attr-grip'); grip.innerHTML = ICONS.grip; row.appendChild(grip);
      const nm = E('span', 'attr-name'); nm.textContent = t.name; row.appendChild(nm);
      row.appendChild(E('span', 'attr-spacer'));
      const rn = E('button', 'row-btn'); rn.innerHTML = ICONS.rename;
      rn.onclick = async () => {
        const nv = await customPrompt('태그 이름 변경', t.name);
        if (nv === null || !nv.trim()) return;
        t.name = nv.trim(); scheduleSave(); drawAttrs();
      };
      row.appendChild(rn);
      const del = E('button', 'row-btn danger'); del.innerHTML = ICONS.x;
      del.onclick = () => confirmDel(`"${t.name}" 태그를 삭제할까요?`, () => { removeTags([t.id]); folder.tags = folder.tags.filter(z => z.id !== t.id); scheduleSave(); drawAttrs(); });
      row.appendChild(del);
      oList.appendChild(row);
    });
    host.appendChild(oList);
    makeSortable(oList, '.opt-row', {
      handle: '.attr-grip',
      onCommit: order => { folder.tags = order.map(i => folder.tags[i]); scheduleSave(); drawAttrs(); },
    });
    const addRow = E('div', 'attr-add sub');
    const nameIn = E('input', 'ed-input'); nameIn.placeholder = '태그 이름'; nameIn.dataset.add = 'tag';
    const addB = E('button', 'btn btn-s'); addB.textContent = '추가';
    addB.onclick = () => {
      const nm = nameIn.value.trim();
      if (!nm) return;
      if ((folder.tags || []).some(z => z.name === nm)) { toast('이미 존재하는 태그입니다'); return; }
      folder.tags.push({ id: uid(), name: nm });
      nameIn.value = '';
      refocus = '[data-add="tag"]';
      scheduleSave(); drawAttrs();
    };
    nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') addB.click(); });
    addRow.appendChild(nameIn); addRow.appendChild(addB);
    host.appendChild(addRow);
  }

  // 태그가 사라지면 세트와 켜둔 필터에서도 함께 뺀다
  function removeTags(ids) {
    sList().forEach(st => { if (Array.isArray(st.tags)) st.tags = st.tags.filter(id => !ids.includes(id)); });
    setSActive((sActive() || []).filter(id => !ids.includes(id)));
  }

  // 필터 목록 (폴더와 단독 태그가 한 줄기로 나열된다)
  function drawFilters(host) {
    host.innerHTML = '';
    sFilters().forEach((f, idx) => {
      const wrap = E('div', 'attr-wrap');
      wrap.dataset.idx = idx;
      const row = E('div', 'attr-row');
      const grip = E('span', 'attr-grip'); grip.innerHTML = ICONS.grip; row.appendChild(grip);
      const badge = E('span', 'attr-badge ' + f.type); badge.textContent = f.type === 'folder' ? '폴더' : '태그'; row.appendChild(badge);
      const nm = E('span', 'attr-name'); nm.textContent = f.name; row.appendChild(nm);
      row.appendChild(E('span', 'attr-spacer'));
      if (f.type === 'folder') {
        const ex = E('button', 'btn btn-s btn-xs'); ex.innerHTML = expandedAttr === f.id ? `접기 ${ICONS.up}` : `태그 ${ICONS.down}`;
        ex.onclick = () => { expandedAttr = expandedAttr === f.id ? null : f.id; drawAttrs(); };
        row.appendChild(ex);
      }
      const rn = E('button', 'row-btn'); rn.innerHTML = ICONS.rename;
      rn.onclick = async () => {
        const nv = await customPrompt(f.type === 'folder' ? '폴더 이름 변경' : '태그 이름 변경', f.name);
        if (nv === null || !nv.trim()) return;
        f.name = nv.trim(); scheduleSave(); drawAttrs();
      };
      row.appendChild(rn);
      const del = E('button', 'row-btn danger'); del.innerHTML = ICONS.x;
      del.onclick = () => {
        const msg = f.type === 'folder'
          ? `"${f.name}" 폴더와 그 안의 태그를 삭제할까요?`
          : `"${f.name}" 태그를 삭제할까요?`;
        confirmDel(msg, () => {
          removeTags(f.type === 'folder' ? (f.tags || []).map(t => t.id) : [f.id]);
          setSFilters(sFilters().filter(z => z.id !== f.id));
          if (expandedAttr === f.id) expandedAttr = null;
          scheduleSave(); drawAttrs();
        });
      };
      row.appendChild(del);
      wrap.appendChild(row);
      if (f.type === 'folder' && expandedAttr === f.id) {
        const oHost = E('div', 'opt-host');
        drawTags(f, oHost);
        wrap.appendChild(oHost);
      }
      host.appendChild(wrap);
    });
    makeSortable(host, '.attr-wrap', {
      handle: '.attr-grip',
      onCommit: order => { const cur = sFilters(); setSFilters(order.map(i => cur[i])); scheduleSave(); drawAttrs(); },
    });
  }

  // 추가 후 목록을 다시 그리면 입력칸도 새로 만들어지므로 커서를 되돌린다
  let refocus = null;
  function drawAttrs() {
    drawFilters(listF);
    if (refocus) { const el = bd.querySelector(refocus); if (el) el.focus(); refocus = null; }
  }
  drawAttrs();

  sec1f.appendChild(listF);
  // 왼쪽에서 폴더/태그를 고르고 이름을 적어 엔터로 추가한다
  const fAdd = E('div', 'attr-add');
  const fKind = E('select', 'ed-select');
  [['folder', '폴더'], ['tag', '태그']].forEach(([v, l]) => { const o = E('option'); o.value = v; o.textContent = l; fKind.appendChild(o); });
  if (filterAddKind) fKind.value = filterAddKind;
  fKind.onchange = () => { filterAddKind = fKind.value; };
  const fIn = E('input', 'ed-input'); fIn.placeholder = '필터 이름'; fIn.dataset.add = 'filter';
  const addB = E('button', 'btn btn-p'); addB.textContent = '추가';
  addB.onclick = () => {
    const kind = fKind.value;
    const nm = fIn.value.trim();
    if (!nm) { toast('이름을 입력하세요'); return; }
    if (sFilters().some(z => z.type === kind && z.name === nm)) { toast('이미 존재하는 이름입니다'); return; }
    if (kind === 'folder') { const id = uid(); sFilters().push({ id, type: 'folder', name: nm, tags: [] }); expandedAttr = id; }
    else sFilters().push({ id: uid(), type: 'tag', name: nm });
    fIn.value = '';
    filterAddKind = kind;
    refocus = '[data-add="filter"]';
    scheduleSave(); drawAttrs();
  };
  fIn.addEventListener('keydown', e => { if (e.key === 'Enter') addB.click(); });
  fAdd.appendChild(fKind); fAdd.appendChild(fIn); fAdd.appendChild(addB);
  sec1f.appendChild(fAdd);

  // ----- 모델 -----
  const secM = E('div', 'set-sec');
  const stM = E('div', 'set-sec-title'); stM.textContent = '모델'; secM.appendChild(stM);
  const mList = E('div', 'attr-list');
  secM.appendChild(mList);
  function drawModels() {
    mList.innerHTML = '';
    MODELS.forEach((m, idx) => {
      const wrap = E('div', 'attr-wrap');
      wrap.dataset.idx = idx;
      const row = E('div', 'attr-row');
      const grip = E('span', 'attr-grip'); grip.innerHTML = ICONS.grip; row.appendChild(grip);
      const nm = E('span', 'attr-name'); nm.textContent = m.name; row.appendChild(nm);
      row.appendChild(E('span', 'attr-spacer'));
      const rn = E('button', 'row-btn'); rn.innerHTML = ICONS.rename;
      rn.onclick = async () => {
        const nv = await customPrompt('모델 이름 변경', m.name);
        if (nv === null || !nv.trim()) return;
        m.name = nv.trim(); scheduleSave(); drawModels(); renderModelTabs(); drawModelTabs();
      };
      row.appendChild(rn);
      const del = E('button', 'row-btn danger'); del.innerHTML = ICONS.x;
      del.onclick = () => {
        if (MODELS.length <= 1) { toast('마지막 모델은 삭제할 수 없습니다'); return; }
        confirmDel(`"${m.name}" 모델과 그 안의 모든 내용을 삭제할까요?`, async () => {
          await deleteFiles(modelFiles(m));
          MODELS = MODELS.filter(z => z.id !== m.id);
          if (curModel && curModel.id === m.id) {
            curModel = MODELS[0];
            D = curModel.D;
            applyModelView();
            migrate();
          }
          if (sModel.id === m.id) sModel = curModel;
          scheduleSave(); drawModels(); renderModelTabs(); drawModelTabs(); drawAttrs(); drawLayout(); render();
        });
      };
      row.appendChild(del);
      wrap.appendChild(row);
      mList.appendChild(wrap);
    });
    makeSortable(mList, '.attr-wrap', {
      handle: '.attr-grip',
      onCommit: order => { MODELS = order.map(i => MODELS[i]); scheduleSave(); drawModels(); renderModelTabs(); drawModelTabs(); },
    });
  }
  drawModels();
  const mAdd = E('div', 'attr-add');
  const mIn = E('input', 'ed-input'); mIn.placeholder = '모델 이름'; mIn.dataset.add = 'model';
  const mBtn = E('button', 'btn btn-p'); mBtn.textContent = '추가';
  mBtn.onclick = () => {
    const nm = mIn.value.trim();
    if (!nm) { toast('이름을 입력하세요'); return; }
    if (MODELS.some(z => z.name === nm)) { toast('이미 존재하는 모델입니다'); return; }
    MODELS.push(newModel(nm));
    mIn.value = '';
    scheduleSave(); drawModels(); renderModelTabs(); drawModelTabs(); mIn.focus();
  };
  mIn.addEventListener('keydown', e => { if (e.key === 'Enter') mBtn.click(); });
  mAdd.appendChild(mIn); mAdd.appendChild(mBtn);
  secM.appendChild(mAdd);

  // ----- 퀄리티 태그 (갤러리와 무관하게 전체 공용) -----
  const secQ = E('div', 'set-sec');
  const stQ = E('div', 'set-sec-title'); stQ.textContent = '퀄리티 태그'; secQ.appendChild(stQ);
  const qList = E('div', 'q-list');
  secQ.appendChild(qList);
  function drawQuality() {
    qList.innerHTML = '';
    (settings.qualityTags || []).forEach(name => {
      const c = E('span', 'chip q-chip');
      const nm = E('span'); nm.textContent = name; c.appendChild(nm);
      const del = E('button', 'q-del'); del.innerHTML = ICONS.x;
      del.onclick = () => confirmDel(`"${name}" 퀄리티 태그를 삭제할까요?`, () => {
        settings.qualityTags = settings.qualityTags.filter(z => z !== name);
        scheduleSave(); drawQuality();
      });
      c.appendChild(del);
      qList.appendChild(c);
    });
  }
  drawQuality();
  const qAdd = E('div', 'attr-add');
  const qIn = E('input', 'ed-input'); qIn.placeholder = '태그 이름'; qIn.dataset.add = 'quality';
  const qBtn = E('button', 'btn btn-p'); qBtn.textContent = '추가';
  qBtn.onclick = () => {
    // 쉼표로 나누면 여러 개가 한꺼번에 등록된다
    const names = qIn.value.split(',').map(v => v.trim()).filter(Boolean);
    if (!names.length) { toast('이름을 입력하세요'); return; }
    let added = 0;
    names.forEach(n => {
      if (settings.qualityTags.some(z => normalizeTagName(z) === normalizeTagName(n))) return;
      settings.qualityTags.push(n); added++;
    });
    if (!added) { toast('이미 존재하는 태그입니다'); return; }
    qIn.value = '';
    scheduleSave(); drawQuality(); qIn.focus();
  };
  qIn.addEventListener('keydown', e => { if (e.key === 'Enter') qBtn.click(); });
  qAdd.appendChild(qIn); qAdd.appendChild(qBtn);
  secQ.appendChild(qAdd);

  // ----- 테마 (전체 공용) -----
  const secT = E('div', 'set-sec');
  const stT = E('div', 'set-sec-title'); stT.textContent = '테마'; secT.appendChild(stT);
  const thRow = E('div', 'theme-row');
  THEMES.forEach(t => {
    const b = E('button', 'theme-dot' + (settings.theme === t.id ? ' on' : ''));
    b.style.background = t.dot;
    b.dataset.themeId = t.id; b.title = t.name;
    b.onclick = () => {
      settings.theme = t.id;
      applyTheme();
      [...thRow.children].forEach((x, i) => x.classList.toggle('on', THEMES[i].id === t.id));
      scheduleSave();
    };
    thRow.appendChild(b);
  });
  secT.appendChild(thRow);

  // ----- 레이아웃 (갤러리형 타일, 모델·갤러리마다 따로) -----
  const secL = E('div', 'set-sec');
  const stL = E('div', 'set-sec-title'); stL.textContent = '레이아웃'; secL.appendChild(stL);
  const layCols = E('div', 'lay-cols');
  secL.appendChild(layCols);
  // 메타와 작가를 좌우로 나란히 두고 각자 자기 슬라이더를 갖는다
  function drawLayout() {
    layCols.innerHTML = '';
    [['layout', '메타 갤러리'], ['artistLayout', '작가 갤러리']].forEach(([key, label]) => {
      const col = E('div', 'lay-col');
      const h = E('div', 'lay-col-title'); h.textContent = label; col.appendChild(h);
      const vw = sView();
      if (!vw[key]) vw[key] = { ratio: 0, size: 180 };
      const L = vw[key];
      const live = () => { if (sModel === curModel) render(); };

      const prev = E('div', 'lay-prev');
      const syncPrev = () => {
        prev.style.setProperty('--tile-ratio', ratioValue(L.ratio));
        prev.style.width = Math.round(60 + (L.size - 110) * (110 / 210)) + 'px';
      };

      const r1 = E('div', 'lay-row');
      const rl = E('span', 'set-label'); rl.textContent = '비율'; r1.appendChild(rl);
      const rNote = E('span', 'lay-note'); rNote.textContent = ratioLabel(L.ratio); r1.appendChild(rNote);
      col.appendChild(r1);
      const rIn = E('input', 'lay-range'); rIn.type = 'range';
      rIn.min = '0'; rIn.max = '1'; rIn.step = '0.01'; rIn.value = String(L.ratio);
      rIn.oninput = () => {
        L.ratio = parseFloat(rIn.value);
        rNote.textContent = ratioLabel(L.ratio);
        syncPrev(); scheduleSave(); live();
      };
      col.appendChild(rIn);

      const r2 = E('div', 'lay-row');
      const sl2 = E('span', 'set-label'); sl2.textContent = '크기'; r2.appendChild(sl2);
      const sNote = E('span', 'lay-note'); sNote.textContent = L.size + 'px'; r2.appendChild(sNote);
      col.appendChild(r2);
      const sIn = E('input', 'lay-range'); sIn.type = 'range';
      sIn.min = '110'; sIn.max = '320'; sIn.step = '5'; sIn.value = String(L.size);
      sIn.oninput = () => {
        L.size = parseInt(sIn.value, 10);
        sNote.textContent = L.size + 'px';
        syncPrev(); scheduleSave(); live();
      };
      col.appendChild(sIn);

      const pw = E('div', 'lay-prev-wrap');
      syncPrev();
      pw.appendChild(prev);
      col.appendChild(pw);
      layCols.appendChild(col);
    });
  }
  drawLayout();

  // ----- 일반 -----
  const sec2 = E('div', 'set-sec');
  const st2 = E('div', 'set-sec-title'); st2.textContent = '일반'; sec2.appendChild(st2);
  const cRow = E('div', 'set-row');
  const cLb = E('span', 'set-label'); cLb.textContent = '삭제 전 확인'; cRow.appendChild(cLb);
  const cSw = E('div', 'tsw' + (settings.confirmDelete ? ' on' : ''));
  cSw.onclick = () => { settings.confirmDelete = !settings.confirmDelete; cSw.classList.toggle('on', settings.confirmDelete); scheduleSave(); };
  cRow.appendChild(cSw);
  sec2.appendChild(cRow);
  const rRow = E('div', 'set-row');
  const rLb = E('span', 'set-label'); rLb.textContent = '크기 조절 잠금'; rRow.appendChild(rLb);
  const rSw = E('div', 'tsw' + (settings.resizeLock ? ' on' : ''));
  rSw.onclick = () => {
    settings.resizeLock = !settings.resizeLock;
    rSw.classList.toggle('on', settings.resizeLock);
    tauriInvoke('set_resizable', { resizable: !settings.resizeLock });
    if (window.__applyResizeLock) window.__applyResizeLock();
    scheduleSave();
  };
  rRow.appendChild(rSw);
  sec2.appendChild(rRow);

  // ----- 백업 -----
  const sec3 = E('div', 'set-sec');
  const st3 = E('div', 'set-sec-title'); st3.textContent = '백업'; sec3.appendChild(st3);
  const bRow = E('div', 'backup-row');
  const exp = E('button', 'btn btn-s'); exp.textContent = '내보내기';
  exp.onclick = async () => {
    await saveAll();
    try {
      const name = `naso-backup-${new Date().toISOString().slice(0, 10)}.zip`;
      busyToast('내보내는 중...');
      const n = await tauriInvoke('export_backup', { fileName: name });
      if (n < 0) { toast(''); return; } // 저장 위치 고르기를 취소함
      toast('내보내기 완료');
    } catch (e) { console.error(e); toast(String(e && e.message || e) || '내보내기 실패'); }
  };
  const imp = E('button', 'btn btn-s'); imp.textContent = '불러오기';
  imp.onclick = async () => {
    // 웹앱: 아이폰은 버튼을 누른 순간에만 파일 창을 열어 주므로 파일부터 고른다
    let webFile = null;
    if (!isTauri() && window.WebBackend) { webFile = await window.WebBackend.pickZip(); if (!webFile) return; }
    const ok = await customConfirm('현재 데이터와 이미지를 백업 파일로 덮어씁니다. 계속할까요?');
    if (!ok) return;
    try {
      busyToast('불러오는 중...');
      const text = await tauriInvoke('import_backup', webFile ? { file: webFile } : {});
      if (!text) { toast(''); return; } // 파일 고르기를 취소함
      const obj = JSON.parse(text);
      if (obj.settings) settings = Object.assign(settings, loadableSettings(obj.settings));
      if (Array.isArray(obj.models) && obj.models.length) {
        MODELS = obj.models.map(m => ({
          id: m.id || uid(), name: m.name || '모델',
          D: normalizeD(m.D), view: Object.assign(DEFAULT_VIEW(), m.view || {}),
        }));
        curModel = MODELS.find(m => m.id === obj.curModel) || MODELS[0];
      } else {
        MODELS = [newModel('v4.5F'), newModel('v5F')];
        curModel = MODELS[0];
      }
      D = curModel.D;
      applyModelView();
      applyTheme();
      migrate();
      bk.remove(); render();
      toast('복원 완료');
    } catch (e) { console.error(e); toast(String(e && e.message || e) || '복원 실패'); }
  };
  bRow.appendChild(exp); bRow.appendChild(imp);
  if (isTauri()) {
    const od = E('button', 'btn btn-s'); od.textContent = '데이터 폴더 열기';
    od.onclick = () => tauriInvoke('open_data_dir', {});
    bRow.appendChild(od);
  }
  sec3.appendChild(bRow);

  // ----- 페이지 구성 -----
  const pages = [
    { label: '모델', secs: () => [secM] },
    // 필터는 갤러리마다 한 줄씩
    { label: '필터', badge: '메타', gal: 'meta', secs: () => [sec1f] },
    { label: '필터', badge: '작가', gal: 'artist', secs: () => [sec1f] },
    { label: '퀄리티 태그', secs: () => [secQ] },
    { label: '기타', secs: () => [secT, secL, sec2, sec3] },
  ];
  const navBtns = [];
  const showPage = i => {
    const pg = pages[i];
    if (pg.gal && pg.gal !== sGal) { sGal = pg.gal; expandedAttr = null; drawAttrs(); }
    navBtns.forEach((b, k) => b.classList.toggle('active', k === i));
    pageHost.innerHTML = '';
    pg.secs().forEach(sec => pageHost.appendChild(sec));
  };
  pages.forEach((pg, i) => {
    const b = E('button', 'set-nav-item');
    const lb = E('span', 'set-nav-label'); lb.textContent = pg.label; b.appendChild(lb);
    if (pg.badge) { const pill = E('span', 'set-pill'); pill.textContent = pg.badge; b.appendChild(pill); }
    b.onclick = () => showPage(i);
    navBtns.push(b);
    nav.appendChild(b);
  });
  const drawModelTabs = () => {
    mTabs.innerHTML = '';
    MODELS.forEach(m => {
      const b = E('button', 'model-tab' + (m.id === sModel.id ? ' on' : ''));
      b.textContent = m.name;
      b.onclick = () => {
        if (m.id === sModel.id) return;
        sModel = m; expandedAttr = null;
        drawModelTabs(); drawAttrs(); drawModels(); drawLayout();
      };
      mTabs.appendChild(b);
    });
  };
  drawModelTabs();
  showPage(0);

  p.appendChild(bd);
  bk.appendChild(p);
  overlayHost().appendChild(bk);
  let dn = null;
  bk.addEventListener('mousedown', e => { dn = e.target; });
  bk.addEventListener('mouseup', e => { if (dn === e.target && e.target === bk) closeSettings(); dn = null; });
}

// ============================================================
//  초기화
// ============================================================
async function init() {
  $('settingsBtn').innerHTML = ICONS.settings;
  $('searchIcon').innerHTML = ICONS.search;
  $('searchClear').innerHTML = ICONS.x;
  // 치는 즉시 걸러진다. Esc나 X로 지운다
  const sIn = $('searchInput');
  const applySearch = v => { setCurSearch(v); scrollPos[scrollKey()] = 0; render(); };
  sIn.addEventListener('input', () => applySearch(sIn.value));
  sIn.addEventListener('keydown', e => { if (e.key === 'Escape') { sIn.value = ''; applySearch(''); } });
  $('searchClear').onclick = () => { sIn.value = ''; applySearch(''); sIn.focus(); };
  $('winMin').innerHTML = ICONS.winMin;
  $('winMax').innerHTML = ICONS.winMax;
  $('winClose').innerHTML = ICONS.winClose;
  const fab = E('button'); fab.id = 'fab'; fab.innerHTML = ICONS.add;
  fab.onclick = () => openSetEditor();
  overlayHost().appendChild(fab);
  overlayHost().appendChild($('toast'));
  // 최대화 상태에 따라 창 여백/라운드 전환
  const syncMax = async () => {
    try { const m = await tauriInvoke('win_is_max', {}); document.body.classList.toggle('maximized', !!m); } catch (e) { }
  };
  // 스크롤할 때마다 지금 보고 있는 모델·갤러리의 자리를 기억해둔다
  const ctEl = $('content');
  if (ctEl) ctEl.addEventListener('scroll', () => { scrollPos[scrollKey()] = ctEl.scrollTop; });
  window.addEventListener('resize', () => { clearTimeout(syncMax._t); syncMax._t = setTimeout(syncMax, 120); });
  // 창 폭이 바뀌면 필터 줄 넘침 여부도 달라진다
  window.addEventListener('resize', () => {
    clearTimeout(window.__tbT);
    window.__tbT = setTimeout(() => {
      const fw = document.querySelector('#toolbar .filters');
      const rt = document.querySelector('#toolbar .right');
      const vm = rt && rt.querySelector('.seg');
      if (fw && rt && vm) updateFilterOverflow(fw, rt, vm);
    }, 120);
  });
  if (isTauri()) syncMax();
  // 갤러리 전환 (톱니 왼쪽). 아이콘은 '갈 곳'을 가리킨다.
  $('galleryBtn').onclick = () => {
    settings.gallery = isArtist() ? 'meta' : 'artist';
    filtersExpanded = false;
    scheduleSave(); render();
  };
  $('winMin').onclick = () => tauriInvoke('win_min', {});
  $('winMax').onclick = () => tauriInvoke('win_max', {});
  $('winClose').onclick = async () => { await saveAll(); tauriInvoke('win_close', {}); };
  // 크기조절: 가장자리 감지 영역 (커서는 시스템 화살표, 실제 조절은 공식 API가 수행)
  ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].forEach(dir => {
    const z = E('div', 'rz rz-' + dir);
    z.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      if (settings.resizeLock) return; // 잠금 시 크기조절 무시
      e.preventDefault();
      tauriInvoke('win_resize', { direction: dir });
    });
    overlayHost().appendChild(z);
  });
  const applyResizeLock = () => document.body.classList.toggle('resize-locked', !!settings.resizeLock);
  applyResizeLock();
  window.__applyResizeLock = applyResizeLock;

  const hd = $('topbar');
  // 검색칸은 글자를 고르고 지우는 곳이라 창 끌기·최대화에서 뺀다
  hd.addEventListener('mousedown', e => {
    if (e.button !== 0 || e.target.closest('button, .search-box')) return;
    tauriInvoke('win_drag', {});
  });
  hd.addEventListener('dblclick', e => { if (!e.target.closest('button, .search-box')) tauriInvoke('win_max', {}); });
  $('settingsBtn').onclick = () => toggleDD($('settingsBtn'), [
    { icon: isEdit() ? ICONS.lock : ICONS.edit, label: isEdit() ? '편집 종료' : '편집 모드', fn: () => { settings.mode = isEdit() ? 'view' : 'edit'; scheduleSave(); render(); } },
    { icon: ICONS.stats, label: '태그 통계', fn: openTagStats },
    { icon: ICONS.settings, label: '환경설정', fn: openSettings },
  ]);
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('mousedown', e => {
    if (ddState && !ddState.el.contains(e.target) && !ddState.anchor.contains(e.target)) closeDD();
  });
  if (isTauri()) { try { dataDir = await tauriInvoke('get_data_path', {}) || ''; } catch (e) { console.error(e); } }
  else if (window.WebBackend) { try { await window.WebBackend.ready(); } catch (e) { console.error(e); toast('저장소를 열 수 없습니다'); } }
  await loadAll();
  // loadAll로 저장된 resizeLock이 확정된 뒤에 잠금 상태를 다시 반영한다.
  // (위쪽 applyResizeLock()은 기본값 false 상태에서 불리므로, 여기서 다시
  //  적용해야 시작 시에도 .rz가 숨겨지고 리사이즈 화살표 커서가 뜨지 않는다.)
  applyResizeLock();
  tauriInvoke('set_resizable', { resizable: !settings.resizeLock });
  settings.mode = 'view'; // 시작은 항상 뷰어 모드 (참고 프로그램들과 동일)
  render();
  if (loadFailed) toast('불러오기 실패');
}

// 웹앱 저장소(web-backend.js)가 앱을 내릴 때 바로 저장할 수 있게 열어 둔다
window.__naiSaveAll = saveAll;

function boot() { init().then(() => { window.__APP_BOOTED__ = true; }).catch(e => { console.error(e); showFatal(e && e.message || String(e)); window.__APP_BOOTED__ = true; }); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
