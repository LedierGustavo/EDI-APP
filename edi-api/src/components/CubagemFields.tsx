import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const CubagemFields = React.memo(function CubagemFields() {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "cubagem",
  });

  const handleAdd = () => {
    append({ altura: 0, largura: 0, comprimento: 0 });
  };

  const getErrorMessage = (errorObj: unknown, field: string): string | undefined => {
    if (errorObj && typeof errorObj === 'object' && errorObj !== null) {
      const fieldError = (errorObj as Record<string, unknown>)[field];
      if (fieldError && typeof fieldError === 'object' && fieldError !== null) {
        return (fieldError as { message?: string }).message;
      }
    }
    return undefined;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Cubagem (mínimo 1 item)</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd} className="gap-1">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2 p-4 border rounded-lg bg-muted/30">
          <button
            type="button"
            className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => e.preventDefault()}
          >
            <GripVertical className="h-5 w-5" />
          </button>

          <div className="flex-1 grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor={`cubagem.${index}.altura`} className="text-xs">Altura (cm)</Label>
              <Input
                id={`cubagem.${index}.altura`}
                placeholder="Ex: 30"
                {...register(`cubagem.${index}.altura`, { valueAsNumber: true })}
                className="text-center"
                min={0.01}
                step={0.01}
              />
              {getErrorMessage(errors.cubagem, index.toString()) && (
                <p className="text-xs text-destructive mt-1">{getErrorMessage(errors.cubagem, index.toString())}</p>
              )}
            </div>
            <div>
              <Label htmlFor={`cubagem.${index}.largura`} className="text-xs">Largura (cm)</Label>
              <Input
                id={`cubagem.${index}.largura`}
                placeholder="Ex: 20"
                {...register(`cubagem.${index}.largura`, { valueAsNumber: true })}
                className="text-center"
                min={0.01}
                step={0.01}
              />
              {getErrorMessage(errors.cubagem, index.toString()) && (
                <p className="text-xs text-destructive mt-1">{getErrorMessage(errors.cubagem, index.toString())}</p>
              )}
            </div>
            <div>
              <Label htmlFor={`cubagem.${index}.comprimento`} className="text-xs">Comprimento (cm)</Label>
              <Input
                id={`cubagem.${index}.comprimento`}
                placeholder="Ex: 40"
                {...register(`cubagem.${index}.comprimento`, { valueAsNumber: true })}
                className="text-center"
                min={0.01}
                step={0.01}
              />
              {getErrorMessage(errors.cubagem, index.toString()) && (
                <p className="text-xs text-destructive mt-1">{getErrorMessage(errors.cubagem, index.toString())}</p>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
            className="text-destructive hover:bg-destructive/10 mt-1"
            aria-label="Remover item de cubagem"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum item de cubagem adicionado. Clique em "Adicionar" para começar.
        </div>
      )}
    </div>
  );
});