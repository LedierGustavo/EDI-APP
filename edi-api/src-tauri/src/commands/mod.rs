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
    if request.username.is_empty() || request.password.is_empty() {
        return Err("Usuário e senha da API Braspress são obrigatórios.".to_string());
    }

    let client = BraspressClient::new(request.username.clone(), request.password.clone())
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
