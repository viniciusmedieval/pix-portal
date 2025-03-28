
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
  buttonColor = '#22c55e',
  isCartao = true,
  onPixClick
}: PaymentButtonProps) => {
  const isMobile = useIsMobile();
  
  // Create a proper style object with the button color
  const buttonStyle = {
    backgroundColor: buttonColor,
  };
  
  console.log('PaymentButton rendering with:', { buttonText, isCartao, hasPixHandler: !!onPixClick });
  
  return (
    <div className="pt-4">
      {/* Primary button - only shown for cart payment or when no PIX handler is available */}
      {(isCartao || !onPixClick) && (
        <Button
          type="submit"
          form="checkout-form"
          className={`w-full ${isMobile ? 'py-4 text-base' : 'py-6 text-lg'}`}
          style={buttonStyle}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processando...' : buttonText}
        </Button>
      )}
      
      {/* PIX button - shown when handler exists and is selected as payment method */}
      {!isCartao && onPixClick && (
        <Button
          type="button"
          onClick={() => {
            console.log("PIX button clicked in PaymentButton component - direct mode");
            onPixClick();
          }}
          className={`w-full ${isMobile ? 'py-4 text-base' : 'py-6 text-lg'}`}
          style={buttonStyle}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processando...' : 'Gerar PIX'}
        </Button>
      )}
      
      {/* Alternative PIX payment option - shown only when cart is selected */}
      {isCartao && onPixClick && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">ou</span>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              console.log("PIX button clicked in PaymentButton component - alternative mode");
              onPixClick();
            }}
            className="w-full mt-2 flex items-center justify-center"
            disabled={isSubmitting}
            type="button" // Important: This prevents form submission
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
