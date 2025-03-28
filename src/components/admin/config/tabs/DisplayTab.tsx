
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface DisplayTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function DisplayTab({ form }: DisplayTabProps) {
  return (
    <TabsContent value="display" className="space-y-6">
      <h3 className="text-lg font-medium">Configurações de Visibilidade</h3>
      
      <FormField
        control={form.control}
        name="showHeader"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Cabeçalho</FormLabel>
              <FormDescription>
                Mostrar a faixa de cabeçalho no topo da página.
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
        name="showFooter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Rodapé</FormLabel>
              <FormDescription>
                Mostrar informações de rodapé na parte inferior da página.
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
              <FormLabel>Exibir Depoimentos</FormLabel>
              <FormDescription>
                Mostrar depoimentos de clientes na página.
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
        name="showVisitorCounter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Contador de Visitantes</FormLabel>
              <FormDescription>
                Mostrar número de pessoas visualizando a página.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </TabsContent>
  );
}
