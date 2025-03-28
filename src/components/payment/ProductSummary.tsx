
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card className="mb-6 border-0 shadow-sm bg-gray-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {produto.imagem_url && (
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={produto.imagem_url} 
                alt={produto.nome} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <h2 className="font-semibold text-lg mb-1">{produto.nome}</h2>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatCurrency(finalPrice)}</span>
              
              {discountEnabled && discountAmount > 0 && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {discountText}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        
        {discountEnabled && discountAmount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valor original:</span>
              <span>{formatCurrency(originalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Desconto:</span>
              <span>- {formatCurrency(discountAmount)}</span>
            </div>
            <div className="flex justify-between mt-1 pt-1 border-t border-gray-200 font-medium">
              <span>Total:</span>
              <span>{formatCurrency(finalPrice)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
