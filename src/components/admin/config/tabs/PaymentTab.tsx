
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface PaymentTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PaymentTab({ form }: PaymentTabProps) {
  return (
    <TabsContent value="payment" className="space-y-4">
      <h3 className="text-lg font-medium">Configurações de Pagamento</h3>
      
      <FormField
        control={form.control}
        name="pixKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chave PIX</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Chave PIX para pagamentos" />
            </FormControl>
            <FormDescription>
              Sua chave PIX para recebimento dos pagamentos.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="qrCodeUrl"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>URL do QR Code do PIX</FormLabel>
            <FormControl>
              <Input {...field} placeholder="URL da imagem do QR Code" />
            </FormControl>
            <FormDescription>
              URL da imagem do QR Code para pagamentos PIX.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="pixMessage"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Mensagem após pagamento PIX</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Mensagem exibida após o pagamento PIX"
                className="resize-none"
                rows={3}
              />
            </FormControl>
            <FormDescription>
              Mensagem exibida para o cliente após realizar o pagamento via PIX.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="beneficiaryName"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Nome do Beneficiário</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome do beneficiário do PIX" />
            </FormControl>
            <FormDescription>
              Nome que aparecerá como beneficiário do PIX.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="expirationTime"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Tempo de Expiração do PIX (minutos)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                {...field}
              />
            </FormControl>
            <FormDescription>
              Tempo em minutos até o código PIX expirar.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
}
