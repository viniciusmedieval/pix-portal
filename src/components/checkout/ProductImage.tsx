
import { FC } from 'react';

interface ProductImageProps {
  imageUrl?: string | null;
  productName: string;
  className?: string;
}

const ProductImage: FC<ProductImageProps> = ({ 
  imageUrl,
  productName,
  className = "w-full h-full object-cover"
}) => {
  // Imagem de fallback caso o URL não seja fornecido
  const fallbackImage = '/placeholder.svg';
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <img
      src={imageUrl || fallbackImage}
      alt={productName}
      className={className}
      onError={handleImageError}
    />
  );
};

export default ProductImage;
