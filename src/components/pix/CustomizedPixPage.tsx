
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Copy, Check, ChevronDown, ChevronUp, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from '@/hooks/use-toast';

interface CustomizedPixPageProps {
  config: any;
  produto: any;
  pixCode: string;
  qrCodeUrl: string;
  handleConfirm: () => void;
  verifyingPayment: boolean;
  expirationTime: number;
}

const CustomizedPixPage = ({
  config,
  produto,
  pixCode,
  qrCodeUrl,
  handleConfirm,
  verifyingPayment,
  expirationTime
}: CustomizedPixPageProps) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(expirationTime * 60);
  const [isExpanded, setIsExpanded] = useState(false);

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
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast({
      title: config.pix_texto_copiado || 'Código copiado!',
      description: 'O código PIX foi copiado para a área de transferência.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const timerText = (config.pix_timer_texto || 'Faltam {minutos}:{segundos} minutos para o pagamento expirar...')
    .replace('{minutos}', formatTime().minutes)
    .replace('{segundos}', formatTime().seconds);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow my-4">
      {/* PIX Code Section */}
      <div className="p-5 border-b">
        <h2 className="text-lg font-semibold mb-2">
          {config.pix_titulo || 'Aqui está o PIX copia e cola'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {config.pix_subtitulo || 'Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.'}
        </p>
        
        <div className="flex space-x-4">
          {/* PIX code */}
          <div className="flex-1">
            <div className="relative bg-gray-100 p-3 rounded-md">
              <code className="text-xs block truncate">
                {pixCode}
              </code>
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 h-7 w-7"
                onClick={handleCopy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="w-24 h-24 border flex items-center justify-center">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code PIX" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center text-gray-400">
                <Info size={24} className="mx-auto mb-1" />
                <span className="text-xs">QR Code</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Confirm button */}
        <Button 
          className="w-full mt-4"
          variant="outline"
          onClick={handleConfirm}
          disabled={verifyingPayment}
        >
          <span className="flex items-center justify-center">
            {verifyingPayment ? "Verificando..." : (config.pix_botao_texto || "Confirmar pagamento")}
          </span>
        </Button>
      </div>
      
      {/* Timer */}
      <div className="p-3 border-b bg-gray-100 text-center">
        <p className="text-sm text-gray-700">{timerText}</p>
      </div>
      
      {/* Instructions */}
      <div className="p-5 border-b">
        <h3 className="font-semibold mb-3">
          {config.pix_instrucoes_titulo || 'Para realizar o pagamento:'}
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>{config.pix_instrucoes?.[0] || 'Abra o aplicativo do seu banco:'}</li>
          <li>{config.pix_instrucoes?.[1] || 'Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code:'}</li>
          <li>{config.pix_instrucoes?.[2] || 'Confirme as informações e finalize o pagamento.'}</li>
        </ol>
        
        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-4 text-sm text-amber-800 flex items-start">
          <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>{config.pix_seguranca_texto || 'Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.'}</p>
        </div>
      </div>
      
      {/* Learn More Accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="learn-more">
          <AccordionTrigger className="px-5 py-3">
            {config.pix_saiba_mais_texto || 'Saiba mais'}
          </AccordionTrigger>
          <AccordionContent className="px-5 py-3 text-sm text-gray-600">
            <p>Para mais informações sobre pagamentos PIX, consulte o site do seu banco ou entre em contato com o suporte.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Purchase Summary */}
      {config.pix_mostrar_produto !== false && (
        <div className="p-5 border-t">
          <h3 className="font-semibold mb-3">{config.pix_compra_titulo || 'Sua Compra'}</h3>
          
          <div className="flex items-center justify-between">
            {produto.imagem_url && (
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-contain" />
              </div>
            )}
            
            <div className="flex-grow">
              <h4 className="text-sm font-medium">{produto.nome}</h4>
              {produto.descricao && <p className="text-xs text-gray-500">{produto.descricao.substring(0, 60)}...</p>}
            </div>
            
            <div className="text-right">
              <span className="text-sm text-gray-500">(1)</span>
              <p className="font-semibold">{formatCurrency(produto.preco)}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      {config.pix_mostrar_termos !== false && (
        <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center rounded-b-lg">
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
