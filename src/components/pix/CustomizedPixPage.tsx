
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Clock, Info, CreditCard, ArrowRight, ShieldCheck, Mail, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency } from '@/lib/formatters';
import { useIsMobile } from '@/hooks/use-mobile';
import PixFaqSection from './PixFaqSection';
import { Badge } from '@/components/ui/badge';

export default function CustomizedPixPage({ 
  config,
  produto,
  pixConfig,
  pixCode,
  qrCodeUrl,
  handleConfirm,
  verifyingPayment,
  expirationTime
}: {
  config: any;
  produto: any;
  pixConfig?: any;
  pixCode: string;
  qrCodeUrl?: string;
  handleConfirm: () => void;
  verifyingPayment: boolean;
  expirationTime?: number;
}) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({ minutes: 0, seconds: 0 });
  const isMobile = useIsMobile();
  
  // Convert type of key to readable format
  const getTipoChaveLabel = (tipo: string) => {
    const tipos = {
      'cpf': 'CPF',
      'cnpj': 'CNPJ',
      'email': 'E-mail',
      'telefone': 'Telefone',
      'aleatoria': 'Chave aleatória'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  // Setup timer
  useEffect(() => {
    if (!expirationTime) return;
    
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
    if (!timeLeft) return '';
    
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
    const name = pixConfig?.nome_beneficiario || config?.nome_beneficiario;
    return name || 'Nome não informado';
  };

  // Generate fake QR code content
  const getFakeQrCodeData = () => {
    if (qrCodeUrl) {
      return pixCode;
    }
    
    const fakePixData = `00020126330014BR.GOV.BCB.PIX0111${config.tipo_chave === 'email' ? 'email@example.com' : '12345678901'}5204000053039865802BR5913${getBeneficiaryName()}6008BRASILIA62070503***63041234`;
    
    return fakePixData;
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center" style={{ backgroundColor: config.cor_fundo || '#f5f5f7' }}>
      {/* Timer */}
      {timeLeft.minutes > 0 || timeLeft.seconds > 0 ? (
        <div className="w-full max-w-4xl mb-4 bg-red-600 text-white p-3 rounded-md text-center text-sm font-medium flex items-center justify-center animate-pulse">
          <Clock className="mr-2 h-4 w-4" />
          {formatTimer()}
        </div>
      ) : null}
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - QR code and PIX code */}
        <Card className="shadow-lg border-none">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xl text-gray-900">
              {config.pix_titulo || 'Pague com PIX'}
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              {config.pix_subtitulo || 'Escaneie o QR Code ou use o código para fazer o pagamento'}
            </p>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            {/* QR Code Section */}
            {!isMobile || (isMobile && config.mostrar_qrcode_mobile !== false) ? (
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 mb-3">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px]" />
                  ) : (
                    <QRCodeSVG 
                      value={getFakeQrCodeData()} 
                      size={isMobile ? 150 : 180}
                      bgColor={"#FFFFFF"}
                      fgColor={"#000000"}
                      level={"M"}
                      includeMargin={true}
                    />
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Escaneie o QR Code com o app do seu banco
                </p>
              </div>
            ) : null}
            
            {/* PIX Code Copy */}
            <div className="bg-white border border-gray-200 rounded-md p-3 sm:p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Código PIX:</span>
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
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-2 sm:p-3 text-xs font-mono break-all">
                {pixCode}
              </div>
            </div>
            
            {/* Enhanced Beneficiary Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 sm:p-4 mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Dados do Recebedor</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600">Beneficiário:</div>
                    <div className="font-semibold">{getBeneficiaryName()}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600">Tipo de chave:</div>
                    <div className="font-semibold">{getTipoChaveLabel(config.tipo_chave || 'email')}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Instructions - Enhanced with better styling similar to the image */}
            <div className="mb-6 bg-gray-50 border border-gray-100 rounded-lg p-4 sm:p-5">
              <h3 className="font-medium text-gray-900 text-center mb-4 text-lg">
                {config.pix_instrucoes_titulo || 'Para realizar o pagamento:'}
              </h3>
              <ol className="space-y-4">
                {(config.pix_instrucoes || [
                  'Abra o aplicativo do seu banco',
                  'Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code',
                  'Confirme as informações e finalize o pagamento'
                ]).map((instrucao: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 text-sm sm:text-base">{instrucao}</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
        
        {/* Right column - Order summary and payment button */}
        <div className="space-y-6">
          {/* Product Summary with Highlighted Price */}
          {config.pix_mostrar_produto !== false && produto && (
            <Card className="shadow-lg border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-900">
                  {config.pix_compra_titulo || 'Resumo da Compra'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-600">Produto:</span>
                    <span className="font-medium">{produto.nome}</span>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(produto.preco)}</span>
                  </div>
                </div>
                
                {/* Highlighted Payment Amount */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 bg-primary/10 rounded-lg">
                  <span className="text-lg font-bold mb-2 sm:mb-0">Total:</span>
                  <div className="text-right">
                    <Badge className="mb-1" variant="outline">Preço à vista</Badge>
                    <div className="text-xl sm:text-2xl font-bold text-primary">{formatCurrency(produto.preco)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Action Button */}
          <Card className="shadow-lg border-none">
            <CardContent className="p-4 sm:p-6">
              <Button 
                className="w-full py-4 sm:py-6 text-base sm:text-lg rounded-md flex items-center justify-center gap-2" 
                style={{ backgroundColor: config.cor_botao || '#22c55e' }}
                onClick={handleConfirm}
                disabled={verifyingPayment}
              >
                {verifyingPayment ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verificando pagamento...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>{config.pix_botao_texto || 'Confirmar pagamento'}</span>
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </>
                )}
              </Button>
              
              {/* Security Message */}
              {config.pix_seguranca_texto && (
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 sm:p-4 mt-4 flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    {config.pix_seguranca_texto}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-2 text-gray-600 mt-4">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm">Pagamento 100% seguro</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Terms */}
          {config.pix_mostrar_termos && (
            <div className="text-center text-xs text-gray-500">
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
        </div>
      </div>
      
      {/* FAQ Section */}
      {produto && <PixFaqSection productId={produto.id} />}
      
      {/* Learn More */}
      {config.pix_saiba_mais_texto && (
        <div className="mt-8 text-center">
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
    </div>
  );
}
