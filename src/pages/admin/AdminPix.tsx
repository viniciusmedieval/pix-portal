
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { criarOuAtualizarConfig, getConfig } from '@/services/configService';
import { getProdutoBySlug } from '@/services/produtoService';

const pixFormSchema = z.object({
  chave_pix: z.string().min(1, { message: "Chave PIX obrigatória" }),
  tipo_chave: z.string().default("email"),
  qr_code: z.string().optional(),
  mensagem_pix: z.string().optional(),
  tempo_expiracao: z.coerce.number().min(1, { message: "Tempo de expiração deve ser pelo menos 1 minuto" }).default(15),
  nome_beneficiario: z.string().min(1, { message: "Nome do beneficiário é obrigatório" }),
  pix_titulo: z.string().optional(),
  pix_subtitulo: z.string().optional(),
  pix_botao_texto: z.string().optional(),
  pix_timer_texto: z.string().optional(),
  pix_mostrar_produto: z.boolean().default(true),
  pix_mostrar_termos: z.boolean().default(true)
});

type PixFormValues = z.infer<typeof pixFormSchema>;

export default function AdminPix() {
  const { id: productIdOrSlug } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<PixFormValues>({
    resolver: zodResolver(pixFormSchema),
    defaultValues: {
      chave_pix: '',
      tipo_chave: 'email',
      qr_code: '',
      mensagem_pix: '',
      tempo_expiracao: 15,
      nome_beneficiario: '',
      pix_titulo: 'Pagamento via PIX',
      pix_subtitulo: 'Copie o código ou use o QR Code para realizar o pagamento',
      pix_botao_texto: 'Confirmar pagamento',
      pix_timer_texto: 'Faltam {minutos}:{segundos} para o pagamento expirar...',
      pix_mostrar_produto: true,
      pix_mostrar_termos: true
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
                tipo_chave: configData.tipo_chave || 'email',
                qr_code: configData.qr_code || '',
                mensagem_pix: configData.mensagem_pix || '',
                tempo_expiracao: configData.tempo_expiracao || 15,
                nome_beneficiario: configData.nome_beneficiario || '',
                pix_titulo: configData.pix_titulo || 'Pagamento via PIX',
                pix_subtitulo: configData.pix_subtitulo || 'Copie o código ou use o QR Code para realizar o pagamento',
                pix_botao_texto: configData.pix_botao_texto || 'Confirmar pagamento',
                pix_timer_texto: configData.pix_timer_texto || 'Faltam {minutos}:{segundos} para o pagamento expirar...',
                pix_mostrar_produto: configData.pix_mostrar_produto !== false,
                pix_mostrar_termos: configData.pix_mostrar_termos !== false
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

  const handleSavePix = async (values: PixFormValues) => {
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
        tipo_chave: values.tipo_chave,
        mensagem_pix: values.mensagem_pix,
        qr_code: values.qr_code,
        tempo_expiracao: values.tempo_expiracao,
        nome_beneficiario: values.nome_beneficiario,
        pix_titulo: values.pix_titulo,
        pix_subtitulo: values.pix_subtitulo,
        pix_botao_texto: values.pix_botao_texto,
        pix_timer_texto: values.pix_timer_texto,
        pix_mostrar_produto: values.pix_mostrar_produto,
        pix_mostrar_termos: values.pix_mostrar_termos
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
        <CardDescription>Configure as informações de pagamento PIX e personalize a página de pagamento</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="appearance">Personalização</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSavePix)} className="space-y-6">
              <TabsContent value="basic" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
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
                    name="tipo_chave"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Chave PIX</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de chave" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="cpf">CPF</SelectItem>
                            <SelectItem value="cnpj">CNPJ</SelectItem>
                            <SelectItem value="telefone">Telefone</SelectItem>
                            <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="nome_beneficiario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Beneficiário</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome de quem receberá o PIX" {...field} />
                      </FormControl>
                      <FormDescription>
                        Este nome será exibido na página de pagamento PIX
                      </FormDescription>
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
                        <Input placeholder="URL da imagem do QR Code" {...field} />
                      </FormControl>
                      <FormDescription>
                        Cole aqui a URL da imagem do QR Code gerado pelo seu banco
                      </FormDescription>
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
                      <FormDescription>
                        Tempo limite para o cliente concluir o pagamento
                      </FormDescription>
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
                      <FormDescription>
                        Esta mensagem será enviada ao banco junto com o pagamento
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4">
                <FormField
                  control={form.control}
                  name="pix_titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título da página PIX</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Pagamento via PIX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pix_subtitulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo / Instrução</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Copie o código ou use o QR Code..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pix_botao_texto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto do botão de confirmação</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Confirmar pagamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pix_timer_texto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto do temporizador</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Faltam {minutos}:{segundos} para expirar..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Use {"{minutos}"} e {"{segundos}"} para exibir o tempo restante
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pix_mostrar_produto"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Mostrar detalhes do produto</FormLabel>
                          <FormDescription>
                            Exibe informações do produto na página PIX
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
                    name="pix_mostrar_termos"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Mostrar termos e políticas</FormLabel>
                          <FormDescription>
                            Exibe links para termos de uso e política de privacidade
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
              
              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Salvando..." : "Salvar Configurações PIX"}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
