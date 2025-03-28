
import React from 'react';
import ProductDetails from '@/components/checkout/ProductDetails';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';

interface CheckoutContentProps {
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
    slug?: string;
  };
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({ 
  producto
}) => {
  return (
    <div className="grid gap-6 mt-6 md:grid-cols-2">
      {/* Left column: Product details */}
      <div className="space-y-6">
        <ProductDetails 
          produto={producto} 
          numParcelas={1}
          maxParcelas={producto.parcelas || 1}
          onParcelaChange={(value) => console.log('Parcela changed:', value)}
        />
      </div>
      
      {/* Right column: Checkout summary */}
      <div>
        <div className="sticky top-4">
          <CheckoutSummary 
            product={producto}
            onContinue={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
