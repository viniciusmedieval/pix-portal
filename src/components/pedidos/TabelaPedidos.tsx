
import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { formatCurrency } from '@/lib/formatters';

type Pedido = {
  id: string;
  produto_id: string;
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string;
  valor: number;
  forma_pagamento: string;
  status: string;
  criado_em: string;
  produtos?: {
    nome: string;
  };
};

interface TabelaPedidosProps {
  pedidos: Pedido[];
  onChangeStatus: (pedidoId: string, status: 'Pago' | 'Falhou') => void;
  onCancelPedido: (pedidoId: string) => void;
  onDeletePedido: (pedidoId: string) => void;
}

const TabelaPedidos = ({ 
  pedidos, 
  onChangeStatus, 
  onCancelPedido, 
  onDeletePedido 
}: TabelaPedidosProps) => {
  // Use useMemo to memoize the function to avoid recreating it on every render
  const getStatusBadge = useMemo(() => (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'pago':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Pago</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }, []);

  // Format date function
  const formatData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
  };

  // Memoize the table rows to avoid unnecessary re-renders
  const tableRows = useMemo(() => 
    pedidos.map((pedido) => (
      <TableRow key={pedido.id}>
        <TableCell className="whitespace-nowrap">{formatData(pedido.criado_em)}</TableCell>
        <TableCell>
          <div className="font-medium">{pedido.nome}</div>
          <div className="text-sm text-gray-500">{pedido.email}</div>
          <div className="text-xs text-gray-400">CPF: {pedido.cpf}</div>
        </TableCell>
        <TableCell>{pedido.produtos?.nome || "Produto não encontrado"}</TableCell>
        <TableCell>{formatCurrency(pedido.valor)}</TableCell>
        <TableCell className="uppercase">{pedido.forma_pagamento}</TableCell>
        <TableCell>{getStatusBadge(pedido.status)}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-green-100 hover:bg-green-200 text-green-800"
              onClick={() => onChangeStatus(pedido.id, 'Pago')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Marcar como Pago
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-red-100 hover:bg-red-200 text-red-800"
              onClick={() => onChangeStatus(pedido.id, 'Falhou')}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Marcar como Falhou
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-amber-100 hover:bg-amber-200 text-amber-800"
              onClick={() => onCancelPedido(pedido.id)}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Cancelar Pedido
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-red-100 hover:bg-red-200 text-red-800"
              onClick={() => onDeletePedido(pedido.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </TableCell>
      </TableRow>
    )), [pedidos, getStatusBadge, formatData, onChangeStatus, onCancelPedido, onDeletePedido]);

  if (pedidos.length === 0) {
    return <div className="text-center py-4">Nenhum pedido encontrado</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableRows}
        </TableBody>
      </Table>
    </div>
  );
};

// Use React.memo to prevent re-renders when props haven't changed
export default React.memo(TabelaPedidos);
