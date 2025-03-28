
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ui/color-picker";
import { useFormContext } from "react-hook-form";

export function CheckoutTimerConfig() {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Timer</h3>
      
      <FormField
        control={form.control}
        name="timerEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Timer</FormLabel>
              <FormDescription>
                Exibir contador regressivo no topo da página.
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
      
      {form.watch('timerEnabled') && (
        <>
          <FormField
            control={form.control}
            name="timerMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Minutos" {...field} />
                </FormControl>
                <FormDescription>
                  Tempo em minutos para o contador.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timerText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto do Timer</FormLabel>
                <FormControl>
                  <Input placeholder="Texto exibido junto ao contador" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timerBgColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor de Fundo do Timer</FormLabel>
                <FormControl>
                  <ColorPicker
                    id="timerBgColor"
                    value={field.value || '#000000'}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Cor de fundo da barra do contador.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timerTextColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor do Texto do Timer</FormLabel>
                <FormControl>
                  <ColorPicker
                    id="timerTextColor"
                    value={field.value || '#ffffff'}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Cor do texto do contador.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}

export default CheckoutTimerConfig;
