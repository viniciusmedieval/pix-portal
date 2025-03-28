
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface SecurityTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function SecurityTab({ form }: SecurityTabProps) {
  return (
    <TabsContent value="security" className="space-y-6">
      <h3 className="text-lg font-medium">Configurações de Segurança</h3>
      
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
    </TabsContent>
  );
}
