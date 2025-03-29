
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

interface PaymentButtonProps {
  isSubmitting: boolean;
  buttonText: string;
  buttonColor?: string;
  isCartao: boolean;
  onPixClick?: () => void;
}

export default function PaymentButton({
  isSubmitting,
  buttonText,
  buttonColor,
  isCartao,
  onPixClick
}: PaymentButtonProps) {
  const handlePixButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    console.log("PIX button clicked, calling handler");
    if (onPixClick) {
      onPixClick();
    }
  };

  // Get button style based on custom color
  const buttonStyle = buttonColor 
    ? { backgroundColor: buttonColor, borderColor: buttonColor } 
    : {};
  
  console.log("PaymentButton render:", { 
    isSubmitting, 
    isCartao, 
    hasPixHandler: !!onPixClick,
    buttonText
  });

  const handleCardButtonClick = (e: React.MouseEvent) => {
    // Only log the event, don't prevent default as we want form submission
    console.log("Card payment button clicked, allowing form submission");
  };

  return (
    <div className="mt-6">
      {isCartao ? (
        // Credit card payment button - standard form submit
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3"
          style={buttonStyle}
          disabled={isSubmitting}
          onClick={handleCardButtonClick}
          data-testid="card-payment-button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>
      ) : (
        // PIX payment button - special handler
        <Button
          type="button" // Alterado para button para impedir a submissão padrão do formulário
          onClick={handlePixButtonClick}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3"
          style={buttonStyle}
          disabled={isSubmitting}
          data-testid="pix-payment-button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              {buttonText}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
