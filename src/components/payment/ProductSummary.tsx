
import { formatCurrency } from "@/lib/formatters";

interface ProductSummaryProps {
  produto: {
    nome: string;
  };
  pedido: {
    valor: number;
  };
}

export default function ProductSummary({ produto, pedido }: ProductSummaryProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md">
      <h2 className="font-semibold text-lg mb-2">{produto.nome}</h2>
      <p className="text-gray-700 mb-2">
        Valor: <span className="font-medium">{formatCurrency(pedido.valor)}</span>
      </p>
    </div>
  );
}
