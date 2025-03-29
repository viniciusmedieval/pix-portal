
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ConfigDataLoader } from '@/components/admin/config/ConfigDataLoader';
import { criarOuAtualizarConfig } from '@/services/configService';
import { getProdutoById } from '@/services/produtoService';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { formSchema } from '@/components/admin/config/schema';
import { UseFormReturn } from 'react-hook-form';
import { FaqItem } from '@/types/checkoutConfig';
import { getFaqs, saveFaqs } from '@/services/faqService';

export default function AdminPixUnified() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [produto, setProduto] = useState<any>(null);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      if (!id) return;
      
      try {
        setLoadingFaqs(true);
        const produtoData = await getProdutoById(id);
        setProduto(produtoData);
        
        if (produtoData?.id) {
          const faqData = await getFaqs(produtoData.id);
          setFaqs(faqData);
        }
      } catch (error) {
        console.error("Error loading FAQs:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as FAQs",
          variant: "destructive"
        });
      } finally {
        setLoadingFaqs(false);
      }
    };
    
    loadFaqs();
  }, [id]);

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFaqs(updatedFaqs);
  };

  const removeFaq = (index: number) => {
    const updatedFaqs = [...faqs];
    updatedFaqs.splice(index, 1);
    setFaqs(updatedFaqs);
  };

  const saveFaqChanges = async () => {
    if (!produto?.id) {
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      const success = await saveFaqs(produto.id, faqs);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "FAQs salvas com sucesso"
        });
      } else {
        throw new Error("Erro ao salvar FAQs");
      }
    } catch (error) {
      console.error("Error saving FAQs:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as FAQs",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfig = async (data: z.infer<typeof formSchema>) => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID do produto não encontrado",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      console.log("Saving config form with form data:", data);
      
      const configData = {
        produto_id: id,
        cor_fundo: data.backgroundColor,
        cor_botao: data.buttonColor,
        texto_botao: data.buttonText,
        chave_pix: data.pixKey,
        qr_code: data.qrCodeUrl,
        mensagem_pix: data.pixMessage,
        tempo_expiracao: data.expirationTime,
        nome_beneficiario: data.beneficiaryName,
        tipo_chave: data.tipoChavePix,
        exibir_testemunhos: data.showTestimonials,
        numero_aleatorio_visitas: data.showVisitorCounter,
        bloquear_cpfs: data.blockedCpfs?.split(",").map(cpf => cpf.trim()) || [],
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
        testimonials_title: data.testimonialTitle,
        one_checkout_enabled: data.oneCheckoutEnabled,
        form_header_text: data.formHeaderText,
        form_header_bg_color: data.formHeaderBgColor,
        form_header_text_color: data.formHeaderTextColor,
        mostrar_qrcode_mobile: data.mostrarQrcodeMobile,
        pix_titulo: data.pixTitulo,
        pix_subtitulo: data.pixSubtitulo,
        pix_timer_texto: data.pixTimerTexto,
        pix_botao_texto: data.pixBotaoTexto,
        pix_seguranca_texto: data.pixSegurancaTexto,
        pix_compra_titulo: data.pixCompraTitulo,
        pix_mostrar_produto: data.pixMostrarProduto,
        pix_mostrar_termos: data.pixMostrarTermos,
        pix_saiba_mais_texto: data.pixSaibaMaisTexto,
        pix_texto_copiado: data.pixTextoCopied,
        pix_instrucoes_titulo: data.pixInstrucoesTitulo,
        pix_instrucoes: data.pixInstrucoes,
        pix_whatsapp_number: data.pixWhatsappNumber,
        pix_whatsapp_message: data.pixWhatsappMessage,
        pix_show_whatsapp_button: data.pixShowWhatsappButton
      };
      
      console.log("Config data being sent:", configData);
      
      await criarOuAtualizarConfig(configData);
      
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso"
      });
    } catch (error) {
      console.error("Error saving config:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const renderPixConfig = (form: UseFormReturn<z.infer<typeof formSchema>>) => (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="instruction">Instruções</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="faqs">Perguntas Frequentes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX (Código Copia e Cola)</Label>
              <Textarea
                id="pixKey"
                {...form.register("pixKey")}
                placeholder="Cole aqui o código PIX copia e cola"
                className="min-h-[100px]"
              />
              <p className="text-sm text-gray-500">Cole o código PIX completo gerado pelo seu banco ou gateway de pagamento.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qrCodeUrl">URL da Imagem do QR Code</Label>
              <Input
                id="qrCodeUrl"
                {...form.register("qrCodeUrl")}
                placeholder="https://exemplo.com/qrcode.png"
              />
              <p className="text-sm text-gray-500">URL da imagem do QR Code para pagamento PIX.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoChavePix">Tipo de Chave PIX</Label>
              <Select
                onValueChange={(value) => form.setValue('tipoChavePix', value)}
                value={form.watch('tipoChavePix') || 'email'}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de chave" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="cnpj">CNPJ</SelectItem>
                  <SelectItem value="aleatoria">Chave aleatória</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">Tipo de chave PIX que você está utilizando.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="beneficiaryName">Nome do Beneficiário</Label>
              <Input
                id="beneficiaryName"
                {...form.register("beneficiaryName")}
                placeholder="Nome completo"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expirationTime">Tempo de Expiração (minutos)</Label>
              <Input
                id="expirationTime"
                type="number"
                {...form.register("expirationTime", { valueAsNumber: true })}
                min={1}
              />
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="mostrarQrcodeMobile">Mostrar QR Code em Dispositivos Móveis</Label>
                <p className="text-sm text-muted-foreground">
                  Se desativado, o QR Code não será exibido em celulares e tablets
                </p>
              </div>
              <Switch
                id="mostrarQrcodeMobile"
                checked={form.watch("mostrarQrcodeMobile")}
                onCheckedChange={(checked) => form.setValue("mostrarQrcodeMobile", checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pixMessage">Mensagem Pós Pagamento</Label>
            <Input
              id="pixMessage"
              {...form.register("pixMessage")}
              placeholder="Obrigado pelo seu pagamento!"
            />
            <p className="text-sm text-gray-500">Mensagem exibida após o pagamento ser confirmado.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pixTitulo">Título Principal</Label>
            <Input
              id="pixTitulo"
              {...form.register("pixTitulo")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pixSubtitulo">Subtítulo / Instruções Principais</Label>
            <Textarea
              id="pixSubtitulo"
              {...form.register("pixSubtitulo")}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pixTimerTexto">Texto do Cronômetro</Label>
              <Input
                id="pixTimerTexto"
                {...form.register("pixTimerTexto")}
              />
              <p className="text-sm text-gray-500">Use {"{minutos}"} e {"{segundos}"} como placeholders.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pixBotaoTexto">Texto do Botão</Label>
              <Input
                id="pixBotaoTexto"
                {...form.register("pixBotaoTexto")}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pixTextoCopied">Texto ao Copiar o Código</Label>
              <Input
                id="pixTextoCopied"
                {...form.register("pixTextoCopied")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pixCompraTitulo">Título da Seção de Compra</Label>
              <Input
                id="pixCompraTitulo"
                {...form.register("pixCompraTitulo")}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pixSegurancaTexto">Texto Sobre Segurança</Label>
            <Textarea
              id="pixSegurancaTexto"
              {...form.register("pixSegurancaTexto")}
              className="min-h-[80px]"
            />
            <p className="text-sm text-gray-500">Texto informativo sobre a segurança do pagamento PIX.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="pixMostrarProduto">Mostrar Resumo do Produto</Label>
                <p className="text-sm text-muted-foreground">
                  Exibir as informações do produto na página de pagamento PIX
                </p>
              </div>
              <Switch
                id="pixMostrarProduto"
                {...form.register("pixMostrarProduto")}
                checked={form.watch("pixMostrarProduto")}
                onCheckedChange={(checked) => form.setValue("pixMostrarProduto", checked)}
              />
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="pixMostrarTermos">Mostrar Termos e Condições</Label>
                <p className="text-sm text-muted-foreground">
                  Exibir links para termos de uso e política de privacidade
                </p>
              </div>
              <Switch
                id="pixMostrarTermos"
                {...form.register("pixMostrarTermos")}
                checked={form.watch("pixMostrarTermos")}
                onCheckedChange={(checked) => form.setValue("pixMostrarTermos", checked)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="instruction" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pixInstrucoesTitulo">Título das Instruções</Label>
            <Input
              id="pixInstrucoesTitulo"
              {...form.register("pixInstrucoesTitulo")}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Instruções de Pagamento</Label>
            <p className="text-sm text-gray-500 mb-2">
              Adicione os passos que o cliente deve seguir para realizar o pagamento.
            </p>
            
            {form.watch("pixInstrucoes")?.map((instrucao, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  value={instrucao}
                  onChange={(e) => {
                    const updated = [...form.watch("pixInstrucoes")];
                    updated[index] = e.target.value;
                    form.setValue("pixInstrucoes", updated);
                  }}
                  placeholder={`Passo ${index + 1}`}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    const updated = [...form.watch("pixInstrucoes")];
                    updated.splice(index, 1);
                    form.setValue("pixInstrucoes", updated);
                  }}
                >
                  Remover
                </Button>
              </div>
            ))}
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                const current = form.watch("pixInstrucoes") || [];
                form.setValue("pixInstrucoes", [...current, ""]);
              }}
            >
              Adicionar Instrução
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="whatsapp" className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Integração com WhatsApp</h3>
                <p className="text-sm text-gray-500">
                  Configure o botão de envio de comprovante via WhatsApp
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="pixShowWhatsappButton">Exibir botão de WhatsApp</Label>
                <Switch
                  id="pixShowWhatsappButton"
                  checked={form.watch("pixShowWhatsappButton")}
                  onCheckedChange={(checked) => form.setValue("pixShowWhatsappButton", checked)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pixWhatsappNumber">Número do WhatsApp</Label>
              <Input
                id="pixWhatsappNumber"
                {...form.register("pixWhatsappNumber")}
                placeholder="Ex: 5511999999999"
              />
              <p className="text-sm text-gray-500">
                Insira o número completo com código do país (55 para Brasil) e DDD, sem espaços ou caracteres especiais.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pixWhatsappMessage">Mensagem do WhatsApp</Label>
            <Textarea
              id="pixWhatsappMessage"
              {...form.register("pixWhatsappMessage")}
              className="min-h-[120px]"
              placeholder="Olá, acabei de realizar um pagamento via PIX e gostaria de confirmar meu pedido."
            />
            <p className="text-sm text-gray-500">
              Você pode usar as variáveis {"{nome}"}, {"{email}"}, {"{telefone}"}, {"{cpf}"}, {"{produto}"} e {"{valor}"} que serão substituídas pelos dados do cliente.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="faqs" className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Perguntas Frequentes</h3>
              <Button 
                type="button" 
                onClick={saveFaqChanges} 
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar FAQs"}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Adicione perguntas e respostas frequentes para ajudar seus clientes.
            </p>
          </div>
          
          {loadingFaqs ? (
            <div className="text-center py-4">Carregando FAQs...</div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-md p-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${index}`}>Pergunta</Label>
                    <Input
                      id={`question-${index}`}
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      placeholder="Escreva a pergunta"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`answer-${index}`}>Resposta</Label>
                    <Textarea
                      id={`answer-${index}`}
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      placeholder="Escreva a resposta"
                      rows={3}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeFaq(index)}
                  >
                    Remover Pergunta
                  </Button>
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={addFaq}
              >
                Adicionar Nova Pergunta
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={saving}
          onClick={form.handleSubmit(handleSaveConfig)}
        >
          {saving ? "Salvando..." : "Salvar Todas as Configurações"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configuração Unificada do PIX</h1>
          <p className="text-gray-500">Gerencie todas as configurações relacionadas ao PIX em um único local</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/admin/produtos`)}>
          Voltar para Produtos
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configurações da Página PIX</CardTitle>
          <CardDescription>
            Personalize a experiência de pagamento PIX para seus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConfigDataLoader>
            {(form) => renderPixConfig(form)}
          </ConfigDataLoader>
        </CardContent>
      </Card>
    </div>
  );
}
