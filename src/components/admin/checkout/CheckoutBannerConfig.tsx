
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { useFormContext } from "react-hook-form";

export function CheckoutBannerConfig() {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Banner</h3>
      
      <FormField
        control={form.control}
        name="imagemBanner"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL da Imagem Banner</FormLabel>
            <FormControl>
              <Input placeholder="URL da imagem do banner" {...field} />
            </FormControl>
            <FormDescription>
              URL da imagem que será exibida como banner no topo da página.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="bannerBgColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor de Fundo do Banner</FormLabel>
            <FormControl>
              <ColorPicker
                id="bannerBgColor"
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
    </div>
  );
}

export default CheckoutBannerConfig;
