
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
import PixCode from '@/components/PixCode';
import { formatCurrency } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';

export default function PixPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const pedido_id = searchParams.get('pedido_id');

  const navigate = useNavigate();

  const [produto, setProduto] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !pedido_id) return;
      
      try {
        const produtoData = await getProdutoBySlug(slug);
        if (produtoData) {
          setProduto(produtoData);
          
          const configData = await getConfig(produtoData.id);
          setConfig(configData);
          
          const { data: pedidoData } = await supabase
            .from('pedidos')
            .select('*')
            .eq('id', pedido_id)
            .single();
          
          setPedido(pedidoData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug, pedido_id]);

  const handleConfirm = async () => {
    if (!pedido_id) return;
    
    try {
      await supabase
        .from('pedidos')
        .update({ status: 'pago' })
        .eq('id', pedido_id);
        
      toast({
        title: "Pagamento confirmado",
        description: "Estamos processando seu pagamento. Você receberá uma confirmação em breve."
      });
      navigate('/');
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao confirmar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) return <div className="p-6 text-center">Carregando informações de pagamento...</div>;
  if (!config || !pedido) return <div className="p-6 text-center">Informações de pagamento não encontradas.</div>;

  return (
    <div className="min-h-screen p-6" style={{ background: config.cor_fundo }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <h1 className="text-xl font-bold text-center mb-4">Pague com PIX</h1>
        
        {/* Product Info */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold text-lg mb-2">{produto?.nome}</h2>
          <p className="text-gray-700 mb-2">
            Valor: <span className="font-medium">{formatCurrency(pedido.valor)}</span>
          </p>
        </div>

        {/* PIX Code Component */}
        <PixCode
          pixCode={config.chave_pix || ''}
          expirationMinutes={config.tempo_expiracao || 15}
          onExpire={() => toast({
            title: "Tempo expirado",
            description: "O tempo para pagamento expirou. Por favor, reinicie o processo.",
            variant: "destructive"
          })}
          qrCodeUrl={config.qr_code}
        />

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full mt-6 p-3 rounded font-bold text-white"
          style={{ backgroundColor: config.cor_botao }}
        >
          Confirmar pagamento
        </button>

        {/* Instructions */}
        {config.mensagem_pix && (
          <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Instruções:</h3>
            <p>{config.mensagem_pix}</p>
          </div>
        )}
      </div>
    </div>
  );
}
