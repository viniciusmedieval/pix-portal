
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  listarPedidos, 
  atualizarStatusPagamento, 
  excluirPedido,
  cancelarPedido,
  buscarPedidos,
  excluirTodosPedidos
} from "@/services/pedidoService";
import TabelaPedidos from "@/components/pedidos/TabelaPedidos";
import FiltrosPedidos from "@/components/pedidos/FiltrosPedidos";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, RefreshCw } from "lucide-react";

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    carregarPedidos();
  }, [refreshTrigger]);

  async function carregarPedidos() {
    setLoading(true);
    try {
      console.log("Loading orders with filters:", {
        statusFilter,
        produtoFilter,
        clienteFilter,
        dataInicio,
        dataFim
      });
      
      const data = await buscarPedidos(
        statusFilter,
        produtoFilter,
        clienteFilter,
        dataInicio,
        dataFim
      );
      
      console.log("Orders loaded:", data?.length || 0, "orders found");
      setPedidos(data || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    // Incrementing the refresh trigger will cause the useEffect to run again
    setRefreshTrigger(prev => prev + 1);
    toast.info('Atualizando lista de pedidos...');
  };

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
        setLoading(true);
        const sucesso = await excluirPedido(pedidoId);
        if (sucesso) {
          setPedidos(prevPedidos => prevPedidos.filter(pedido => pedido.id !== pedidoId));
          toast.success('Pedido excluído com sucesso!');
        } else {
          toast.error('Erro ao excluir pedido. Verifique se há pagamentos associados.');
        }
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        toast.error('Erro ao excluir pedido');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAll = async () => {
    const confirmMessage = 'ATENÇÃO: Tem certeza que deseja excluir TODOS os pedidos e seus pagamentos relacionados? Esta ação não pode ser desfeita!';
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        const sucesso = await excluirTodosPedidos();
        if (sucesso) {
          setPedidos([]);
          toast.success('Todos os pedidos foram excluídos com sucesso!');
        } else {
          toast.error('Erro ao excluir todos os pedidos. Verifique o console para mais detalhes.');
        }
      } catch (error) {
        console.error('Erro ao excluir todos os pedidos:', error);
        toast.error('Erro ao excluir todos os pedidos');
      } finally {
        setLoading(false);
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

  const handleSearch = () => {
    carregarPedidos();
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
      <FiltrosPedidos 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        produtoFilter={produtoFilter}
        setProdutoFilter={setProdutoFilter}
        clienteFilter={clienteFilter}
        setClienteFilter={setClienteFilter}
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFim={dataFim}
        setDataFim={setDataFim}
        onSearch={handleSearch}
        onClearFilters={limparFiltros}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pedidos Recebidos</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw size={18} />
              <span>Atualizar</span>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAll}
              disabled={loading || pedidos.length === 0}
              className="flex items-center gap-2"
            >
              <Trash2 size={18} />
              <span>Excluir Todos os Pedidos</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TabelaPedidos 
            pedidos={pedidos}
            onChangeStatus={handleChangeStatus}
            onCancelPedido={handleCancelPedido}
            onDelete={handleDelete}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
