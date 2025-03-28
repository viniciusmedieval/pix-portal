
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { listarPedidos, atualizarStatusPagamento, excluirPedido } from "@/services/pedidoService";
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

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPedidos() {
      setLoading(true);
      try {
        const data = await listarPedidos();
        setPedidos(data || []);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        toast.error('Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    }
    
    carregarPedidos();
  }, []);

  const handleChangeStatus = async (pedidoId: string, status: 'Pago' | 'Falhou') => {
    try {
      const result = await atualizarStatusPagamento(pedidoId, status);
      if (result) {
        setPedidos(prevPedidos => 
          prevPedidos.map(pedido => 
            pedido.id === pedidoId ? {...pedido, status: status === 'Pago' ? 'pago' : 'cancelado'} : pedido
          )
        );
        toast.success(`Status alterado para ${status}`);
      } else {
        toast.error('Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDelete = async (pedidoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        const sucesso = await excluirPedido(pedidoId);
        if (sucesso) {
          setPedidos(prevPedidos => prevPedidos.filter(pedido => pedido.id !== pedidoId));
          toast.success('Pedido excluído com sucesso!');
        } else {
          toast.error('Erro ao excluir pedido');
        }
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        toast.error('Erro ao excluir pedido');
      }
    }
  };

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Pedidos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recebidos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando pedidos...</div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-4">Nenhum pedido encontrado</div>
          ) : (
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
                          onClick={() => handleChangeStatus(pedido.id, 'Pago')}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como Pago
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-red-100 hover:bg-red-200 text-red-800"
                          onClick={() => handleChangeStatus(pedido.id, 'Falhou')}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Marcar como Falhou
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-red-100 hover:bg-red-200 text-red-800"
                          onClick={() => handleDelete(pedido.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
