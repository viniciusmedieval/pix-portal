
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
import { criarPedido, atualizarStatusPagamento } from '@/services/pedidoService';
import PixCode from '@/components/PixCode';
import { formatCurrency } from '@/lib/formatters';
import { toast } from '@/hooks/use-toast';
import usePixel from '@/hooks/usePixel';

export default function PixPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [pix, setPix] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  
  // Initialize pixels for purchase tracking
  const { trackEvent } = usePixel(produto?.id, 'PageView');

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      try {
        const produtoData = await getProdutoBySlug(slug);
        if (produtoData) {
          setProduto(produtoData);
          
          const configData = await getConfig(produtoData.id);
          setConfig(configData);
          
          // Fetch PIX config
          const { data } = await supabase
            .from('pagina_pix')
            .select('*')
            .eq('produto_id', produtoData.id)
            .maybeSingle();
            
          if (data) setPix(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  const verificarPagamento = async (pedidoId: string) => {
    if (verifyingPayment) return;
    
    setVerifyingPayment(true);
    try {
      // Simulação de verificação de pagamento - Em produção, deve chamar uma API real
      const pagamentoRealizado = Math.random() > 0.3; // 70% de chance de sucesso para demonstração
      
      if (pagamentoRealizado) {
        await atualizarStatusPagamento(pedidoId, 'Pago');
        toast({
          title: "Pagamento aprovado!",
          description: "Seu pedido foi processado com sucesso.",
        });
        
        // Track purchase event if not already confirmed
        if (!paymentConfirmed) {
          trackEvent('Purchase', {
            value: produto.preco,
            currency: 'BRL',
            content_name: produto.nome
          });
          setPaymentConfirmed(true);
        }
        
        // Redirecionar para página de sucesso após alguns segundos
        setTimeout(() => {
          navigate(`/checkout/${slug}/success?pedido_id=${pedidoId}`);
        }, 3000);
      } else {
        await atualizarStatusPagamento(pedidoId, 'Falhou');
        toast({
          title: "Pagamento não localizado",
          description: "Tente novamente ou use outro método de pagamento.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro na verificação de pagamento:", error);
      toast({
        title: "Erro",
        description: "Houve um problema ao verificar seu pagamento.",
        variant: "destructive"
      });
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handleConfirm = async () => {
    if (!produto) return;
    
    try {
      // Create order in database
      const pedido = await criarPedido({
        produto_id: produto.id,
        nome_cliente: 'Cliente PIX',
        email_cliente: 'pix@email.com',
        valor: produto.preco,
        forma_pagamento: 'pix',
        status: 'pendente',
      });
      
      if (pedido && pedido.id) {
        // Iniciar verificação do pagamento
        verificarPagamento(pedido.id);
      } else {
        throw new Error("Falha ao criar pedido");
      }
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
  if (!config || !produto) return <div className="p-6 text-center">Informações de pagamento não encontradas.</div>;

  // If we have pix config, use the custom template
  if (pix) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white text-gray-800">
        {pix.titulo && (
          <h1 className="text-2xl font-bold mb-4 text-center">{pix.titulo}</h1>
        )}

        {pix.instrucao && (
          <p className="text-center text-sm mb-4 max-w-md">{pix.instrucao}</p>
        )}

        {pix.qr_code_url && (
          <img
            src={pix.qr_code_url}
            alt="QR Code"
            className="w-60 h-60 object-contain border p-2 rounded mb-4"
          />
        )}

        {pix.chave_pix && (
          <div className="text-center mb-6">
            <p className="font-semibold mb-1">Chave PIX:</p>
            <input
              type="text"
              value={pix.chave_pix}
              readOnly
              className="border p-2 rounded w-full max-w-sm text-center"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
        )}

        <button
          onClick={handleConfirm}
          className="w-full max-w-sm mt-6 p-3 rounded font-bold text-white"
          style={{ backgroundColor: config.cor_botao }}
          disabled={verifyingPayment}
        >
          {verifyingPayment ? "Verificando pagamento..." : "Confirmar pagamento"}
        </button>

        {pix.mensagem_pos_pagamento && (
          <p className="text-xs text-gray-500 text-center max-w-md mt-4">
            {pix.mensagem_pos_pagamento}
          </p>
        )}
      </div>
    );
  }

  // Fallback to default PIX interface
  return (
    <div className="min-h-screen p-6" style={{ background: config.cor_fundo }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <h1 className="text-xl font-bold text-center mb-4">Pague com PIX</h1>
        
        {/* Product Info */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold text-lg mb-2">{produto?.nome}</h2>
          <p className="text-gray-700 mb-2">
            Valor: <span className="font-medium">{formatCurrency(produto.preco)}</span>
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
          disabled={verifyingPayment}
        >
          {verifyingPayment ? "Verificando pagamento..." : "Confirmar pagamento"}
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
