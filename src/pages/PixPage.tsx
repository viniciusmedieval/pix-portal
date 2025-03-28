
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
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

  // Check if we should use the new customized PIX page
  const useCustomizedPage = true; // We can make this configurable later

  if (useCustomizedPage) {
    return (
      <CustomizedPixPage
        config={config}
        produto={produto}
        pixCode={pix?.codigo_copia_cola || config.chave_pix || ''}
        qrCodeUrl={pix?.qr_code_url || config.qr_code || ''}
        handleConfirm={handleConfirm}
        verifyingPayment={verifyingPayment}
        expirationTime={pix?.tempo_expiracao || config.tempo_expiracao || 15}
      />
    );
  }

  // Fallback to original templates if needed
  return pix ? (
    <CustomPixTemplate 
      pix={pix} 
      config={config} 
      handleConfirm={handleConfirm} 
      verifyingPayment={verifyingPayment} 
    />
  ) : (
    <DefaultPixTemplate 
      config={config} 
      produto={produto} 
      handleConfirm={handleConfirm} 
      verifyingPayment={verifyingPayment} 
    />
  );
}
