
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getProdutoById } from '@/services/produtoService';
import { formatCurrency } from '@/lib/formatters';
import { Loader2 } from 'lucide-react';

export default function SuccessPage() {
  const { id } = useParams(); // ID do pedido
  const [pedido, setPedido] = useState<any>(null);
  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidoDetails = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from('pedidos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          setPedido(data);
          
          // Fetch related product
          if (data.produto_id) {
            const produtoData = await getProdutoById(data.produto_id);
            setProduto(produtoData);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar pedido', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidoDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Carregando detalhes do pedido...</span>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
        <p>Não foi possível localizar os detalhes do pedido informado.</p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold mt-4"
          onClick={() => window.location.href = '/'}
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">🎉 Obrigado pela sua compra!</h1>

      <div className="bg-green-50 border border-green-200 rounded p-4">
        <p className="text-lg text-green-800">Seu pedido foi confirmado com sucesso!</p>
      </div>

      <div className="mt-6 bg-white shadow rounded p-4">
        <h2 className="font-semibold text-lg border-b pb-2 mb-3">Detalhes do Pedido:</h2>
        
        {produto && (
          <p className="py-1"><span className="font-medium">Produto:</span> {produto.nome}</p>
        )}
        
        <p className="py-1"><span className="font-medium">Valor Total:</span> {formatCurrency(pedido.valor)}</p>
        
        {pedido.parcelas && (
          <p className="py-1"><span className="font-medium">Parcelas:</span> {pedido.parcelas}x de {formatCurrency(pedido.valor / pedido.parcelas)}</p>
        )}
        
        <p className="py-1">
          <span className="font-medium">Status do Pagamento:</span> 
          <span className={`ml-1 ${pedido.status_pagamento === 'Pago' ? 'text-green-600' : pedido.status_pagamento === 'Falhou' ? 'text-red-600' : 'text-yellow-600'}`}>
            {pedido.status_pagamento || "Pendente"}
          </span>
        </p>
        
        <p className="py-1"><span className="font-medium">Método de Pagamento:</span> {pedido.forma_pagamento}</p>
        
        <p className="py-1 text-sm text-gray-500">
          <span className="font-medium">Data da Compra:</span> {new Date(pedido.criado_em).toLocaleString()}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold transition-colors"
          onClick={() => window.location.href = '/'}
        >
          Voltar para o Início
        </button>
      </div>
    </div>
  );
}
