
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface QuickCheckoutButtonProps {
  productId: string;
  slug?: string | null;
  buttonText?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const QuickCheckoutButton: React.FC<QuickCheckoutButtonProps> = ({
  productId,
  slug,
  buttonText = "Comprar Agora",
  className = "",
  variant = "default"
}) => {
  const navigate = useNavigate();
  
  // Use the slug for the checkout path if available, otherwise use ID
  const checkoutSlug = slug && slug.trim() !== '' ? slug : productId;
  
  const handleQuickCheckout = () => {
    navigate(`/checkout/${checkoutSlug}`);
  };
  
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
};

export default QuickCheckoutButton;
