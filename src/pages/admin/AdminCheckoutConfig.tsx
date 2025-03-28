
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckoutCustomizationType } from '@/types/checkoutConfig';
import { getCheckoutCustomization, saveCheckoutCustomization } from '@/services/checkoutCustomizationService';
import { getProdutos } from '@/services/produtoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { Plus, Trash, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminCheckoutConfig() {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [productId, setProductId] = useState<string>(id || '');
  const [formData, setFormData] = useState<Omit<CheckoutCustomizationType, 'produto_id'>>({
    benefits: [],
    faqs: [],
    show_guarantees: true,
    guarantee_days: 7,
    show_benefits: true,
    show_faq: true,
    show_header: true,
    show_footer: true,
    show_testimonials: true,
    show_payment_options: true,
    payment_methods: ["pix", "cartao"],
    payment_info_title: "Informações de Pagamento",
    testimonials_title: "O que dizem nossos clientes",
    cta_text: "Comprar agora"
  });
  
  const [configData, setConfigData] = useState({
    exibir_testemunhos: true,
    numero_aleatorio_visitas: true,
    cor_fundo: '#f9fafb',
    chave_pix: '',
    timer_enabled: false,
    timer_minutes: 15,
    timer_text: 'Oferta expira em:',
    discount_badge_enabled: false,
    discount_badge_text: 'Oferta especial',
    discount_amount: 0,
    original_price: 0,
    payment_security_text: 'Pagamento 100% seguro',
    texto_botao: 'Comprar agora',
    cor_botao: '#22c55e'
  });
  
  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => getProdutos(),
  });
  
  // Fetch customization data
  const { data: customization, isLoading: isCustomizationLoading } = useQuery({
    queryKey: ['checkout-customization', productId],
    queryFn: () => getCheckoutCustomization(productId),
    enabled: !!productId,
  });
  
  // Fetch config data
  const { data: config, isLoading: isConfigLoading } = useQuery({
    queryKey: ['checkout-config', productId],
    queryFn: () => productId ? getConfig(productId) : null,
    enabled: !!productId,
  });
  
  const saveMutation = useMutation({
    mutationFn: (data: CheckoutCustomizationType) => saveCheckoutCustomization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['checkout-customization']});
      toast({
        title: "Sucesso",
        description: "Configurações de checkout salvas com sucesso!",
      });
    },
    onError: (error) => {
      console.error("Error saving customization:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Update form data when customization data changes
  useEffect(() => {
    if (customization) {
      setFormData({
        id: customization.id,
        benefits: customization.benefits || [],
        faqs: customization.faqs || [],
        show_guarantees: customization.show_guarantees,
        guarantee_days: customization.guarantee_days || 7,
        show_benefits: customization.show_benefits,
        show_faq: customization.show_faq,
        header_message: customization.header_message,
        footer_text: customization.footer_text,
        payment_info_title: customization.payment_info_title,
        testimonials_title: customization.testimonials_title,
        cta_text: customization.cta_text,
        custom_css: customization.custom_css,
        show_header: customization.show_header,
        show_footer: customization.show_footer,
        show_testimonials: customization.show_testimonials,
        show_payment_options: customization.show_payment_options,
        payment_methods: customization.payment_methods
      });
    }
  }, [customization]);
  
  // Update config data when config data changes
  useEffect(() => {
    if (config) {
      setConfigData({
        exibir_testemunhos: config.exibir_testemunhos ?? true,
        numero_aleatorio_visitas: config.numero_aleatorio_visitas ?? true,
        cor_fundo: config.cor_fundo || '#f9fafb',
        chave_pix: config.chave_pix || '',
        timer_enabled: config.timer_enabled ?? false,
        timer_minutes: config.timer_minutes || 15,
        timer_text: config.timer_text || 'Oferta expira em:',
        discount_badge_enabled: config.discount_badge_enabled ?? false,
        discount_badge_text: config.discount_badge_text || 'Oferta especial',
        discount_amount: config.discount_amount || 0,
        original_price: config.original_price || 0,
        payment_security_text: config.payment_security_text || 'Pagamento 100% seguro',
        texto_botao: config.texto_botao || 'Comprar agora',
        cor_botao: config.cor_botao || '#22c55e'
      });
    }
  }, [config]);
  
  const handleProductChange = (value: string) => {
    setProductId(value);
    navigate(`/admin/checkout-config/${value}`);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) {
      toast({
        title: "Erro",
        description: "Selecione um produto para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    const customizationData: CheckoutCustomizationType = {
      ...formData,
      produto_id: productId,
    };
    
    saveMutation.mutate(customizationData);
    
    // Save config data
    saveConfig({
      produto_id: productId,
      ...configData
    });
  };
  
  // Helper functions for managing benefits and FAQs
  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, { text: "" }],
    }));
  };
  
  const updateBenefit = (index: number, text: string) => {
    const updatedBenefits = [...formData.benefits];
    updatedBenefits[index] = { ...updatedBenefits[index], text };
    setFormData(prev => ({ ...prev, benefits: updatedBenefits }));
  };
  
  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };
  
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };
  
  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
  };
  
  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    if (checked && !formData.payment_methods?.includes(method)) {
      setFormData(prev => ({
        ...prev,
        payment_methods: [...(prev.payment_methods || []), method]
      }));
    } else if (!checked && formData.payment_methods?.includes(method)) {
      setFormData(prev => ({
        ...prev,
        payment_methods: prev.payment_methods?.filter(m => m !== method) || []
      }));
    }
  };
  
  // Mock function for saving config data (you'll need to implement this)
  const saveConfig = async (configData: any) => {
    // Implement this function to save config data to the backend
    console.log('Saving config data:', configData);
    toast({
      title: "Sucesso",
      description: "Configurações de checkout salvas com sucesso!",
    });
  };
  
  // Loading state
  if (isCustomizationLoading || isConfigLoading) {
    return (
      <div className="container py-6">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Personalização do Checkout</h1>
          <p className="text-gray-500">Configure os elementos da página de checkout</p>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={saveMutation.isPending || !productId}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saveMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Selecione um produto</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={productId} onValueChange={handleProductChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        {productId && (
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="benefits">Benefícios</TabsTrigger>
              <TabsTrigger value="payment">Pagamento</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="advanced">Avançado</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparência do Checkout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cor_fundo">Cor de fundo</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="cor_fundo" 
                            value={configData.cor_fundo} 
                            onChange={(e) => setConfigData(prev => ({ ...prev, cor_fundo: e.target.value }))} 
                          />
                          <div 
                            className="w-10 h-10 rounded-md border"
                            style={{ backgroundColor: configData.cor_fundo }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cor_botao">Cor do botão</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="cor_botao" 
                            value={configData.cor_botao} 
                            onChange={(e) => setConfigData(prev => ({ ...prev, cor_botao: e.target.value }))} 
                          />
                          <div 
                            className="w-10 h-10 rounded-md border"
                            style={{ backgroundColor: configData.cor_botao }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show_header">Exibir cabeçalho</Label>
                        <Switch 
                          id="show_header" 
                          checked={formData.show_header} 
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_header: checked }))} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show_footer">Exibir rodapé</Label>
                        <Switch 
                          id="show_footer" 
                          checked={formData.show_footer} 
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_footer: checked }))} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="timer_enabled">Exibir contador regressivo</Label>
                        <Switch 
                          id="timer_enabled" 
                          checked={configData.timer_enabled} 
                          onCheckedChange={(checked) => setConfigData(prev => ({ ...prev, timer_enabled: checked }))} 
                        />
                      </div>
                      
                      {configData.timer_enabled && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-1">
                            <Label htmlFor="timer_minutes">Minutos</Label>
                            <Input 
                              id="timer_minutes" 
                              type="number" 
                              min={1}
                              value={configData.timer_minutes}
                              onChange={(e) => setConfigData(prev => ({ ...prev, timer_minutes: parseInt(e.target.value) }))} 
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="timer_text">Texto</Label>
                            <Input 
                              id="timer_text" 
                              value={configData.timer_text}
                              onChange={(e) => setConfigData(prev => ({ ...prev, timer_text: e.target.value }))} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="numero_aleatorio_visitas">Exibir contador de visitantes</Label>
                        <Switch 
                          id="numero_aleatorio_visitas" 
                          checked={configData.numero_aleatorio_visitas} 
                          onCheckedChange={(checked) => setConfigData(prev => ({ ...prev, numero_aleatorio_visitas: checked }))} 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle>Conteúdo do Checkout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="header_message">Mensagem do cabeçalho</Label>
                      <Input 
                        id="header_message" 
                        value={formData.header_message || ''} 
                        onChange={(e) => setFormData(prev => ({ ...prev, header_message: e.target.value }))} 
                        placeholder="Ex: Oferta por tempo limitado!"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="footer_text">Texto do rodapé</Label>
                      <Input 
                        id="footer_text" 
                        value={formData.footer_text || ''} 
                        onChange={(e) => setFormData(prev => ({ ...prev, footer_text: e.target.value }))} 
                        placeholder="Ex: © 2023 Todos os direitos reservados"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cta_text">Texto do botão de compra</Label>
                      <Input 
                        id="cta_text" 
                        value={formData.cta_text || ''} 
                        onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))} 
                        placeholder="Ex: Comprar agora"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="payment_security_text">Texto de segurança de pagamento</Label>
                      <Input 
                        id="payment_security_text" 
                        value={configData.payment_security_text} 
                        onChange={(e) => setConfigData(prev => ({ ...prev, payment_security_text: e.target.value }))} 
                        placeholder="Ex: Pagamento 100% seguro"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="discount_badge_enabled">Exibir badge de desconto</Label>
                        <Switch 
                          id="discount_badge_enabled" 
                          checked={configData.discount_badge_enabled} 
                          onCheckedChange={(checked) => setConfigData(prev => ({ ...prev, discount_badge_enabled: checked }))} 
                        />
                      </div>
                      
                      {configData.discount_badge_enabled && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-1">
                            <Label htmlFor="discount_badge_text">Texto do badge</Label>
                            <Input 
                              id="discount_badge_text" 
                              value={configData.discount_badge_text}
                              onChange={(e) => setConfigData(prev => ({ ...prev, discount_badge_text: e.target.value }))} 
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="discount_amount">Valor do desconto</Label>
                            <Input 
                              id="discount_amount" 
                              type="number"
                              value={configData.discount_amount}
                              onChange={(e) => setConfigData(prev => ({ ...prev, discount_amount: parseFloat(e.target.value) }))} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="benefits">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Benefícios</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.show_benefits}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, show_benefits: checked }))
                        }
                        id="show-benefits"
                      />
                      <Label htmlFor="show-benefits">Exibir benefícios</Label>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {formData.show_benefits && (
                      <div className="space-y-4">
                        <div className="grid gap-4">
                          {formData.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={benefit.text}
                                onChange={(e) => updateBenefit(index, e.target.value)}
                                placeholder="Descrição do benefício"
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBenefit(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={addBenefit}
                          className="w-full flex items-center justify-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Adicionar benefício
                        </Button>
                        
                        <div className="space-y-2 p-4 border rounded-md mt-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show_guarantees">Exibir garantia</Label>
                            <Switch 
                              id="show_guarantees" 
                              checked={formData.show_guarantees} 
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_guarantees: checked }))} 
                            />
                          </div>
                          
                          {formData.show_guarantees && (
                            <div className="mt-2">
                              <Label htmlFor="guarantee_days">Dias de garantia</Label>
                              <Input 
                                id="guarantee_days" 
                                type="number" 
                                min={1}
                                value={formData.guarantee_days}
                                onChange={(e) => setFormData(prev => ({ ...prev, guarantee_days: parseInt(e.target.value) }))} 
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment_info_title">Título da seção de pagamento</Label>
                      <Input 
                        id="payment_info_title" 
                        value={formData.payment_info_title || ''} 
                        onChange={(e) => setFormData(prev => ({ ...prev, payment_info_title: e.target.value }))} 
                        placeholder="Ex: Pagamento"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show_payment_options">Exibir opções de pagamento</Label>
                        <Switch 
                          id="show_payment_options" 
                          checked={formData.show_payment_options} 
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_payment_options: checked }))} 
                        />
                      </div>
                      
                      {formData.show_payment_options && (
                        <div className="space-y-2 mt-2 p-4 border rounded-md">
                          <Label>Métodos de pagamento disponíveis</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center space-x-2">
                              <input 
                                type="checkbox"
                                id="payment_pix"
                                checked={formData.payment_methods?.includes('pix')}
                                onChange={(e) => handlePaymentMethodChange('pix', e.target.checked)}
                              />
                              <Label htmlFor="payment_pix">PIX</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input 
                                type="checkbox"
                                id="payment_cartao"
                                checked={formData.payment_methods?.includes('cartao')}
                                onChange={(e) => handlePaymentMethodChange('cartao', e.target.checked)}
                              />
                              <Label htmlFor="payment_cartao">Cartão de crédito</Label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chave_pix">Chave PIX</Label>
                      <Input 
                        id="chave_pix" 
                        value={configData.chave_pix} 
                        onChange={(e) => setConfigData(prev => ({ ...prev, chave_pix: e.target.value }))} 
                        placeholder="Ex: email@exemplo.com"
                      />
                      <p className="text-sm text-gray-500">
                        A chave PIX que será usada para receber pagamentos.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faqs">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Perguntas Frequentes</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.show_faq}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, show_faq: checked }))
                        }
                        id="show-faq"
                      />
                      <Label htmlFor="show-faq">Exibir FAQ</Label>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {formData.show_faq && (
                      <div className="space-y-6">
                        {formData.faqs.map((faq, index) => (
                          <div key={index} className="space-y-2 border p-4 rounded-md">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">Pergunta #{index + 1}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFaq(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor={`question-${index}`}>Pergunta</Label>
                                <Input
                                  id={`question-${index}`}
                                  value={faq.question}
                                  onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                  placeholder="Digite a pergunta"
                                  className="mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`answer-${index}`}>Resposta</Label>
                                <Textarea
                                  id={`answer-${index}`}
                                  value={faq.answer}
                                  onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                  placeholder="Digite a resposta"
                                  className="mt-1 min-h-[100px]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          onClick={addFaq}
                          className="w-full flex items-center justify-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Adicionar pergunta
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Avançadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show_testimonials">Exibir depoimentos</Label>
                        <Switch 
                          id="show_testimonials" 
                          checked={formData.show_testimonials} 
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_testimonials: checked }))} 
                        />
                      </div>
                      
                      {formData.show_testimonials && (
                        <div className="space-y-2 mt-2">
                          <Label htmlFor="testimonials_title">Título da seção de depoimentos</Label>
                          <Input 
                            id="testimonials_title" 
                            value={formData.testimonials_title || ''} 
                            onChange={(e) => setFormData(prev => ({ ...prev, testimonials_title: e.target.value }))} 
                            placeholder="Ex: O que dizem nossos clientes"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom_css">CSS personalizado</Label>
                      <Textarea
                        id="custom_css"
                        value={formData.custom_css || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, custom_css: e.target.value }))}
                        placeholder="/* Adicione seu CSS personalizado aqui */"
                        className="min-h-[200px] font-mono"
                      />
                      <p className="text-sm text-gray-500">
                        Use CSS personalizado para customizar ainda mais a aparência do checkout.
                        Cuidado com alterações que possam quebrar o layout.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}
