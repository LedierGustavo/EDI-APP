use crate::braspress::{BraspressClient, CotacaoRequest, CotacaoResponse};
use crate::keyring::{save_credentials, load_credentials, delete_credentials, has_credentials};
use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiCredentials {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CredenciaisResult {
    pub has_credentials: bool,
}

#[command]
pub async fn cotacao_calcular(request: CotacaoRequest) -> Result<CotacaoResponse, String> {
    let credentials = load_credentials().map_err(|e| e.to_string())?
        .ok_or("Credenciais não configuradas. Configure usuário e senha da API Braspress.")?;

    let client = BraspressClient::new(credentials.0, credentials.1)
        .map_err(|e| e.to_string())?;

    client.calcular_cotacao(request)
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn credenciais_salvar(credentials: ApiCredentials) -> Result<(), String> {
    save_credentials(&credentials.username, &credentials.password)
        .map_err(|e| e.to_string())
}

#[command]
pub async fn credenciais_carregar() -> Result<CredenciaisResult, String> {
    Ok(CredenciaisResult {
        has_credentials: has_credentials(),
    })
}

#[command]
pub async fn credenciais_limpar() -> Result<(), String> {
    delete_credentials().map_err(|e| e.to_string())
}

#[command]
pub async fn credenciais_existem() -> Result<bool, String> {
    Ok(has_credentials())
}
