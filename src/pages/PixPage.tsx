
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';

export default function PixPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const pedido_id = searchParams.get('pedido_id');

  const navigate = useNavigate();

  const [produto, setProduto] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [pedido, setPedido] = useState<any>(null);
  const [timer, setTimer] = useState(900); // 15 minutos

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
          
          // Set timer based on config
          if (configData?.tempo_expiracao) {
            setTimer(configData.tempo_expiracao * 60);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, [slug, pedido_id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = () => {
    const min = Math.floor(timer / 60).toString().padStart(2, '0');
    const sec = (timer % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleConfirm = async () => {
    if (!pedido_id) return;
    
    await supabase
      .from('pedidos')
      .update({ status: 'pago' })
      .eq('id', pedido_id);
      
    alert('Pagamento confirmado!');
    navigate('/');
  };

  if (!produto || !config || !pedido) return <p className="p-6">Carregando...</p>;

  return (
    <div className="min-h-screen bg-white p-6" style={{ background: config.cor_fundo }}>
      {/* Header */}
      <h1 className="text-xl font-bold text-center mb-4">💸 Pague com PIX</h1>

      {/* PIX QR + Código */}
      <div className="bg-gray-100 p-4 rounded shadow max-w-md mx-auto mb-4 text-center">
        <h2 className="font-semibold mb-2">Aqui está o PIX copia e cola</h2>
        <input
          className="w-full text-center p-2 bg-white rounded border"
          value={config.chave_pix || '00020126360014...'}
          readOnly
        />
        <button
          onClick={() => navigator.clipboard.writeText(config.chave_pix || '00020126360014...')}
          className="mt-2 text-sm text-blue-500 underline"
        >
          Copiar
        </button>

        <img
          src={config.qr_code || 'https://api.qrserver.com/v1/create-qr-code/?data=00020126360014...&size=150x150'}
          alt="QR Code"
          className="mx-auto my-4"
        />

        <button
          className="w-full bg-green-500 text-white p-3 rounded font-bold mt-2"
          onClick={handleConfirm}
        >
          Confirmar pagamento
        </button>

        <p className="text-sm mt-4 text-gray-500">
          Tempo restante para pagamento expirar: <span className="font-bold">{formatTimer()}</span>
        </p>
      </div>

      {/* Instruções */}
      <div className="text-sm max-w-md mx-auto text-gray-600 leading-relaxed mt-6">
        <ol className="list-decimal list-inside">
          <li>Abra o aplicativo do seu banco</li>
          <li>Escolha a opção PIX e cole o código ou use a câmera</li>
          <li>Confirme as informações e finalize o pagamento</li>
        </ol>
      </div>
    </div>
  );
}
