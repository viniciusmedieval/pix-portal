
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
      const { data, error } = await supabase
        .from('pedidos')
        .select('*, produtos(nome)')
        .order('criado_em', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar pedidos:', error);
      } else {
        setPedidos(data || []);
      }
      setLoading(false);
    }
    
    carregarPedidos();
  }, []);

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
