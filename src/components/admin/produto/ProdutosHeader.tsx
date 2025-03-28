
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ProdutosHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Produtos</h1>
      <Link to="/admin/produto/new">
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </Link>
    </div>
  );
}
