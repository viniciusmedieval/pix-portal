
import { Link } from "react-router-dom";
import { Mail, Phone, Copyright } from "lucide-react";

interface CheckoutFooterProps {
  showFooter: boolean;
  footerText?: string;
  year?: number;
}

const CheckoutFooter = ({ 
  showFooter = true, 
  footerText = "Todos os direitos reservados", 
  year = new Date().getFullYear() 
}: CheckoutFooterProps) => {
  if (!showFooter) return null;
  
  return (
    <footer className="mt-8 py-6 border-t border-gray-200">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company info */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-sm mb-2">PixPortal</h4>
            <p className="text-sm text-gray-600">
              Soluções de pagamento para aumentar suas vendas online.
            </p>
          </div>
          
          {/* Contact info */}
          <div className="text-center">
            <h4 className="font-semibold text-sm mb-2">Contato</h4>
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-600 mb-1">
              <Mail className="w-4 h-4 mr-2" />
              <span>contato@pixportal.com.br</span>
            </div>
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>(11) 99999-9999</span>
            </div>
          </div>
          
          {/* Legal links */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-sm mb-2">Legal</h4>
            <div className="space-y-1 text-sm">
              <p><Link to="/termos" className="text-gray-600 hover:text-gray-900">Termos de uso</Link></p>
              <p><Link to="/privacidade" className="text-gray-600 hover:text-gray-900">Política de privacidade</Link></p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <Copyright className="w-3 h-3 mr-1" />
            <span>{year} {footerText}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CheckoutFooter;
