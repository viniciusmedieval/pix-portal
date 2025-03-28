
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface AppearanceTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function AppearanceTab({ form }: AppearanceTabProps) {
  return (
    <TabsContent value="appearance" className="space-y-4">
      <h3 className="text-lg font-medium">Configurações de Aparência</h3>
      
      <FormField
        control={form.control}
        name="backgroundColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor de Fundo</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input type="color" className="w-12 h-10 p-1" {...field} />
                <Input {...field} placeholder="Cor de fundo (ex: #f0f0f0)" />
              </div>
            </FormControl>
            <FormDescription>
              Cor de fundo da página de checkout.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="buttonColor"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Cor do Botão</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input type="color" className="w-12 h-10 p-1" {...field} />
                <Input {...field} placeholder="Cor do botão (ex: #30b968)" />
              </div>
            </FormControl>
            <FormDescription>
              Cor do botão de compra.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="buttonText"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Texto do Botão</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Texto do botão (ex: Comprar agora)" />
            </FormControl>
            <FormDescription>
              Texto exibido no botão de compra.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="showVisitorCounter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Contador de Visitas</FormLabel>
              <FormDescription>
                Exibir contador de visitantes na página de checkout.
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
