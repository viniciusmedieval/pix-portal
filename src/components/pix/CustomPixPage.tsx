
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Clock, Info } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency } from '@/lib/formatters';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';

export default function CustomPixPage() {
  const { id: productIdOrSlug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [config, setConfig] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!productIdOrSlug) return;
        
        // Load product first to get the valid UUID
        const productData = await getProdutoBySlug(productIdOrSlug);
        
        if (!productData) {
          toast({
            title: "Erro",
            description: "Produto não encontrado",
            variant: "destructive",
          });
          return;
        }
        
        setProduct(productData);
        
        // Now fetch config with the valid product ID
        const configData = await getConfig(productData.id);
        setConfig(configData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as informações de pagamento",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [productIdOrSlug, toast]);

  // Setup timer
  useEffect(() => {
    if (!config || !config.tempo_expiracao) return;
    
    const expirationMinutes = config.tempo_expiracao;
    let totalSeconds = expirationMinutes * 60;
    
    const intervalId = setInterval(() => {
      totalSeconds -= 1;
      
      if (totalSeconds <= 0) {
        clearInterval(intervalId);
        toast({
          title: "Tempo expirado",
          description: "O tempo para pagamento expirou. Por favor, reinicie o processo.",
          variant: "destructive",
        });
        // Redirect to checkout after expiration
        navigate(`/checkout/${productIdOrSlug}`);
        return;
      }
      
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ minutes, seconds });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [config, productIdOrSlug, navigate, toast]);

  const handleCopyPixCode = () => {
    if (!config || !config.chave_pix) return;
    
    navigator.clipboard.writeText(config.chave_pix);
    setCopied(true);
    toast({
      title: config.pix_texto_copiado || "Código copiado!",
      description: "O código PIX foi copiado para a área de transferência",
    });
    
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmPayment = () => {
    navigate(`/success/${productIdOrSlug}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Carregando</h1>
          <p>Aguarde enquanto preparamos seu pagamento...</p>
        </div>
      </div>
    );
  }

  if (!config || !config.chave_pix) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Erro</h1>
          <p>Não foi possível carregar as informações de pagamento PIX.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate(`/checkout/${productIdOrSlug}`)}
          >
            Voltar para o checkout
          </Button>
        </div>
      </div>
    );
  }

  const formatTimer = () => {
    if (!timeLeft) return '';
    
    const { minutes, seconds } = timeLeft;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    const timerText = config.pix_timer_texto || 'Faltam {minutos}:{segundos} para o pagamento expirar...';
    return timerText
      .replace('{minutos}', formattedMinutes)
      .replace('{segundos}', formattedSeconds);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Timer */}
      {timeLeft && (
        <div className="w-full max-w-md mb-4 bg-red-600 text-white p-2 rounded-md text-center text-sm font-medium flex items-center justify-center">
          <Clock className="mr-2 h-4 w-4" />
          {formatTimer()}
        </div>
      )}
      
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              {config.pix_titulo || 'Aqui está o PIX copia e cola'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {config.pix_subtitulo || 'Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.'}
            </p>
          </div>
          
          {/* PIX Code Card */}
          <div className="bg-gray-100 rounded-md p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Código PIX:</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 flex items-center text-blue-600 hover:text-blue-800"
                onClick={handleCopyPixCode}
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? (config.pix_texto_copiado || "Copiado!") : "Copiar"}
              </Button>
            </div>
            <div className="bg-white border border-gray-200 rounded p-2 text-xs font-mono break-all">
              {config.chave_pix}
            </div>
          </div>
          
          {/* QR Code Section */}
          {config.qr_code && (
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white border border-gray-200 rounded-md p-3 mb-2">
                <QRCodeSVG value={config.chave_pix} size={180} />
              </div>
              <p className="text-sm text-gray-500">
                Escaneie o QR Code com o app do seu banco
              </p>
            </div>
          )}
          
          {/* Instructions */}
          <div className="mb-6">
            <h2 className="font-medium text-gray-900 mb-2">
              {config.pix_instrucoes_titulo || 'Para realizar o pagamento:'}
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
              {(config.pix_instrucoes || [
                'Abra o aplicativo do seu banco',
                'Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code',
                'Confirme as informações e finalize o pagamento'
              ]).map((instrucao: string, index: number) => (
                <li key={index}>{instrucao}</li>
              ))}
            </ol>
          </div>
          
          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-6 flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              {config.pix_seguranca_texto || 
                'Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.'}
            </p>
          </div>
          
          {/* Purchase Summary */}
          {config.pix_mostrar_produto && product && (
            <div className="mb-6">
              <h2 className="font-medium text-gray-900 mb-2">
                {config.pix_compra_titulo || 'Sua Compra'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Produto:</span>
                  <span className="text-sm font-medium">{product.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valor:</span>
                  <span className="text-sm font-medium">{formatCurrency(product.preco)}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <Button 
            className="w-full" 
            style={{ backgroundColor: config.cor_botao || '#22c55e' }}
            onClick={handleConfirmPayment}
          >
            {config.pix_botao_texto || 'Confirmar pagamento'}
          </Button>
          
          {/* Terms */}
          {config.pix_mostrar_termos && (
            <div className="mt-4 text-center text-xs text-gray-500">
              Ao efetuar o pagamento, você concorda com nossos{' '}
              <a href={config.terms_url || '/termos'} className="text-blue-600 hover:underline">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href={config.privacy_url || '/privacidade'} className="text-blue-600 hover:underline">
                Política de Privacidade
              </a>
            </div>
          )}
          
          {/* Learn More */}
          {config.pix_saiba_mais_texto && (
            <div className="mt-4 text-center">
              <a 
                href="https://www.bcb.gov.br/estabilidadefinanceira/pix" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {config.pix_saiba_mais_texto}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
