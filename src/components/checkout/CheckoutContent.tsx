
import React from 'react';
import { Testimonial } from '@/pages/CheckoutPage';
import TestimonialsSection from '@/components/checkout/TestimonialsSection';
import PaymentFormSection from '@/components/checkout/PaymentFormSection';
import { formatCurrency } from '@/lib/formatters';
import { User, CreditCard, MessageCircle, ShoppingCart } from 'lucide-react';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import ProductDetails from '@/components/checkout/ProductDetails';

interface CheckoutContentProps {
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    slug?: string | null;
    imagem_url?: string | null;
    original_price?: number;
    discount_amount?: number;
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
  testimonials = [],
  bannerImage
}) => {
  // Use config as the single source of truth, falling back to customization for specific fields
  const combinedConfig = {
    ...config,
    // Override with customization values if they exist
    cta_text: config?.texto_botao || 'Assinar agora',
    payment_info_title: customization?.payment_info_title || 'Informações de Pagamento',
    testimonials_title: customization?.testimonials_title || 'O que dizem nossos clientes',
    payment_methods: customization?.payment_methods || ['pix', 'cartao'],
    show_testimonials: config?.exibir_testemunhos !== false,
    show_payment_options: customization?.show_payment_options !== false,
  };

  // Consolidate product data with any configuration options
  const productData = {
    ...producto,
    original_price: config?.original_price || producto.preco,
    discount_amount: config?.discount_amount || 0
  };

  return (
    <div className="space-y-6">
      {/* Product Details Section - For desktop only */}
      <div className="hidden md:block">
        <ProductDetails 
          produto={productData}
          numParcelas={1}
          maxParcelas={producto.parcelas || 1}
          onParcelaChange={() => {}}
        />
      </div>

      {/* Section 1: Identification & Payment Form - Separate card with shadow */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
              <User size={18} />
            </div>
            <h2 className="text-lg font-medium">Identificação</h2>
          </div>
        </div>
        <div className="p-6">
          <PaymentFormSection 
            produto={{
              id: producto.id,
              nome: producto.nome,
              preco: producto.preco,
              parcelas: producto.parcelas,
              imagem_url: bannerImage || producto.imagem_url
            }}
            customization={combinedConfig}
            config={config}
            showPaymentSection={false}
          />
        </div>
      </div>
      
      {/* Section 2: Payment - Separate card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
              <CreditCard size={18} />
            </div>
            <h2 className="text-lg font-medium">{combinedConfig.payment_info_title}</h2>
          </div>
        </div>
        <div className="p-6">
          <PaymentFormSection 
            produto={{
              id: producto.id,
              nome: producto.nome,
              preco: producto.preco,
              parcelas: producto.parcelas,
              imagem_url: bannerImage || producto.imagem_url
            }}
            customization={combinedConfig}
            config={config}
            showIdentificationSection={false}
          />
        </div>
      </div>
      
      {/* Section 3: Testimonials - Separate card */}
      {testimonials.length > 0 && combinedConfig.show_testimonials && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                <MessageCircle size={18} />
              </div>
              <h2 className="text-lg font-medium">{combinedConfig.testimonials_title}</h2>
              {testimonials.length > 0 && (
                <span className="ml-auto text-sm text-gray-500">{testimonials.length} comentários</span>
              )}
            </div>
          </div>
          <div className="p-6">
            <TestimonialsSection 
              testimonials={testimonials} 
              title="" 
            />
          </div>
        </div>
      )}
      
      {/* Section 4: Order Summary - Separate card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
              <ShoppingCart size={18} />
            </div>
            <h2 className="text-lg font-medium">Resumo da compra</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 flex-shrink-0">
                <img 
                  src={bannerImage || producto.imagem_url || "/placeholder.svg"} 
                  alt={producto.nome}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium">{producto.nome}</h3>
                <p className="text-sm text-gray-500">
                  {producto.parcelas && producto.parcelas > 1 
                    ? `${producto.parcelas}x de ${formatCurrency(producto.preco / producto.parcelas)}`
                    : formatCurrency(producto.preco)
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{formatCurrency(producto.preco)}</p>
              <p className="text-sm text-gray-500">1 item</p>
            </div>
          </div>
          
          <CheckoutSummary 
            product={productData}
            config={combinedConfig}
            onContinue={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
