
import { Check, Shield, Clock } from 'lucide-react';
import { BenefitItem } from '@/types/checkoutConfig';

interface BenefitsListProps {
  benefits: BenefitItem[];
  showGuarantees?: boolean;
  guaranteeDays?: number;
}

export default function BenefitsList({ 
  benefits, 
  showGuarantees = true, 
  guaranteeDays = 7 
}: BenefitsListProps) {
  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 text-green-500 mr-2">
              <Check className="h-5 w-5" />
            </div>
            <span className="text-sm">{benefit.text}</span>
          </li>
        ))}
        
        {showGuarantees && (
          <li className="flex items-start pt-3 mt-3 border-t border-gray-100">
            <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-medium">Garantia de {guaranteeDays} dias</span>
              <p className="text-xs text-gray-500">
                Se não estiver satisfeito, devolvemos seu dinheiro
              </p>
            </div>
          </li>
        )}

        <li className="flex items-start pt-3 mt-3 border-t border-gray-100">
          <div className="flex-shrink-0 w-5 h-5 text-green-500 mr-2">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-medium">Acesso imediato</span>
            <p className="text-xs text-gray-500">
              Após a confirmação do pagamento, acesso liberado imediatamente
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}
