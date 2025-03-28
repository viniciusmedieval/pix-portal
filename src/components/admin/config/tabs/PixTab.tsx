
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface PixTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PixTab({ form }: PixTabProps) {
  return (
    <TabsContent value="pix" className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações do PIX</h3>
        <p className="text-sm text-muted-foreground">
          Configure os detalhes do pagamento via PIX, incluindo chave, mensagens e aparência.
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-2">
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
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
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
      </div>
      
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
      
      <Separator />
      
      <div>
        <h3 className="text-md font-medium mb-4">Personalização da Página de Pagamento PIX</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="pixTitulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Seção PIX</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Aqui está o PIX copia e cola" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pixSubtitulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtítulo da Seção PIX</FormLabel>
                <FormControl>
                  <Input placeholder="Instrução para copiar o código" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mt-4">
          <FormField
            control={form.control}
            name="pixTimerTexto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto do Temporizador</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Faltam {minutos}:{segundos} para expirar" {...field} />
                </FormControl>
                <FormDescription>
                  Use {minutos} e {segundos} para inserir o tempo restante.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pixBotaoTexto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto do Botão de Confirmação</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Confirmar pagamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mt-4">
          <FormField
            control={form.control}
            name="pixMostrarProduto"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                <div>
                  <FormLabel className="text-base">Mostrar Resumo da Compra</FormLabel>
                  <FormDescription>
                    Exibe os detalhes do produto na página de pagamento
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pixMostrarTermos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                <div>
                  <FormLabel className="text-base">Mostrar Termos e Rodapé</FormLabel>
                  <FormDescription>
                    Exibe os links de termos e o rodapé na página
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="pixSegurancaTexto"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Texto de Segurança</FormLabel>
              <FormControl>
                <Textarea placeholder="Mensagem sobre a segurança do pagamento PIX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  );
}
