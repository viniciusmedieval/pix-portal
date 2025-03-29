
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';

interface PaymentButtonProps {
  isSubmitting: boolean;
  buttonText: string;
  buttonColor?: string;
  isCartao?: boolean;
  onPixClick?: () => void;
  onCardClick?: () => void;  // New prop for card payment handling
}

const PaymentButton = ({
  isSubmitting,
  buttonText,
  buttonColor = '#22c55e',
  isCartao = true,
  onPixClick,
  onCardClick  // New prop for card payment handling
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
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao processar o pagamento PIX",
          variant: "destructive"
        });
        setIsProcessing(false);
      }
    } else {
      console.log("No PIX handler provided");
      // Reset processing state if no handler
      setTimeout(() => setIsProcessing(false), 500);
    }
  };
  
  // New handler for card payment button
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Card button clicked in PaymentButton component");
    
    // Prevent multiple clicks
    if (isProcessing || isSubmitting) {
      console.log("Already processing, ignoring click");
      return;
    }
    
    // Set processing state
    setIsProcessing(true);
    
    // Call the card handler if provided
    if (onCardClick) {
      try {
        console.log("Calling card handler function");
        onCardClick();
      } catch (error) {
        console.error("Error in card handler:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao processar o pagamento com cartão",
          variant: "destructive"
        });
        setIsProcessing(false);
      }
    } else {
      console.log("No card handler provided, using default form submission");
      // If no specific handler, we don't prevent default form submission
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="pt-4">
      {/* Primary button for cart payment */}
      {isCartao && (
        <Button
          type={onCardClick ? "button" : "submit"}  // Use button type if we have a handler
          form={onCardClick ? undefined : "checkout-form"}  // Only specify form if using default submission
          className={`w-full flex items-center justify-center gap-2 ${isMobile ? 'py-4 text-base' : 'py-6 text-lg'}`}
          style={buttonStyle}
          disabled={isSubmitting || isProcessing}
          onClick={onCardClick ? handleCardClick : undefined}  // Use our handler if provided
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
            <img src="/pix-logo.png" alt="PIX" className="w-4 h-4" />
            <span>Pagar com PIX</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
