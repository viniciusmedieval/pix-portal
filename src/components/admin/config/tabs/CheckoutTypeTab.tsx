
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface CheckoutTypeTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function CheckoutTypeTab({ form }: CheckoutTypeTabProps) {
  return (
    <TabsContent value="checkoutType" className="space-y-4">
      <h3 className="text-lg font-medium">Tipo de Checkout</h3>
      
      <FormField
        control={form.control}
        name="oneCheckoutEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Checkout em Página Única</FormLabel>
              <FormDescription>
                Se ativado, mostra todo o formulário de checkout em uma única página.
                Se desativado, o checkout será mostrado em etapas separadas.
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
    </TabsContent>
  );
}
