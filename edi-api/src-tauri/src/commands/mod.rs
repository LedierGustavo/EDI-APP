use crate::braspress::{BraspressClient, CotacaoRequest as BraspressCotacaoRequest, CubagemItem as BraspressCubagemItem};
use crate::keyring::{save_credentials, load_credentials, delete_credentials, has_credentials};
use serde::{Deserialize, Serialize};
use tauri::command;

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

#[derive(Debug, Serialize, Deserialize)]
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

#[derive(Debug, Serialize, Deserialize)]
pub struct CotacaoResponse {
    pub status: i32,
    pub mensagem: Option<String>,
    pub dados: Option<CotacaoDados>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiCredentials {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CredenciaisResult {
    pub username: String,
    pub password: String,
    pub has_credentials: bool,
}

fn convert_request(request: CotacaoRequest) -> BraspressCotacaoRequest {
    BraspressCotacaoRequest {
        cnpj_remetente: request.cnpj_remetente,
        cnpj_destinatario: request.cnpj_destinatario,
        cnpj_consignado: request.cnpj_consignado,
        modal: request.modal,
        tipo_frete: request.tipo_frete,
        cep_origem: request.cep_origem,
        cep_destino: request.cep_destino,
        vlr_mercadoria: request.vlr_mercadoria,
        peso: request.peso,
        volumes: request.volumes,
        cubagem: request.cubagem.into_iter().map(|c| BraspressCubagemItem {
            altura: c.altura,
            largura: c.largura,
            comprimento: c.comprimento,
        }).collect(),
    }
}

fn convert_response(response: crate::braspress::CotacaoResponse) -> CotacaoResponse {
    CotacaoResponse {
        status: response.status,
        mensagem: response.mensagem,
        dados: response.dados.map(|d| CotacaoDados {
            valor_frete: d.valor_frete,
            valor_seguro: d.valor_seguro,
            valor_total: d.valor_total,
            prazo_entrega: d.prazo_entrega,
            data_validade: d.data_validade,
            observacoes: d.observacoes,
        }),
    }
}

#[command]
pub async fn cotacao_calcular(request: CotacaoRequest) -> Result<CotacaoResponse, String> {
    let credentials = load_credentials().map_err(|e| e.to_string())?
        .ok_or("Credenciais não configuradas. Configure usuário e senha da API Braspress.")?;

    let client = BraspressClient::new(credentials.0, credentials.1);
    let braspress_request = convert_request(request);
    
    let response = client.calcular_cotacao(braspress_request)
        .map_err(|e| e.to_string())?;

    Ok(convert_response(response))
}

#[command]
pub async fn credenciais_salvar(credentials: ApiCredentials) -> Result<(), String> {
    save_credentials(&credentials.username, &credentials.password)
        .map_err(|e| e.to_string())
}

#[command]
pub async fn credenciais_carregar() -> Result<CredenciaisResult, String> {
    match load_credentials().map_err(|e| e.to_string())? {
        Some((username, password)) => Ok(CredenciaisResult {
            username,
            password,
            has_credentials: true,
        }),
        None => Ok(CredenciaisResult {
            username: String::new(),
            password: String::new(),
            has_credentials: false,
        }),
    }
}

#[command]
pub async fn credenciais_limpar() -> Result<(), String> {
    delete_credentials().map_err(|e| e.to_string())
}

#[command]
pub async fn credenciais_existem() -> Result<bool, String> {
    Ok(has_credentials())
}