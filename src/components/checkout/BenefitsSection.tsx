
import React from 'react';
import { Shield } from 'lucide-react';

interface BenefitsSectionProps {
  benefits: {
    text: string;
    icon: string;
  }[];
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow mb-6">
      <h2 className="font-medium text-lg mb-4">Benefícios</h2>
      <ul className="space-y-4">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>{benefit.text}</span>
          </li>
        ))}
        
        {/* Guarantee box */}
        <li className="mt-6 border border-blue-100 rounded-lg p-4 bg-blue-50">
          <div className="flex items-start">
            <div className="text-blue-500 mr-2">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Garantia de 7 dias</p>
              <p className="text-sm text-gray-600">Se não estiver satisfeito, devolvemos seu dinheiro</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default BenefitsSection;
