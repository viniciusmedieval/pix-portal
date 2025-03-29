import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getProdutoBySlug } from '@/services/produtoService';
import { getFaqs, saveFaqs } from '@/services/faqService';
import { FaqItem } from '@/types/checkoutConfig';

export default function AdminFaqs() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // Fetch existing FAQs
  const { data, isLoading, error } = useQuery({
    queryKey: ['faqs', id],
    queryFn: () => getFaqs(id || ''),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setFaqs(data);
    }
  }, [data]);

  // Form schema for adding new FAQ
  const faqSchema = z.object({
    question: z.string().min(3, { message: "A pergunta deve ter pelo menos 3 caracteres" }),
    answer: z.string().min(5, { message: "A resposta deve ter pelo menos 5 caracteres" }),
  });

  // Form for adding new FAQ
  const form = useForm<z.infer<typeof faqSchema>>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  // Mutation for saving FAQs
  const saveFaqsMutation = useMutation({
    mutationFn: (newFaqs: FaqItem[]) => saveFaqs(id || '', newFaqs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs', id] });
      toast({
        title: "FAQs salvas com sucesso",
        description: "As perguntas frequentes foram atualizadas.",
      });
      setLoading(false);
    },
    onError: (error) => {
      console.error("Error saving FAQs:", error);
      toast({
        title: "Erro ao salvar FAQs",
        description: "Ocorreu um erro ao salvar as perguntas frequentes.",
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  // Add new FAQ
  const handleAddFaq = (values: z.infer<typeof faqSchema>) => {
    const newFaq = {
      question: values.question,
      answer: values.answer,
    };
    setFaqs([...faqs, newFaq]);
    form.reset();
  };

  // Remove FAQ
  const handleRemoveFaq = (index: number) => {
    const updatedFaqs = [...faqs];
    updatedFaqs.splice(index, 1);
    setFaqs(updatedFaqs);
  };

  // Save all FAQs
  const handleSaveFaqs = () => {
    setLoading(true);
    saveFaqsMutation.mutate(faqs);
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Perguntas Frequentes (FAQs)</h1>
          <p className="text-gray-500">Adicione e edite perguntas frequentes exibidas na página de checkout</p>
        </div>
        <Button 
          onClick={handleSaveFaqs} 
          disabled={loading || faqs.length === 0}
          className="flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Salvando..." : "Salvar Todas as FAQs"}
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Add new FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Pergunta</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para adicionar uma nova pergunta frequente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddFaq)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pergunta</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Como funciona o pagamento por PIX?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resposta</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: O pagamento por PIX é processado instantaneamente. Basta escanear o QR code ou copiar o código..." 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Pergunta
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Existing FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes Existentes</CardTitle>
            <CardDescription>
              Gerencie as perguntas frequentes já cadastradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Carregando FAQs...</div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Erro ao carregar as perguntas frequentes. Por favor, tente novamente.
                </AlertDescription>
              </Alert>
            ) : faqs.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Nenhuma pergunta frequente cadastrada ainda.
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-md p-4 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveFaq(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <h3 className="font-medium mb-1 pr-8">{faq.question}</h3>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
