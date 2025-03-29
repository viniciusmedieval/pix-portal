
import { formatCurrency } from '@/lib/formatters';
import PixCode from '@/components/PixCode';
import { toast } from '@/hooks/use-toast';

interface DefaultPixTemplateProps {
  config: any;
  produto: any;
  handleConfirm: () => void;
  verifyingPayment: boolean;
}

const DefaultPixTemplate = ({ 
  config, 
  produto, 
  handleConfirm, 
  verifyingPayment 
}: DefaultPixTemplateProps) => {
  console.log("DefaultPixTemplate rendering with config:", config);
  console.log("PIX specific fields:", {
    chave_pix: config.chave_pix,
    nome_beneficiario: config.nome_beneficiario,
    tipo_chave: config.tipo_chave,
    expiration: config.tempo_expiracao
  });
  
  const title = config.pix_titulo || 'Pague com PIX';
  const instructions = config.pix_subtitulo || 'Escaneie o QR Code ou copie o código para realizar o pagamento';
  const buttonText = config.pix_botao_texto || 'Confirmar pagamento';
  const securityText = config.pix_seguranca_texto || 'Pagamento 100% seguro e protegido';
  
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
          beneficiaryName={config.nome_beneficiario || 'Nome do Beneficiário'}
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
      </div>
    </div>
  );
};

export default DefaultPixTemplate;
