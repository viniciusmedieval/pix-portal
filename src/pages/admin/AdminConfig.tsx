
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getConfig, criarOuAtualizarConfig } from '@/services/configService';
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  // Basic info
  backgroundColor: z.string().optional(),
  buttonColor: z.string().optional(),
  buttonText: z.string().optional(),
  
  // PIX settings
  pixMessage: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  pixKey: z.string().optional(),
  expirationTime: z.coerce.number().min(1).default(15).optional(),
  beneficiaryName: z.string().optional(),
  
  // Display toggles
  showTestimonials: z.boolean().default(true).optional(),
  showVisitorCounter: z.boolean().default(true).optional(),
  showHeader: z.boolean().default(true).optional(),
  showFooter: z.boolean().default(true).optional(),
  
  // Timer settings
  timerEnabled: z.boolean().default(false).optional(),
  timerMinutes: z.coerce.number().min(1).default(15).optional(),
  timerText: z.string().optional(),
  timerBgColor: z.string().optional(),
  timerTextColor: z.string().optional(),
  
  // Promo settings
  discountBadgeEnabled: z.boolean().default(false).optional(),
  discountBadgeText: z.string().optional(),
  discountAmount: z.coerce.number().min(0).default(0).optional(),
  originalPrice: z.coerce.number().min(0).nullable().optional(),
  
  // Content settings
  headerMessage: z.string().optional(),
  headerBgColor: z.string().optional(),
  headerTextColor: z.string().optional(),
  footerText: z.string().optional(),
  testimonialsTitle: z.string().optional(),
  
  // Security
  blockedCpfs: z.string().optional(),
});

