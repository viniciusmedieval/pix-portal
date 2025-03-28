
import { useEffect } from 'react';
import { getPixel } from '@/services/pixelService';

/**
 * Hook for integrating Facebook and Google tracking pixels
 * @param produtoId Product ID for tracking
 * @param event Event name to track ('InitiateCheckout', 'Purchase', etc.)
 */
export function usePixel(produtoId?: string, event: string = 'PageView') {
  useEffect(() => {
    const loadPixels = async () => {
      if (!produtoId) return;
      
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
            window.fbq('track', event);
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
            window.gtag('event', event);
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
    };

    loadPixels();
  }, [produtoId, event]);

  // Return a function that can be used to track events outside of the hook
  return {
    trackEvent: (eventName: string, params?: Record<string, any>) => {
      if (window.fbq) {
        window.fbq('track', eventName, params);
      }
      if (window.gtag) {
        window.gtag('event', eventName, params);
      }
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
