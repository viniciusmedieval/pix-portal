
import { useEffect } from 'react';

/**
 * Hook for integrating Facebook and Google tracking pixels
 * @param fbId Facebook Pixel ID
 * @param gId Google Analytics ID
 */
export function usePixel(fbId?: string, gId?: string) {
  useEffect(() => {
    // Initialize Facebook Pixel
    if (fbId) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s) {
          if(f.fbq)return;n=f.fbq=function(){
            n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)
        }(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }

    // Initialize Google Analytics
    if (gId) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gId}`;
      script.async = true;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gId}');
      `;
      document.head.appendChild(inlineScript);
    }

    // Cleanup function
    return () => {
      // Clean up is not really feasible for scripts added to the DOM
      // as removing them doesn't undo their effects
    };
  }, [fbId, gId]);

  // Additional methods for tracking events could be added here
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
