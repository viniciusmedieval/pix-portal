
import { useEffect } from 'react';
import { getPixel } from '@/services/pixelService';

/**
 * Hook para integração com pixels de rastreamento (Facebook, Google)
 */
export function usePixel() {
  // Carrega pixels para um produto específico
  const loadPixels = async (produtoId: string) => {
    try {
      const pixelData = await getPixel(produtoId);
      if (!pixelData) return;

      // Facebook Pixel
      if (pixelData.facebook_pixel_id) {
        if (!window.fbq) {
          const fbScript = document.createElement('script');
          fbScript.innerHTML = `
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelData.facebook_pixel_id}');
          `;
          document.head.appendChild(fbScript);
        }
      }

      // Google Tag Manager
      if (pixelData.gtm_id) {
        if (!window.gtag) {
          const gtagScript = document.createElement('script');
          gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${pixelData.gtm_id}`;
          gtagScript.async = true;
          document.head.appendChild(gtagScript);

          const configScript = document.createElement('script');
          configScript.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${pixelData.gtm_id}');
          `;
          document.head.appendChild(configScript);
        }
      }

      // Script personalizado
      if (pixelData.custom_script) {
        const customScript = document.createElement('script');
        customScript.innerHTML = pixelData.custom_script;
        document.head.appendChild(customScript);
      }
    } catch (error) {
      console.error('Erro ao carregar pixels:', error);
    }
  };

  // Retorna uma função que pode ser usada para rastrear eventos
  return {
    loadPixels,
    trackEvent: (eventName: string, params?: Record<string, any> | string) => {
      const trackPixelEvent = async () => {
        // Verifica se params é uma string (ID do produto legado) ou um objeto
        let produtoId: string | undefined = undefined;
        let eventParams: Record<string, any> | undefined = undefined;
        
        if (typeof params === 'string') {
          produtoId = params;
        } else if (params && typeof params === 'object') {
          if ('produtoId' in params) {
            produtoId = params.produtoId;
          }
          eventParams = params;
        }
        
        // Busca dados de pixel apenas se tivermos um ID de produto
        if (produtoId) {
          try {
            const pixelData = await getPixel(produtoId);
            if (!pixelData) return;
    
            // Facebook Pixel
            if (pixelData.facebook_pixel_id) {
              if (!window.fbq) {
                const fbScript = document.createElement('script');
                fbScript.innerHTML = `
                  !function(f,b,e,v,n,t,s){
                    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)
                  }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${pixelData.facebook_pixel_id}');
                `;
                document.head.appendChild(fbScript);
              }
              
              // Rastrear o evento específico
              if (window.fbq) {
                window.fbq('track', eventName, eventParams);
              }
            }
    
            // Google Tag Manager
            if (pixelData.gtm_id) {
              if (!window.gtag) {
                const gtagScript = document.createElement('script');
                gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${pixelData.gtm_id}`;
                gtagScript.async = true;
                document.head.appendChild(gtagScript);
    
                const configScript = document.createElement('script');
                configScript.innerHTML = `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${pixelData.gtm_id}');
                `;
                document.head.appendChild(configScript);
              }
              
              // Rastrear o evento específico
              if (window.gtag) {
                window.gtag('event', eventName, eventParams);
              }
            }
    
            // Script personalizado
            if (pixelData.custom_script) {
              const customScript = document.createElement('script');
              customScript.innerHTML = pixelData.custom_script;
              document.head.appendChild(customScript);
            }
          } catch (error) {
            console.error('Erro ao carregar pixels:', error);
          }
        } else {
          // Se não houver ID de produto, apenas rastrear com pixels existentes
          if (window.fbq) {
            window.fbq('track', eventName, eventParams);
          }
          if (window.gtag) {
            window.gtag('event', eventName, eventParams);
          }
        }
      };
      
      trackPixelEvent();
    }
  };
}

// Definir tipos de janela para suporte TypeScript
declare global {
  interface Window {
    fbq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

export default usePixel;
