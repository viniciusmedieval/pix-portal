
import { Button } from "@/components/ui/button";
import { Package, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyProductsListProps {
  onRetry?: () => void;
}

export default function EmptyProductsList({ onRetry }: EmptyProductsListProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg bg-gray-50 h-96">
      <Package className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="font-medium text-lg mb-2">Nenhum produto cadastrado</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Você ainda não adicionou nenhum produto. Adicione seu primeiro produto para começar a vender.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/admin/produto/new">
          <Button size="lg">
            Adicionar primeiro produto
          </Button>
        </Link>
        
        {onRetry && (
          <Button variant="outline" size="lg" onClick={onRetry} className="mt-2 sm:mt-0">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}
