
import React from 'react';
import { Testimonial } from '@/pages/CheckoutPage';
import BenefitsSection from '@/components/checkout/BenefitsSection';
import TestimonialsWidget from '@/components/checkout/TestimonialsWidget';
import ProductSection from '@/components/checkout/ProductSection';
import PaymentFormSection from '@/components/checkout/PaymentFormSection';
import VisitorCounterWidget from '@/components/checkout/VisitorCounterWidget';
import { Card, CardContent } from '@/components/ui/card';

interface CheckoutContentProps {
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    slug?: string | null;
    imagem_url?: string | null;
  };
  config?: any;
  customization?: any;
  testimonials?: Testimonial[];
  bannerImage?: string;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({
  producto,
  config,
  customization,
  testimonials = []
}) => {
  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const originalPrice = config?.original_price || producto.preco;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Coluna esquerda: Informações do produto e formulário de pagamento */}
      <div className="lg:col-span-7 space-y-6">
        {/* Etapa 1: Exibição do produto */}
        <ProductSection 
          producto={producto}
          config={config}
          discountEnabled={discountEnabled}
          discountText={discountText}
          originalPrice={originalPrice}
        />
        
        {/* Etapa 2, 3, 4: Informações do cliente, seleção de pagamento, resumo */}
        <PaymentFormSection 
          produto={{
            id: producto.id,
            nome: producto.nome,
            preco: producto.preco,
            parcelas: producto.parcelas,
            imagem_url: producto.imagem_url
          }}
          customization={customization}
          config={config}
        />
        
        {/* Contador de visitantes */}
        <Card>
          <CardContent className="py-4">
            <VisitorCounterWidget baseNumber={85} />
          </CardContent>
        </Card>
      </div>
      
      {/* Coluna direita: Depoimentos e benefícios */}
      <div className="lg:col-span-5 space-y-6">
        {/* Benefícios adicionais do produto */}
        <Card>
          <CardContent className="py-6">
            <BenefitsSection benefits={[
              { text: "Acesso imediato após a confirmação do pagamento", icon: "clock" },
              { text: "Suporte técnico disponível 24h por dia", icon: "support" },
              { text: "Garantia de 7 dias ou seu dinheiro de volta", icon: "shield" }
            ]} />
          </CardContent>
        </Card>
        
        {/* Etapa 2: Depoimentos após os dados do cliente */}
        {testimonials.length > 0 && (
          <Card>
            <CardContent className="py-6">
              <TestimonialsWidget testimonials={testimonials} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CheckoutContent;
