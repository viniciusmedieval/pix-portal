
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface HeaderTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function HeaderTab({ form }: HeaderTabProps) {
  return (
    <TabsContent value="header" className="space-y-4">
      <h3 className="text-lg font-medium">Configurações do Cabeçalho</h3>
      
      <FormField
        control={form.control}
        name="showHeader"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Cabeçalho</FormLabel>
              <FormDescription>
                Mostrar a barra de cabeçalho no topo da página.
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
        name="headerMessage"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Mensagem do Cabeçalho</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Mensagem do cabeçalho" />
            </FormControl>
            <FormDescription>
              Mensagem exibida na barra de cabeçalho.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="headerBgColor"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Cor de Fundo do Cabeçalho</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input type="color" className="w-12 h-10 p-1" {...field} />
                <Input {...field} placeholder="Cor de fundo (ex: #df2020)" />
              </div>
            </FormControl>
            <FormDescription>
              Cor de fundo da barra de cabeçalho.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="headerTextColor"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Cor do Texto do Cabeçalho</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input type="color" className="w-12 h-10 p-1" {...field} />
                <Input {...field} placeholder="Cor do texto (ex: #ffffff)" />
              </div>
            </FormControl>
            <FormDescription>
              Cor do texto na barra de cabeçalho.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
}
