
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";

interface ProductSummaryProps {
  produto: {
    id: string;
    nome: string;
    imagem_url?: string | null;
    preco: number;
  };
  config?: {
    discount_badge_enabled?: boolean;
    discount_badge_text?: string;
    discount_amount?: number;
    original_price?: number | null;
  };
}

export default function ProductSummary({ produto, config }: ProductSummaryProps) {
  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const discountAmount = config?.discount_amount || 0;
  const originalPrice = config?.original_price || produto.preco;
  
  const finalPrice = originalPrice - discountAmount;
  
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Sua Compra</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
            <img 
              src={produto.imagem_url || "/placeholder.svg"} 
              alt={produto.nome} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{produto.nome}</h3>
            <div className="flex items-center mt-1">
              <span className="text-sm font-medium">
                {formatCurrency(finalPrice)}
              </span>
              {discountEnabled && discountAmount > 0 && (
                <span className="text-xs text-gray-500 line-through ml-2">
                  {formatCurrency(originalPrice)}
                </span>
              )}
              {discountEnabled && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 text-xs">
                  {discountText}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm">{formatCurrency(originalPrice)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between mb-2 text-green-600">
              <span className="text-sm">Desconto</span>
              <span className="text-sm">- {formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium pt-2 border-t border-gray-100 mt-2">
            <span>Total</span>
            <span>{formatCurrency(finalPrice)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
