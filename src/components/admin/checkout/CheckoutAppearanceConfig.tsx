
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { useFormContext } from "react-hook-form";

export function CheckoutAppearanceConfig() {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Aparência Geral</h3>
      
      <FormField
        control={form.control}
        name="backgroundColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor de Fundo</FormLabel>
            <FormControl>
              <ColorPicker
                id="backgroundColor"
                value={field.value || ''}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              Cor de fundo da página de checkout.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="buttonColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor do Botão</FormLabel>
            <FormControl>
              <ColorPicker
                id="buttonColor"
                value={field.value || ''}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              Cor do botão de compra.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="buttonText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Texto do Botão</FormLabel>
            <FormControl>
              <Input placeholder="Texto do botão (ex: Comprar agora)" {...field} />
            </FormControl>
            <FormDescription>
              Texto exibido no botão de compra.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default CheckoutAppearanceConfig;
