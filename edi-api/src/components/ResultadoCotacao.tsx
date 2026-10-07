import { CheckCircle, Truck, Clock, Hash, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import type { CotacaoResponse } from "../types/api";

interface ResultadoCotacaoProps {
  data?: CotacaoResponse;
}

export function ResultadoCotacao({ data }: ResultadoCotacaoProps) {
  if (!data || (data.totalFrete === undefined && data.prazo === undefined && data.id === undefined)) {
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

  const { id, prazo, totalFrete } = data;

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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-green-50 p-6 dark:bg-green-900/20">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Truck className="h-5 w-5" />
                <span className="font-medium">Valor do Frete</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">
                R$ {totalFrete?.toFixed(2).replace(".", ",") || "0,00"}
              </p>
            </div>

            <div className="rounded-lg border bg-blue-50 p-6 dark:bg-blue-900/20">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Prazo de Entrega</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-100">
                {prazo ?? "—"} dia(s)
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
                {id !== undefined && (
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      ID da Cotação
                    </TableCell>
                    <TableCell className="font-medium">{id}</TableCell>
                  </TableRow>
                )}
                {prazo !== undefined && (
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Prazo de Entrega
                    </TableCell>
                    <TableCell className="font-medium">{prazo} dia(s) útil(eis)</TableCell>
                  </TableRow>
                )}
                {totalFrete !== undefined && (
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      Total do Frete
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {totalFrete.toFixed(2).replace(".", ",")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
