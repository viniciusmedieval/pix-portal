
import React, { useState } from 'react';

interface ProductImageProps {
  imageUrl: string | null | undefined;
  productName: string;
  className?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ imageUrl, productName, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const defaultImage = "/lovable-uploads/5bdb8fb7-f326-419c-9013-3ab40582ff09.png";
  
  // Handle image loading errors
  const handleImageError = () => {
    console.error(`Failed to load image: ${imageUrl}`);
    setImageError(true);
  };

  // Determine which image source to use
  const imageSrc = imageError || !imageUrl ? defaultImage : imageUrl;
  
  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${className}`}>
      <img 
        src={imageSrc} 
        alt={productName}
        onError={handleImageError}
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default ProductImage;
