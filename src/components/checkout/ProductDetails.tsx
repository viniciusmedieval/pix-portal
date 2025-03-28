
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
  // Make sure we have a valid slug or ID for navigation
  const checkoutPathBase = produto.slug 
    ? `/checkout/${encodeURIComponent(produto.slug)}` 
    : `/checkout/${produto.id}`;

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
          />
        </div>
        <p className="text-gray-600">{produto.descricao}</p>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Preço: {formatCurrency(produto.preco)}</h3>
          <p className="text-sm text-gray-500">
            Em até:
          </p>
          <Select onValueChange={onParcelaChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxParcelas }, (_, i) => i + 1).map((parcela) => (
                <SelectItem key={parcela} value={parcela.toString()}>
                  {parcela}x de {formatCurrency(produto.preco / parcela)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`${checkoutPathBase}/pix`}>
          <Button className="w-full">
            Continuar para Pagamento
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductDetails;
