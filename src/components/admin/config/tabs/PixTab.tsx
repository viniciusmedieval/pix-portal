
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface PixTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PixTab({ form }: PixTabProps) {
  return (
    <TabsContent value="pix" className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Personalização da Página PIX</h3>
        <p className="text-sm text-gray-500">
          Personalize a aparência e o conteúdo da página de pagamento PIX.
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="text-md font-medium">Títulos e Instruções</h4>
        
        <FormField
          control={form.control}
          name="pixTitulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título Principal</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Título da página PIX" />
              </FormControl>
              <FormDescription>
                Título principal exibido na página de pagamento PIX.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pixSubtitulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtítulo / Instruções</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Instruções para o cliente sobre como realizar o pagamento"
                  className="resize-none"
                  rows={2}
                />
              </FormControl>
              <FormDescription>
                Instruções exibidas abaixo do título principal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pixInstrucoesTitulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da Seção de Instruções</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Para realizar o pagamento:" />
              </FormControl>
              <FormDescription>
                Título da seção que contém as instruções detalhadas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="text-md font-medium">Textos do Cronômetro e Botões</h4>
        
        <FormField
          control={form.control}
          name="pixTimerTexto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto do Cronômetro</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Faltam {minutos}:{segundos} minutos para o pagamento expirar..."
                />
              </FormControl>
              <FormDescription>
                Texto do cronômetro. Use {"{minutos}"} e {"{segundos}"} como placeholders.
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
                <Input {...field} placeholder="Confirmar pagamento" />
              </FormControl>
              <FormDescription>
                Texto exibido no botão de confirmação de pagamento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pixTextoCopied"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto ao Copiar o Código PIX</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Código copiado!" />
              </FormControl>
              <FormDescription>
                Mensagem exibida quando o cliente copia o código PIX.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="text-md font-medium">Informações Adicionais</h4>
        
        <FormField
          control={form.control}
          name="pixSegurancaTexto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto sobre Segurança</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Texto informativo sobre segurança do pagamento"
                  className="resize-none"
                  rows={2}
                />
              </FormControl>
              <FormDescription>
                Texto explicativo sobre a segurança do pagamento PIX.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pixCompraTitulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Resumo da Compra</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Sua Compra" />
              </FormControl>
              <FormDescription>
                Título da seção que mostra o resumo da compra.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pixSaibaMaisTexto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto do Link "Saiba Mais"</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Saiba mais" />
              </FormControl>
              <FormDescription>
                Texto para o link de informações adicionais.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="text-md font-medium">Opções de Exibição</h4>
        
        <FormField
          control={form.control}
          name="pixMostrarProduto"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Mostrar Resumo do Produto</FormLabel>
                <FormDescription>
                  Exibir as informações do produto na página de pagamento PIX.
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
          name="pixMostrarTermos"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Mostrar Termos e Condições</FormLabel>
                <FormDescription>
                  Exibir links para termos de uso e política de privacidade.
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
      </div>
    </TabsContent>
  );
}
