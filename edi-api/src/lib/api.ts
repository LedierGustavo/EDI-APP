import { invoke } from "@tauri-apps/api/core";
import type { CotacaoRequest, CotacaoResponse, ApiCredentials, ApiError } from "../types/api";

export interface CotacaoCalcularArgs {
  request: CotacaoRequest;
}

export interface CredenciaisSalvarArgs {
  credentials: ApiCredentials;
}

export interface CredenciaisCarregarResult {
  username: string;
  password: string;
  hasCredentials: boolean;
}

export const api = {
  async cotacaoCalcular(request: CotacaoRequest): Promise<CotacaoResponse> {
    try {
      const result = await invoke<CotacaoResponse>("cotacao_calcular", { request });
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Erro ao calcular cotação");
    }
  },

  async credenciaisSalvar(credentials: ApiCredentials): Promise<void> {
    await invoke("credenciais_salvar", { credentials });
  },

  async credenciaisCarregar(): Promise<CredenciaisCarregarResult> {
    return await invoke("credenciais_carregar");
  },

  async credenciaisLimpar(): Promise<void> {
    await invoke("credenciais_limpar");
  },
};