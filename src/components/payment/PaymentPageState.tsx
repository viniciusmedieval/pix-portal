
interface PaymentPageStateProps {
  loading: boolean;
  hasData: boolean;
}

export default function PaymentPageState({ loading, hasData }: PaymentPageStateProps) {
  if (loading) return <div className="p-6 text-center">Carregando informações de pagamento...</div>;
  if (!hasData) return <div className="p-6 text-center">Informações de pagamento não encontradas.</div>;
  return null;
}
