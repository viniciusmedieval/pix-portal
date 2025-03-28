
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { getConfig, criarOuAtualizarConfig } from '@/services/configService';
import { AppearanceTab } from './tabs/AppearanceTab';
import { PixTab } from './tabs/PixTab';
import { DisplayTab } from './tabs/DisplayTab';
import { ContentTab } from './tabs/ContentTab';
import { SecurityTab } from './tabs/SecurityTab';
import { formSchema } from './schema';

export function ConfigForm() {
  const [isSaving, setIsSaving] = useState(false);
  const { id: productId } = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backgroundColor: '#ffffff',
      buttonColor: '#30b968',
      buttonText: 'Finalizar Compra',
      pixMessage: '',
      qrCodeUrl: '',
      pixKey: '',
      expirationTime: 15,
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
      headerMessage: 'Tempo restante! Garanta sua oferta',
      headerBgColor: '#df2020',
      headerTextColor: '#ffffff',
      footerText: 'Todos os direitos reservados © 2023',
      testimonialsTitle: 'O que dizem nossos clientes',
      blockedCpfs: '',
    },
  });

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
        exibir_testemunhos: data.showTestimonials,
        numero_aleatorio_visitas: data.showVisitorCounter,
        bloquear_cpfs: data.blockedCpfs?.split(",").map(cpf => cpf.trim()) || [],
        tempo_expiracao: data.expirationTime,
        nome_beneficiario: data.beneficiaryName,
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
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="pix">PIX</TabsTrigger>
            <TabsTrigger value="display">Visibilidade</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>
          
          <AppearanceTab form={form} />
          <PixTab form={form} />
          <DisplayTab form={form} />
          <ContentTab form={form} />
          <SecurityTab form={form} />
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
