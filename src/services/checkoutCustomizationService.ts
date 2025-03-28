
import { CheckoutCustomizationType } from '@/types/checkoutConfig';
import { getCheckoutCustomization, getPaymentInfo } from './checkout/checkoutCustomizationQueries';
import { saveCheckoutCustomization, savePaymentInfo } from './checkout/checkoutCustomizationMutations';

// Re-export all the functions from the smaller files to maintain the existing API
export {
  getCheckoutCustomization,
  saveCheckoutCustomization,
  getPaymentInfo,
  savePaymentInfo
};
