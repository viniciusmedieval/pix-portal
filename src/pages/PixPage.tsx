
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/config/configService';
import { getPixConfig } from '@/services/config/pixConfigService';
import { criarPedido } from '@/services/pedidoService';
import { toast } from '@/hooks/use-toast';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import CustomPixTemplate from '@/components/pix/CustomPixTemplate';
import DefaultPixTemplate from '@/components/pix/DefaultPixTemplate';
import CustomizedPixPage from '@/components/pix/CustomizedPixPage';

export default function PixPage() {
  const { slug } = useParams();
  const [produto, setProduto] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [pix, setPix] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { verificarPagamento, verifyingPayment } = usePaymentVerification(produto, slug);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      try {
        const produtoData = await getProdutoBySlug(slug);
        if (produtoData) {
          setProduto(produtoData);
          
          // Fetch checkout config
          const configData = await getConfig(produtoData.id);
          console.log('Fetched config data:', configData);
          setConfig(configData);
          
          // Fetch PIX specific config
          const pixConfig = await getPixConfig(produtoData.id);
          console.log("PIX config loaded:", pixConfig);
          setPix(pixConfig);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

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
        toast({
          title: "Verificando pagamento",
          description: "Aguarde enquanto verificamos o seu pagamento PIX...",
        });
        
        // Start payment verification
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

  // Log the actual values before rendering
  console.log("PixPage render - beneficiary name:", config.nome_beneficiario);
  console.log("PIX config from DB:", pix);
  console.log("Combined config:", config);

  // Always use the new customized PIX page with improved design
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <CustomizedPixPage
        config={config}
        produto={produto}
        pixConfig={pix}
        pixCode={pix?.codigo_copia_cola || config.chave_pix || ''}
        qrCodeUrl={pix?.qr_code_url || config.qr_code || ''}
        handleConfirm={handleConfirm}
        verifyingPayment={verifyingPayment}
        expirationTime={pix?.tempo_expiracao || config.tempo_expiracao || 15}
      />
    </div>
  );
}
