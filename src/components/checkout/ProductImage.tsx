
import React from 'react';

interface ProductImageProps {
  imageUrl: string | null | undefined;
  productName: string;
  className?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ imageUrl, productName, className = "" }) => {
  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${className}`}>
      <img 
        src={imageUrl || "/lovable-uploads/5bdb8fb7-f326-419c-9013-3ab40582ff09.png"} 
        alt={productName}
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default ProductImage;
