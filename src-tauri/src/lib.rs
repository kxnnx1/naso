// NASO — macOS용 백엔드
// 원래 윈도우용 앱의 명령 이름·인자·반환값을 그대로 맞춰서, 화면 코드(src/app.js)는 손대지 않고 쓴다.

use std::collections::HashSet;
use std::fs;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};

use base64::{engine::general_purpose::STANDARD as B64, Engine as _};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, LogicalSize, Manager, PhysicalPosition, WebviewWindow};
use tauri_plugin_dialog::DialogExt;
use zip::{write::SimpleFileOptions, CompressionMethod, ZipArchive, ZipWriter};

/// 데이터 폴더: ~/Library/Application Support/com.naimetagallery.app
/// (앱 이름을 NASO로 바꿨지만, 기존 데이터를 그대로 쓰도록 식별자는 유지한다)
struct DataDir(PathBuf);

const APPDATA_FILE: &str = "appdata.json";
const WINDOW_STATE_FILE: &str = "window_state.json";

fn data_dir(app: &AppHandle) -> PathBuf {
    app.state::<DataDir>().0.clone()
}
fn images_dir(dir: &Path) -> PathBuf {
    dir.join("images")
}
fn thumbs_dir(dir: &Path) -> PathBuf {
    dir.join("images").join("thumbs")
}

/// 파일 이름에 경로 문자가 섞여 데이터 폴더 밖을 건드리지 못하게 막는다
fn safe_name(name: &str) -> Result<&str, String> {
    if name.is_empty()
        || name.starts_with('.')
        || name.contains('/')
        || name.contains('\\')
        || name.contains("..")
    {
        return Err(format!("경로 오류: {name}"));
    }
    Ok(name)
}

fn is_thumb(name: &str) -> bool {
    name.ends_with("_t.jpg")
}

fn image_path(dir: &Path, name: &str) -> Result<PathBuf, String> {
    let n = safe_name(name)?;
    Ok(if is_thumb(n) { thumbs_dir(dir) } else { images_dir(dir) }.join(n))
}

/// 임시 파일에 쓴 뒤 바꿔치기 — 저장 중에 꺼져도 기존 파일이 깨지지 않는다
fn write_atomic(path: &Path, bytes: &[u8]) -> Result<(), String> {
    let tmp = path.with_extension("tmp");
    fs::write(&tmp, bytes).map_err(|e| format!("파일 생성 실패: {e}"))?;
    fs::rename(&tmp, path).map_err(|e| format!("파일 생성 실패: {e}"))
}

fn ensure_dirs(dir: &Path) -> Result<(), String> {
    fs::create_dir_all(dir).map_err(|e| format!("폴더 생성 실패: {e}"))?;
    fs::create_dir_all(images_dir(dir)).map_err(|e| format!("이미지 폴더 생성 실패: {e}"))?;
    fs::create_dir_all(thumbs_dir(dir)).map_err(|e| format!("썸네일 폴더 생성 실패: {e}"))
}

fn list_files(dir: &Path) -> Vec<String> {
    let Ok(rd) = fs::read_dir(dir) else { return vec![] };
    rd.filter_map(|e| e.ok())
        .filter(|e| e.file_type().map(|t| t.is_file()).unwrap_or(false))
        .filter_map(|e| e.file_name().into_string().ok())
        .filter(|n| !n.starts_with('.'))
        .collect()
}

// ---------------- 데이터 ----------------

#[tauri::command]
fn save_data(app: AppHandle, key: String, value: String) -> Result<String, String> {
    let dir = data_dir(&app);
    ensure_dirs(&dir)?;
    let file = format!("{}.json", safe_name(&key)?);
    write_atomic(&dir.join(file), value.as_bytes())?;
    Ok(String::new())
}

#[tauri::command]
fn load_data(app: AppHandle, key: String) -> Result<String, String> {
    let path = data_dir(&app).join(format!("{}.json", safe_name(&key)?));
    match fs::read_to_string(&path) {
        Ok(s) => Ok(s),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(String::new()),
        Err(e) => Err(format!("데이터 읽기 실패: {e}")),
    }
}

#[tauri::command]
fn get_data_path(app: AppHandle) -> String {
    data_dir(&app).to_string_lossy().into_owned()
}

#[tauri::command]
fn open_data_dir(app: AppHandle) -> Result<(), String> {
    let dir = data_dir(&app);
    ensure_dirs(&dir)?;
    std::process::Command::new("open")
        .arg(&dir)
        .spawn()
        .map(|_| ())
        .map_err(|e| format!("폴더 열기 실패: {e}"))
}

// ---------------- 이미지 ----------------

#[tauri::command]
fn save_image_base64(
    app: AppHandle,
    name: String,
    data: String,
    thumb: Option<bool>,
) -> Result<String, String> {
    let dir = data_dir(&app);
    ensure_dirs(&dir)?;
    let n = safe_name(&name)?;
    let target = if thumb.unwrap_or(false) || is_thumb(n) {
        thumbs_dir(&dir).join(n)
    } else {
        images_dir(&dir).join(n)
    };
    let bytes = B64.decode(data.as_bytes()).map_err(|e| format!("이미지 디코딩 실패: {e}"))?;
    write_atomic(&target, &bytes)?;
    Ok(name)
}

