
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { Link } from 'react-router-dom';

interface ProdutoCardProps {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem_url?: string;
  slug?: string;
  estoque?: number;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({ 
  id, 
  nome, 
  descricao, 
  preco, 
  imagem_url, 
  slug,
  estoque
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative pt-[56.25%] bg-gray-100">
        <img 
          src={imagem_url || "/lovable-uploads/5bdb8fb7-f326-419c-9013-3ab40582ff09.png"} 
          alt={nome} 
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{nome}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {descricao && (
          <p className="text-gray-600 text-sm mb-2">{descricao.substring(0, 100)}{descricao.length > 100 ? '...' : ''}</p>
        )}
        <div className="mt-2">
          <span className="text-xl font-bold text-primary">{formatCurrency(preco)}</span>
        </div>
        {estoque !== undefined && (
          <div className="mt-2 text-xs text-gray-500">
            {estoque > 0 ? (
              estoque < 5 ? 
                <span className="text-red-500">Apenas {estoque} em estoque!</span> : 
                <span>Em estoque</span>
            ) : (
              <span className="text-red-500">Esgotado</span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Link to={`/checkout/${slug || id}`} className="w-full">
          <Button variant="default" size="sm" className="w-full">
            Comprar agora
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(ProdutoCard);
