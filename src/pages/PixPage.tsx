
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CheckCircle, Clock } from "lucide-react";
import PixCode from "@/components/PixCode";
import { formatCurrency } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";
import { ProductType } from "@/components/ProductCard";

export default function PixPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const pedido_id = searchParams.get('pedido_id');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<ProductType | null>(null);
  const [pedido, setPedido] = useState<any | null>(null);
  const [config, setConfig] = useState<any | null>(null);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!pedido_id) {
        setError('ID do pedido não encontrado');
        setLoading(false);
        return;
      }
      
      try {
        const { data: pedidoData } = await supabase
          .from('pedidos')
          .select('*, produtos(*)')
          .eq('id', pedido_id)
          .single();
        
        setPedido(pedidoData);
        
        if (pedidoData?.produtos) {
          setProduct({
            id: pedidoData.produtos.id,
            title: pedidoData.produtos.nome,
            description: pedidoData.produtos.descricao || "",
            price: pedidoData.valor || pedidoData.produtos.preco,
            imageUrl: pedidoData.produtos.imagem || "/placeholder.svg"
          });
          
          const { data: configData } = await supabase
            .from('config_checkout')
            .select('*')
            .eq('produto_id', pedidoData.produtos.id)
            .single();
          
          setConfig(configData);
          setPixCode(configData?.chave_pix || "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142310a19520212Pagamento PIX5204000053039865802BR5913Recipient Name6009SAO PAULO62070503***63040A45");
        }
        
        const checkPaymentInterval = setInterval(() => {
          // Simulate payment confirmation after random time
          if (Math.random() > 0.8) {
            setPaymentStatus('success');
            clearInterval(checkPaymentInterval);
          }
        }, 5000);
        
        return () => clearInterval(checkPaymentInterval);
      } catch (err) {
        console.error('Error fetching PIX data:', err);
        setError('Não foi possível carregar os dados do pagamento PIX.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pedido_id]);

  const handleBackToCheckout = () => {
    navigate(`/checkout/${slug}`);
  };

  const handlePixExpired = () => {
    setError('O código PIX expirou. Por favor, retorne ao checkout para gerar um novo código.');
  };

  const handleCopyCode = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleConfirm = async () => {
    try {
      await supabase.from('pedidos').update({ status: 'pago' }).eq('id', pedido_id);
      setPaymentStatus('success');
      toast({
        title: "Pagamento confirmado!",
        description: "Seu pagamento foi confirmado com sucesso.",
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível confirmar o pagamento.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Gerando código PIX...</div>
      </div>
    );
  }

  if (error || !product || !pixCode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error || 'Não foi possível gerar o código PIX.'}
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={handleBackToCheckout}
          >
            Voltar ao checkout
          </Button>
        </Alert>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center bg-green-50 border-b">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <CardTitle className="text-xl text-green-700">
              Pagamento Confirmado!
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Seu pagamento de <strong>{formatCurrency(product.price)}</strong> foi confirmado.
              </p>
              <p className="text-gray-700">
                {config?.mensagem_pix || "Você receberá um email com os detalhes da sua compra."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-3">
        <div className="container px-4 mx-auto flex items-center justify-center">
          <h1 className="text-lg font-medium">Pagamento via PIX</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={handleBackToCheckout}
        >
          Voltar ao checkout
        </Button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <PixCode 
              pixCode={pixCode} 
              expirationMinutes={config?.tempo_expiracao || 15} 
              onExpire={handlePixExpired}
              qrCodeUrl={config?.qr_code}
            />
          </div>

          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo da compra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img 
                        src={product.imageUrl || "/placeholder.svg"} 
                        alt={product.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-gray-500">{product.description}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold mt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(product.price)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={handleConfirm}
                  >
                    Confirmar pagamento
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                {config?.mensagem_pix || "Assim que o pagamento for confirmado, você receberá um email com os detalhes da sua compra."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
