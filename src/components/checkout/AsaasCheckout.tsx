
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { 
  getAsaasSettings, 
  createAsaasCustomer,
  createAsaasPixPayment,
  getAsaasPixQrCode,
  createAsaasCardPayment,
  checkAsaasPaymentStatus
} from '@/services/asaasService';

// Validation schema for checkout form
const checkoutSchema = z.object({
  name: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().min(11, 'CPF inválido').max(14),
  phone: z.string().optional(),
  payment_method: z.enum(['pix', 'credit_card']),
  // Credit card fields (conditional)
  card_holder_name: z.string().optional(),
  card_number: z.string().optional(),
  card_expiry_month: z.string().optional(),
  card_expiry_year: z.string().optional(),
  card_cvv: z.string().optional(),
  postal_code: z.string().optional(),
  address_number: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface AsaasCheckoutProps {
  produto: {
    id: string;
    nome: string;
    preco: number;
    parcelas?: number;
  };
  onPaymentSuccess?: (paymentId: string, method: string) => void;
}

export default function AsaasCheckout({ produto, onPaymentSuccess }: AsaasCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const [integrationEnabled, setIntegrationEnabled] = useState(false);
  const [pixQrCodeData, setPixQrCodeData] = useState<{ 
    encodedImage: string; 
    payload: string;
    expirationDate: string;
  } | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  // Initialize form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: 'pix', // Default to PIX if available
    }
  });

  // Watch payment method
  const paymentMethod = watch('payment_method');

  // Load Asaas settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getAsaasSettings();
        
        if (settings) {
          // Check if integration is enabled
          setIntegrationEnabled(settings.integration_enabled);
          
          // Determine available payment methods
          const methods: string[] = [];
          if (settings.pix_enabled) methods.push('pix');
          if (settings.credit_card_enabled) methods.push('credit_card');
          
          setAvailableMethods(methods);
          
          // Set default payment method if available
          if (methods.length > 0 && methods.includes('pix')) {
            setValue('payment_method', 'pix');
          } else if (methods.length > 0 && methods.includes('credit_card')) {
            setValue('payment_method', 'credit_card');
          }
        }
      } catch (error) {
        console.error('Error loading Asaas settings:', error);
        toast.error('Erro ao carregar configurações de pagamento');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSettings();
  }, [setValue]);

  // Process payment
  const processPayment = async (data: CheckoutFormValues) => {
    if (!integrationEnabled) {
      toast.error('Pagamentos estão temporariamente indisponíveis');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Format CPF (remove non-digits)
      const cpf = data.cpf.replace(/\D/g, '');
      
      // Create customer
      const customerId = await createAsaasCustomer({
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpfCnpj: cpf
      });
      
      if (!customerId) {
        throw new Error('Não foi possível criar o cliente');
      }
      
      // Process payment based on selected method
      if (data.payment_method === 'pix') {
        // Create PIX payment
        const payment = await createAsaasPixPayment(
          customerId,
          produto.preco,
          `Pagamento para ${produto.nome}`
        );
        
        if (payment && payment.id) {
          setPaymentId(payment.id);
          
          // Get PIX QR code
          const qrCodeData = await getAsaasPixQrCode(payment.id);
          setPixQrCodeData(qrCodeData);
          
          toast.success('PIX gerado com sucesso');
          
          // Store payment info in localStorage for verification
          localStorage.setItem('currentPaymentId', payment.id);
          localStorage.setItem('currentPaymentMethod', 'pix');
        }
      } else if (data.payment_method === 'credit_card') {
        // Validate credit card fields
        if (!data.card_holder_name || !data.card_number || !data.card_expiry_month || 
            !data.card_expiry_year || !data.card_cvv || !data.postal_code || !data.address_number) {
          toast.error('Preencha todos os campos do cartão de crédito');
          setIsProcessing(false);
          return;
        }
        
        // Create credit card payment
        const payment = await createAsaasCardPayment(
          customerId,
          produto.preco,
          {
            holderName: data.card_holder_name,
            number: data.card_number.replace(/\D/g, ''),
            expiryMonth: data.card_expiry_month,
            expiryYear: data.card_expiry_year,
            ccv: data.card_cvv
          },
          {
            name: data.name,
            email: data.email,
            cpfCnpj: cpf,
            postalCode: data.postal_code.replace(/\D/g, ''),
            addressNumber: data.address_number,
            phone: data.phone || ''
          },
          `Pagamento para ${produto.nome}`
        );
        
        if (payment && payment.id) {
          setPaymentId(payment.id);
          
          if (payment.status === 'CONFIRMED' || payment.status === 'RECEIVED') {
            toast.success('Pagamento confirmado com sucesso!');
            
            // Call success callback if provided
            if (onPaymentSuccess) {
              onPaymentSuccess(payment.id, 'credit_card');
            }
          } else if (payment.status === 'PENDING') {
            toast.info('Pagamento em análise pela operadora do cartão');
            
            // Store payment info in localStorage for verification
            localStorage.setItem('currentPaymentId', payment.id);
            localStorage.setItem('currentPaymentMethod', 'credit_card');
          } else {
            toast.error(`Pagamento não aprovado: ${payment.status}`);
          }
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(`Erro ao processar pagamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Check PIX payment status
  const checkPixPaymentStatus = async () => {
    if (!paymentId) return;
    
    try {
      setIsProcessing(true);
      
      const payment = await checkAsaasPaymentStatus(paymentId);
      
      if (payment.status === 'RECEIVED' || payment.status === 'CONFIRMED') {
        toast.success('Pagamento PIX confirmado!');
        
        // Call success callback if provided
        if (onPaymentSuccess) {
          onPaymentSuccess(paymentId, 'pix');
        }
      } else if (payment.status === 'PENDING') {
        toast.info('Pagamento PIX ainda não confirmado');
      } else {
        toast.error(`Status do pagamento: ${payment.status}`);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('Erro ao verificar status do pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy PIX code to clipboard
  const copyPixCodeToClipboard = () => {
    if (pixQrCodeData?.payload) {
      navigator.clipboard.writeText(pixQrCodeData.payload)
        .then(() => toast.success('Código PIX copiado para a área de transferência'))
        .catch(err => {
          console.error('Error copying PIX code:', err);
          toast.error('Erro ao copiar o código PIX');
        });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Show message if integration is disabled
  if (!integrationEnabled) {
    return (
      <div className="w-full py-8">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Pagamentos temporariamente indisponíveis</h3>
              <p className="text-gray-500">
                Nosso sistema de pagamentos está em manutenção. Por favor, tente novamente mais tarde.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show message if no payment methods are available
  if (availableMethods.length === 0) {
    return (
      <div className="w-full py-8">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Métodos de pagamento indisponíveis</h3>
              <p className="text-gray-500">
                Não há métodos de pagamento disponíveis no momento. Por favor, tente novamente mais tarde.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show PIX QR code if generated
  if (pixQrCodeData) {
    return (
      <div className="w-full py-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-center">Pagamento via PIX</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center py-6">
              <img 
                src={`data:image/png;base64,${pixQrCodeData.encodedImage}`}
                alt="QR Code PIX"
                className="w-64 h-64 mb-6"
              />
              
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-2">
                  Escaneie o QR Code acima ou copie o código abaixo
                </p>
                <div className="relative">
                  <Input 
                    value={pixQrCodeData.payload} 
                    readOnly 
                    className="pr-20 bg-gray-50 font-mono text-sm text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-1 top-1"
                    onClick={copyPixCodeToClipboard}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">
                  Expira em:{' '}
                  {new Date(pixQrCodeData.expirationDate).toLocaleString('pt-BR')}
                </p>
              </div>
              
              <Button
                variant="default"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={checkPixPaymentStatus}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar Pagamento'
                )}
              </Button>
              
              <div className="mt-6 text-sm text-gray-500">
                <p className="mb-2 font-medium">Como pagar com PIX:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Abra o app do seu banco</li>
                  <li>Escolha a opção PIX</li>
                  <li>Escaneie o QR code ou cole o código</li>
                  <li>Confirme as informações e finalize o pagamento</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <form onSubmit={handleSubmit(processPayment)}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Informações de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer information fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome completo"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  placeholder="Digite seu CPF (apenas números)"
                  {...register('cpf')}
                />
                {errors.cpf && (
                  <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="Digite seu telefone com DDD"
                  {...register('phone')}
                />
              </div>
            </div>
            
            {/* Payment method selector */}
            {availableMethods.length > 1 && (
              <div className="space-y-3">
                <Label>Forma de Pagamento</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setValue('payment_method', value as 'pix' | 'credit_card')}
                  className="flex flex-col space-y-3"
                >
                  {availableMethods.includes('pix') && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center">
                        <img src="/pix-logo.png" alt="PIX" className="h-5 w-5 mr-2" />
                        <span>PIX (pagamento instantâneo)</span>
                      </Label>
                    </div>
                  )}
                  
                  {availableMethods.includes('credit_card') && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex items-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                        <span>Cartão de Crédito</span>
                      </Label>
                    </div>
                  )}
                </RadioGroup>
              </div>
            )}
            
            {/* Credit card fields */}
            {paymentMethod === 'credit_card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card_holder_name">Nome no Cartão *</Label>
                  <Input
                    id="card_holder_name"
                    placeholder="Nome impresso no cartão"
                    {...register('card_holder_name')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="card_number">Número do Cartão *</Label>
                  <Input
                    id="card_number"
                    placeholder="0000 0000 0000 0000"
                    {...register('card_number')}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="card_expiry_month">Mês *</Label>
                    <Input
                      id="card_expiry_month"
                      placeholder="MM"
                      maxLength={2}
                      {...register('card_expiry_month')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="card_expiry_year">Ano *</Label>
                    <Input
                      id="card_expiry_year"
                      placeholder="AA"
                      maxLength={2}
                      {...register('card_expiry_year')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="card_cvv">CVV *</Label>
                    <Input
                      id="card_cvv"
                      placeholder="123"
                      maxLength={4}
                      {...register('card_cvv')}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="postal_code">CEP *</Label>
                  <Input
                    id="postal_code"
                    placeholder="00000-000"
                    {...register('postal_code')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address_number">Número *</Label>
                  <Input
                    id="address_number"
                    placeholder="123"
                    {...register('address_number')}
                  />
                </div>
                
                {produto.parcelas && produto.parcelas > 1 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium">Parcelamento:</span>
                    <span className="text-sm">
                      {produto.parcelas}x de {(produto.preco / produto.parcelas).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                paymentMethod === 'pix' ? 'Gerar PIX' : 'Finalizar Pagamento'
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
