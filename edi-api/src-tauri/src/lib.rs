use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    log::info!("Starting EDI API application");
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Debug)
            .build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::cotacao_calcular,
            commands::credenciais_salvar,
            commands::credenciais_existem,
        ])
        .setup(|app| {
            log::info!("Setup hook called");
            log::info!("Windows: {:?}", app.webview_windows());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}

mod commands;
mod braspress;
mod keyring;
mod supabase;