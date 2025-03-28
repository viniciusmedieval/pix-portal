
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getCheckoutCustomization, saveCheckoutCustomization } from '@/services/checkoutCustomizationService';
import { getProdutos } from '@/services/produtoService';

const formSchema = z.object({
  produto_id: z.string().uuid(),
  benefits: z.array(z.object({
    text: z.string().min(3, "O texto do benefício deve ter pelo menos 3 caracteres")
  })),
  faqs: z.array(z.object({
    question: z.string().min(3, "A pergunta deve ter pelo menos 3 caracteres"),
    answer: z.string().min(3, "A resposta deve ter pelo menos 3 caracteres")
  })),
  show_guarantees: z.boolean().default(true),
  guarantee_days: z.number().min(1).default(7),
  show_benefits: z.boolean().default(true),
  show_faq: z.boolean().default(true)
});

export default function AdminCheckoutCustomization() {
  const { id: paramId } = useParams<{ id: string }>();
  const [produtos, setProdutos] = useState<{id: string, nome: string}[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('benefits');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produto_id: paramId || '',
      benefits: [{ text: "Carregando..." }],
      faqs: [{ question: "Carregando...", answer: "Carregando..." }],
      show_guarantees: true,
      guarantee_days: 7,
      show_benefits: true,
      show_faq: true
    }
  });
  
  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = 
    useFieldArray({ control: form.control, name: "benefits" });
    
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = 
    useFieldArray({ control: form.control, name: "faqs" });

  // Load products for selection
  useEffect(() => {
    const loadProdutos = async () => {
      try {
        const data = await getProdutos();
        setProdutos(data.map(p => ({ id: p.id, nome: p.nome })));
        
        // If no product ID in URL and we have products, select the first one
        if (!paramId && data.length > 0) {
          form.setValue('produto_id', data[0].id);
          loadCustomization(data[0].id);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar a lista de produtos.",
          variant: "destructive"
        });
      }
    };
    
    loadProdutos();
  }, []);
  
  // Load customization when product ID changes
  useEffect(() => {
    if (paramId) {
      loadCustomization(paramId);
    }
  }, [paramId]);
  
  const loadCustomization = async (productId: string) => {
    try {
      const customization = await getCheckoutCustomization(productId);
      
      form.reset({
        produto_id: productId,
        benefits: customization.benefits || [{ text: "" }],
        faqs: customization.faqs || [{ question: "", answer: "" }],
        show_guarantees: customization.show_guarantees,
        guarantee_days: customization.guarantee_days,
        show_benefits: customization.show_benefits,
        show_faq: customization.show_faq
      });
    } catch (error) {
      console.error("Error loading customization:", error);
      toast({
        title: "Erro ao carregar personalização",
        description: "Não foi possível carregar as configurações de personalização.",
        variant: "destructive"
      });
    }
  };
  
  const onProductChange = (productId: string) => {
    if (productId) {
      loadCustomization(productId);
    }
  };
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      await saveCheckoutCustomization(data);
      toast({
        title: "Personalização salva",
        description: "As configurações de personalização foram salvas com sucesso."
      });
    } catch (error) {
      console.error("Error saving customization:", error);
      toast({
        title: "Erro ao salvar personalização",
        description: "Não foi possível salvar as configurações de personalização.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Personalização do Checkout</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Selecione o Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="produto_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produto</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onProductChange(e.target.value);
                        }}
                      >
                        <option value="">Selecione um produto</option>
                        {produtos.map(produto => (
                          <option key={produto.id} value={produto.id}>{produto.nome}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="benefits">Benefícios</TabsTrigger>
              <TabsTrigger value="faqs">Perguntas Frequentes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="benefits">
              <Card>
                <CardHeader>
                  <CardTitle>Benefícios</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="show_benefits"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                        <div className="space-y-0.5">
                          <FormLabel>Exibir Benefícios</FormLabel>
                          <FormDescription>
                            Mostrar a seção de benefícios na página de checkout
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('show_benefits') && (
                    <>
                      <div className="space-y-4">
                        {benefitFields.map((field, index) => (
                          <div key={field.id} className="flex items-start space-x-2">
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name={`benefits.${index}.text`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Benefício {index + 1}</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Descreva o benefício" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="mt-8"
                              onClick={() => removeBenefit(index)}
                              disabled={benefitFields.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => appendBenefit({ text: "" })}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Benefício
                      </Button>
                      
                      <Separator className="my-6" />
                      
                      <FormField
                        control={form.control}
                        name="show_guarantees"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                            <div className="space-y-0.5">
                              <FormLabel>Exibir Garantia</FormLabel>
                              <FormDescription>
                                Mostrar informações sobre garantia de devolução do dinheiro
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch('show_guarantees') && (
                        <FormField
                          control={form.control}
                          name="guarantee_days"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dias de Garantia</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={e => field.onChange(parseInt(e.target.value))} 
                                />
                              </FormControl>
                              <FormDescription>
                                Número de dias da garantia de devolução do dinheiro
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faqs">
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas Frequentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="show_faq"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                        <div className="space-y-0.5">
                          <FormLabel>Exibir FAQ</FormLabel>
                          <FormDescription>
                            Mostrar a seção de perguntas frequentes na página de checkout
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('show_faq') && (
                    <>
                      <div className="space-y-6">
                        {faqFields.map((field, index) => (
                          <div key={field.id} className="border p-4 rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">Pergunta {index + 1}</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeFaq(index)}
                                disabled={faqFields.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name={`faqs.${index}.question`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Pergunta</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Digite a pergunta" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`faqs.${index}.answer`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Resposta</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Digite a resposta" 
                                        {...field} 
                                        className="min-h-24"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => appendFaq({ question: "", answer: "" })}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Pergunta
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Personalizações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
