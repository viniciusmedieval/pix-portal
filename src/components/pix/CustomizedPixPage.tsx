
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Copy, Check, ChevronDown, ChevronUp, Info, AlertTriangle, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CustomizedPixPageProps {
  config: any;
  produto: any;
  pixConfig?: any; // PIX specific configuration
  pixCode: string;
  qrCodeUrl: string;
  handleConfirm: () => void;
  verifyingPayment: boolean;
  expirationTime: number;
}

const CustomizedPixPage = ({
  config,
  produto,
  pixConfig,
  pixCode,
  qrCodeUrl,
  handleConfirm,
  verifyingPayment,
  expirationTime
}: CustomizedPixPageProps) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(expirationTime * 60);
  const [isExpanded, setIsExpanded] = useState(false);

  // For better code organization, merge configs with priority for PIX config
  const mergedConfig = {
    ...config,
    ...(pixConfig || {})
  };

  // Timer for countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time for display
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      setCopied(true);
      
      const copyMessage = pixConfig?.texto_copiado || config.pix_texto_copiado || 'Código copiado!';
      toast({
        title: copyMessage,
        description: 'O código PIX foi copiado para a área de transferência.'
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Build timer text with replacements for minutes and seconds
  const timerText = (() => {
    const template = pixConfig?.timer_texto || 
                    config.pix_timer_texto || 
                    'Faltam {minutos}:{segundos} para o pagamento expirar...';
    
    return template
      .replace('{minutos}', formatTime().minutes)
      .replace('{segundos}', formatTime().seconds);
  })();

  // Get instructions array
  const instructions = pixConfig?.instrucoes || config.pix_instrucoes || [
    'Abra o aplicativo do seu banco',
    'Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code',
    'Confirme as informações e finalize o pagamento'
  ];

  // Get configured display settings
  const showProduct = pixConfig?.mostrar_produto !== undefined 
    ? pixConfig.mostrar_produto 
    : (config.pix_mostrar_produto !== false);
    
  const showTerms = pixConfig?.mostrar_termos !== undefined 
    ? pixConfig.mostrar_termos 
    : (config.pix_mostrar_termos !== false);
  
  // Get beneficiary information
  const beneficiaryName = pixConfig?.nome_beneficiario || config.nome_beneficiario || 'Não informado';
  const pixKeyType = pixConfig?.tipo_chave || config.tipo_chave_pix || 'Email';

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg my-4 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 text-white">
        <h1 className="text-xl font-bold text-center">
          {pixConfig?.titulo || config.pix_titulo || 'Pagamento via PIX'}
        </h1>
        <p className="text-sm opacity-90 text-center">
          {pixConfig?.instrucao || config.pix_subtitulo || 'Copie o código ou use o QR Code para realizar o pagamento'}
        </p>
      </div>

      <div className="p-6 grid md:grid-cols-5 gap-6">
        {/* Left column */}
        <div className="md:col-span-3 space-y-6">
          {/* PIX Code Section */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Copie e cole o código PIX
                </h2>
                <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  PIX
                </div>
              </div>
              
              <div className="relative bg-gray-50 border rounded-md p-3">
                <code className="text-sm block truncate pr-10 font-mono">
                  {pixCode}
                </code>
                <Button
                  size="sm"
                  variant={copied ? "default" : "outline"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-700 flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Informações do beneficiário:</p>
                  <p>Nome: <span className="font-medium">{beneficiaryName}</span></p>
                  <p>Tipo de chave: <span className="font-medium">{pixKeyType}</span></p>
                  <p>Valor: <span className="font-medium">{formatCurrency(produto.preco)}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timer */}
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-center">
            <p className="text-amber-800 font-medium">{timerText}</p>
          </div>

          {/* Instructions */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-gray-800">
                {pixConfig?.instrucoes_titulo || config.pix_instrucoes_titulo || 'Para realizar o pagamento:'}
              </h3>
              <ol className="list-decimal pl-5 space-y-3 text-sm">
                {instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-700">{instruction}</li>
                ))}
              </ol>
              
              {/* Security Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex items-start mt-4">
                <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0 text-amber-600" />
                <p>
                  {pixConfig?.seguranca_texto || 
                   config.pix_seguranca_texto || 
                   'Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Confirm Button */}
          <Button 
            className="w-full py-6 text-base font-bold"
            style={{ backgroundColor: config.cor_botao || '#10b981' }}
            onClick={handleConfirm}
            disabled={verifyingPayment}
          >
            {verifyingPayment 
              ? "Verificando pagamento..." 
              : (pixConfig?.botao_texto || config.pix_botao_texto || "Confirmar pagamento")}
          </Button>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-6">
          {/* QR Code */}
          <Card className="overflow-hidden">
            <div className="bg-gray-50 p-3 border-b text-center">
              <h3 className="font-medium text-gray-700">QR Code PIX</h3>
            </div>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code PIX" 
                  className="w-48 h-48 object-contain border p-2 rounded" 
                />
              ) : (
                <div className="w-48 h-48 border rounded-md flex flex-col items-center justify-center text-gray-400">
                  <QrCode size={64} className="mb-2" />
                  <span className="text-sm">QR Code não disponível</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-3 text-center">
                Escaneie o QR Code com o aplicativo do seu banco
              </p>
            </CardContent>
          </Card>

          {/* Purchase Summary */}
          {showProduct && (
            <Card>
              <div className="bg-gray-50 p-3 border-b">
                <h3 className="font-medium text-gray-700">
                  {pixConfig?.compra_titulo || config.pix_compra_titulo || 'Sua Compra'}
                </h3>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {produto.imagem_url && (
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                      <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-contain" />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h4 className="font-medium">{produto.nome}</h4>
                    {produto.descricao && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {produto.descricao}
                      </p>
                    )}
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Quantidade:</span>
                  <span>1</span>
                </div>
                <div className="flex justify-between items-center font-medium mt-1">
                  <span>Total:</span>
                  <span className="text-green-600">{formatCurrency(produto.preco)}</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Learn More Accordion */}
          <Accordion type="single" collapsible className="bg-white border rounded-md">
            <AccordionItem value="learn-more" className="border-none">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                {pixConfig?.saiba_mais_texto || config.pix_saiba_mais_texto || 'Saiba mais sobre PIX'}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-sm text-gray-600">
                <p>O PIX é um meio de pagamento instantâneo criado pelo Banco Central do Brasil. Com ele, você pode fazer transferências e pagamentos em segundos, a qualquer hora do dia, todos os dias do ano, incluindo finais de semana e feriados.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* Footer */}
      {showTerms && (
        <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center border-t">
          <div className="flex justify-center space-x-2 mb-2">
            <a href={config.terms_url || '/termos'} className="hover:underline">Termos de Compra</a>
            <span>•</span>
            <a href={config.privacy_url || '/privacidade'} className="hover:underline">Política de Privacidade</a>
          </div>
          <div className="flex items-center justify-center">
            <span>{config.footer_text || 'Todos os direitos reservados'}</span>
            <span className="mx-2">•</span>
            <span className="text-green-500 flex items-center">
              <Check size={14} className="mr-1" />
              Compra 100% segura
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizedPixPage;
