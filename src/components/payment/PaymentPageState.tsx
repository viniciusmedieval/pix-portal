
import { Loader } from "lucide-react";

interface PaymentPageStateProps {
  loading: boolean;
  hasData: boolean;
}

export default function PaymentPageState({ loading, hasData }: PaymentPageStateProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-48">
        <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-center text-gray-600">Carregando informações de pagamento...</p>
      </div>
    );
  }
  
  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-48">
        <div className="rounded-full bg-yellow-100 p-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-yellow-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-center text-gray-600">Informações de pagamento não encontradas.</p>
        <p className="text-center text-sm text-gray-500 mt-2">Verifique o link ou tente novamente mais tarde.</p>
      </div>
    );
  }
  
  return null;
}
