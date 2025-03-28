
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { formSchema } from './schema';
import { ConfigDataLoader } from './ConfigDataLoader';
import { criarOuAtualizarConfig } from '@/services/configService';

// Import all tab components
import { AppearanceTab } from './tabs/AppearanceTab';
import { HeaderTab } from './tabs/HeaderTab';
import { ProductTab } from './tabs/ProductTab';
import { TestimonialsTab } from './tabs/TestimonialsTab';
import { PaymentTab } from './tabs/PaymentTab';
import { SecurityTab } from './tabs/SecurityTab';
import { CheckoutTypeTab } from './tabs/CheckoutTypeTab';
import { FooterTab } from './tabs/FooterTab';
import { TimerTab } from './tabs/TimerTab';

export function ConfigForm() {
  const { id: productId } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  
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
        one_checkout_enabled: data.oneCheckoutEnabled,
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
    <ConfigDataLoader>
      {(form) => (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveConfig)} className="space-y-6">
            <Tabs defaultValue="appearance">
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="appearance">Aparência</TabsTrigger>
                <TabsTrigger value="header">Cabeçalho</TabsTrigger>
                <TabsTrigger value="footer">Rodapé</TabsTrigger>
                <TabsTrigger value="product">Produto</TabsTrigger>
                <TabsTrigger value="timer">Cronômetro</TabsTrigger>
                <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
                <TabsTrigger value="payment">Pagamento</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
                <TabsTrigger value="checkoutType">Tipo de Checkout</TabsTrigger>
              </TabsList>
              
              <AppearanceTab form={form} />
              <HeaderTab form={form} />
              <FooterTab form={form} />
              <ProductTab form={form} />
              <TimerTab form={form} />
              <TestimonialsTab form={form} />
              <PaymentTab form={form} />
              <SecurityTab form={form} />
              <CheckoutTypeTab form={form} />
            </Tabs>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </ConfigDataLoader>
  );
}
