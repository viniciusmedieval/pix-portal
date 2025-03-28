
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface TimerTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function TimerTab({ form }: TimerTabProps) {
  return (
    <TabsContent value="timer" className="space-y-4">
      <h3 className="text-lg font-medium">Configurações do Cronômetro</h3>
      
      <FormField
        control={form.control}
        name="timerEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Ativar Cronômetro</FormLabel>
              <FormDescription>
                Exibir um cronômetro de contagem regressiva para criar urgência na compra.
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
        name="timerMinutes"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Duração (minutos)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Tempo em minutos para o cronômetro.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="timerText"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Texto do Cronômetro</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Texto exibido junto ao cronômetro" />
            </FormControl>
            <FormDescription>
              Texto exibido ao lado do cronômetro.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          control={form.control}
          name="timerBgColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor de Fundo</FormLabel>
              <FormControl>
                <div className="flex gap-2 items-center">
                  <Input type="color" className="w-12 h-10 p-1" {...field} />
                  <Input {...field} placeholder="Cor de fundo (ex: #000000)" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="timerTextColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor do Texto</FormLabel>
              <FormControl>
                <div className="flex gap-2 items-center">
                  <Input type="color" className="w-12 h-10 p-1" {...field} />
                  <Input {...field} placeholder="Cor do texto (ex: #ffffff)" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  );
}
