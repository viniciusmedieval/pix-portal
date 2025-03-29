
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { formatCurrency } from '@/lib/formatters';

interface Pedido {
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
}

interface TabelaPedidosProps {
  pedidos: Pedido[];
  onChangeStatus: (pedidoId: string, status: 'Pago' | 'Falhou') => void;
  onCancelPedido: (pedidoId: string) => void;
  onDelete: (pedidoId: string) => void;
  loading: boolean;
}

const getStatusBadge = (status: string) => {
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
};

const formatData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
};

const formatWhatsappLink = (telefone: string | null, nome: string, produtoNome: string) => {
  if (!telefone) return '';
  
  // Format phone number for WhatsApp (remove non-numeric characters)
  let formattedPhone = telefone.replace(/\D/g, '');
  
  // Add the country code if it's not already there
  if (!formattedPhone.startsWith('55')) {
    formattedPhone = '55' + formattedPhone;
  }
  
  // Create the message text
  const message = encodeURIComponent(
    `Olá ${nome}, agradecemos seu pedido do produto "${produtoNome}". Como podemos ajudar?`
  );
  
  return `https://wa.me/${formattedPhone}?text=${message}`;
};

const TabelaPedidos: React.FC<TabelaPedidosProps> = ({ 
  pedidos, 
  onChangeStatus, 
  onCancelPedido, 
  onDelete,
  loading
}) => {
  if (loading) {
    return <div className="text-center py-4">Carregando pedidos...</div>;
  }
  
  if (pedidos.length === 0) {
    return <div className="text-center py-4">Nenhum pedido encontrado</div>;
  }

  return (
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
        {pedidos.map((pedido) => (
          <TableRow key={pedido.id}>
            <TableCell className="whitespace-nowrap">{formatData(pedido.criado_em)}</TableCell>
            <TableCell>
              <div className="font-medium">{pedido.nome}</div>
              <div className="text-sm text-gray-500">{pedido.email}</div>
              {pedido.telefone && (
                <div className="text-sm text-gray-500">{pedido.telefone}</div>
              )}
              <div className="text-xs text-gray-400">CPF: {pedido.cpf || 'Não informado'}</div>
            </TableCell>
            <TableCell>{pedido.produtos?.nome || "Produto não encontrado"}</TableCell>
            <TableCell>{formatCurrency(pedido.valor)}</TableCell>
            <TableCell className="uppercase">{pedido.forma_pagamento}</TableCell>
            <TableCell>{getStatusBadge(pedido.status)}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-2">
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
                </div>
                <div className="flex flex-wrap gap-2">
                  {pedido.telefone && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      asChild
                    >
                      <a 
                        href={formatWhatsappLink(pedido.telefone, pedido.nome, pedido.produtos?.nome || 'produto')} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contato WhatsApp
                      </a>
                    </Button>
                  )}
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
                    onClick={() => onDelete(pedido.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default React.memo(TabelaPedidos);
