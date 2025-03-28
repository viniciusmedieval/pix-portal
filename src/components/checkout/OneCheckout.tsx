
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, CheckoutFormValues } from './forms/checkoutFormSchema';
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';

// Import components
import CheckoutHeader from './header/CheckoutHeader';
import ProductCard from './product/ProductCard';
import CustomerInfoForm from './forms/CustomerInfoForm';
import CardPaymentForm from './forms/CardPaymentForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import TestimonialsSection from './testimonials/TestimonialsSection';
import VisitorCounter from './visitors/VisitorCounter';
import { mockTestimonials } from './data/mockTestimonials';

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
  const [visitors, setVisitors] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extract config values with defaults
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
  
  // Set up random visitor count
  useEffect(() => {
    if (showVisitorCounter) {
      setVisitors(Math.floor(Math.random() * (150 - 80) + 80));
    }
  }, [showVisitorCounter]);
  
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: 'cartao',
      installments: '1x',
    },
  });
  
  const currentPaymentMethod = watch('payment_method');
  
  // Handle payment method change
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    setValue('payment_method', method);
  };
  
  // Handle PIX payment
  const handlePixPayment = () => {
    setValue('payment_method', 'pix');
    handleSubmit(onSubmit)();
  };

  // Form submission handler
  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('Form data:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.payment_method === 'pix') {
        navigate(`/checkout/${producto.slug || producto.id}/pix`);
      } else {
        navigate(`/checkout/${producto.slug || producto.id}/cartao`);
      }
      
      toast({
        title: "Processando pagamento",
        description: `Redirecionando para pagamento via ${data.payment_method === 'pix' ? 'PIX' : 'cartão'}...`,
      });
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      toast({
        variant: 'destructive',
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate installment options based on product settings
  const maxInstallments = producto.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
    (num) => ({
      value: `${num}x`,
      label: `${num}x de R$ ${(producto.preco / num).toFixed(2)}${num > 1 ? ' sem juros' : ''}`,
    })
  );
  
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: corFundo }}>
      {/* Header section */}
      {showHeader && (
        <CheckoutHeader 
          message={headerMessage}
          bgColor={headerBgColor}
          textColor={headerTextColor}
        />
      )}
      
      <div className="container max-w-4xl mx-auto py-4 px-4 sm:px-6 sm:py-6">
        {/* Enhanced Product card */}
        <ProductCard 
          product={producto}
          discountEnabled={discountEnabled}
          discountText={discountText}
          originalPrice={originalPrice}
        />

        <Card className="shadow-sm overflow-hidden mt-6">
          <div className="bg-red-600 text-white p-3 text-center">
            <h3 className="font-bold">PREENCHA SEUS DADOS ABAIXO</h3>
          </div>
          
          <CardContent className="p-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</div>
                  <h2 className="font-semibold text-lg">Informações Pessoais</h2>
                </div>
                
                <CustomerInfoForm 
                  register={register}
                  errors={errors}
                />
              </div>
              
              {/* Payment Section */}
              <div className="space-y-5 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</div>
                  <h2 className="font-semibold text-lg">Forma de Pagamento</h2>
                </div>
                
                <input type="hidden" {...register('payment_method')} />
                
                <PaymentMethodSelector 
                  availableMethods={paymentMethods}
                  currentMethod={currentPaymentMethod}
                  onChange={handlePaymentMethodChange}
                />
                
                {/* Conditional card fields */}
                {currentPaymentMethod === 'cartao' && (
                  <CardPaymentForm 
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    installmentOptions={installmentOptions}
                  />
                )}
                
                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-4 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: corBotao }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processando...' : textoBotao}
                  </button>
                  
                  {/* PIX alternative */}
                  {paymentMethods.includes('pix') && currentPaymentMethod === 'cartao' && (
                    <div className="mt-4 text-center">
                      <span className="text-sm text-gray-500 block mb-2">ou</span>
                      <button
                        type="button"
                        onClick={handlePixPayment}
                        className="w-full py-3 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        Pagar com PIX
                      </button>
                    </div>
                  )}
                  
                  <div className="text-center mt-3 text-sm text-gray-500">
                    <p>Pagamento 100% seguro. Transação realizada com criptografia.</p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Testimonials section */}
        {showTestimonials && (
          <TestimonialsSection 
            testimonials={mockTestimonials} 
            title={testimonialTitle} 
          />
        )}
        
        {/* Visitor counter */}
        {showVisitorCounter && (
          <VisitorCounter visitors={visitors} />
        )}
      </div>
    </div>
  );
};

export default OneCheckout;
