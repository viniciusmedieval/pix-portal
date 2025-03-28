
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/formatters';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductDetailsProps {
  produto: {
    id: string;
    nome: string;
    descricao?: string | null;
    imagem_url?: string | null;
    preco: number;
    slug?: string | null;
    original_price?: number;
    discount_amount?: number;
  };
  numParcelas: number;
  maxParcelas?: number;
  onParcelaChange: (value: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  produto, 
  numParcelas, 
  maxParcelas = 12, 
  onParcelaChange 
}) => {
  // Make sure we have a valid slug for navigation
  const checkoutSlug = produto?.slug || produto?.id || '';
  
  const checkoutPathBase = `/checkout/${encodeURIComponent(checkoutSlug)}`;
  
  // Calculate final price after discount
  const originalPrice = produto.original_price || produto.preco;
  const discountAmount = produto.discount_amount || 0;
  const finalPrice = originalPrice - discountAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{produto.nome}</CardTitle>
        <CardDescription>Confira os detalhes do produto e finalize a compra.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <img
            src={produto.imagem_url || "/placeholder-image.png"}
            alt={produto.nome}
            className="w-full h-auto rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <p className="text-gray-600">{produto.descricao}</p>
        <div className="mt-4">
          {discountAmount > 0 ? (
            <>
              <h3 className="text-xl font-semibold">
                <span className="line-through text-gray-400 mr-2">{formatCurrency(originalPrice)}</span>
                {formatCurrency(finalPrice)}
              </h3>
            </>
          ) : (
            <h3 className="text-xl font-semibold">Preço: {formatCurrency(produto.preco)}</h3>
          )}
          
          <p className="text-sm text-gray-500">
            Em até:
          </p>
          <Select onValueChange={onParcelaChange} defaultValue="1">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxParcelas }, (_, i) => i + 1).map((parcela) => (
                <SelectItem key={parcela} value={parcela.toString()}>
                  {parcela}x de {formatCurrency(finalPrice / parcela)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      {checkoutSlug && (
        <CardFooter>
          <Link to={`${checkoutPathBase}/pix`}>
            <Button className="w-full">
              Continuar para Pagamento
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductDetails;
