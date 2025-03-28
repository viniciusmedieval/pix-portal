
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckoutCustomizationType, BenefitItem, FaqItem } from '@/types/checkoutConfig';
import { getCheckoutCustomization, saveCheckoutCustomization } from '@/services/checkoutCustomizationService';
import { getProdutos } from '@/services/produtoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash, Save, Type, LayoutGrid, ShieldCheck, MessageSquare, Palette, Clock, BadgeDollarSign, FileCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

export default function AdminCheckoutCustomization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
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
  
  const [activeBenefitIndex, setActiveBenefitIndex] = useState<number | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  
  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => getProdutos(),
  });
  
  // Fetch customization for selected product
  const { data: customization, isLoading } = useQuery({
    queryKey: ['checkout-customization', productId],
    queryFn: () => getCheckoutCustomization(productId),
    enabled: !!productId,
  });
  
  // Save mutation
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
  
  // Update form when customization data changes
  useEffect(() => {
    if (customization) {
      setFormData({
        id: customization.id,
        benefits: customization.benefits || [],
        faqs: customization.faqs || [],
        show_guarantees: customization.show_guarantees,
        guarantee_days: customization.guarantee_days,
        show_benefits: customization.show_benefits,
        show_faq: customization.show_faq,
        // Novos campos
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
  
  // Handle product change
  const handleProductChange = (value: string) => {
    setProductId(value);
    navigate(`/admin/checkout-customization/${value}`);
  };
  
  // Handle form submission
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
    
    const dataToSave: CheckoutCustomizationType = {
      ...formData,
      produto_id: productId,
    };
    
    saveMutation.mutate(dataToSave);
  };
  
  // Benefits management
  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, { text: "" }],
    }));
    setActiveBenefitIndex(formData.benefits.length);
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
    setActiveBenefitIndex(null);
  };
  
  // FAQs management
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
    setActiveFaqIndex(formData.faqs.length);
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
    setActiveFaqIndex(null);
  };

  // Payment methods management
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
  
  if (isLoading) {
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
            <CardDescription>
              As configurações serão aplicadas à página de checkout deste produto
            </CardDescription>
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
          <Tabs defaultValue="benefits" className="w-full">
            <TabsLists className="w-full">
              <TabsListWrapper>
                <TabsList>
                  <TabsTrigger value="benefits" className="flex gap-1 items-center">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Benefícios</span>
                  </TabsTrigger>
                  <TabsTrigger value="faqs" className="flex gap-1 items-center">
                    <MessageSquare className="h-4 w-4" />
                    <span>Perguntas Frequentes</span>
                  </TabsTrigger>
                  <TabsTrigger value="guarantees" className="flex gap-1 items-center">
                    <BadgeDollarSign className="h-4 w-4" />
                    <span>Garantias</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex gap-1 items-center">
                    <Type className="h-4 w-4" />
                    <span>Textos</span>
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="flex gap-1 items-center">
                    <LayoutGrid className="h-4 w-4" />
                    <span>Layout</span>
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex gap-1 items-center">
                    <Clock className="h-4 w-4" />
                    <span>Pagamento</span>
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="flex gap-1 items-center">
                    <FileCode className="h-4 w-4" />
                    <span>CSS Personalizado</span>
                  </TabsTrigger>
                </TabsList>
              </TabsListWrapper>
            </TabsLists>
            
            <div className="mt-6">
              <TabsContent value="benefits">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Benefícios</CardTitle>
                      <CardDescription>
                        Adicione os principais benefícios do seu produto
                      </CardDescription>
                    </div>
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
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faqs">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Perguntas Frequentes</CardTitle>
                      <CardDescription>
                        Adicione perguntas e respostas comuns sobre seu produto
                      </CardDescription>
                    </div>
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
              
              <TabsContent value="guarantees">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Garantias</CardTitle>
                      <CardDescription>
                        Configure a garantia oferecida para o produto
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.show_guarantees}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, show_guarantees: checked }))
                        }
                        id="show-guarantees"
                      />
                      <Label htmlFor="show-guarantees">Exibir garantia</Label>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {formData.show_guarantees && (
                      <div>
                        <Label htmlFor="guarantee-days">Dias de garantia</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="guarantee-days"
                            type="number"
                            min={1}
                            value={formData.guarantee_days}
                            onChange={(e) => 
                              setFormData(prev => ({ 
                                ...prev, 
                                guarantee_days: parseInt(e.target.value) || 7 
                              }))
                            }
                            className="max-w-[120px]"
                          />
                          <span>dias</span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-2">
                          Exibirá uma mensagem informando sobre a garantia de satisfação e devolução do dinheiro
                          durante o período configurado.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="text">
                <Card>
                  <CardHeader>
                    <CardTitle>Textos</CardTitle>
                    <CardDescription>
                      Configure os textos exibidos no checkout
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="header-message">Mensagem de Cabeçalho</Label>
                      <Textarea
                        id="header-message"
                        placeholder="Ex: Você está a um passo de transformar sua vida!"
                        value={formData.header_message || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, header_message: e.target.value }))}
                      />
                      <p className="text-sm text-muted-foreground">Mensagem exibida no topo da página de checkout</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cta-text">Texto do Botão de Compra</Label>
                      <Input
                        id="cta-text"
                        placeholder="Ex: Comprar agora"
                        value={formData.cta_text || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-info-title">Título da Seção de Pagamento</Label>
                      <Input
                        id="payment-info-title"
                        placeholder="Ex: Informações de Pagamento"
                        value={formData.payment_info_title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, payment_info_title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="testimonials-title">Título da Seção de Depoimentos</Label>
                      <Input
                        id="testimonials-title"
                        placeholder="Ex: O que dizem nossos clientes"
                        value={formData.testimonials_title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, testimonials_title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="footer-text">Texto do Rodapé</Label>
                      <Textarea
                        id="footer-text"
                        placeholder="Ex: © 2023 Empresa. Todos os direitos reservados."
                        value={formData.footer_text || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, footer_text: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout</CardTitle>
                    <CardDescription>
                      Configure quais seções serão exibidas no checkout
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2 border p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Cabeçalho</h3>
                          <p className="text-sm text-muted-foreground">Exibe uma mensagem no topo da página</p>
                        </div>
                        <Switch
                          checked={formData.show_header}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, show_header: checked }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2 border p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Depoimentos</h3>
                          <p className="text-sm text-muted-foreground">Exibe depoimentos de clientes</p>
                        </div>
                        <Switch
                          checked={formData.show_testimonials}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, show_testimonials: checked }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2 border p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Opções de Pagamento</h3>
                          <p className="text-sm text-muted-foreground">Exibe os métodos de pagamento disponíveis</p>
                        </div>
                        <Switch
                          checked={formData.show_payment_options}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, show_payment_options: checked }))
                          }
                        />
                      </div>
                      
                      {formData.show_payment_options && (
                        <div className="mt-4 space-y-2">
                          <Label>Métodos de pagamento disponíveis</Label>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="payment-pix" 
                                checked={formData.payment_methods?.includes('pix')}
                                onCheckedChange={(checked) => 
                                  handlePaymentMethodChange('pix', checked as boolean)
                                }
                              />
                              <Label htmlFor="payment-pix">PIX</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="payment-cartao" 
                                checked={formData.payment_methods?.includes('cartao')}
                                onCheckedChange={(checked) => 
                                  handlePaymentMethodChange('cartao', checked as boolean)
                                }
                              />
                              <Label htmlFor="payment-cartao">Cartão de Crédito</Label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 border p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium">Rodapé</h3>
                          <p className="text-sm text-muted-foreground">Exibe informações no rodapé da página</p>
                        </div>
                        <Switch
                          checked={formData.show_footer}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, show_footer: checked }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Pagamento</CardTitle>
                    <CardDescription>
                      Configure opções relacionadas ao pagamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Implementar opções relacionadas a pagamento aqui */}
                      <p className="text-sm text-gray-500">
                        Você pode configurar as opções de pagamento na aba "Layout" e os textos específicos na aba "Textos".
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom">
                <Card>
                  <CardHeader>
                    <CardTitle>CSS Personalizado</CardTitle>
                    <CardDescription>
                      Adicione estilos CSS personalizados para sua página de checkout
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        id="custom-css"
                        placeholder=".container { max-width: 1200px; }"
                        value={formData.custom_css || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, custom_css: e.target.value }))}
                        className="min-h-[200px] font-mono"
                      />
                      <p className="text-sm text-gray-500">
                        Estes estilos CSS serão aplicados apenas na página de checkout deste produto.
                        Use com cautela, pois estilos mal-formados podem quebrar o layout.
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

// TabsList wrapper to ensure proper styling
const TabsListWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full border-b">
    <div className="container">
      {children}
    </div>
  </div>
);

// I've refactored the TabsList to use proper TabsListWrapper
const TabsLists = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={className}>
    {children}
  </div>
);
