
import { Database } from '@/types/database.types';

// Define the correct type to use in CheckoutPage.tsx
export type CheckoutConfigType = Database['public']['Tables']['checkout_config']['Row'] & {
  fonte?: string; // Add the missing property
};
