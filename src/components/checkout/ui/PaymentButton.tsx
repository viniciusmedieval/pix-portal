
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
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
  const [clickProcessing, setClickProcessing] = useState(false);
  
  // Reset processing state when submission state changes
  useEffect(() => {
    if (!isSubmitting) {
      setClickProcessing(false);
    }
  }, [isSubmitting]);
  
  // Create a proper style object with the button color
  const buttonStyle = {
    backgroundColor: buttonColor,
  };
  
  console.log('PaymentButton rendering with:', { 
    buttonText, 
    isCartao, 
    hasPixHandler: !!onPixClick,
    isSubmitting,
    clickProcessing
  });
  
  // Handler function to ensure click is processed
  const handlePixClick = (e: React.MouseEvent) => {
    console.log("PIX button clicked in PaymentButton");
    
    // Prevent the event from triggering a form submission
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent double-clicks
    if (clickProcessing || isSubmitting) {
      console.log("Click already processing or submitting, ignoring");
      return;
    }
    
    console.log("Setting clickProcessing to true");
    setClickProcessing(true);
    
    if (onPixClick) {
      console.log("Calling provided PIX click handler");
      // Call the handler directly
      try {
        onPixClick();
      } catch (error) {
        console.error("Error in PIX click handler:", error);
        setClickProcessing(false);
      }
    } else {
      console.log("No PIX click handler provided");
      // Reset processing state after a short delay
      setTimeout(() => {
        setClickProcessing(false);
      }, 500);
    }
  };
  
  return (
    <div className="pt-4">
      {/* Primary button - only shown for cart payment or when no PIX handler is available */}
      {(isCartao || !onPixClick) && (
        <Button
          type="submit"
          form="checkout-form"
          className={`w-full ${isMobile ? 'py-4 text-base' : 'py-6 text-lg'}`}
          style={buttonStyle}
          disabled={isSubmitting || clickProcessing}
        >
          {isSubmitting ? 'Processando...' : buttonText}
        </Button>
      )}
      
      {/* PIX button - shown when handler exists and is selected as payment method */}
      {!isCartao && onPixClick && (
        <Button
          type="button"
          onClick={handlePixClick}
          className={`w-full ${isMobile ? 'py-4 text-base' : 'py-6 text-lg'}`}
          style={buttonStyle}
          disabled={isSubmitting || clickProcessing}
        >
          {isSubmitting || clickProcessing ? 'Processando...' : 'Gerar PIX'}
        </Button>
      )}
      
      {/* Alternative PIX payment option - shown only when cart is selected */}
      {isCartao && onPixClick && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">ou</span>
          <Button
            variant="outline"
            onClick={handlePixClick}
            className="w-full mt-2 flex items-center justify-center"
            disabled={isSubmitting || clickProcessing}
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