#[tauri::command]
fn read_image_base64(app: AppHandle, name: String) -> Result<String, String> {
    let path = image_path(&data_dir(&app), &name)?;
    let bytes = fs::read(&path).map_err(|_| "이미지 없음".to_string())?;
    Ok(B64.encode(bytes))
}

#[tauri::command]
fn delete_image(app: AppHandle, name: String) -> Result<(), String> {
    let path = image_path(&data_dir(&app), &name)?;
    match fs::remove_file(&path) {
        Ok(()) => Ok(()),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(e) => Err(format!("삭제 실패: {e}")),
    }
}

#[tauri::command]
fn list_images(app: AppHandle) -> Vec<String> {
    let dir = data_dir(&app);
    let mut v = list_files(&images_dir(&dir));
    v.extend(list_files(&thumbs_dir(&dir)));
    v
}

#[tauri::command]
fn cleanup_images(app: AppHandle, keep: Vec<String>) -> usize {
    let dir = data_dir(&app);
    let keep: HashSet<String> = keep.into_iter().collect();
    let mut removed = 0;
    for folder in [images_dir(&dir), thumbs_dir(&dir)] {
        for n in list_files(&folder) {
            if !keep.contains(&n) && fs::remove_file(folder.join(&n)).is_ok() {
                removed += 1;
            }
        }
    }
    removed
}

// ---------------- 백업 (zip) ----------------
// 형식: appdata.json + images/<파일> + images/thumbs/<파일>
// 윈도우판에서 내보낸 백업도 그대로 불러올 수 있다.

#[tauri::command]
async fn export_backup(app: AppHandle, file_name: String) -> Result<i64, String> {
    let dir = data_dir(&app);
    let appdata = fs::read(dir.join(APPDATA_FILE)).map_err(|_| "저장 데이터가 없습니다".to_string())?;

    let Some(picked) = app
        .dialog()
        .file()
        .set_title("백업 파일")
        .set_file_name(&file_name)
        .add_filter("백업 파일", &["zip"])
        .blocking_save_file()
    else {
        return Ok(-1); // 저장 위치 고르기를 취소함
    };
    let out = picked.into_path().map_err(|e| format!("경로 오류: {e}"))?;

    let file = fs::File::create(&out).map_err(|e| format!("파일 생성 실패: {e}"))?;
    let mut zw = ZipWriter::new(file);
    let deflated = SimpleFileOptions::default().compression_method(CompressionMethod::Deflated);
    // 이미지는 이미 압축된 형식이라 다시 압축하지 않는다
    let stored = SimpleFileOptions::default().compression_method(CompressionMethod::Stored);

    zw.start_file(APPDATA_FILE, deflated).map_err(|e| format!("파일 생성 실패: {e}"))?;
    zw.write_all(&appdata).map_err(|e| format!("파일 생성 실패: {e}"))?;

    let mut count: i64 = 0;
    for (folder, prefix) in [(images_dir(&dir), "images/"), (thumbs_dir(&dir), "images/thumbs/")] {
        for n in list_files(&folder) {
            let bytes = fs::read(folder.join(&n)).map_err(|e| format!("데이터 읽기 실패: {e}"))?;
            zw.start_file(format!("{prefix}{n}"), stored).map_err(|e| format!("파일 생성 실패: {e}"))?;
            zw.write_all(&bytes).map_err(|e| format!("파일 생성 실패: {e}"))?;
            count += 1;
        }
    }
    zw.finish().map_err(|e| format!("압축 마무리 실패: {e}"))?;
    Ok(count)
}

#[tauri::command]
async fn import_backup(app: AppHandle) -> Result<String, String> {
    let Some(picked) = app
        .dialog()
        .file()
        .set_title("백업 파일")
        .add_filter("백업 파일", &["zip"])
        .blocking_pick_file()
    else {
        return Ok(String::new()); // 파일 고르기를 취소함
    };
    let src = picked.into_path().map_err(|e| format!("경로 오류: {e}"))?;
    let file = fs::File::open(&src).map_err(|e| format!("파일 열기 실패: {e}"))?;
    let mut ar = ZipArchive::new(file).map_err(|_| "유효하지 않은 백업 파일입니다".to_string())?;

    // 1) 먼저 appdata.json이 멀쩡한지 확인한 뒤에야 기존 데이터를 건드린다
    let mut text = String::new();
    ar.by_name(APPDATA_FILE)
        .map_err(|_| "유효하지 않은 백업 파일입니다".to_string())?
        .read_to_string(&mut text)
        .map_err(|_| "유효하지 않은 백업 파일입니다".to_string())?;
    serde_json::from_str::<serde_json::Value>(&text)
        .map_err(|_| "유효하지 않은 백업 파일입니다".to_string())?;

    // 2) 기존 이미지 비우고 백업 내용으로 채운다
    let dir = data_dir(&app);
    ensure_dirs(&dir)?;
    for folder in [images_dir(&dir), thumbs_dir(&dir)] {
        for n in list_files(&folder) {
            let _ = fs::remove_file(folder.join(n));
        }
    }
    for i in 0..ar.len() {
        let mut f = ar.by_index(i).map_err(|e| format!("복원 실패: {e}"))?;
        if f.is_dir() {
            continue;
        }
        let entry = f.name().replace('\\', "/");
        let target = if let Some(n) = entry.strip_prefix("images/thumbs/") {
            safe_name(n).ok().map(|n| thumbs_dir(&dir).join(n))
        } else if let Some(n) = entry.strip_prefix("images/") {
            safe_name(n).ok().map(|n| images_dir(&dir).join(n))
        } else {
            None
        };
        let Some(target) = target else { continue };
        let mut buf = Vec::with_capacity(f.size() as usize);
        f.read_to_end(&mut buf).map_err(|e| format!("복원 실패: {e}"))?;
        fs::write(&target, &buf).map_err(|e| format!("복원 실패: {e}"))?;
    }
    write_atomic(&dir.join(APPDATA_FILE), text.as_bytes())?;
    Ok(text)
}

