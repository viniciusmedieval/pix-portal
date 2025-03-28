
import React, { ReactNode } from 'react';

interface CheckoutLayoutProps {
  bgColor: string;
  children: ReactNode;
  showHeader?: boolean;
  headerTitle?: string;
  headerMessage?: string;
  showFooter?: boolean;
  footerText?: string;
  customCss?: string;
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({
  bgColor,
  children,
  showHeader = false,
  headerTitle = '',
  headerMessage = '',
  showFooter = false,
  footerText = '',
  customCss = ''
}) => {
  return (
    <div style={{ backgroundColor: bgColor }} className="min-h-screen flex flex-col">
      {/* Header */}
      {showHeader && (
        <header className="bg-black text-white py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{headerTitle}</h1>
              {headerMessage && (
                <p className="text-sm mt-1">{headerMessage}</p>
              )}
            </div>
            <div className="hidden md:block">
              <img src="/pix-logo.png" alt="Métodos de pagamento" className="h-6" />
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <div className="flex-grow container mx-auto py-6 md:py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      {showFooter && (
        <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500 mt-auto">
          <div className="container mx-auto px-4">
            {footerText ? (
              <p>{footerText}</p>
            ) : (
              <p>© {new Date().getFullYear()} - Todos os direitos reservados</p>
            )}
          </div>
        </footer>
      )}
      
      {/* Custom CSS */}
      {customCss && (
        <style>{customCss}</style>
      )}
    </div>
  );
};

export default CheckoutLayout;
