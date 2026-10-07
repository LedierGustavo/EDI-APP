use crate::braspress::{BraspressClient, CotacaoRequest, CotacaoResponse};
use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiCredentials {
    pub username: String,
    pub password: String,
}

#[command]
pub async fn cotacao_calcular(request: CotacaoRequest) -> Result<CotacaoResponse, String> {
    log::info!("[Command] cotacao_calcular — credencialId={}", request.credencial_id);

    let credencial = crate::supabase::fetch_credencial(request.credencial_id).await?;

    log::info!("[Command] Credencial encontrada — usuario={}", credencial.usuario);

    let client = BraspressClient::new(credencial.usuario.clone(), credencial.senha.clone())
        .map_err(|e| e.to_string())?;

    client.calcular_cotacao(request)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn credenciais_salvar(credentials: ApiCredentials) -> Result<(), String> {
    crate::keyring::save_credentials(&credentials.username, &credentials.password)
        .map_err(|e| e.to_string())
}

#[command]
pub async fn credenciais_existem() -> Result<bool, String> {
    Ok(crate::keyring::has_credentials())
}
