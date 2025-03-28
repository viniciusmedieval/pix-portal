
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CheckoutLayoutProps {
  bgColor?: string;
  children: ReactNode;
  showHeader?: boolean;
  headerTitle?: string;
  headerMessage?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  showFooter?: boolean;
  footerText?: string;
  customCss?: string;
  bannerImage?: string;
  bannerBgColor?: string;
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({
  bgColor = '#f5f5f5',
  children,
  showHeader = true,
  headerMessage = '',
  headerBgColor = '#000000',
  headerTextColor = '#ffffff',
  showFooter = false,
  footerText = '',
  customCss = '',
  bannerImage,
  bannerBgColor = '#000000'
}) => {
  const isMobile = useIsMobile();

  return (
    <div style={{ backgroundColor: bgColor }} className="min-h-screen flex flex-col">
      {/* Header */}
      {showHeader && (
        <header 
          className="py-2 px-4 text-center text-sm"
          style={{ 
            backgroundColor: headerBgColor,
            color: headerTextColor
          }}
        >
          <p dangerouslySetInnerHTML={{ __html: headerMessage || "Tempo restante! Garanta sua oferta" }} />
        </header>
      )}

      {/* Banner Image */}
      {bannerImage && (
        <div className="w-full" style={{ backgroundColor: bannerBgColor }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <img 
              src={bannerImage} 
              alt="Banner" 
              className="w-full h-auto object-contain" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
        </div>
      )}

      {/* Spacer between banner and content */}
      {bannerImage && <div className="h-5"></div>}

      {/* Main content */}
      <div className="flex-grow container mx-auto py-6 px-4 max-w-4xl">
        <div className="mx-auto">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      {showFooter && (
        <footer className="bg-white py-4 text-center text-xs text-gray-500 mt-auto border-t">
          <div className="container mx-auto px-4">
            {footerText ? (
              <p dangerouslySetInnerHTML={{ __html: footerText }} />
            ) : (
              <p>© {new Date().getFullYear()} - Todos os direitos reservados</p>
            )}
          </div>
        </footer>
      )}
      
      {/* Custom CSS */}
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}
    </div>
  );
};

export default CheckoutLayout;
