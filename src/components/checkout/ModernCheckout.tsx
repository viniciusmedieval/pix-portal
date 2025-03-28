
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle2, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formSchema, CheckoutFormValues } from './forms/checkoutFormSchema';
import { formatCurrency } from '@/lib/formatters';
import { toast } from "@/hooks/use-toast";

// Componentes mockados
const mockTestimonials = [
  {
    id: '1',
    author: 'Ricardo dos Reis',
    content: 'Ótima escolha! Qualidade do produto, satisfação garantida.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '2 dias atrás'
  },
  {
    id: '2',
    author: 'Juliana Vasconcelos',
    content: 'Produto surpreendente! Eu recomendo a qualquer um.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: '5 dias atrás'
  },
  {
    id: '3',
    author: 'Rafaela Gomes',
    content: 'Achei simples, satisfatório, cumpre bem o objetivo.',
    rating: 4,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    date: '1 semana atrás'
  }
];

interface ModernCheckoutProps {
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

export default function ModernCheckout({ producto, config = {} }: ModernCheckoutProps) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('identification'); // 'identification' ou 'payment'
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('cartao');
  const [visitors, setVisitors] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Configurações do checkout
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
  
  // Set random number of visitors
  useEffect(() => {
    if (showVisitorCounter) {
      setVisitors(Math.floor(Math.random() * (150 - 80) + 80));
    }
  }, [showVisitorCounter]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: 'cartao',
      installments: '1x',
    },
  });
  
  const currentPaymentMethod = watch('payment_method');
  
  const handleContinue = async () => {
    if (activeStep === 'identification') {
      const isValid = await trigger(['name', 'email', 'cpf', 'telefone']);
      if (isValid) {
        setActiveStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    setPaymentMethod(method);
    setValue('payment_method', method);
  };
  
  const handlePixPayment = () => {
    setValue('payment_method', 'pix');
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('Form data:', data);
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.payment_method === 'pix') {
        // Redirecionar para página de PIX
        navigate(`/checkout/${producto.slug || producto.id}/pix`);
      } else {
        // Redirecionar para página de cartão
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
      label: `${num}x de R$ ${(producto.preco / num).toFixed(2).replace('.', ',')}${num > 1 ? ' sem juros' : ''}`,
    })
  );
  
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: corFundo }}>
      {/* Header Banner */}
      {showHeader && (
        <div 
          className="w-full py-2 px-4 text-center" 
          style={{ 
            backgroundColor: headerBgColor,
            color: headerTextColor
          }}
        >
          <p className="text-sm font-medium">
            {headerMessage}
          </p>
        </div>
      )}
      
      <div className="container max-w-4xl mx-auto py-4 px-4 sm:px-6 sm:py-6">
        {/* Preço promocional */}
        {discountEnabled && (
          <div className="flex flex-col items-center mb-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-1">
              {discountEnabled ? `DE ${formatCurrency(originalPrice)}` : ''}
            </h1>
            <h2 className="text-3xl font-bold text-red-700">
              POR APENAS {formatCurrency(producto.preco)}
            </h2>
            <div className="bg-yellow-400 px-3 py-1 text-sm font-bold text-black rounded mt-2">
              PREÇO DE HOJE - OFERTA LIMITADA
            </div>
          </div>
        )}
        
        {/* Formulário */}
        <Card className="shadow-sm overflow-hidden">
          <div className="bg-red-600 text-white p-3 text-center">
            <h3 className="font-bold">PREENCHA SEUS DADOS ABAIXO</h3>
          </div>
          
          <CardContent className="p-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {activeStep === 'identification' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="https://cdn-icons-png.flaticon.com/512/5087/5087607.png" alt="Formulário" className="w-5 h-5" />
                    <p className="text-lg font-semibold">Dados pessoais</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Nome completo</Label>
                      <Input 
                        id="name" 
                        {...register('name')} 
                        placeholder="Digite seu nome completo" 
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...register('email')} 
                        placeholder="Digite seu e-mail" 
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="cpf">CPF/CNPJ</Label>
                      <Input 
                        id="cpf" 
                        {...register('cpf')} 
                        placeholder="Digite seu CPF ou CNPJ" 
                        className={errors.cpf ? 'border-red-500' : ''}
                      />
                      {errors.cpf && (
                        <p className="text-xs text-red-500 mt-1">{errors.cpf.message}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="w-1/5">
                        <Label htmlFor="ddd">DDD</Label>
                        <Select defaultValue="55" disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="+55" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="55">+55</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="telefone">Celular</Label>
                        <Input 
                          id="telefone" 
                          {...register('telefone')} 
                          placeholder="Digite seu número de celular" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handleContinue}
                    className="w-full py-6 text-lg font-semibold mt-6"
                    style={{ backgroundColor: corBotao }}
                  >
                    Continuar
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="https://cdn-icons-png.flaticon.com/512/126/126179.png" alt="Pagamento" className="w-5 h-5" />
                    <p className="text-lg font-semibold">Pagamento</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border p-3 rounded-lg">
                    <button 
                      type="button"
                      onClick={() => handlePaymentMethodChange('cartao')}
                      className={`border rounded-md p-2 flex justify-center items-center ${
                        currentPaymentMethod === 'cartao' ? 'bg-blue-50 border-blue-500' : ''
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      <span>Cartão</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handlePaymentMethodChange('pix')}
                      className={`border rounded-md p-2 flex justify-center items-center ${
                        currentPaymentMethod === 'pix' ? 'bg-blue-50 border-blue-500' : ''
                      }`}
                    >
                      <img src="/pix-logo.png" alt="PIX" className="h-5 w-5 mr-2" />
                      <span>PIX</span>
                    </button>
                  </div>
                  
                  {currentPaymentMethod === 'cartao' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="card_name">Nome no cartão</Label>
                        <Input 
                          id="card_name" 
                          {...register('card_name')} 
                          placeholder="Digite o nome como está no cartão" 
                        />
                        {errors.card_name && (
                          <p className="text-xs text-red-500 mt-1">{errors.card_name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="card_number">Número do cartão</Label>
                        <Input 
                          id="card_number" 
                          {...register('card_number')} 
                          placeholder="Digite o número do cartão" 
                        />
                        {errors.card_number && (
                          <p className="text-xs text-red-500 mt-1">{errors.card_number.message}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <Label htmlFor="card_expiry">Vencimento</Label>
                          <Input 
                            id="card_expiry" 
                            {...register('card_expiry')} 
                            placeholder="MM/AA" 
                          />
                          {errors.card_expiry && (
                            <p className="text-xs text-red-500 mt-1">{errors.card_expiry.message}</p>
                          )}
                        </div>
                        
                        <div className="col-span-1">
                          <Label htmlFor="card_cvv">CVV</Label>
                          <Input 
                            id="card_cvv" 
                            {...register('card_cvv')} 
                            placeholder="000" 
                          />
                          {errors.card_cvv && (
                            <p className="text-xs text-red-500 mt-1">{errors.card_cvv.message}</p>
                          )}
                        </div>
                        
                        <div className="col-span-1">
                          <Label htmlFor="installments">Parcelas</Label>
                          <Select defaultValue="1x" onValueChange={(value) => setValue('installments', value)}>
                            <SelectTrigger id="installments">
                              <SelectValue placeholder="1x" />
                            </SelectTrigger>
                            <SelectContent>
                              {installmentOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">{producto.nome}</span>
                      <span className="font-bold text-lg">{formatCurrency(producto.preco)}</span>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full py-6 text-lg font-semibold"
                      style={{ backgroundColor: corBotao }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processando...' : (currentPaymentMethod === 'pix' ? 'Pagar com PIX' : textoBotao)}
                    </Button>
                    
                    {currentPaymentMethod === 'cartao' && (
                      <div className="mt-4 text-center">
                        <span className="text-sm text-gray-500">ou</span>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={handlePixPayment}
                          className="w-full mt-2"
                          disabled={isSubmitting}
                        >
                          <img src="/pix-logo.png" alt="PIX" className="w-4 h-4 mr-2" />
                          Pagar com PIX
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center mt-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
        
        {/* Depoimentos */}
        {showTestimonials && activeStep === 'identification' && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{testimonialTitle}</h3>
                <span className="text-sm text-gray-500">{mockTestimonials.length} comentários</span>
              </div>
              
              <div className="space-y-4">
                {mockTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-semibold">{testimonial.author}</p>
                          <span className="text-xs text-gray-500">{testimonial.date}</span>
                        </div>
                        <div className="flex text-yellow-500 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < testimonial.rating ? 'currentColor' : 'none'}
                              color={i < testimonial.rating ? 'currentColor' : '#ccc'}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 mt-2 text-sm">{testimonial.content}</p>
                        
                        <div className="flex gap-4 mt-2">
                          <button className="text-xs text-gray-500 flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Útil
                          </button>
                          <button className="text-xs text-gray-500 flex items-center">
                            Não útil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Contador de Visitantes */}
        {showVisitorCounter && visitors > 0 && (
          <div className="bg-red-50 border border-red-100 rounded p-3 mt-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-700">
              <strong>{visitors}</strong> pessoas estão vendo essa página agora
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
