
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface FooterTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function FooterTab({ form }: FooterTabProps) {
  return (
    <TabsContent value="footer" className="space-y-4">
      <h3 className="text-lg font-medium">Configurações do Rodapé</h3>
      
      <FormField
        control={form.control}
        name="showFooter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Rodapé</FormLabel>
              <FormDescription>
                Mostrar a área de rodapé na parte inferior da página.
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
        name="footerText"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Texto do Rodapé</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Texto do rodapé" />
            </FormControl>
            <FormDescription>
              Texto exibido no rodapé da página.
            </FormDescription>
          </FormItem>
        )}
      />
    </TabsContent>
  );
}
