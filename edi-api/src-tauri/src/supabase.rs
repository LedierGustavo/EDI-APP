use serde::Deserialize;

const SUPABASE_URL: &str = "https://ynunxrvepaokkafxhzda.supabase.co";
const SUPABASE_KEY: &str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludW54cnZlcGFva2thZnhoemRhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjE0NjMyMSwiZXhwIjoyMDk3NzIyMzIxfQ.EGbbgfwNL3Ghh3K3lMj91Qej3TxGLa1qK3yJL4Ffjns";

#[derive(Debug, Deserialize)]
pub struct CredencialRow {
    #[allow(dead_code)]
    pub id: i32,
    pub usuario: String,
    pub senha: String,
}

pub async fn fetch_credencial(id: i32) -> Result<CredencialRow, String> {
    let url = format!(
        "{}/rest/v1/credenciais?id=eq.{}&select=id,usuario,senha&limit=1",
        SUPABASE_URL, id
    );

    log::info!("[Supabase] Buscando credencial id={}", id);

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .build()
        .map_err(|e| format!("Erro ao criar client Supabase: {}", e))?;

    let response = client
        .get(&url)
        .header("apikey", SUPABASE_KEY)
        .header("Authorization", format!("Bearer {}", SUPABASE_KEY))
        .header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| format!("Erro na requisição Supabase: {}", e))?;

    let status = response.status();
    log::info!("[Supabase] Status: {}", status);

    let body = response
        .text()
        .await
        .map_err(|e| format!("Erro ao ler resposta Supabase: {}", e))?;

    if !status.is_success() {
        log::error!("[Supabase] HTTP {}: {}", status, body);
        return Err(format!("Supabase HTTP {}: {}", status, body));
    }

    let rows: Vec<CredencialRow> =
        serde_json::from_str(&body).map_err(|e| format!("Erro ao parsear Supabase: {}", e))?;

    rows.into_iter().next().ok_or_else(|| {
        format!("Credencial com id {} não encontrada no Supabase", id)
    })
}
