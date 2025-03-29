
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { getProdutoBySlug } from "@/services/produtoService";
import { getConfig } from "@/services/configService";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, ArrowRight, CreditCard } from "lucide-react";

export default function CartaoPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [producto, setProduto] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);

  useEffect(() => {
    // Load any retry attempts from local storage
    const storedAttempts = localStorage.getItem(`payment-retry-${slug}`);
    if (storedAttempts) {
      setRetryAttempts(parseInt(storedAttempts, 10));
    }
    
    const fetchData = async () => {
      try {
        console.log("Fetching data for payment failed page. Slug:", slug);
        if (!slug) return;
        
        const productData = await getProdutoBySlug(slug);
        console.log("Product data loaded:", productData);
        setProduto(productData);
        
        if (productData?.id) {
          const configData = await getConfig(productData.id);
          console.log("Config data loaded:", configData);
          setConfig(configData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do produto",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  const handleTryAgain = () => {
    // Increment retry attempts and save to local storage
    const newAttempts = retryAttempts + 1;
    setRetryAttempts(newAttempts);
    localStorage.setItem(`payment-retry-${slug}`, newAttempts.toString());
    
    // Go back to checkout page
    navigate(`/checkout/${slug}`);
  };
  
  const handlePayWithPix = () => {
    if (!slug) return;
    navigate(`/checkout/${slug}/pix`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // If no product was found, show a user-friendly error
  if (!producto) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Produto não encontrado
            </h1>
            
            <p className="mt-2 text-gray-600">
              Não conseguimos encontrar o produto solicitado.
              Verifique se o link está correto ou tente novamente mais tarde.
            </p>
          </div>
          
          <Button 
            className="w-full py-6 text-lg flex items-center justify-center gap-2"
            onClick={() => navigate('/')}
          >
            Voltar para a página inicial
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  const buttonColor = config?.cor_botao || '#22c55e';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md space-y-8">
        <Card className="border-red-100 shadow-lg">
          <CardContent className="pt-6 px-6 pb-6">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              
              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Pagamento não aprovado
              </h1>
              
              <p className="mt-3 text-gray-600">
                Infelizmente não conseguimos processar seu pagamento com cartão. 
                Por favor, verifique os dados do cartão ou escolha outro método de pagamento.
              </p>
              
              {retryAttempts > 0 && (
                <div className="mt-4 px-4 py-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-sm">
                  <p>Você já tentou {retryAttempts} {retryAttempts === 1 ? 'vez' : 'vezes'} com este cartão.</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4 mt-8">
              <Button 
                className="w-full py-6 text-lg flex items-center justify-center gap-2" 
                style={{ backgroundColor: buttonColor }}
                onClick={handleTryAgain}
              >
                <CreditCard className="h-5 w-5 mr-1" />
                Tentar novamente com outro cartão
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-50 px-2 text-gray-500">ou</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full py-6 text-lg flex items-center justify-center gap-2"
                onClick={handlePayWithPix}
              >
                <img src="/pix-logo.png" alt="PIX" className="h-5 w-5 mr-2" />
                Pagar com PIX
              </Button>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                <button 
                  onClick={() => navigate(`/checkout/${slug}`)}
                  className="text-sm text-blue-600 hover:underline flex items-center justify-center mx-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar para a página de pagamento
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
