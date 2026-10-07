import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "../lib/utils";
import { supabase, type CredencialRow } from "../lib/supabase";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

async function fetchCredenciais(): Promise<CredencialRow[]> {
  const { data, error } = await supabase
    .from("credenciais")
    .select("id, usuario");

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export function UsuarioApiCombobox() {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "credencialId",
  });

  const [open, setOpen] = React.useState(false);

  const { data: usuarios, isLoading, error } = useQuery({
    queryKey: ["credenciais", "lista"],
    queryFn: fetchCredenciais,
    staleTime: 5 * 60_000,
  });

  const selected = usuarios?.find((u) => u.id === value);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando...
              </span>
            ) : selected ? (
              selected.usuario
            ) : (
              <span className="text-muted-foreground">Selecione um usuário...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar usuário..." />
            <CommandList>
              {isLoading && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Carregando usuários...
                </div>
              )}
              {error && (
                <div className="py-6 text-center text-sm text-destructive">
                  Erro ao carregar usuários.
                </div>
              )}
              {!isLoading && !error && (
                <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
              )}
              <CommandGroup>
                {usuarios?.map((usuario) => (
                  <CommandItem
                    key={usuario.id}
                    value={usuario.usuario}
                    onSelect={() => {
                      onChange(usuario.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === usuario.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {usuario.usuario}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-destructive mt-1">
          Não foi possível carregar os usuários da API.
        </p>
      )}
    </div>
  );
}
