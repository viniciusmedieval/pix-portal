
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
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "@/components/ui/color-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckoutHeaderConfig } from '@/components/admin/checkout/CheckoutHeaderConfig';
import { CheckoutBannerConfig } from '@/components/admin/checkout/CheckoutBannerConfig';
import { CheckoutTimerConfig } from '@/components/admin/checkout/CheckoutTimerConfig';
import { CheckoutPromotionConfig } from '@/components/admin/checkout/CheckoutPromotionConfig';
import { CheckoutPixConfig } from '@/components/admin/checkout/CheckoutPixConfig';
import { CheckoutElementsConfig } from '@/components/admin/checkout/CheckoutElementsConfig';
import { CheckoutAppearanceConfig } from '@/components/admin/checkout/CheckoutAppearanceConfig';

const formSchema = z.object({
  backgroundColor: z.string().optional(),
  buttonColor: z.string().optional(),
  buttonText: z.string().optional(),
  pixMessage: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  pixKey: z.string().optional(),
  showTestimonials: z.boolean().default(false).optional(),
  showVisitorCounter: z.boolean().default(false).optional(),
  blockedCpfs: z.string().optional(),
  expirationTime: z.coerce.number().min(1).default(15).optional(),
  timerEnabled: z.boolean().default(false).optional(),
  timerMinutes: z.coerce.number().min(1).default(15).optional(),
  timerText: z.string().optional(),
  timerBgColor: z.string().optional(),
  timerTextColor: z.string().optional(),
  discountBadgeEnabled: z.boolean().default(false).optional(),
  discountBadgeText: z.string().optional(),
  discountAmount: z.coerce.number().min(0).default(0).optional(),
  originalPrice: z.coerce.number().min(0).optional().nullable(),
  paymentSecurityText: z.string().optional(),
  imagemBanner: z.string().optional(),
  bannerBgColor: z.string().optional(),
  headerMessage: z.string().optional(),
  headerBgColor: z.string().optional(),
  headerTextColor: z.string().optional(),
  showHeader: z.boolean().default(true).optional(),
});

