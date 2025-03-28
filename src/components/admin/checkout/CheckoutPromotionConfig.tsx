
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

export function CheckoutPromotionConfig() {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Promoção</h3>
      
      <FormField
        control={form.control}
        name="discountBadgeEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Badge de Desconto</FormLabel>
              <FormDescription>
                Exibir badge de "Oferta Especial" no produto.
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
      
      {form.watch('discountBadgeEnabled') && (
        <>
          <FormField
            control={form.control}
            name="discountBadgeText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto do Badge</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Oferta Especial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="discountAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Desconto</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Valor do desconto" {...field} />
                </FormControl>
                <FormDescription>
                  Valor do desconto a ser aplicado ao preço original.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Original</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Preço original (antes do desconto)" 
                    value={field.value || ''} 
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>
                  Preço original antes do desconto. Se vazio, usa o preço do produto.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}

export default CheckoutPromotionConfig;
