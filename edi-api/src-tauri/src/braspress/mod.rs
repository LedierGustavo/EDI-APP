use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use base64::{engine::general_purpose, Engine as _};

#[derive(Debug, Serialize, Deserialize)]
pub struct CubagemItem {
    pub altura: f64,
    pub largura: f64,
    pub comprimento: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CotacaoRequest {
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

#[derive(Debug, Deserialize)]
pub struct CotacaoDados {
    #[serde(rename = "valorFrete")]
    pub valor_frete: Option<f64>,
    #[serde(rename = "valorSeguro")]
    pub valor_seguro: Option<f64>,
    #[serde(rename = "valorTotal")]
    pub valor_total: Option<f64>,
    #[serde(rename = "prazoEntrega")]
    pub prazo_entrega: Option<i32>,
    #[serde(rename = "dataValidade")]
    pub data_validade: Option<String>,
    #[serde(rename = "observacoes")]
    pub observacoes: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CotacaoResponse {
    pub status: i32,
    pub mensagem: Option<String>,
    pub dados: Option<CotacaoDados>,
}

#[derive(Debug, thiserror::Error)]
pub enum BraspressError {
    #[error("HTTP error: {0}")]
    Http(#[from] reqwest::Error),
    #[error("API error: {0}")]
    Api(String),
    #[error("Authentication required")]
    AuthRequired,
    #[error("Invalid credentials")]
    InvalidCredentials,
}

pub struct BraspressClient {
    client: Client,
    base_url: String,
    username: String,
    password: String,
}

impl BraspressClient {
    pub fn new(username: String, password: String) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .expect("Failed to create HTTP client");

        Self {
            client,
            base_url: "https://api.braspress.com/v1/cotacao/calcular/json".to_string(),
            username,
            password,
        }
    }

    pub fn calcular_cotacao(&self, request: CotacaoRequest) -> Result<CotacaoResponse, BraspressError> {
        let auth = general_purpose::STANDARD.encode(format!("{}:{}", self.username, self.password));
        
        let response = self.client
            .post(&self.base_url)
            .header("Authorization", format!("Basic {}", auth))
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .json(&request)
            .send()?;

        let status = response.status().as_u16() as i32;
        
        if status == 401 {
            return Err(BraspressError::InvalidCredentials);
        }

        if !response.status().is_success() {
            let error_text = response.text().unwrap_or_default();
            return Err(BraspressError::Api(format!("HTTP {}: {}", status, error_text)));
        }

        let cotacao: CotacaoResponse = response.json()?;
        Ok(cotacao)
    }
}