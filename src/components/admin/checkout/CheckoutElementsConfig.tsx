
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export function CheckoutElementsConfig() {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Elementos do Checkout</h3>
      
      <FormField
        control={form.control}
        name="showVisitorCounter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Contador de Visitas</FormLabel>
              <FormDescription>
                Exibir contador de visitantes na página de checkout.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="showTestimonials"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Testemunhos</FormLabel>
              <FormDescription>
                Exibir depoimentos de clientes na página de checkout.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="paymentSecurityText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Texto de Segurança</FormLabel>
            <FormControl>
              <Input
                placeholder="Texto sobre segurança do pagamento"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Texto exibido sobre a segurança do pagamento.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="blockedCpfs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPFs Bloqueados</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lista de CPFs bloqueados, separados por vírgula"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Lista de CPFs que não podem realizar a compra.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default CheckoutElementsConfig;
