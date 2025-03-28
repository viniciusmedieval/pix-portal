
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { CheckoutFormValues } from '../forms/checkoutFormSchema';

interface PaymentStepProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  watch: UseFormWatch<CheckoutFormValues>;
  product: {
    id: string;
    nome: string;
    preco: number;
    parcelas?: number;
  };
  isSubmitting: boolean;
  paymentMethods: string[];
  handlePixPayment: () => void;
  buttonColor: string;
  buttonText: string;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  register,
  errors,
  setValue,
  watch,
  product,
  isSubmitting,
  paymentMethods,
  handlePixPayment,
  buttonColor,
  buttonText
}) => {
  const currentPaymentMethod = watch('payment_method');

  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    setValue('payment_method', method);
  };

  const maxInstallments = product.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
    (num) => ({
      value: `${num}x`,
      label: `${num}x de R$ ${(product.preco / num).toFixed(2).replace('.', ',')}${num > 1 ? ' sem juros' : ''}`,
    })
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <img src="https://cdn-icons-png.flaticon.com/512/126/126179.png" alt="Pagamento" className="w-5 h-5" />
        <p className="text-lg font-semibold">Pagamento</p>
      </div>
      
      {/* Verifica se temos mais de um método de pagamento disponível */}
      {paymentMethods.length > 1 ? (
        <div className="grid grid-cols-2 gap-4 border p-3 rounded-lg">
          {paymentMethods.includes('cartao') && (
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
          )}
          
          {paymentMethods.includes('pix') && (
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
          )}
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-md text-center">
          <p>Pagamento via {currentPaymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'}</p>
        </div>
      )}
      
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
          <span className="font-semibold">{product.nome}</span>
          <span className="font-bold text-lg">{formatCurrency(product.preco)}</span>
        </div>
        
        <Button
          type="submit"
          className="w-full py-6 text-lg font-semibold"
          style={{ backgroundColor: buttonColor }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processando...' : (currentPaymentMethod === 'pix' ? 'Pagar com PIX' : buttonText)}
        </Button>
        
        {paymentMethods.includes('pix') && currentPaymentMethod === 'cartao' && (
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
  );
};

export default PaymentStep;
