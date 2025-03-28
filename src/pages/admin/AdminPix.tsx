
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { criarOuAtualizarConfig, getConfig } from '@/services/configService';
import { getProdutoBySlug } from '@/services/produtoService';

const pixFormSchema = z.object({
  chave_pix: z.string().min(1, { message: "Chave PIX obrigatória" }),
  qr_code: z.string().optional(),
  mensagem_pix: z.string().optional(),
  tempo_expiracao: z.coerce.number().min(1, { message: "Tempo de expiração deve ser pelo menos 1 minuto" }).default(15),
  nome_beneficiario: z.string().optional()
});

export default function AdminPix() {
  const { id: productIdOrSlug } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof pixFormSchema>>({
    resolver: zodResolver(pixFormSchema),
    defaultValues: {
      chave_pix: '',
      qr_code: '',
      mensagem_pix: '',
      tempo_expiracao: 15,
      nome_beneficiario: ''
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (productIdOrSlug) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          // Try to load the product to get a valid UUID
          const product = await getProdutoBySlug(productIdOrSlug);
          
          if (product) {
            setProductId(product.id);
            // Now fetch the config with the valid product UUID
            const configData = await getConfig(product.id);
            if (configData) {
              form.reset({
                chave_pix: configData.chave_pix || '',
                qr_code: configData.qr_code || '',
                mensagem_pix: configData.mensagem_pix || '',
                tempo_expiracao: configData.tempo_expiracao || 15,
                nome_beneficiario: configData.nome_beneficiario || ''
              });
            }
          } else {
            toast({
              title: "Produto não encontrado",
              description: "Não foi possível encontrar o produto especificado.",
              variant: "destructive",
            });
            navigate("/admin/produtos");
          }
        } catch (error) {
          console.error("Error fetching product or config:", error);
          toast({
            title: "Erro",
            description: "Erro ao carregar as configurações PIX.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [productIdOrSlug, form, toast, navigate]);

  const handleSavePix = async (values: z.infer<typeof pixFormSchema>) => {
    if (!productId) {
      toast({
        title: "Erro",
        description: "ID do produto inválido.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const pixConfig = {
        produto_id: productId,
        chave_pix: values.chave_pix,
        mensagem_pix: values.mensagem_pix,
        qr_code: values.qr_code,
        tempo_expiracao: values.tempo_expiracao,
        nome_beneficiario: values.nome_beneficiario
      };

      await criarOuAtualizarConfig(pixConfig);

      toast({
        title: "Sucesso",
        description: "Configurações PIX salvas com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar configurações PIX.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <p>Carregando configurações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações PIX</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSavePix)} className="space-y-4">
            <FormField
              control={form.control}
              name="chave_pix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave PIX</FormLabel>
                  <FormControl>
                    <Input placeholder="Chave PIX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome_beneficiario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Beneficiário</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do Beneficiário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qr_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do QR Code (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="URL do QR Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mensagem_pix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem PIX (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mensagem exibida na tela de pagamento PIX"
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
              name="tempo_expiracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo de expiração (minutos)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Tempo de expiração" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Configurações PIX"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
