
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { BenefitItem } from '@/types/checkoutConfig';

interface BenefitsListProps {
  benefits: BenefitItem[];
  showGuarantees?: boolean;
  guaranteeDays?: number;
}

const BenefitsList: React.FC<BenefitsListProps> = ({ 
  benefits, 
  showGuarantees = false, 
  guaranteeDays = 7 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">O que você vai receber</h3>
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <span>{benefit.text}</span>
          </li>
        ))}
        
        {showGuarantees && (
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <span>Garantia de {guaranteeDays} dias ou seu dinheiro de volta</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default BenefitsList;
