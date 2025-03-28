
import { CheckoutFormValues } from './forms/checkoutFormSchema';
import CheckoutFormContainer from './forms/CheckoutFormContainer';

interface CheckoutFormProps {
  produto: {
    id: string;
    nome: string;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
  };
  onSubmit?: (data: CheckoutFormValues) => void;
  onPixPayment?: () => void;
  customization?: {
    payment_methods?: string[];
    payment_info_title?: string;
    cta_text?: string;
  };
  config?: {
    cor_botao?: string;
    texto_botao?: string;
  };
}

export default function CheckoutForm({
  produto,
  onSubmit,
  onPixPayment,
  customization,
  config
}: CheckoutFormProps) {
  return (
    <CheckoutFormContainer
      produto={produto}
      onSubmit={onSubmit}
      onPixPayment={onPixPayment}
      customization={customization}
      config={config}
    />
  );
}