// ---------------- 창 ----------------

#[tauri::command]
fn set_title(window: WebviewWindow, title: String) -> Result<(), String> {
    window.set_title(&title).map_err(|e| e.to_string())
}

#[tauri::command]
fn set_resizable(window: WebviewWindow, resizable: bool) -> Result<(), String> {
    window.set_resizable(resizable).map_err(|e| e.to_string())
}

#[tauri::command]
fn win_min(window: WebviewWindow) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

#[tauri::command]
fn win_max(window: WebviewWindow) -> Result<(), String> {
    if window.is_maximized().unwrap_or(false) {
        window.unmaximize().map_err(|e| e.to_string())
    } else {
        window.maximize().map_err(|e| e.to_string())
    }
}

#[tauri::command]
fn win_is_max(window: WebviewWindow) -> bool {
    window.is_maximized().unwrap_or(false)
}

#[tauri::command]
fn win_close(window: WebviewWindow) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}

#[tauri::command]
fn win_drag(window: WebviewWindow) -> Result<(), String> {
    window.start_dragging().map_err(|e| e.to_string())
}

/// 맥에서는 운영체제 창 테두리로 크기를 조절하므로 할 일이 없다
#[tauri::command]
fn win_resize(direction: String) {
    let _ = direction;
}

// ---------------- 창 위치·크기 기억 ----------------

#[derive(Serialize, Deserialize)]
struct WindowState {
    width: f64,
    height: f64,
    x: i32,
    y: i32,
}

fn save_window_state(window: &tauri::Window) {
    if window.is_maximized().unwrap_or(false) || window.is_minimized().unwrap_or(false) {
        return;
    }
    let (Ok(size), Ok(pos), Ok(scale)) =
        (window.inner_size(), window.outer_position(), window.scale_factor())
    else {
        return;
    };
    let logical = size.to_logical::<f64>(scale);
    let st = WindowState { width: logical.width, height: logical.height, x: pos.x, y: pos.y };
    let dir = window.state::<DataDir>().0.clone();
    if fs::create_dir_all(&dir).is_ok() {
        if let Ok(json) = serde_json::to_vec(&st) {
            let _ = write_atomic(&dir.join(WINDOW_STATE_FILE), &json);
        }
    }
}

fn restore_window_state(window: &WebviewWindow, dir: &Path) {
    let Ok(raw) = fs::read(dir.join(WINDOW_STATE_FILE)) else { return };
    let Ok(st) = serde_json::from_slice::<WindowState>(&raw) else { return };
    if st.width >= 300.0 && st.height >= 200.0 {
        let _ = window.set_size(LogicalSize::new(st.width, st.height));
    }
    // 모니터 구성이 바뀌어 화면 밖이 되면 위치는 복원하지 않는다 (가운데 그대로)
    let on_screen = window
        .available_monitors()
        .unwrap_or_default()
        .iter()
        .any(|m| {
            let p = m.position();
            let s = m.size();
            st.x >= p.x - 50
                && st.y >= p.y - 50
                && st.x < p.x + s.width as i32 - 100
                && st.y < p.y + s.height as i32 - 100
        });
    if on_screen {
        let _ = window.set_position(PhysicalPosition::new(st.x, st.y));
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let dir = app.path().app_data_dir()?;
            ensure_dirs(&dir).map_err(|e| -> Box<dyn std::error::Error> { e.into() })?;
            if let Some(w) = app.get_webview_window("main") {
                restore_window_state(&w, &dir);
            }
            app.manage(DataDir(dir));
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                save_window_state(window);
            }
        })
        .invoke_handler(tauri::generate_handler![
            save_data,
            load_data,
            get_data_path,
            open_data_dir,
            save_image_base64,
            read_image_base64,
            delete_image,
            list_images,
            cleanup_images,
            export_backup,
            import_backup,
            set_title,
            set_resizable,
            win_min,
            win_max,
            win_is_max,
            win_close,
            win_drag,
            win_resize,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