export default function AdminCheckoutConfig() {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  const [configData, setConfigData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("appearance");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backgroundColor: '#ffffff',
      buttonColor: '#22c55e',
      buttonText: 'Comprar agora',
      pixMessage: '',
      qrCodeUrl: '',
      pixKey: '',
      showTestimonials: true,
      showVisitorCounter: true,
      blockedCpfs: '',
      expirationTime: 15,
      timerEnabled: false,
      timerMinutes: 15,
      timerText: 'Oferta expira em:',
      timerBgColor: '#000000',
      timerTextColor: '#ffffff',
      discountBadgeEnabled: true,
      discountBadgeText: 'Oferta especial',
      discountAmount: 0,
      originalPrice: null,
      paymentSecurityText: 'Pagamento 100% seguro',
      imagemBanner: '',
      bannerBgColor: '#000000',
      headerMessage: 'Tempo restante! Garanta sua oferta',
      headerBgColor: '#000000',
      headerTextColor: '#ffffff',
      showHeader: true,
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
              buttonColor: data.cor_botao || '#22c55e',
              buttonText: data.texto_botao || 'Comprar agora',
              pixMessage: data.mensagem_pix || '',
              qrCodeUrl: data.qr_code || '',
              pixKey: data.chave_pix || '',
              showTestimonials: data.exibir_testemunhos !== false,
              showVisitorCounter: data.numero_aleatorio_visitas !== false,
              blockedCpfs: data.bloquear_cpfs?.join(", ") || '',
              expirationTime: data.tempo_expiracao || 15,
              timerEnabled: data.timer_enabled || false,
              timerMinutes: data.timer_minutes || 15,
              timerText: data.timer_text || 'Oferta expira em:',
              timerBgColor: data.timer_bg_color || '#000000',
              timerTextColor: data.timer_text_color || '#ffffff',
              discountBadgeEnabled: data.discount_badge_enabled !== false,
              discountBadgeText: data.discount_badge_text || 'Oferta especial',
              discountAmount: data.discount_amount || 0,
              originalPrice: data.original_price || null,
              paymentSecurityText: data.payment_security_text || 'Pagamento 100% seguro',
              imagemBanner: data.imagem_banner || '',
              bannerBgColor: data.banner_bg_color || '#000000',
              headerMessage: data.header_message || 'Tempo restante! Garanta sua oferta',
              headerBgColor: data.header_bg_color || '#000000',
              headerTextColor: data.header_text_color || '#ffffff',
              showHeader: data.show_header !== false,
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
        timer_enabled: data.timerEnabled,
        timer_minutes: data.timerMinutes,
        timer_text: data.timerText,
        timer_bg_color: data.timerBgColor,
        timer_text_color: data.timerTextColor,
        discount_badge_enabled: data.discountBadgeEnabled,
        discount_badge_text: data.discountBadgeText,
        discount_amount: data.discountAmount,
        original_price: data.originalPrice,
        payment_security_text: data.paymentSecurityText,
        imagem_banner: data.imagemBanner,
        banner_bg_color: data.bannerBgColor,
        header_message: data.headerMessage,
        header_bg_color: data.headerBgColor,
        header_text_color: data.headerTextColor,
        show_header: data.showHeader
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
          <form onSubmit={form.handleSubmit(handleSaveConfig)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                <TabsTrigger value="appearance">Aparência</TabsTrigger>
                <TabsTrigger value="header">Cabeçalho</TabsTrigger>
                <TabsTrigger value="banner">Banner</TabsTrigger>
                <TabsTrigger value="timer">Timer</TabsTrigger>
                <TabsTrigger value="promotion">Promoção</TabsTrigger>
                <TabsTrigger value="elements">Elementos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appearance" className="space-y-6">
                <h3 className="text-lg font-medium">Aparência Geral</h3>
                
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor de Fundo</FormLabel>
                      <FormControl>
                        <ColorPicker
                          id="backgroundColor"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
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
                        <ColorPicker
                          id="buttonColor"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
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
                        <Input placeholder="Texto do botão (ex: Comprar agora)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Texto exibido no botão de compra.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="header" className="space-y-6">
                <h3 className="text-lg font-medium">Configuração do Cabeçalho</h3>
                
                <FormField
                  control={form.control}
                  name="showHeader"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Mostrar Cabeçalho</FormLabel>
                        <FormDescription>
                          Exibir a barra de cabeçalho no topo da página.
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
                
                {form.watch('showHeader') && (
                  <>
                    <FormField
                      control={form.control}
                      name="headerMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem do Cabeçalho</FormLabel>
                          <FormControl>
                            <Input placeholder="Mensagem do cabeçalho" {...field} />
                          </FormControl>
                          <FormDescription>
                            Texto exibido na barra preta no topo da página.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="headerBgColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor de Fundo do Cabeçalho</FormLabel>
                          <FormControl>
                            <ColorPicker
                              id="headerBgColor"
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
                      name="headerTextColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor do Texto do Cabeçalho</FormLabel>
                          <FormControl>
                            <ColorPicker
                              id="headerTextColor"
                              value={field.value || '#ffffff'}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="banner" className="space-y-6">
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
              </TabsContent>
              
              <TabsContent value="timer" className="space-y-6">
                <h3 className="text-lg font-medium">Timer</h3>
                
                <FormField
                  control={form.control}
                  name="timerEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir Timer</FormLabel>
                        <FormDescription>
                          Exibir contador regressivo no topo da página.
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
                
                {form.watch('timerEnabled') && (
                  <>
                    <FormField
                      control={form.control}
                      name="timerMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo (minutos)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Minutos" {...field} />
                          </FormControl>
                          <FormDescription>
                            Tempo em minutos para o contador.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timerText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto do Timer</FormLabel>
                          <FormControl>
                            <Input placeholder="Texto exibido junto ao contador" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timerBgColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor de Fundo do Timer</FormLabel>
                          <FormControl>
                            <ColorPicker
                              id="timerBgColor"
                              value={field.value || '#000000'}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            Cor de fundo da barra do contador.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timerTextColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor do Texto do Timer</FormLabel>
                          <FormControl>
                            <ColorPicker
                              id="timerTextColor"
                              value={field.value || '#ffffff'}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            Cor do texto do contador.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="promotion" className="space-y-6">
                <h3 className="text-lg font-medium">Promoção</h3>
                
                <FormField
                  control={form.control}
                  name="discountBadgeEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir Badge de Desconto</FormLabel>
                        <FormDescription>
                          Exibir badge de "Oferta Especial" no produto.
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
                
                {form.watch('discountBadgeEnabled') && (
                  <>
                    <FormField
                      control={form.control}
                      name="discountBadgeText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto do Badge</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Oferta Especial" {...field} />
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
                          <FormDescription>
                            Valor do desconto a ser aplicado ao preço original.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço Original</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Preço original (antes do desconto)" 
                              value={field.value || ''} 
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            />
                          </FormControl>
                          <FormDescription>
                            Preço original antes do desconto. Se vazio, usa o preço do produto.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="elements" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Elementos do Checkout</h3>
                    
                    <FormField
                      control={form.control}
                      name="showVisitorCounter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Exibir Contador de Visitas</FormLabel>
                            <FormDescription>
                              Exibir contador de visitantes na página de checkout.
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
                            <FormLabel>Exibir Testemunhos</FormLabel>
                            <FormDescription>
                              Exibir depoimentos de clientes na página de checkout.
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
                      name="paymentSecurityText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto de Segurança</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Texto sobre segurança do pagamento"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Texto exibido sobre a segurança do pagamento.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
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
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button type="submit" disabled={isSaving} className="mt-8">
              {isSaving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
