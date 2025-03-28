
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Trash2, 
  Tag, 
  ArrowUpDown
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { ProdutoType } from '@/services/produtoService';

interface ProdutosTableProps {
  produtos: ProdutoType[];
  onDelete: (id: string) => Promise<void>;
  onSort: (field: keyof ProdutoType) => void;
}

export default function ProdutosTable({ produtos, onDelete, onSort }: ProdutosTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">
            <button 
              className="flex items-center focus:outline-none"
              onClick={() => onSort('nome')}
            >
              Produto
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
          </TableHead>
          <TableHead>
            <button 
              className="flex items-center focus:outline-none"
              onClick={() => onSort('preco')}
            >
              Preço
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
          </TableHead>
          <TableHead>
            <button 
              className="flex items-center focus:outline-none"
              onClick={() => onSort('estoque')}
            >
              Estoque
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
          </TableHead>
          <TableHead>
            <button 
              className="flex items-center focus:outline-none"
              onClick={() => onSort('ativo')}
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
          </TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {produtos.map((produto) => (
          <TableRow key={produto.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                  {produto.imagem_url ? (
                    <img
                      src={produto.imagem_url}
                      alt={produto.nome}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Tag className="h-6 w-6 m-2 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{produto.nome}</div>
                  {produto.slug && (
                    <div className="text-xs text-gray-500">/{produto.slug}</div>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>{formatCurrency(produto.preco)}</TableCell>
            <TableCell>
              {produto.estoque !== null && produto.estoque !== undefined ? (
                <span className={produto.estoque === 0 ? 'text-red-500' : ''}>
                  {produto.estoque}
                </span>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                produto.ativo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {produto.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Link to={`/admin/produto/${produto.id}`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(produto.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
