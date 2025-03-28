
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileDown } from "lucide-react";
import { gerarRelatorioVendas } from "@/services/pedidoService";
import { formatCurrency } from '@/lib/formatters';

export default function AdminRelatorio() {
  const [relatorio, setRelatorio] = useState<any[]>([]);
  const [statusPagamento, setStatusPagamento] = useState('Todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatorio = async () => {
      setLoading(true);
      try {
        const relatorioVendas = await gerarRelatorioVendas(statusPagamento, dataInicio, dataFim);
        setRelatorio(relatorioVendas);
      } catch (error) {
        console.error("Erro ao buscar relatório:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorio();
  }, [statusPagamento, dataInicio, dataFim]);

  const calcularTotalVendas = () => {
    return relatorio.reduce((total, pedido) => total + (pedido.valor || 0), 0);
  };

  const countPedidosPorStatus = (status: string) => {
    return relatorio.filter(pedido => 
      status === 'Todos' ? true : pedido.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

  const exportarCSV = () => {
    // Cabeçalhos do CSV
    const headers = [
      'ID', 'Produto', 'Cliente', 'Email', 'Valor', 'Data', 'Status'
    ].join(',');
    
    // Linhas do CSV
    const rows = relatorio.map(pedido => [
      pedido.id,
      pedido.produtos?.nome || 'N/A',
      pedido.nome || 'N/A',
      pedido.email || 'N/A',
      pedido.valor,
      pedido.criado_em ? new Date(pedido.criado_em).toLocaleDateString() : 'N/A',
      pedido.status
    ].join(','));
    
    // Unir cabeçalhos e linhas
    const csv = [headers, ...rows].join('\n');
    
    // Criar arquivo para download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_vendas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pago':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">📊 Relatório de Vendas</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Vendas</CardTitle>
            <CardDescription>Valor total de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(calcularTotalVendas())}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pedidos</CardTitle>
            <CardDescription>Total de pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{relatorio.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pagos</CardTitle>
            <CardDescription>Pedidos pagos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{countPedidosPorStatus('pago')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cancelados</CardTitle>
            <CardDescription>Pedidos cancelados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{countPedidosPorStatus('cancelado')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/4">
          <label htmlFor="statusPagamento" className="block text-sm font-medium mb-1">
            Status de Pagamento
          </label>
          <Select value={statusPagamento} onValueChange={setStatusPagamento}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/4">
          <label htmlFor="dataInicio" className="block text-sm font-medium mb-1">
            Data Início
          </label>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            <Input
              type="date"
              id="dataInicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <label htmlFor="dataFim" className="block text-sm font-medium mb-1">
            Data Fim
          </label>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            <Input
              type="date"
              id="dataFim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={exportarCSV}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            {loading ? 'Carregando pedidos...' : `${relatorio.length} pedidos encontrados`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Carregando...</p>
            </div>
          ) : relatorio.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Nenhum pedido encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatorio.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-mono text-xs">{pedido.id.substring(0, 8)}...</TableCell>
                      <TableCell>{pedido.produtos?.nome || 'N/A'}</TableCell>
                      <TableCell>{pedido.nome || 'N/A'}</TableCell>
                      <TableCell>{formatCurrency(pedido.valor || 0)}</TableCell>
                      <TableCell>
                        {pedido.criado_em
                          ? format(new Date(pedido.criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{getStatusBadge(pedido.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
