import React from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Loader2, Key } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { cotacaoRequestSchema, type CotacaoRequest } from "../types/api";
import { CubagemFields } from "./CubagemFields";
import { useCotacaoCalcular } from "../hooks/useCotacao";
import { toast } from "../hooks/useToast";

export function CotacaoForm() {
  const { mutateAsync: calcularCotacao, isPending: isCalculando } = useCotacaoCalcular();

  const form = useForm<CotacaoRequest>({
    resolver: zodResolver(cotacaoRequestSchema),
    defaultValues: {
      username: "",
      password: "",
      cnpjRemetente: "",
      cnpjDestinatario: "",
      cnpjConsignado: "",
      modal: "R",
      tipoFrete: "1",
      cepOrigem: "",
      cepDestino: "",
      vlrMercadoria: 0,
      peso: 0,
      volumes: 1,
      cubagem: [{ altura: 0, largura: 0, comprimento: 0 }],
    },
  });

  const modalValue = useWatch({ control: form.control, name: "modal" });
  const tipoFreteValue = useWatch({ control: form.control, name: "tipoFrete" });

  const onSubmit = async (data: CotacaoRequest) => {
    try {
      const resultado = await calcularCotacao(data);
      toast({
        title: "Cotação realizada com sucesso",
        description: `Valor do frete: R$ ${resultado.totalFrete?.toFixed(2).replace(".", ",") || "0,00"}`,
        variant: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao calcular cotação";
      toast({
        title: "Erro na cotação",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cálculo de Cotação
              </CardTitle>
              <CardDescription>
                Preencha os dados abaixo para calcular o frete na API Braspress
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-4">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Credenciais da API Braspress</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg bg-muted/30">
                <div>
                  <Label htmlFor="username">Usuário *</Label>
                  <Input
                    id="username"
                    placeholder="seu_usuario"
                    autoComplete="username"
                    {...form.register("username")}
                  />
                  {form.formState.errors.username && (
                    <p className="text-xs text-destructive mt-1">{form.formState.errors.username.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="sua_senha"
                    autoComplete="current-password"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <span className="text-sm font-medium text-muted-foreground">Dados da Cotação</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="md:col-span-2">
                <Label htmlFor="cnpjRemetente">CNPJ Remetente *</Label>
                <Input
                  id="cnpjRemetente"
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  {...form.register("cnpjRemetente")}
                />
                {form.formState.errors.cnpjRemetente && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.cnpjRemetente.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="cnpjDestinatario">CNPJ Destinatário *</Label>
                <Input
                  id="cnpjDestinatario"
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  {...form.register("cnpjDestinatario")}
                />
                {form.formState.errors.cnpjDestinatario && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.cnpjDestinatario.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="cnpjConsignado">CNPJ Consignado (opcional)</Label>
                <Input
                  id="cnpjConsignado"
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  {...form.register("cnpjConsignado")}
                />
              </div>

              <div>
                <Label htmlFor="modal">Modal *</Label>
                <Select
                  value={modalValue}
                  onValueChange={(value: "R" | "A") => form.setValue("modal", value)}
                >
                  <SelectTrigger id="modal">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R">Rodoviário (R)</SelectItem>
                    <SelectItem value="A">Aéreo (A)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.modal && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.modal.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tipoFrete">Tipo Frete *</Label>
                <Select
                  value={tipoFreteValue}
                  onValueChange={(value: "1" | "2" | "3") => form.setValue("tipoFrete", value)}
                >
                  <SelectTrigger id="tipoFrete">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">CIF (1)</SelectItem>
                    <SelectItem value="2">FOB (2)</SelectItem>
                    <SelectItem value="3">Terceiros (3)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.tipoFrete && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.tipoFrete.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cepOrigem">CEP Origem *</Label>
                <Input
                  id="cepOrigem"
                  placeholder="00000-000"
                  maxLength={9}
                  {...form.register("cepOrigem")}
                />
                {form.formState.errors.cepOrigem && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.cepOrigem.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cepDestino">CEP Destino *</Label>
                <Input
                  id="cepDestino"
                  placeholder="00000-000"
                  maxLength={9}
                  {...form.register("cepDestino")}
                />
                {form.formState.errors.cepDestino && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.cepDestino.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="vlrMercadoria">Valor Mercadoria (R$) *</Label>
                <Input
                  id="vlrMercadoria"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  {...form.register("vlrMercadoria", { valueAsNumber: true })}
                />
                {form.formState.errors.vlrMercadoria && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.vlrMercadoria.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="peso">Peso (kg) *</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.001"
                  min="0.001"
                  placeholder="0,000"
                  {...form.register("peso", { valueAsNumber: true })}
                />
                {form.formState.errors.peso && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.peso.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="volumes">Volumes *</Label>
                <Input
                  id="volumes"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  {...form.register("volumes", { valueAsNumber: true })}
                />
                {form.formState.errors.volumes && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.volumes.message}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <CubagemFields />
              {form.formState.errors.cubagem && (
                <p className="text-xs text-destructive mt-2">{form.formState.errors.cubagem.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => form.reset()}>
                Limpar
              </Button>
              <Button type="submit" disabled={isCalculando} className="gap-2">
                {isCalculando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4" />
                    Calcular Cotação
                  </>
                )}
              </Button>
            </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
