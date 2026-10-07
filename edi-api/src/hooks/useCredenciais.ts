import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiCredentials } from "../types/api";

const CREDENCIAIS_STALE_TIME = 5 * 60_000;

export function useCredenciais() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["credenciais"],
    queryFn: () => api.credenciaisCarregar(),
    staleTime: CREDENCIAIS_STALE_TIME,
    retry: false,
  });

  const salvarMutation = useMutation({
    mutationFn: (credentials: ApiCredentials) => api.credenciaisSalvar(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credenciais"] });
    },
    retry: false,
  });

  const limparMutation = useMutation({
    mutationFn: () => api.credenciaisLimpar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credenciais"] });
    },
    retry: false,
  });

  return {
    credenciais: data,
    isLoading,
    error,
    salvar: salvarMutation.mutateAsync,
    limpar: limparMutation.mutateAsync,
    isSalvando: salvarMutation.isPending,
    isLimpando: limparMutation.isPending,
  };
}
