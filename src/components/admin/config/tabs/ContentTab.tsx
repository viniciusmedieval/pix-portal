
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface ContentTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function ContentTab({ form }: ContentTabProps) {
  return (
    <TabsContent value="content" className="space-y-6">
      <h3 className="text-lg font-medium">Configurações de Textos do Formulário</h3>
      
      <div className="border p-4 rounded-md space-y-4">
        <h4 className="font-medium">Cabeçalho do Formulário</h4>
        
        <FormField
          control={form.control}
          name="formHeaderText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto do Cabeçalho do Formulário</FormLabel>
              <FormControl>
                <Input placeholder="PREENCHA SEUS DADOS ABAIXO" {...field} />
              </FormControl>
              <FormDescription>
                Texto exibido no topo do formulário
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="formHeaderBgColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor de Fundo</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <Input type="color" className="w-12 h-10 p-1" {...field} />
                    <Input placeholder="Cor de fundo (ex: #dc2626)" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="formHeaderTextColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor do Texto</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <Input type="color" className="w-12 h-10 p-1" {...field} />
                    <Input placeholder="Cor do texto (ex: #ffffff)" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </TabsContent>
  );
}
