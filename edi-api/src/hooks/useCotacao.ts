import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { CotacaoRequest, CotacaoResponse } from "../types/api";

export function useCotacaoCalcular() {
  const queryClient = useQueryClient();

  return useMutation<CotacaoResponse, Error, CotacaoRequest>({
    mutationFn: (request) => api.cotacaoCalcular(request),
    onSuccess: (data) => {
      queryClient.setQueryData(["cotacao", "last"], data);
    },
  });
}

export function useCotacaoLast() {
  return { data: undefined };
}