
import { formatCurrency } from '@/lib/formatters';
import PixCode from '@/components/PixCode';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface DefaultPixTemplateProps {
  config: any;
  produto: any;
  handleConfirm: () => void;
  verifyingPayment: boolean;
  customerInfo?: {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
  };
}

const DefaultPixTemplate = ({ 
  config, 
  produto, 
  handleConfirm, 
  verifyingPayment,
  customerInfo 
}: DefaultPixTemplateProps) => {
  console.log("DefaultPixTemplate rendering with config:", config);
  console.log("PIX specific fields:", {
    chave_pix: config.chave_pix,
    nome_beneficiario: config.nome_beneficiario,
    tipo_chave: config.tipo_chave,
    expiration: config.tempo_expiracao,
    whatsapp_number: config.whatsapp_number,
    whatsapp_message: config.whatsapp_message
  });
  
  const title = config.pix_titulo || 'Pague com PIX';
  const instructions = config.pix_subtitulo || 'Escaneie o QR Code ou copie o código para realizar o pagamento';
  const buttonText = config.pix_botao_texto || 'Confirmar pagamento';
  const securityText = config.pix_seguranca_texto || 'Pagamento 100% seguro e protegido';
  
  // Make sure we have a beneficiary name with a fallback
  const beneficiaryName = config.nome_beneficiario || 'Nome do Beneficiário';
  
  // WhatsApp functionality
  const showWhatsappButton = config.show_whatsapp_button !== false;
  const whatsappNumber = config.whatsapp_number || '';
  let whatsappMessage = config.whatsapp_message || 'Olá, acabei de realizar um pagamento via PIX e gostaria de confirmar meu pedido.';
  
  if (customerInfo && whatsappMessage) {
    // Replace placeholders in whatsapp message
    whatsappMessage = whatsappMessage
      .replace('{nome}', customerInfo.nome || '')
      .replace('{email}', customerInfo.email || '')
      .replace('{telefone}', customerInfo.telefone || '')
      .replace('{cpf}', customerInfo.cpf || '')
      .replace('{produto}', produto?.nome || 'Produto')
      .replace('{valor}', formatCurrency(produto?.preco || 0));
  }
  
  const handleWhatsAppClick = () => {
    if (!whatsappNumber) {
      toast({
        title: "Erro",
        description: "Número de WhatsApp não configurado.",
        variant: "destructive"
      });
      return;
    }
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <div className="min-h-screen p-6" style={{ background: config.cor_fundo || '#f5f5f7' }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <h1 className="text-xl font-bold text-center mb-4">{title}</h1>
        
        {/* Product Info */}
        {config.pix_mostrar_produto !== false && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold text-lg mb-2">{produto?.nome || 'Produto'}</h2>
            <p className="text-gray-700 mb-2">
              Valor: <span className="font-medium">{formatCurrency(produto?.preco || 0)}</span>
            </p>
          </div>
        )}

        {/* PIX Code Component */}
        <PixCode
          pixCode={config.chave_pix || ''}
          expirationMinutes={config.tempo_expiracao || 15}
          onExpire={() => toast({
            title: "Tempo expirado",
            description: "O tempo para pagamento expirou. Por favor, reinicie o processo.",
            variant: "destructive"
          })}
          qrCodeUrl={config.qr_code}
          beneficiaryName={beneficiaryName}
          pixKeyType={config.tipo_chave || 'email'}
          showQrOnMobile={config.mostrar_qrcode_mobile !== false}
        />

        {/* Instructions */}
        <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">{config.pix_instrucoes_titulo || 'Instruções:'}</h3>
          <p>{instructions}</p>
          
          {config.pix_instrucoes && Array.isArray(config.pix_instrucoes) && config.pix_instrucoes.length > 0 ? (
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {config.pix_instrucoes.map((instruction: string, index: number) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Security Message */}
        {securityText && (
          <div className="mt-4 text-xs text-center text-gray-500">
            {securityText}
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full mt-6 p-3 rounded font-bold text-white"
          style={{ backgroundColor: config.cor_botao || '#22c55e' }}
          disabled={verifyingPayment}
        >
          {verifyingPayment ? "Verificando pagamento..." : buttonText}
        </button>
        
        {/* WhatsApp Button */}
        {showWhatsappButton && whatsappNumber && (
          <Button
            onClick={handleWhatsAppClick}
            className="w-full mt-3 bg-[#25D366] hover:bg-[#128C7E] text-white"
            variant="outline"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              className="h-5 w-5 mr-2"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Enviar comprovante no WhatsApp
          </Button>
        )}
        
        {/* Customer Information if available */}
        {customerInfo && (
          <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Dados do cliente:</h3>
            <p><strong>Nome:</strong> {customerInfo.nome}</p>
            <p><strong>Email:</strong> {customerInfo.email}</p>
            <p><strong>Telefone:</strong> {customerInfo.telefone}</p>
            <p><strong>CPF:</strong> {customerInfo.cpf}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultPixTemplate;
