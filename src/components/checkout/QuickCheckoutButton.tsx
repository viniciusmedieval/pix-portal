
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Copy, Check, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface QuickCheckoutButtonProps {
  productId: string;
  slug?: string | null;
  buttonText?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  showCopyOption?: boolean;
}

const QuickCheckoutButton: React.FC<QuickCheckoutButtonProps> = ({
  productId,
  slug,
  buttonText = "Comprar Agora",
  className = "",
  variant = "default",
  showCopyOption = false
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Use the slug for the checkout path if available, otherwise use ID
  const checkoutSlug = slug && slug.trim() !== '' ? slug : productId;
  const checkoutUrl = `${window.location.origin}/checkout/${checkoutSlug}`;
  
  const handleQuickCheckout = () => {
    navigate(`/checkout/${checkoutSlug}`);
  };
  
  const copyCheckoutLink = () => {
    navigator.clipboard.writeText(checkoutUrl).then(() => {
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "Link do checkout copiado para a área de transferência.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Erro ao copiar:', err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive"
      });
    });
  };
  
  if (!showCopyOption) {
    // Original button without copy option
    return (
      <Button 
        variant={variant} 
        className={`flex items-center gap-2 ${className}`}
        onClick={handleQuickCheckout}
      >
        <ShoppingCart className="h-4 w-4" />
        {buttonText}
      </Button>
    );
  }
  
  // Button with copy option in a popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant={variant} 
          className={`flex items-center gap-2 ${className}`}
        >
          <ShoppingCart className="h-4 w-4" />
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex justify-start gap-2"
            onClick={handleQuickCheckout}
          >
            <ShoppingCart className="h-4 w-4" />
            Ir para checkout
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex justify-start gap-2"
            onClick={copyCheckoutLink}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado!" : "Copiar link"}
          </Button>
          <div className="text-xs text-gray-500 mt-1 px-2">
            {checkoutUrl.length > 40 ? checkoutUrl.substring(0, 40) + '...' : checkoutUrl}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuickCheckoutButton;
