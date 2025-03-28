
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">PixPortal</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="text-gray-600 hover:text-primary">Recursos</a>
          <a href="#products" className="text-gray-600 hover:text-primary">Produtos</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
