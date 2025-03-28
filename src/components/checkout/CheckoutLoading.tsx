
import { Loader2 } from 'lucide-react';

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Carregando checkout...</h2>
        <p className="mt-2 text-gray-500">Aguarde enquanto preparamos sua experiência de compra</p>
      </div>
    </div>
  );
}
