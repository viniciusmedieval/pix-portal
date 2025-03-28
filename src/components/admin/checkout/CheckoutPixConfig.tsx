
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export function CheckoutPixConfig() {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Configurações PIX</h3>
      
      <FormField
        control={form.control}
        name="pixKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chave PIX</FormLabel>
            <FormControl>
              <Input placeholder="Chave PIX para pagamento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="qrCodeUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL do QR Code</FormLabel>
            <FormControl>
              <Input placeholder="URL da imagem do QR Code" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="pixMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mensagem Pós-PIX</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mensagem exibida após pagamento PIX"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="expirationTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tempo de Expiração (minutos)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Tempo de expiração em minutos" {...field} />
            </FormControl>
            <FormDescription>
              Tempo em minutos até o pagamento PIX expirar.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="nome_beneficiario"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Beneficiário</FormLabel>
            <FormControl>
              <Input placeholder="Nome de quem recebe o PIX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default CheckoutPixConfig;
