import { CheckCircle, Truck, Clock, Shield, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import type { CotacaoResponse } from "../types/api";

interface ResultadoCotacaoProps {
  data?: CotacaoResponse;
}

export function ResultadoCotacao({ data }: ResultadoCotacaoProps) {
  if (!data?.dados) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Info className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            Preencha o formulário e clique em "Calcular Cotação" para ver o resultado aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { valorFrete, valorSeguro, valorTotal, prazoEntrega, dataValidade, observacoes } = data.dados;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            Cotação Realizada com Sucesso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-green-50 p-6 dark:bg-green-900/20">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Truck className="h-5 w-5" />
                <span className="font-medium">Valor do Frete</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">
                R$ {valorFrete?.toFixed(2).replace(".", ",") || "0,00"}
              </p>
            </div>

            <div className="rounded-lg border bg-blue-50 p-6 dark:bg-blue-900/20">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Valor do Seguro</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-100">
                R$ {valorSeguro?.toFixed(2).replace(".", ",") || "0,00"}
              </p>
            </div>

            <div className="rounded-lg border bg-primary/10 p-6">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Valor Total</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-primary">
                R$ {valorTotal?.toFixed(2).replace(".", ",") || "0,00"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Informação</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prazoEntrega && (
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Prazo de Entrega
                    </TableCell>
                    <TableCell className="font-medium">{prazoEntrega} dia(s) útil(eis)</TableCell>
                  </TableRow>
                )}
                {dataValidade && (
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      Validade da Cotação
                    </TableCell>
                    <TableCell className="font-medium">{dataValidade}</TableCell>
                  </TableRow>
                )}
                {observacoes && (
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      Observações
                    </TableCell>
                    <TableCell>{observacoes}</TableCell>
                  </TableRow>
                )}
                {data.status && (
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      Status HTTP
                    </TableCell>
                    <TableCell className="font-medium">{data.status}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {data.mensagem && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">{data.mensagem}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}