
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloseCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentFailedPage() {
  const { slug, pedidoId } = useParams<{ slug: string, pedidoId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    async function fetchPedido() {
      if (!pedidoId) return;
      
      try {
        const { data, error } = await supabase
          .from('pedidos')
          .select('*, produtos:produto_id(*)')
          .eq('id', pedidoId)
          .maybeSingle();
        
        if (error) throw error;
        setPedido(data);
      } catch (error) {
        console.error('Erro ao buscar pedido:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPedido();
  }, [pedidoId]);

  const handleTryAgain = () => {
    if (slug) {
      navigate(`/checkout/${slug}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container max-w-lg mx-auto py-12 px-4 min-h-[80vh] flex items-center justify-center">
      <Card className="w-full">
        <CardHeader className="bg-red-50 text-center border-b">
          <div className="flex justify-center mb-4">
            <CloseCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-700">Pagamento não aprovado</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-8 px-6">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">
              Infelizmente seu pagamento não foi aprovado. Por favor, verifique os dados do seu cartão e tente novamente.
            </p>
            
            {!loading && pedido && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800">Detalhes do pedido:</h3>
                <p className="text-sm text-gray-600">Produto: {pedido.produtos?.nome || 'N/A'}</p>
                <p className="text-sm text-gray-600">Valor: R$ {pedido.valor?.toFixed(2).replace('.', ',') || '0,00'}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <Button onClick={handleTryAgain} className="w-full bg-primary hover:bg-primary/90">
              Tentar novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
