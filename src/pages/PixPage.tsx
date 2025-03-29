
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/config/configService';
import { getPixConfig } from '@/services/config/pixConfigService';
import { criarPedido } from '@/services/pedidoService';
import { toast } from 'sonner';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import CustomizedPixPage from '@/components/pix/CustomizedPixPage';

export default function PixPage() {
  const { slug } = useParams();
  const [produto, setProduto] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [pix, setPix] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: ''
  });
  
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
        } else {
          console.error("Product not found for slug:", slug);
          toast.error("Produto não encontrado");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        toast.error("Ocorreu um erro ao carregar os dados");
      }
    };
    
    fetchData();
  }, [slug]);

  // Get customer information from localStorage if available
  useEffect(() => {
    const savedCustomerInfo = localStorage.getItem('customerInfo');
    if (savedCustomerInfo) {
      try {
        const parsedInfo = JSON.parse(savedCustomerInfo);
        setCustomerInfo(parsedInfo);
      } catch (e) {
        console.error("Error parsing saved customer info:", e);
      }
    }
  }, []);

  const handleConfirm = async () => {
    if (!produto) return;
    
    try {
      // Check if we already have a pedido ID
      if (!pedidoId) {
        // Create order in database with customer information
        console.log("Creating PIX order for product:", produto.id);
        const pedido = await criarPedido({
          produto_id: produto.id,
          nome_cliente: customerInfo.nome || 'Cliente PIX',
          email_cliente: customerInfo.email || 'pix@email.com',
          telefone_cliente: customerInfo.telefone || '',
          cpf_cliente: customerInfo.cpf || '',
          valor: produto.preco,
          forma_pagamento: 'pix',
          status: 'pendente',
        });
        
        if (pedido && pedido.id) {
          console.log("PIX order created with ID:", pedido.id);
          setPedidoId(pedido.id);
          
          toast("Verificando pagamento", {
            description: "Aguarde enquanto verificamos o seu pagamento PIX...",
          });
          
          // Start payment verification
          verificarPagamento(pedido.id);
        } else {
          throw new Error("Falha ao criar pedido");
        }
      } else {
        // If pedido already exists, just verify payment
        console.log("Using existing pedido ID:", pedidoId);
        verificarPagamento(pedidoId);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Ocorreu um erro ao confirmar o pagamento. Tente novamente.");
    }
  };

  if (loading) return <div className="p-6 text-center">Carregando informações de pagamento...</div>;
  if (!config || !produto) return <div className="p-6 text-center">Informações de pagamento não encontradas.</div>;

  // Combine default config with PIX-specific config if available
  const combinedConfig = pix ? {
    ...config,
    chave_pix: pix.codigo_copia_cola || config.chave_pix,
    qr_code: pix.qr_code_url || config.qr_code,
    nome_beneficiario: pix.nome_beneficiario || config.nome_beneficiario,
    tempo_expiracao: pix.tempo_expiracao || config.tempo_expiracao
  } : config;

  // Log the actual values before rendering
  console.log("PixPage render - combined config:", combinedConfig);
  console.log("Customer info for PIX order:", customerInfo);

  // Use the customized PIX page with improved design
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <CustomizedPixPage
        config={combinedConfig}
        produto={produto}
        pixConfig={pix}
        pixCode={pix?.codigo_copia_cola || config.chave_pix || ''}
        qrCodeUrl={pix?.qr_code_url || config.qr_code || ''}
        handleConfirm={handleConfirm}
        verifyingPayment={verifyingPayment}
        expirationTime={pix?.tempo_expiracao || config.tempo_expiracao || 15}
        customerInfo={customerInfo}
      />
    </div>
  );
}
