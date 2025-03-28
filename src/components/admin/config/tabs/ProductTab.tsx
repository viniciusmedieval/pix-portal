
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface ProductTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function ProductTab({ form }: ProductTabProps) {
  return (
    <TabsContent value="product" className="space-y-4">
      <h3 className="text-lg font-medium">Configurações do Produto</h3>
      
      <FormField
        control={form.control}
        name="discountBadgeEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Badge de Desconto</FormLabel>
              <FormDescription>
                Mostrar um badge indicando desconto no produto.
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
      
      <FormField
        control={form.control}
        name="discountBadgeText"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Texto do Badge de Desconto</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Texto do badge (ex: Oferta especial)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="discountAmount"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Valor do Desconto (R$)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                step="0.01" 
                {...field} 
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Valor do desconto em reais.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="originalPrice"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Preço Original (R$)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                step="0.01" 
                value={field.value || ''} 
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormDescription>
              Preço original antes do desconto.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
}
