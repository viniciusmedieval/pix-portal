
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, CheckCircle, XCircle, AlertTriangle, Search, Calendar } from "lucide-react";
import { toast } from "sonner";
import { 
  listarPedidos, 
  atualizarStatusPagamento, 
  excluirPedido,
  cancelarPedido,
  buscarPedidos
} from "@/services/pedidoService";
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
  
  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [produtoFilter, setProdutoFilter] = useState('');
  const [clienteFilter, setClienteFilter] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    carregarPedidos();
  }, [statusFilter, produtoFilter, clienteFilter, dataInicio, dataFim]);

  async function carregarPedidos() {
    setLoading(true);
    try {
      // Usar a nova função de buscarPedidos com filtros
      const data = await buscarPedidos(
        statusFilter,
        produtoFilter,
        clienteFilter,
        dataInicio,
        dataFim
      );
      setPedidos(data || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }

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

  const handleCancelPedido = async (pedidoId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      try {
        const sucesso = await cancelarPedido(pedidoId);
        if (sucesso) {
          setPedidos(prevPedidos => 
            prevPedidos.map(pedido => 
              pedido.id === pedidoId ? {...pedido, status: 'cancelado'} : pedido
            )
          );
          toast.success('Pedido cancelado com sucesso!');
        } else {
          toast.error('Erro ao cancelar pedido');
        }
      } catch (error) {
        console.error('Erro ao cancelar pedido:', error);
        toast.error('Erro ao cancelar pedido');
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

  const limparFiltros = () => {
    setStatusFilter('Todos');
    setProdutoFilter('');
    setClienteFilter('');
    setDataInicio('');
    setDataFim('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Pedidos</h1>
      
      {/* Filtros avançados */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtros de Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Produto</label>
              <div className="flex items-center border rounded-md">
                <Search className="w-4 h-4 text-gray-400 ml-2" />
                <Input
                  placeholder="Buscar por produto"
                  value={produtoFilter}
                  onChange={(e) => setProdutoFilter(e.target.value)}
                  className="border-0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Cliente</label>
              <div className="flex items-center border rounded-md">
                <Search className="w-4 h-4 text-gray-400 ml-2" />
                <Input
                  placeholder="Buscar por cliente"
                  value={clienteFilter}
                  onChange={(e) => setClienteFilter(e.target.value)}
                  className="border-0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Data Início</label>
              <div className="flex items-center border rounded-md">
                <Calendar className="w-4 h-4 text-gray-400 ml-2" />
                <Input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="border-0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Data Fim</label>
              <div className="flex items-center border rounded-md">
                <Calendar className="w-4 h-4 text-gray-400 ml-2" />
                <Input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="border-0"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={limparFiltros}
            >
              Limpar Filtros
            </Button>
            <Button 
              onClick={carregarPedidos}
            >
              Buscar Pedidos
            </Button>
          </div>
        </CardContent>
      </Card>
      
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
                          className="bg-amber-100 hover:bg-amber-200 text-amber-800"
                          onClick={() => handleCancelPedido(pedido.id)}
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Cancelar Pedido
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
