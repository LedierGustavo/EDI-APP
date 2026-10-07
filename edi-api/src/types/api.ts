import { z } from "zod";

export const cubagemSchema = z.object({
  altura: z.coerce.number().positive("Altura deve ser maior que zero"),
  largura: z.coerce.number().positive("Largura deve ser maior que zero"),
  comprimento: z.coerce.number().positive("Comprimento deve ser maior que zero"),
});

export type Cubagem = z.infer<typeof cubagemSchema>;

export const cotacaoRequestSchema = z.object({
  username: z.string().min(1, "Usuário da API é obrigatório"),
  password: z.string().min(1, "Senha da API é obrigatória"),
  cnpjRemetente: z.string().length(14, "CNPJ do remetente deve ter 14 dígitos"),
  cnpjDestinatario: z.string().length(14, "CNPJ do destinatário deve ter 14 dígitos"),
  cnpjConsignado: z.string().length(14, "CNPJ do consignado deve ter 14 dígitos").optional().or(z.literal("")),
  modal: z.enum(["R", "A"], { message: "Modal deve ser R (Rodoviário) ou A (Aéreo)" }),
  tipoFrete: z.enum(["1", "2", "3"], { message: "Tipo de frete deve ser 1, 2 ou 3" }),
  cepOrigem: z.string().length(8, "CEP de origem deve ter 8 dígitos"),
  cepDestino: z.string().length(8, "CEP de destino deve ter 8 dígitos"),
  vlrMercadoria: z.coerce.number().positive("Valor da mercadoria deve ser maior que zero"),
  peso: z.coerce.number().positive("Peso deve ser maior que zero"),
  volumes: z.coerce.number().int().positive("Volumes deve ser um número inteiro maior que zero"),
  cubagem: z.array(cubagemSchema).min(1, "Mínimo 1 item de cubagem"),
});

export type CotacaoRequest = z.infer<typeof cotacaoRequestSchema>;

export const cotacaoResponseSchema = z.object({
  status: z.number(),
  mensagem: z.string().optional(),
  dados: z.object({
    valorFrete: z.number().optional(),
    valorSeguro: z.number().optional(),
    valorTotal: z.number().optional(),
    prazoEntrega: z.number().optional(),
    dataValidade: z.string().optional(),
    observacoes: z.string().optional(),
  }).optional(),
});

export type CotacaoResponse = z.infer<typeof cotacaoResponseSchema>;

export interface ApiCredentials {
  username: string;
  password: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}