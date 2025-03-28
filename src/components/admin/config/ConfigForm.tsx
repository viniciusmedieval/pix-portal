
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getConfig, criarOuAtualizarConfig } from '@/services/configService';

// Esquema de validação do formulário
const formSchema = z.object({
  backgroundColor: z.string().optional(),
  buttonColor: z.string().optional(),
  buttonText: z.string().optional(),
  pixMessage: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  pixKey: z.string().optional(),
  beneficiaryName: z.string().optional(),
  showTestimonials: z.boolean().default(true),
  showVisitorCounter: z.boolean().default(true),
  showHeader: z.boolean().default(true),
  showFooter: z.boolean().default(true),
  timerEnabled: z.boolean().default(false),
  timerMinutes: z.coerce.number().min(1).default(15),
  timerText: z.string().optional(),
  timerBgColor: z.string().optional(),
  timerTextColor: z.string().optional(),
  discountBadgeEnabled: z.boolean().default(false),
  discountBadgeText: z.string().optional(),
  discountAmount: z.coerce.number().default(0),
  originalPrice: z.coerce.number().optional().nullable(),
  headerMessage: z.string().optional(),
  headerBgColor: z.string().optional(),
  headerTextColor: z.string().optional(),
  footerText: z.string().optional(),
  testimonialsTitle: z.string().optional(),
  blockedCpfs: z.string().optional(),
  expirationTime: z.coerce.number().min(1).default(15),
});

export function ConfigForm() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backgroundColor: '#ffffff',
      buttonColor: '#30b968',
      buttonText: 'Finalizar Compra',
      pixMessage: '',
      qrCodeUrl: '',
      pixKey: '',
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
      originalPrice: null,
      headerMessage: 'Tempo restante! Garanta sua oferta',
      headerBgColor: '#df2020',
      headerTextColor: '#ffffff',
      footerText: 'Todos os direitos reservados © 2023',
      testimonialsTitle: 'O que dizem nossos clientes',
      expirationTime: 15,
      blockedCpfs: '',
    },
  });

  useEffect(() => {
    if (productId) {
      getConfig(productId)
        .then(data => {
          if (data) {
            form.reset({
              backgroundColor: data.cor_fundo || '#ffffff',
              buttonColor: data.cor_botao || '#30b968',
              buttonText: data.texto_botao || 'Finalizar Compra',
              pixMessage: data.mensagem_pix || '',
              qrCodeUrl: data.qr_code || '',
              pixKey: data.chave_pix || '',
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
              expirationTime: data.tempo_expiracao || 15,
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
    if (!productId) return;
    
    setIsSaving(true);
    try {
      const configData = {
        produto_id: productId,
        cor_fundo: data.backgroundColor,
        cor_botao: data.buttonColor,
        texto_botao: data.buttonText,
        mensagem_pix: data.pixMessage,
        qr_code: data.qrCodeUrl,
        chave_pix: data.pixKey,
        nome_beneficiario: data.beneficiaryName,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSaveConfig)} className="space-y-6">
        <Tabs defaultValue="appearance">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="header">Cabeçalho</TabsTrigger>
            <TabsTrigger value="product">Produto</TabsTrigger>
            <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor de Fundo</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input type="color" className="w-12 h-10 p-1" {...field} />
                          <Input {...field} placeholder="Cor de fundo (ex: #f0f0f0)" />
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
                    <FormItem className="mt-4">
                      <FormLabel>Cor do Botão</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input type="color" className="w-12 h-10 p-1" {...field} />
                          <Input {...field} placeholder="Cor do botão (ex: #30b968)" />
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
                    <FormItem className="mt-4">
                      <FormLabel>Texto do Botão</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Texto do botão (ex: Comprar agora)" />
                      </FormControl>
                      <FormDescription>
                        Texto exibido no botão de compra.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="showVisitorCounter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir Contador de Visitas</FormLabel>
                        <FormDescription>
                          Exibir contador de visitantes na página de checkout.
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="header" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="showHeader"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir Cabeçalho</FormLabel>
                        <FormDescription>
                          Mostrar a barra de cabeçalho no topo da página.
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
                  name="headerMessage"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Mensagem do Cabeçalho</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Mensagem do cabeçalho" />
                      </FormControl>
                      <FormDescription>
                        Mensagem exibida na barra de cabeçalho.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="headerBgColor"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Cor de Fundo do Cabeçalho</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input type="color" className="w-12 h-10 p-1" {...field} />
                          <Input {...field} placeholder="Cor de fundo (ex: #df2020)" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Cor de fundo da barra de cabeçalho.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="headerTextColor"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Cor do Texto do Cabeçalho</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input type="color" className="w-12 h-10 p-1" {...field} />
                          <Input {...field} placeholder="Cor do texto (ex: #ffffff)" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Cor do texto na barra de cabeçalho.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="product" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="discountBadgeEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir Badge de Desconto</FormLabel>
                        <FormDescription>
                          Mostrar um badge indicando desconto no produto.
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
                  name="discountBadgeText"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Texto do Badge de Desconto</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Texto do badge (ex: Oferta especial)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discountAmount"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Valor do Desconto (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Valor do desconto em reais.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Preço Original (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormDescription>
                        Preço original antes do desconto.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="testimonials" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="showTestimonials"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exibir Depoimentos</FormLabel>
                        <FormDescription>
                          Mostrar depoimentos de clientes na página de checkout.
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
                  name="testimonialsTitle"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Título da Seção de Depoimentos</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Título dos depoimentos" />
                      </FormControl>
                      <FormDescription>
                        Título exibido acima dos depoimentos.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="blockedCpfs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPFs Bloqueados</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Lista de CPFs bloqueados, separados por vírgula"
                          className="resize-none"
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Lista de CPFs que não podem realizar a compra.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
