
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface PixTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PixTab({ form }: PixTabProps) {
  return (
    <TabsContent value="pix" className="space-y-6">
      <h3 className="text-lg font-medium">Configurações do PIX</h3>
      
      <FormField
        control={form.control}
        name="pixKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chave PIX</FormLabel>
            <FormControl>
              <Input placeholder="Sua chave PIX" {...field} />
            </FormControl>
            <FormDescription>
              A chave PIX que será usada para receber os pagamentos.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="beneficiaryName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Beneficiário</FormLabel>
            <FormControl>
              <Input placeholder="Nome que aparecerá para o cliente" {...field} />
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
            <FormLabel>URL do QR Code (opcional)</FormLabel>
            <FormControl>
              <Input placeholder="URL da imagem do QR Code" {...field} />
            </FormControl>
            <FormDescription>
              Deixe em branco para gerar automaticamente.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="pixMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mensagem após pagamento PIX</FormLabel>
            <FormControl>
              <Textarea placeholder="Mensagem a ser exibida após o pagamento PIX" {...field} />
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
              <Input type="number" {...field} />
            </FormControl>
            <FormDescription>
              Tempo em minutos até o pagamento PIX expirar.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );
}