export default function AdminConfig() {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  const [configData, setConfigData] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backgroundColor: '#ffffff',
      buttonColor: '#30b968',
      buttonText: 'Finalizar Compra',
      pixMessage: '',
      qrCodeUrl: '',
      pixKey: '',
      expirationTime: 15,
      beneficiaryName: '',
      showTestimonials: true,
      showVisitorCounter: true,
      showHeader: true,
      showFooter: true,
      timerEnabled: false,
      timerMinutes: 15,
      timerText: 'Oferta expira em:',
      timerBgColor: '#000000',
      timerTextColor: '#ffffff',
      discountBadgeEnabled: false,
      discountBadgeText: 'Oferta especial',
      discountAmount: 0,
      headerMessage: 'Tempo restante! Garanta sua oferta',
      headerBgColor: '#df2020',
      headerTextColor: '#ffffff',
      footerText: 'Todos os direitos reservados © 2023',
      testimonialsTitle: 'O que dizem nossos clientes',
      blockedCpfs: '',
    },
  });

  useEffect(() => {
    if (productId) {
      getConfig(productId)
        .then(data => {
          setConfigData(data);
          if (data) {
            form.reset({
              backgroundColor: data.cor_fundo || '#ffffff',
              buttonColor: data.cor_botao || '#30b968',
              buttonText: data.texto_botao || 'Finalizar Compra',
              pixMessage: data.mensagem_pix || '',
              qrCodeUrl: data.qr_code || '',
              pixKey: data.chave_pix || '',
              expirationTime: data.tempo_expiracao || 15,
              beneficiaryName: data.nome_beneficiario || '',
              showTestimonials: data.exibir_testemunhos !== false,
              showVisitorCounter: data.numero_aleatorio_visitas !== false,
              showHeader: data.show_header !== false,
              showFooter: data.show_footer !== false,
              timerEnabled: data.timer_enabled || false,
              timerMinutes: data.timer_minutes || 15,
              timerText: data.timer_text || 'Oferta expira em:',
              timerBgColor: data.timer_bg_color || '#000000',
              timerTextColor: data.timer_text_color || '#ffffff',
              discountBadgeEnabled: data.discount_badge_enabled || false,
              discountBadgeText: data.discount_badge_text || 'Oferta especial',
              discountAmount: data.discount_amount || 0,
              originalPrice: data.original_price || null,
              headerMessage: data.header_message || 'Tempo restante! Garanta sua oferta',
              headerBgColor: data.header_bg_color || '#df2020',
              headerTextColor: data.header_text_color || '#ffffff',
              footerText: data.footer_text || 'Todos os direitos reservados © 2023',
              testimonialsTitle: data.testimonials_title || 'O que dizem nossos clientes',
              blockedCpfs: data.bloquear_cpfs?.join(", ") || '',
            });
          }
        })
        .catch(error => {
          console.error("Error fetching config:", error);
          toast({
            title: "Erro ao carregar configuração",
            description: "Ocorreu um erro ao carregar os dados da configuração.",
            variant: "destructive",
          });
        });
    }
  }, [productId, form]);

  const handleSaveConfig = async (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      const configData = {
        produto_id: productId as string,
        cor_fundo: data.backgroundColor,
        cor_botao: data.buttonColor,
        texto_botao: data.buttonText,
        mensagem_pix: data.pixMessage,
        qr_code: data.qrCodeUrl,
        chave_pix: data.pixKey,
        exibir_testemunhos: data.showTestimonials,
        numero_aleatorio_visitas: data.showVisitorCounter,
        bloquear_cpfs: data.blockedCpfs?.split(",").map(cpf => cpf.trim()) || [],
        tempo_expiracao: data.expirationTime,
        nome_beneficiario: data.beneficiaryName,
        timer_enabled: data.timerEnabled,
        timer_minutes: data.timerMinutes,
        timer_text: data.timerText,
        timer_bg_color: data.timerBgColor,
        timer_text_color: data.timerTextColor,
        discount_badge_enabled: data.discountBadgeEnabled,
        discount_badge_text: data.discountBadgeText,
        discount_amount: data.discountAmount,
        original_price: data.originalPrice,
        header_message: data.headerMessage,
        header_bg_color: data.headerBgColor,
        header_text_color: data.headerTextColor,
        show_header: data.showHeader,
        show_footer: data.showFooter,
        footer_text: data.footerText,
        testimonials_title: data.testimonialsTitle,
      };

      await criarOuAtualizarConfig(configData);

      toast({
        title: "Configuração salva!",
        description: "As configurações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving config:", error);
      toast({
        title: "Erro ao salvar configuração",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveConfig)} className="space-y-6">
            <Tabs defaultValue="appearance">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="appearance">Aparência</TabsTrigger>
                <TabsTrigger value="pix">PIX</TabsTrigger>
                <TabsTrigger value="display">Visibilidade</TabsTrigger>
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
              </TabsList>
              
              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6">
                <h3 className="text-lg font-medium">Configurações de Aparência</h3>
                
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor de Fundo</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input type="color" className="w-12 h-10 p-1" {...field} />
                          <Input placeholder="Cor de fundo (ex: #ffffff)" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Cor de fundo da página de checkout.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="buttonColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor do Botão</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input type="color" className="w-12 h-10 p-1" {...field} />
                          <Input placeholder="Cor do botão (ex: #30b968)" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Cor do botão de compra.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto do Botão</FormLabel>
                      <FormControl>
                        <Input placeholder="Texto do botão (ex: Finalizar Compra)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Texto exibido no botão de compra.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <h3 className="text-lg font-medium">Configurações do Cabeçalho</h3>
                
                <FormField
                  control={form.control}
                  name="headerBgColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor de Fundo do Cabeçalho</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input type="color" className="w-12 h-10 p-1" {...field} />
                          <Input placeholder="Cor do cabeçalho (ex: #df2020)" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="headerTextColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor do Texto do Cabeçalho</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input type="color" className="w-12 h-10 p-1" {...field} />
                          <Input placeholder="Cor do texto (ex: #ffffff)" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <h3 className="text-lg font-medium">Configurações do Cronômetro</h3>
                
                <FormField
                  control={form.control}
                  name="timerEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Ativar Cronômetro</FormLabel>
                        <FormDescription>
                          Exibir um cronômetro de contagem regressiva.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                          <FormLabel>Duração do Cronômetro (minutos)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timerText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto do Cronômetro</FormLabel>
                          <FormControl>
                            <Input placeholder="Texto exibido junto ao cronômetro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="timerBgColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cor de Fundo do Cronômetro</FormLabel>
                            <FormControl>
                              <div className="flex gap-2 items-center">
                                <Input type="color" className="w-12 h-10 p-1" {...field} />
                                <Input placeholder="Cor de fundo" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="timerTextColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cor do Texto do Cronômetro</FormLabel>
                            <FormControl>
                              <div className="flex gap-2 items-center">
                                <Input type="color" className="w-12 h-10 p-1" {...field} />
                                <Input placeholder="Cor do texto" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
                
                <Separator />
                
                <h3 className="text-lg font-medium">Configurações de Promoção</h3>
                
                <FormField
                  control={form.control}
                  name="discountBadgeEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Ativar Selo de Desconto</FormLabel>
                        <FormDescription>
                          Exibir um selo de oferta especial na página.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch('discountBadgeEnabled') && (
                  <>
                    <FormField
                      control={form.control}
                      name="discountBadgeText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto do Selo de Desconto</FormLabel>
                          <FormControl>
                            <Input placeholder="Texto do selo de desconto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="discountAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor do Desconto</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Valor do desconto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field: { value, onChange, ...rest }}) => (
                        <FormItem>
                          <FormLabel>Preço Original</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Preço original" 
                              value={value === null ? '' : value}
                              onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
                              {...rest}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </TabsContent>
              
              {/* PIX Tab */}
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
              
              {/* Display Tab */}
              <TabsContent value="display" className="space-y-6">
                <h3 className="text-lg font-medium">Configurações de Visibilidade</h3>
                
                <FormField
                  control={form.control}
                  name="showHeader"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir Cabeçalho</FormLabel>
                        <FormDescription>
                          Mostrar a faixa de cabeçalho no topo da página.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="showFooter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir Rodapé</FormLabel>
                        <FormDescription>
                          Mostrar informações de rodapé na parte inferior da página.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="showTestimonials"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir Depoimentos</FormLabel>
                        <FormDescription>
                          Mostrar depoimentos de clientes na página.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="showVisitorCounter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir Contador de Visitantes</FormLabel>
                        <FormDescription>
                          Mostrar número de pessoas visualizando a página.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <h3 className="text-lg font-medium">Configurações de Conteúdo</h3>
                
                <FormField
                  control={form.control}
                  name="headerMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem do Cabeçalho</FormLabel>
                      <FormControl>
                        <Input placeholder="Mensagem exibida no cabeçalho" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="footerText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto do Rodapé</FormLabel>
                      <FormControl>
                        <Input placeholder="Texto exibido no rodapé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="testimonialsTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título da Seção de Depoimentos</FormLabel>
                      <FormControl>
                        <Input placeholder="Título para a seção de depoimentos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <h3 className="text-lg font-medium">Configurações de Segurança</h3>
                
                <FormField
                  control={form.control}
                  name="blockedCpfs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPFs Bloqueados</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Lista de CPFs bloqueados, separados por vírgula"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Lista de CPFs que não podem realizar a compra.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
