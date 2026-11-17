// 릴리스 빌드에서 윈도우 콘솔 창이 뜨지 않게 (맥에서는 영향 없음)
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    nai_meta_gallery_lib::run()
}
