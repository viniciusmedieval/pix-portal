
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Link } from "react-router-dom";

export interface ProductType {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  parcelas?: number;
  imagem?: string;
  slug?: string | null;
}

interface ProductCardProps {
  product: ProductType;
  onSelect: (product: ProductType) => void;
}

const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const { id, title, description, price, originalPrice, imageUrl, parcelas, imagem, slug } = product;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  // Make sure we have a valid slug for the checkout link
  const checkoutSlug = slug && slug.trim() !== '' ? slug : id;
  const checkoutPath = `/checkout/${encodeURIComponent(checkoutSlug)}`;

  return (
    <Card className="max-w-sm mx-auto overflow-hidden">
      <div className="w-full h-48 overflow-hidden">
        <img 
          src={imageUrl || "https://placehold.co/400x300"} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(price)}
          </span>
          
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
          
          {discount > 0 && (
            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={checkoutPath} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Comprar agora
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
