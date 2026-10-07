import { invoke } from "@tauri-apps/api/core";
import type { CotacaoRequest, CotacaoResponse, ApiCredentials, ApiError } from "../types/api";

const INVOKE_TIMEOUT_MS = 35_000;

async function invokeWithTimeout<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      invoke<T>(cmd, args),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("Tempo esgotado. Verifique sua conexão e tente novamente.")),
          INVOKE_TIMEOUT_MS,
        );
      }),
    ]);
    return result;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function toApiError(error: unknown, fallback: string): Error {
  if (error instanceof Error) return error;
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as ApiError).message;
    if (typeof msg === "string" && msg.length > 0) return new Error(msg);
  }
  return new Error(fallback);
}

export const api = {
  async cotacaoCalcular(request: CotacaoRequest): Promise<CotacaoResponse> {
    try {
      return await invokeWithTimeout<CotacaoResponse>("cotacao_calcular", { request });
    } catch (error) {
      throw toApiError(error, "Erro ao calcular cotação");
    }
  },

  async credenciaisSalvar(credentials: ApiCredentials): Promise<void> {
    try {
      await invokeWithTimeout<void>("credenciais_salvar", { credentials });
    } catch (error) {
      throw toApiError(error, "Erro ao salvar credenciais");
    }
  },

  async credenciaisExistem(): Promise<boolean> {
    try {
      return await invokeWithTimeout<boolean>("credenciais_existem");
    } catch (error) {
      throw toApiError(error, "Erro ao verificar credenciais");
    }
  },
};
