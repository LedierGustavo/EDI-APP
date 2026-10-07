use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use base64::{engine::general_purpose, Engine as _};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CubagemItem {
    pub altura: f64,
    pub largura: f64,
    pub comprimento: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CotacaoRequest {
    #[serde(skip_serializing, default)]
    pub username: String,
    #[serde(skip_serializing, default)]
    pub password: String,
    #[serde(rename = "cnpjRemetente")]
    pub cnpj_remetente: String,
    #[serde(rename = "cnpjDestinatario")]
    pub cnpj_destinatario: String,
    #[serde(rename = "cnpjConsignado", skip_serializing_if = "Option::is_none")]
    pub cnpj_consignado: Option<String>,
    pub modal: String,
    #[serde(rename = "tipoFrete")]
    pub tipo_frete: String,
    #[serde(rename = "cepOrigem")]
    pub cep_origem: String,
    #[serde(rename = "cepDestino")]
    pub cep_destino: String,
    #[serde(rename = "vlrMercadoria")]
    pub vlr_mercadoria: f64,
    pub peso: f64,
    pub volumes: i32,
    pub cubagem: Vec<CubagemItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CotacaoDados {
    #[serde(rename = "valorFrete", default)]
    pub valor_frete: Option<f64>,
    #[serde(rename = "valorSeguro", default)]
    pub valor_seguro: Option<f64>,
    #[serde(rename = "valorTotal", default)]
    pub valor_total: Option<f64>,
    #[serde(rename = "prazoEntrega", default)]
    pub prazo_entrega: Option<i32>,
    #[serde(rename = "dataValidade", default)]
    pub data_validade: Option<String>,
    #[serde(rename = "observacoes", default)]
    pub observacoes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CotacaoResponse {
    #[serde(default)]
    pub status: i32,
    #[serde(default)]
    pub mensagem: Option<String>,
    #[serde(default)]
    pub dados: Option<CotacaoDados>,
}

#[derive(Debug, thiserror::Error)]
pub enum BraspressError {
    #[error("Falha de conexão com a API Braspress: {0}")]
    Http(#[from] reqwest::Error),
    #[error("Erro da API Braspress: {0}")]
    Api(String),
    #[error("Credenciais inválidas (401) — verifique usuário e senha da Braspress")]
    InvalidCredentials,
}

pub struct BraspressClient {
    client: Client,
    base_url: String,
    username: String,
    password: String,
}

impl BraspressClient {
    pub fn new(username: String, password: String) -> Result<Self, BraspressError> {
        log::info!("[Braspress] Criando HTTP client (timeout=30s, connect=10s)");
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .connect_timeout(Duration::from_secs(10))
            .build()?;

        Ok(Self {
            client,
            base_url: "https://api.braspress.com/v1/cotacao/calcular/json".to_string(),
            username,
            password,
        })
    }

    pub async fn calcular_cotacao(&self, request: CotacaoRequest) -> Result<CotacaoResponse, BraspressError> {
        let auth = general_purpose::STANDARD.encode(format!("{}:{}", self.username, self.password));

        log::info!("[Braspress] POST {}", self.base_url);
        log::debug!("[Braspress] Payload: {}", serde_json::to_string(&request).unwrap_or_default());

        let response = self.client
            .post(&self.base_url)
            .header("Authorization", format!("Basic {}", auth))
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .json(&request)
            .send()
            .await
            .map_err(|e| {
                log::error!("[Braspress] Erro no .send(): {}", e);
                BraspressError::from(e)
            })?;

        let status = response.status();
        log::info!("[Braspress] Resposta recebida — Status: {}", status);

        let body_text = response.text().await.unwrap_or_else(|e| {
            log::error!("[Braspress] Erro ao ler body: {}", e);
            String::new()
        });

        log::info!("[Braspress] Body bruto: {}", body_text);

        if status.as_u16() == 401 {
            log::error!("[Braspress] 401 Unauthorized — credenciais inválidas");
            return Err(BraspressError::InvalidCredentials);
        }

        if !status.is_success() {
            log::error!("[Braspress] HTTP {} — {}", status, body_text);
            return Err(BraspressError::Api(format!("HTTP {}: {}", status, body_text)));
        }

        let cotacao: CotacaoResponse = serde_json::from_str(&body_text).map_err(|e| {
            log::error!("[Braspress] Erro ao desserializar JSON: {}", e);
            BraspressError::Api(format!("Resposta inválida da API: {}", e))
        })?;

        log::info!("[Braspress] Cotação desserializada com sucesso — status: {}", cotacao.status);
        Ok(cotacao)
    }
}
