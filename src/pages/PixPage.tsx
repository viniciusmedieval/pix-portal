
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import PixCode from "@/components/PixCode";
import { formatCurrency } from "@/lib/formatters";
import { ProductType } from "@/components/ProductCard";

// For this demo, we'll use a mock product and pix code
const mockProduct: ProductType = {
  id: "checkout-item-1",
  title: "Hotmart - Checkou Cash",
  description: "Domine as técnicas de vendas online com nosso curso completo.",
  price: 19.90,
  originalPrice: 29.90,
  imageUrl: "/lovable-uploads/5bdb8fb7-f326-419c-9013-3ab40582ff09.png"
};

const mockPixCode = "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142310a19520212Pagamento PIX5204000053039865802BR5913Recipient Name6009SAO PAULO62070503***63040A45";

const PixPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would generate a PIX code
        // For demo, use mock data
        setProduct(mockProduct);
        setPixCode(mockPixCode);
        
        // Simulate checking payment status
        const checkPaymentInterval = setInterval(() => {
          // Random success after some time for demo purposes
          if (Math.random() > 0.8) {
            setPaymentStatus('success');
            clearInterval(checkPaymentInterval);
          }
        }, 5000);
        
        return () => clearInterval(checkPaymentInterval);
      } catch (err) {
        console.error('Error fetching PIX data:', err);
        setError('Não foi possível gerar o código PIX.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBackToCheckout = () => {
    navigate(`/checkout/${id}`);
  };

  const handlePixExpired = () => {
    setError('O código PIX expirou. Por favor, retorne ao checkout para gerar um novo código.');
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
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error || 'Não foi possível gerar o código PIX.'}
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={handleBackToCheckout}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
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
                Você receberá um email com os detalhes da sua compra.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button onClick={() => window.location.href = "/"}>
              Retornar à loja
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-burgundy-800 text-white py-3">
        <div className="container px-4 mx-auto flex items-center justify-center">
          <h1 className="text-lg font-medium">Pagamento via PIX</h1>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={handleBackToCheckout}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao checkout
        </Button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <PixCode 
              pixCode={pixCode} 
              expirationMinutes={15} 
              onExpire={handlePixExpired}
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
                        src={product.imageUrl || "https://placehold.co/400x300"} 
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
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(product.originalPrice || product.price)}</span>
                    </div>
                    
                    {product.originalPrice && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Desconto:</span>
                        <span>-{formatCurrency(product.originalPrice - product.price)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold mt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(product.price)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                Assim que o pagamento for confirmado, você receberá um email com os detalhes da sua compra.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 bg-gray-100 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} PixPortal. Todos os direitos reservados.</p>
          <div className="mt-2">
            <a href="#" className="text-gray-600 hover:text-primary mx-2">Termos de Uso</a>
            <a href="#" className="text-gray-600 hover:text-primary mx-2">Política de Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PixPage;
