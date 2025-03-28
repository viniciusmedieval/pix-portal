
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
import { Plus, Trash, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    show_faq: true
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
                  <TabsTrigger value="benefits">Benefícios</TabsTrigger>
                  <TabsTrigger value="faqs">Perguntas Frequentes</TabsTrigger>
                  <TabsTrigger value="guarantees">Garantias</TabsTrigger>
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
