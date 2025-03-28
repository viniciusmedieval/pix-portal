
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface ContentTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function ContentTab({ form }: ContentTabProps) {
  return (
    <TabsContent value="content" className="space-y-6">
      <h3 className="text-lg font-medium">Configurações de Conteúdo</h3>
      
      <FormField
        control={form.control}
        name="headerMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mensagem do Cabeçalho</FormLabel>
            <FormControl>
              <Input placeholder="Mensagem exibida no cabeçalho" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="footerText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Texto do Rodapé</FormLabel>
            <FormControl>
              <Input placeholder="Texto exibido no rodapé" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="testimonialsTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título da Seção de Depoimentos</FormLabel>
            <FormControl>
              <Input placeholder="Título para a seção de depoimentos" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
}
