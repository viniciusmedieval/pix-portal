
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

interface ProdutoHeaderProps {
  isEditing: boolean;
}

export default function ProdutoHeader({ isEditing }: ProdutoHeaderProps) {
  return (
    <div className="mb-6">
      <Link to="/admin/produtos" className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para produtos
      </Link>
      <h1 className="text-2xl font-bold">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
    </div>
  );
}
