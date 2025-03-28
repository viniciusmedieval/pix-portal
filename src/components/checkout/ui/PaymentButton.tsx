
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentButtonProps {
  isSubmitting: boolean;
  buttonText: string;
  buttonColor?: string;
  isCartao?: boolean;
  onPixClick?: () => void;
}

const PaymentButton = ({
  isSubmitting,
  buttonText,
  buttonColor,
  isCartao = true,
  onPixClick
}: PaymentButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="pt-4">
      <Button
        type="submit"
        form="checkout-form"
        className={`w-full ${isMobile ? 'py-4 text-base' : 'py-6 text-lg'} ${buttonColor || 'bg-primary hover:bg-primary/90'}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processando...' : buttonText}
      </Button>
      
      {isCartao && onPixClick && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">ou</span>
          <Button
            variant="outline"
            onClick={onPixClick}
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            <img src="/pix-logo.png" alt="PIX" className="w-4 h-4 mr-2" />
            Pagar com PIX
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
