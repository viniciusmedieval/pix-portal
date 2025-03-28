
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarStatusPagamento } from '@/services/pedidoService';
import { toast } from '@/hooks/use-toast';
import usePixel from '@/hooks/usePixel';

export function usePaymentVerification(produto: any, slug: string | undefined) {
  const navigate = useNavigate();
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  
  // Initialize pixels for purchase tracking
  const { trackEvent } = usePixel();

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
        if (!paymentConfirmed && produto) {
          trackEvent('Purchase', {
            value: produto.preco,
            currency: 'BRL',
            content_name: produto.nome,
            produtoId: produto.id
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

  return {
    verificarPagamento,
    verifyingPayment,
    paymentConfirmed,
    setPaymentConfirmed
  };
}
