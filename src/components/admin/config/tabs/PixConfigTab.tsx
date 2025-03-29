
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCard, 
  QrCode, 
  User, 
  Clock, 
  Mail,
  Key,
  Check,
  Info,
  FileText,
  Link as LinkIcon
} from 'lucide-react';

interface PixConfigTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PixConfigTab({ form }: PixConfigTabProps) {
  return (
    <TabsContent value="pixConfig" className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações do PIX</h3>
        <p className="text-sm text-gray-500">
          Configure os dados principais do seu PIX para pagamentos.
        </p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Dados do PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <FormField
              control={form.control}
              name="pixKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave PIX (Código Copia e Cola)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Cole aqui o código PIX copia e cola"
                      className="min-h-[120px] font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    Cole o código PIX completo gerado pelo seu banco ou gateway de pagamento.
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
                    <Input {...field} placeholder="Nome completo do recebedor" />
                  </FormControl>
                  <FormDescription>
                    Nome que aparecerá como recebedor do pagamento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="qrCodeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem do QR Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://exemplo.com/qrcode.png" />
                  </FormControl>
                  <FormDescription>
                    URL da imagem do QR Code para pagamento PIX.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Configurações de Tempo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <FormField
              control={form.control}
              name="expirationTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo de Expiração (minutos)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      placeholder="15"
                    />
                  </FormControl>
                  <FormDescription>
                    Tempo em minutos até o pagamento expirar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pixTimerTexto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto do Cronômetro</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Faltam {minutos}:{segundos} para o pagamento expirar..."
                    />
                  </FormControl>
                  <FormDescription>
                    Texto do cronômetro. Use {"{minutos}"} e {"{segundos}"} como placeholders.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Botão e Redirecionamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
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
            name="pixRedirectUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de Redirecionamento após Confirmação</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://exemplo.com/obrigado" type="url" />
                </FormControl>
                <FormDescription>
                  URL para redirecionar o cliente após clicar no botão de confirmar pagamento. Deixe em branco para o comportamento padrão.
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Textos da Página PIX
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <FormField
            control={form.control}
            name="pixTitulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título Principal</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Pagamento via PIX" />
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
                <FormLabel>Subtítulo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Copie o código ou use o QR Code para realizar o pagamento" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pixSegurancaTexto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto de Segurança</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Os bancos reforçaram a segurança do Pix..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pixCompraTitulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Seção de Compra</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Sua Compra" />
                </FormControl>
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
                  <Input {...field} placeholder="Saiba mais sobre PIX" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pixInstrucoesTitulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título das Instruções</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Para realizar o pagamento:" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
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
