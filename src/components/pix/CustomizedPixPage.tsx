import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Clock, Info, CreditCard, DollarSign } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency } from '@/lib/formatters';
import { useIsMobile } from '@/hooks/use-mobile';
import PixFaqSection from './PixFaqSection';

interface CustomizedPixPageProps {
  config: any;
  produto: any;
  pixConfig: any;
  pixCode: string;
  qrCodeUrl: string;
  handleConfirm: () => void;
  verifyingPayment: boolean;
  expirationTime: number;
}

export default function CustomizedPixPage({
  config,
  produto,
  pixConfig,
  pixCode,
  qrCodeUrl,
  handleConfirm,
  verifyingPayment,
  expirationTime = 15
}: CustomizedPixPageProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({ minutes: 0, seconds: 0 });
  const isMobile = useIsMobile();
  
  console.log("CustomizedPixPage config:", config);
  console.log("Beneficiary name from config:", config.nome_beneficiario);
  
  // Convert type of key to readable format
  const getTipoChaveLabel = (tipo: string) => {
    const tipos = {
      'email': 'E-mail',
      'telefone': 'Telefone',
      'cpf': 'CPF',
      'cnpj': 'CNPJ',
      'aleatoria': 'Chave Aleatória'
    };
    return tipos[tipo as keyof typeof tipos] || 'Chave PIX';
  };
  
  // Should the QR code be displayed on this device?
  const shouldShowQRCode = () => {
    // Check if QR code URL exists
    if (!qrCodeUrl) return false;
    
    // If on mobile, check the mobile display setting
    if (isMobile) {
      return config.mostrar_qrcode_mobile !== false;
    }
    
    // Always show on desktop
    return true;
  };

  // Setup timer
  useEffect(() => {
    let totalSeconds = expirationTime * 60;
    
    const intervalId = setInterval(() => {
      totalSeconds -= 1;
      
      if (totalSeconds <= 0) {
        clearInterval(intervalId);
        toast({
          title: "Tempo expirado",
          description: "O tempo para pagamento expirou. Por favor, reinicie o processo.",
          variant: "destructive",
        });
        return;
      }
      
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ minutes, seconds });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [expirationTime, toast]);

  const handleCopyPixCode = () => {
    if (!pixCode) return;
    
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast({
      title: config.pix_texto_copiado || "Código copiado!",
      description: "O código PIX foi copiado para a área de transferência",
    });
    
    setTimeout(() => setCopied(false), 3000);
  };

  const formatTimer = () => {
    const { minutes, seconds } = timeLeft;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    const timerText = config.pix_timer_texto || 'Faltam {minutos}:{segundos} para o pagamento expirar...';
    return timerText
      .replace('{minutos}', formattedMinutes)
      .replace('{segundos}', formattedSeconds);
  };

  // Get beneficiary name with fallback
  const getBeneficiaryName = () => {
    // Try to get from pixConfig first, then config, then use default
    const name = pixConfig?.nome_beneficiario || config?.nome_beneficiario;
    return name || 'Nome não informado';
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
          
          {/* Payment value highlight */}
          <div className="bg-green-50 border border-green-100 rounded-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium text-gray-700">Valor a pagar:</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-lg text-green-600">{formatCurrency(produto.preco)}</span>
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Pagamento único</span>
              </div>
            </div>
          </div>
          
          {/* Beneficiary information */}
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Beneficiário:</span>
              <span className="text-sm font-bold">{getBeneficiaryName()}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm font-medium text-gray-600">Tipo de chave:</span>
              <span className="text-sm font-bold">{getTipoChaveLabel(config.tipo_chave || 'email')}</span>
            </div>
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
              {pixCode}
            </div>
          </div>
          
          {/* QR Code Section - Only show if shouldShowQRCode() returns true */}
          {shouldShowQRCode() && (
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white border border-gray-200 rounded-md p-3 mb-2">
                <QRCodeSVG value={pixCode} size={180} />
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
          {config.pix_mostrar_produto && produto && (
            <div className="mb-6">
              <h2 className="font-medium text-gray-900 mb-2">
                {config.pix_compra_titulo || 'Sua Compra'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Produto:</span>
                  <span className="text-sm font-medium">{produto.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valor:</span>
                  <span className="text-sm font-medium">{formatCurrency(produto.preco)}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <Button 
            className="w-full" 
            style={{ backgroundColor: config.cor_botao || '#22c55e' }}
            onClick={handleConfirm}
            disabled={verifyingPayment}
          >
            {verifyingPayment ? "Verificando pagamento..." : (config.pix_botao_texto || 'Confirmar pagamento')}
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
      
      {/* FAQ Section */}
      <div className="w-full max-w-md mt-6">
        <PixFaqSection />
      </div>
    </div>
  );
}
