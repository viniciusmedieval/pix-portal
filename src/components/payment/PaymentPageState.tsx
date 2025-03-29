
import { Loader, AlertCircle, CheckCircle } from "lucide-react";

interface PaymentPageStateProps {
  loading: boolean;
  hasData: boolean;
  success?: boolean;
}

export default function PaymentPageState({ loading, hasData, success }: PaymentPageStateProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-60 bg-white rounded-xl shadow-md">
        <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-center text-lg font-medium text-gray-700">Carregando informações de pagamento...</p>
        <p className="text-center text-gray-500 mt-2">Por favor, aguarde enquanto processamos sua solicitação.</p>
      </div>
    );
  }
  
  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-60 bg-white rounded-xl shadow-md">
        <div className="rounded-full bg-yellow-100 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-yellow-600" />
        </div>
        <p className="text-center text-lg font-medium text-gray-700">Informações de pagamento não encontradas.</p>
        <p className="text-center text-gray-500 mt-2">Verifique se você acessou a página corretamente através do checkout.</p>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-60 bg-white rounded-xl shadow-md">
        <div className="rounded-full bg-green-100 p-4 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-center text-lg font-medium text-gray-700">Pagamento processado com sucesso!</p>
        <p className="text-center text-gray-500 mt-2">Você receberá a confirmação por email em breve.</p>
      </div>
    );
  }
  
  return null;
}
