import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { CotacaoRequest, CotacaoResponse } from "../types/api";

export function useCotacaoCalcular() {
  const queryClient = useQueryClient();

  return useMutation<CotacaoResponse, Error, CotacaoRequest>({
    mutationFn: (request) => api.cotacaoCalcular(request),
    onSuccess: (data) => {
      queryClient.setQueryData(["cotacao", "last"], data);
    },
    retry: false,
  });
}

export function useCotacaoLast(): CotacaoResponse | undefined {
  const { data } = useQuery<CotacaoResponse>({
    queryKey: ["cotacao", "last"],
    enabled: false,
    staleTime: Infinity,
  });
  return data;
}
