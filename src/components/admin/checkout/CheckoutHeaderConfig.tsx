
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ui/color-picker";
import { useFormContext } from "react-hook-form";

export function CheckoutHeaderConfig() {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Configuração do Cabeçalho</h3>
      
      <FormField
        control={form.control}
        name="showHeader"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Mostrar Cabeçalho</FormLabel>
              <FormDescription>
                Exibir a barra de cabeçalho no topo da página.
              </FormDescription>
            </div>
            <FormControl>
              <Switch 
                checked={field.value} 
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {form.watch('showHeader') && (
        <>
          <FormField
            control={form.control}
            name="headerMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem do Cabeçalho</FormLabel>
                <FormControl>
                  <Input placeholder="Mensagem do cabeçalho" {...field} />
                </FormControl>
                <FormDescription>
                  Texto exibido na barra no topo da página.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="headerBgColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor de Fundo do Cabeçalho</FormLabel>
                <FormControl>
                  <ColorPicker
                    id="headerBgColor"
                    value={field.value || '#000000'}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="headerTextColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor do Texto do Cabeçalho</FormLabel>
                <FormControl>
                  <ColorPicker
                    id="headerTextColor"
                    value={field.value || '#ffffff'}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}

export default CheckoutHeaderConfig;
