
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, Settings, CreditCard, Trash, ExternalLink, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProdutosTableProps {
  produtos: any[];
  onDelete?: (id: string, nome?: string) => Promise<boolean | void>;
  onSort?: (field: "id" | "nome" | "descricao" | "preco" | "parcelas" | "ativo" | "criado_em" | "estoque" | "slug") => void;
}

export function ProdutosTable({ produtos = [], onDelete, onSort }: ProdutosTableProps) {
  const { toast } = useToast();
  const [copiedProductId, setCopiedProductId] = useState<string | null>(null);

  const handleCopyCheckoutLink = (produto: any) => {
    const checkoutSlug = produto.slug && produto.slug.trim() !== '' ? produto.slug : produto.id;
    const checkoutUrl = `${window.location.origin}/checkout/${checkoutSlug}`;
    
    navigator.clipboard.writeText(checkoutUrl)
      .then(() => {
        setCopiedProductId(produto.id);
        toast({
          title: "Link copiado!",
          description: "Link do checkout copiado para a área de transferência.",
        });
        
        setTimeout(() => setCopiedProductId(null), 2000);
      })
      .catch(err => {
        console.error('Erro ao copiar:', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link.",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => onSort && onSort("nome")}>
              Nome
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort && onSort("preco")}>
              Preço
            </TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                Nenhum produto encontrado
              </TableCell>
            </TableRow>
          ) : (
            produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{formatCurrency(produto.preco)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/produto/${produto.id}`}>
                        Editar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/config/${produto.id}`}>
                        Configurar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/pix-unified/${produto.id}`}>
                        PIX
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/checkout-customization/${produto.id}`}>
                        Checkout
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleCopyCheckoutLink(produto)}
                    >
                      {copiedProductId === produto.id ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Checkout
                        </>
                      )}
                    </Button>
                    {onDelete && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDelete(produto.id, produto.nome)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
