
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
  // Fallback image if URL is not provided
  const fallbackImage = '/placeholder.svg';
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Image failed to load, using fallback:", fallbackImage);
    e.currentTarget.src = fallbackImage;
  };

  return (
    <img
      src={imageUrl || fallbackImage}
      alt={productName}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default ProductImage;
