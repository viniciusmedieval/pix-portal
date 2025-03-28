
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PlusCircle, Package } from "lucide-react";

export default function EmptyProductsList() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border">
      <Package className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium">Nenhum produto cadastrado</h3>
      <p className="mt-2 text-gray-500">Comece adicionando seu primeiro produto.</p>
      <div className="mt-6">
        <Link to="/admin/produto/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </Link>
      </div>
    </div>
  );
}
