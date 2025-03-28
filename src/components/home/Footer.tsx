
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">PixPortal</h3>
            <p className="mb-4">
              Soluções de checkout e pagamento para aumentar suas vendas online.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Início</a></li>
              <li><a href="#features" className="hover:text-white">Recursos</a></li>
              <li><a href="#products" className="hover:text-white">Produtos</a></li>
              <li><Link to="/admin" className="hover:text-white">Admin</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Contato</h4>
            <p>contato@pixportal.com.br</p>
            <p className="mt-2">São Paulo, Brasil</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} PixPortal. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
