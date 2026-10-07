use keyring::Entry;
use std::sync::OnceLock;

const SERVICE_NAME: &str = "edi-api";

static KEYRING_ENTRY: OnceLock<Entry> = OnceLock::new();

fn get_entry() -> Result<&'static Entry, String> {
    let entry = Entry::new(SERVICE_NAME, "braspress_credentials")
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    
    KEYRING_ENTRY.set(entry).ok();
    KEYRING_ENTRY.get().ok_or("Failed to initialize keyring entry".to_string())
}

pub fn save_credentials(username: &str, password: &str) -> Result<(), String> {
    let entry = get_entry()?;
    
    let credentials = format!("{}:{}", username, password);
    entry.set_password(&credentials)
        .map_err(|e| format!("Failed to save credentials: {}", e))
}

pub fn load_credentials() -> Result<Option<(String, String)>, String> {
    let entry = get_entry()?;
    
    match entry.get_password() {
        Ok(credentials) => {
            if let Some((username, password)) = credentials.split_once(':') {
                Ok(Some((username.to_string(), password.to_string())))
            } else {
                Err("Invalid credentials format".to_string())
            }
        }
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(format!("Failed to load credentials: {}", e)),
    }
}

pub fn has_credentials() -> bool {
    load_credentials().map(|c| c.is_some()).unwrap_or(false)
}