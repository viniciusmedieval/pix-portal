
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface ProductSummaryProps {
  produto: {
    nome: string;
    imagem_url?: string | null;
  };
  pedido: {
    valor: number;
  };
  config?: {
    discount_badge_enabled?: boolean;
    discount_badge_text?: string;
    discount_amount?: number;
    original_price?: number;
  };
}

export default function ProductSummary({ produto, pedido, config }: ProductSummaryProps) {
  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const discountAmount = config?.discount_amount || 0;
  const originalPrice = config?.original_price || pedido.valor;
  const finalPrice = pedido.valor;
  
  return (
    <Card className="border-0 shadow-md bg-white overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Product image banner */}
          {produto.imagem_url && (
            <div className="w-full h-40 overflow-hidden">
              <img 
                src={produto.imagem_url} 
                alt={produto.nome} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-5">
            <h2 className="font-bold text-xl mb-3">{produto.nome}</h2>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl">{formatCurrency(finalPrice)}</span>
              
              {discountEnabled && discountAmount > 0 && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {discountText}
                  </Badge>
                </>
              )}
            </div>
            
            {discountEnabled && discountAmount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor original:</span>
                  <span>{formatCurrency(originalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Desconto:</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 font-medium">
                  <span>Total:</span>
                  <span>{formatCurrency(finalPrice)}</span>
                </div>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Pagamento 100% seguro e criptografado</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
