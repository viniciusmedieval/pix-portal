
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/ui/color-picker";
import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

export function CheckoutHeaderConfig() {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Cabeçalho</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-medium">Exibir cabeçalho</h4>
              <p className="text-sm text-muted-foreground">
                Ativa ou desativa a barra de cabeçalho no topo da página
              </p>
            </div>
            <FormField
              control={form.control}
              name="show_header"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="header_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem do Cabeçalho</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: Tempo restante! Garanta sua oferta" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Mensagem que será exibida na barra no topo da página.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="header_bg_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor de Fundo do Cabeçalho</FormLabel>
                  <FormControl>
                    <ColorPicker
                      id="header_bg_color"
                      value={field.value || '#000000'}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="header_text_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor do Texto do Cabeçalho</FormLabel>
                  <FormControl>
                    <ColorPicker
                      id="header_text_color"
                      value={field.value || '#ffffff'}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CheckoutHeaderConfig;
