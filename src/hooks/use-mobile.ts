
import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar inicialmente
    checkIfMobile();

    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', checkIfMobile);

    // Remover listener ao desmontar
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
}
