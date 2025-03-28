
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
  return (
    <div className="min-h-screen p-6" style={{ background: config.cor_fundo }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <h1 className="text-xl font-bold text-center mb-4">Pague com PIX</h1>
        
        {/* Product Info */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold text-lg mb-2">{produto?.nome}</h2>
          <p className="text-gray-700 mb-2">
            Valor: <span className="font-medium">{formatCurrency(produto.preco)}</span>
          </p>
        </div>

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
        />

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full mt-6 p-3 rounded font-bold text-white"
          style={{ backgroundColor: config.cor_botao }}
          disabled={verifyingPayment}
        >
          {verifyingPayment ? "Verificando pagamento..." : "Confirmar pagamento"}
        </button>

        {/* Instructions */}
        {config.mensagem_pix && (
          <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Instruções:</h3>
            <p>{config.mensagem_pix}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultPixTemplate;
