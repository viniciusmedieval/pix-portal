
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface TestimonialsTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function TestimonialsTab({ form }: TestimonialsTabProps) {
  return (
    <TabsContent value="testimonials" className="space-y-4">
      <h3 className="text-lg font-medium">Configurações de Depoimentos</h3>
      
      <FormField
        control={form.control}
        name="showTestimonials"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Depoimentos</FormLabel>
              <FormDescription>
                Mostrar depoimentos de clientes na página de checkout.
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
        name="testimonialsTitle"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Título da Seção de Depoimentos</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Título dos depoimentos" />
            </FormControl>
            <FormDescription>
              Título exibido acima dos depoimentos.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
}
