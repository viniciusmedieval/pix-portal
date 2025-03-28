
import { useEffect } from 'react';
import { getPixel } from '@/services/pixelService';

/**
 * Hook for integrating Facebook and Google tracking pixels
 */
export function usePixel() {
  // Return a function that can be used to track events
  return {
    trackEvent: (eventName: string, produtoId?: string, params?: Record<string, any>) => {
      const trackPixelEvent = async () => {
        // Only fetch pixel data if we have a product ID
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
              
              // Track the specific event
              if (window.fbq) {
                window.fbq('track', eventName, params);
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
              
              // Track the specific event
              if (window.gtag) {
                window.gtag('event', eventName);
              }
            }
    
            // Custom script
            if (pixelData.custom_script) {
              const customScript = document.createElement('script');
              customScript.innerHTML = pixelData.custom_script;
              document.head.appendChild(customScript);
            }
          } catch (error) {
            console.error('Error loading pixels:', error);
          }
        } else {
          // If no product ID, just track with existing pixels if they exist
          if (window.fbq) {
            window.fbq('track', eventName, params);
          }
          if (window.gtag) {
            window.gtag('event', eventName, params);
          }
        }
      };
      
      trackPixelEvent();
    }
  };
}

// Define window types for TypeScript support
declare global {
  interface Window {
    fbq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

export default usePixel;
