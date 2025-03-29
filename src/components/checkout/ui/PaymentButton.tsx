
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Reset processing state when submission state changes
  useEffect(() => {
    if (!isSubmitting) {
      setIsProcessing(false);
    }
  }, [isSubmitting]);
  
  // Create a proper style object with the button color
  const buttonStyle = {
    backgroundColor: buttonColor,
  };
  
  // Simple handler for PIX button that ensures the handler is called
  const handlePixClick = (e: React.MouseEvent) => {
    // Prevent default action and stop propagation
    e.preventDefault();
    e.stopPropagation();
    
    console.log("PIX button clicked in PaymentButton component");
    
    // Prevent multiple clicks
    if (isProcessing || isSubmitting) {
      console.log("Already processing, ignoring click");
      return;
    }
    
    // Set processing state
    setIsProcessing(true);
    
    // Call the PIX handler if provided
    if (onPixClick) {
      try {
        console.log("Calling PIX handler function");
        onPixClick();
      } catch (error) {
        console.error("Error in PIX handler:", error);
        // Update toast call to use sonner's format
        toast.error("Ocorreu um erro ao processar o pagamento PIX");
        setIsProcessing(false);
      }
    } else {
      console.log("No PIX handler provided");
      // Reset processing state if no handler
      setTimeout(() => setIsProcessing(false), 500);
    }
  };
  
  console.log("PaymentButton rendering with:", { isCartao, isSubmitting, buttonText });
  
  return (
    <div className="pt-4">
      {/* Primary button for cart payment */}
      {isCartao && (
        <Button
          type="submit"
          form="checkout-form"
          className={`w-full flex items-center justify-center gap-2 ${isMobile ? 'py-4 text-base' : 'py-6 text-lg'}`}
          style={buttonStyle}
          disabled={isSubmitting || isProcessing}
        >
          <span>{isSubmitting ? 'Processando...' : buttonText}</span>
          {!isSubmitting && <ArrowRight className="h-5 w-5" />}
        </Button>
      )}
      
      {/* PIX button - shown when PIX is the selected payment method */}
      {!isCartao && (
        <Button
          type="button"
          onClick={handlePixClick}
          className={`w-full flex items-center justify-center gap-2 ${isMobile ? 'py-4 text-base' : 'py-6 text-lg'}`}
          style={buttonStyle}
          disabled={isSubmitting || isProcessing}
        >
          <img src="/pix-logo.png" alt="PIX" className="w-5 h-5 mr-1" />
          <span>{isSubmitting || isProcessing ? 'Processando...' : 'Gerar PIX'}</span>
          {!isSubmitting && !isProcessing && <ArrowRight className="h-5 w-5" />}
        </Button>
      )}
      
      {/* Alternative PIX payment option - shown only when cart is selected */}
      {isCartao && onPixClick && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">ou</span>
          <Button
            variant="outline"
            onClick={handlePixClick}
            className="w-full mt-2 flex items-center justify-center gap-2"
            disabled={isSubmitting || isProcessing}
            type="button"
          >
            <img src="/pix-logo.png" alt="PIX" className="w-4 h-4 mr-1" />
            <span>Pagar com PIX</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
