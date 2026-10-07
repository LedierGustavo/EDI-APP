import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiCredentials } from "../types/api";

export function useCredenciais() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["credenciais"],
    queryFn: () => api.credenciaisCarregar(),
    staleTime: Infinity,
  });

  const salvarMutation = useMutation({
    mutationFn: (credentials: ApiCredentials) => api.credenciaisSalvar(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credenciais"] });
    },
  });

  const limparMutation = useMutation({
    mutationFn: () => api.credenciaisLimpar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credenciais"] });
    },
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