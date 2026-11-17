// NASO — 웹앱(아이폰 Safari 등)용 저장소
// 데스크톱 앱(Tauri)의 백엔드 명령을 브라우저 안에서 똑같이 흉내 낸다.
//  - 데이터(appdata)와 이미지는 IndexedDB에 저장 → 껐다 켜도 남는다
//  - 백업은 데스크톱판과 같은 zip 형식(appdata.json + images/ + images/thumbs/)
// 데스크톱 앱 안에서는 아무것도 하지 않는다.
(function () {
  'use strict';
  if (window.__TAURI__) return;

  const DB_NAME = 'nai-meta-gallery'; // 저장소 이름은 그대로 둔다 (바꾸면 기존 데이터가 안 보인다)
  const KV = 'kv';
  const IMG = 'images';
  let db = null;
  const urls = new Map(); // 이미지 이름 → blob: URL (화면에 바로 쓰기 위해 메모리에 둔다)

  // ---------- IndexedDB ----------
  function reqP(r) {
    return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  }
  function openDB() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => { r.result.createObjectStore(KV); r.result.createObjectStore(IMG); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  // 쓰기는 트랜잭션이 끝까지 기록돼야 성공으로 친다
  function write(store, fn) {
    return new Promise((res, rej) => {
      const t = db.transaction(store, 'readwrite');
      fn(t.objectStore(store));
      t.oncomplete = () => res();
      t.onerror = t.onabort = () => rej(t.error || new Error('저장 실패'));
    });
  }
  const get = (store, key) => reqP(db.transaction(store).objectStore(store).get(key));

  function setURL(name, blob) {
    if (urls.has(name)) URL.revokeObjectURL(urls.get(name));
    urls.set(name, URL.createObjectURL(blob));
  }
  function dropURL(name) {
    if (urls.has(name)) { URL.revokeObjectURL(urls.get(name)); urls.delete(name); }
  }

  const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', bmp: 'image/bmp' };
  function mimeOf(name) {
    const m = /\.([a-z0-9]+)$/i.exec(name);
    return (m && MIME[m[1].toLowerCase()]) || 'application/octet-stream';
  }
  function safeName(name) {
    if (!name || name.startsWith('.') || /[\/\\]/.test(name) || name.includes('..')) throw new Error('경로 오류: ' + name);
    return name;
  }
  function b64ToBlob(b64, type) {
    const bin = atob(b64);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new Blob([u8], { type });
  }
  function blobToB64(blob) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result).split(',')[1] || '');
      fr.onerror = () => rej(fr.error);
      fr.readAsDataURL(blob);
    });
  }

  // ---------- zip ----------
  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(u8) {
    let c = 0xffffffff;
    for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  // 압축 없이(stored) 묶는다. 이미지는 이미 압축돼 있어 크기 차이가 거의 없고,
  // 원본 Blob을 그대로 이어 붙이므로 아이폰에서도 메모리를 적게 쓴다.
  async function buildZip(entries) {
    const enc = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    for (const { name, blob } of entries) {
      const nameU8 = enc.encode(name);
      const crc = crc32(new Uint8Array(await blob.arrayBuffer()));
      const size = blob.size;
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
      lh.setUint16(8, 0, true); lh.setUint16(10, dosTime, true); lh.setUint16(12, dosDate, true);
      lh.setUint32(14, crc, true); lh.setUint32(18, size, true); lh.setUint32(22, size, true);
      lh.setUint16(26, nameU8.length, true); lh.setUint16(28, 0, true);
      parts.push(lh.buffer, nameU8, blob);
      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true);
      ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true); ch.setUint16(12, dosTime, true);
      ch.setUint16(14, dosDate, true); ch.setUint32(16, crc, true); ch.setUint32(20, size, true);
      ch.setUint32(24, size, true); ch.setUint16(28, nameU8.length, true);
      ch.setUint32(42, offset, true);
      central.push(ch.buffer, nameU8);
      offset += 30 + nameU8.length + size;
      if (offset > 0xffffffff) throw new Error('백업이 너무 큽니다 (4GB 초과)');
    }
    const cdSize = central.reduce((s, p) => s + p.byteLength, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, entries.length, true); end.setUint16(10, entries.length, true);
    end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
    return new Blob([...parts, ...central, end.buffer], { type: 'application/zip' });
  }

  async function dv(blob, start, len) {
    return new DataView(await blob.slice(start, start + len).arrayBuffer());
  }

  // 데스크톱판이 만든 zip(압축/비압축, zip64 포함)을 읽는다.
  async function readZip(file) {
    const tailLen = Math.min(file.size, 65535 + 22);
    const tailStart = file.size - tailLen;
    const tail = await dv(file, tailStart, tailLen);
    let eocd = -1;
    for (let i = tailLen - 22; i >= 0; i--) if (tail.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) throw new Error('유효하지 않은 백업 파일입니다');
    let count = tail.getUint16(eocd + 10, true);
    let cdSize = tail.getUint32(eocd + 12, true);
    let cdOff = tail.getUint32(eocd + 16, true);
    if (count === 0xffff || cdOff === 0xffffffff || cdSize === 0xffffffff) {
      const loc = eocd - 20;
      if (loc < 0 || tail.getUint32(loc, true) !== 0x07064b50) throw new Error('유효하지 않은 백업 파일입니다');
      const z64 = await dv(file, Number(tail.getBigUint64(loc + 8, true)), 56);
      count = Number(z64.getBigUint64(32, true));
      cdSize = Number(z64.getBigUint64(40, true));
      cdOff = Number(z64.getBigUint64(48, true));
    }
    const cd = await dv(file, cdOff, cdSize);
    const dec = new TextDecoder();
    const out = [];
    let p = 0;
    for (let i = 0; i < count; i++) {
      if (cd.getUint32(p, true) !== 0x02014b50) throw new Error('유효하지 않은 백업 파일입니다');
      const method = cd.getUint16(p + 10, true);
      let csize = cd.getUint32(p + 20, true);
      let usize = cd.getUint32(p + 24, true);
      const nLen = cd.getUint16(p + 28, true);
      const eLen = cd.getUint16(p + 30, true);
      const cLen = cd.getUint16(p + 32, true);
      let lOff = cd.getUint32(p + 42, true);
      const name = dec.decode(new Uint8Array(cd.buffer, cd.byteOffset + p + 46, nLen)).replace(/\\/g, '/');
      // zip64 확장 필드
      let e = p + 46 + nLen;
      const eEnd = e + eLen;
      while (e + 4 <= eEnd) {
        const id = cd.getUint16(e, true), sz = cd.getUint16(e + 2, true);
        if (id === 0x0001) {
          let q = e + 4;
          if (usize === 0xffffffff) { usize = Number(cd.getBigUint64(q, true)); q += 8; }
          if (csize === 0xffffffff) { csize = Number(cd.getBigUint64(q, true)); q += 8; }
          if (lOff === 0xffffffff) { lOff = Number(cd.getBigUint64(q, true)); q += 8; }
        }
        e += 4 + sz;
      }
      out.push({ name, method, csize, usize, lOff });
      p += 46 + nLen + eLen + cLen;
    }
    return out;
  }

  async function entryBlob(file, ent, type) {
    const lh = await dv(file, ent.lOff, 30);
    const start = ent.lOff + 30 + lh.getUint16(26, true) + lh.getUint16(28, true);
    const raw = file.slice(start, start + ent.csize, type);
    if (ent.method === 0) return raw;
    if (ent.method === 8) {
      if (typeof DecompressionStream === 'undefined') throw new Error('이 브라우저는 압축된 백업을 풀 수 없습니다 (iOS 16.4 이상 필요)');
      const stream = raw.stream().pipeThrough(new DecompressionStream('deflate-raw'));
      const b = await new Response(stream).blob();
      return type ? b.slice(0, b.size, type) : b;
    }
    throw new Error('지원하지 않는 압축 방식입니다');
  }

  // ---------- 팝업 / 파일 고르기 ----------
  // 아이폰 Safari는 '버튼을 누른 그 순간'에만 공유·파일 창을 열어 준다.
  // 그래서 백업 파일을 다 만든 뒤 한 번 더 누를 버튼을 띄운다.
  function offerFile(file) {
    return new Promise(resolve => {
      const host = document.getElementById('app') || document.body;
      const bk = document.createElement('div'); bk.className = 'prompt-bk';
      const box = document.createElement('div'); box.className = 'prompt-box';
      const t = document.createElement('div'); t.className = 'prompt-title';
      const sz = file.size < 1048576 ? Math.max(1, Math.round(file.size / 1024)) + 'KB' : (file.size / 1048576).toFixed(1) + 'MB';
      t.textContent = '백업 파일이 준비됐어요 (' + sz + ')';
      const btns = document.createElement('div'); btns.className = 'prompt-btns';
      const no = document.createElement('button'); no.className = 'prompt-btn'; no.textContent = '취소';
      const yes = document.createElement('button'); yes.className = 'prompt-btn primary';
      const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
      yes.textContent = canShare ? '공유·저장' : '다운로드';
      btns.append(no, yes); box.append(t, btns); bk.append(box); host.append(bk);
      const close = v => { bk.remove(); resolve(v); };
      no.onclick = () => close(false);
      yes.onclick = () => {
        if (canShare) {
          navigator.share({ files: [file] })
            .then(() => close(true))
            .catch(e => { if (e && e.name === 'AbortError') close(false); else { download(file); close(true); } });
        } else { download(file); close(true); }
      };
    });
  }
  function download(file) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file); a.download = file.name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
  }
  function pickZip() {
    return new Promise(resolve => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.zip,application/zip';
      let done = false;
      const fin = v => { if (!done) { done = true; resolve(v); } };
      inp.onchange = () => fin(inp.files && inp.files[0] || null);
      inp.addEventListener('cancel', () => fin(null));
      inp.click();
    });
  }

  // ---------- 명령 ----------
  async function exportBackup(fileName) {
    const appdata = await get(KV, 'appdata');
    if (!appdata) throw new Error('저장 데이터가 없습니다');
    const entries = [{ name: 'appdata.json', blob: new Blob([appdata], { type: 'application/json' }) }];
    const names = [...urls.keys()].sort();
    for (const n of names) {
      const blob = await get(IMG, n);
      if (!blob) continue;
      entries.push({ name: (n.endsWith('_t.jpg') ? 'images/thumbs/' : 'images/') + n, blob });
    }
    const zip = await buildZip(entries);
    const file = new File([zip], fileName || 'naso-backup.zip', { type: 'application/zip' });
    const tst = document.getElementById('toast'); if (tst) tst.classList.remove('show');
    const ok = await offerFile(file);
    return ok ? entries.length - 1 : -1;
  }

  async function importBackup(file) {
    if (!file) return '';
    const list = await readZip(file);
    const appEnt = list.find(e => e.name === 'appdata.json');
    if (!appEnt) throw new Error('유효하지 않은 백업 파일입니다');
    const text = await (await entryBlob(file, appEnt)).text();
    try { JSON.parse(text); } catch (e) { throw new Error('유효하지 않은 백업 파일입니다'); }

    // 이미지 먼저 다 풀어 둔 뒤 한 번에 바꿔 넣는다
    const imgs = [];
    for (const ent of list) {
      const m = /^images\/(?:thumbs\/)?([^/]+)$/.exec(ent.name);
      if (!m) continue;
      let n; try { n = safeName(m[1]); } catch (e) { continue; }
      imgs.push([n, await entryBlob(file, ent, mimeOf(n))]);
    }
    // 한 트랜잭션으로 비우고 채운다 — 중간에 실패하면 통째로 취소돼 기존 이미지가 남는다
    await write(IMG, s => { s.clear(); imgs.forEach(([n, b]) => s.put(b, n)); });
    await write(KV, s => s.put(text, 'appdata'));
    [...urls.keys()].forEach(dropURL);
    imgs.forEach(([n, b]) => setURL(n, b));
    return text;
  }

  async function invoke(cmd, a) {
    a = a || {};
    switch (cmd) {
      case 'save_data': await write(KV, s => s.put(a.value, safeName(a.key))); return '';
      case 'load_data': return (await get(KV, safeName(a.key))) || '';
      case 'get_data_path': return '(웹 앱)';
      case 'save_image_base64': {
        const n = safeName(a.name);
        const blob = b64ToBlob(a.data, mimeOf(n));
        await write(IMG, s => s.put(blob, n));
        setURL(n, blob);
        return n;
      }
      case 'read_image_base64': {
        const b = await get(IMG, safeName(a.name));
        if (!b) throw new Error('이미지 없음');
        return blobToB64(b);
      }
      case 'delete_image': { const n = safeName(a.name); await write(IMG, s => s.delete(n)); dropURL(n); return null; }
      case 'list_images': return [...urls.keys()];
      case 'cleanup_images': {
        const keep = new Set(a.keep || []);
        const gone = [...urls.keys()].filter(n => !keep.has(n));
        await write(IMG, s => gone.forEach(n => s.delete(n)));
        gone.forEach(dropURL);
        return gone.length;
      }
      case 'export_backup': return exportBackup(a.fileName);
      case 'import_backup': return importBackup(a.file);
      case 'set_title': document.title = a.title || document.title; return null;
      default: return null; // 창 버튼·크기조절 등은 웹에서 할 일이 없다
    }
  }

  async function ready() {
    db = await openDB();
    // 저장 공간을 브라우저가 임의로 비우지 않도록 요청 (홈 화면 앱에서는 보통 허용됨)
    try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) { }
    const t = db.transaction(IMG);
    const st = t.objectStore(IMG);
    const [keys, vals] = await Promise.all([reqP(st.getAllKeys()), reqP(st.getAll())]);
    keys.forEach((k, i) => setURL(String(k), vals[i]));
  }

  // 아이폰은 앱을 내리면 타이머가 멈출 수 있으니, 화면을 벗어날 때 바로 저장한다
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && db && typeof window.__naiSaveAll === 'function') window.__naiSaveAll();
  });

  // 오프라인에서도 열리도록 (https에서만 동작)
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
  }

  window.WebBackend = { invoke, ready, url: n => urls.get(n) || '', pickZip };
})();
