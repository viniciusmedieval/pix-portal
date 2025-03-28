
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

export function CheckoutBannerConfig() {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Banner</h3>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <FormField
            control={form.control}
            name="imagem_banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Imagem Banner</FormLabel>
                <FormControl>
                  <Input placeholder="URL da imagem do banner" {...field} />
                </FormControl>
                <FormDescription>
                  URL da imagem que será exibida como banner no topo da página.
                  Para melhor resultado, use uma imagem panorâmica.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="banner_bg_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor de Fundo do Banner</FormLabel>
                <FormControl>
                  <ColorPicker
                    id="banner_bg_color"
                    value={field.value || '#000000'}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Cor de fundo por trás do banner.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default CheckoutBannerConfig;
