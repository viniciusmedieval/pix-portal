
// For the CheckoutPage, we need to find and update the references to the 'fonte' property
// Since this file is not in the allowed files list, we'll need to create a type-only fix
// that the user can apply later

import { Database } from '@/types/database.types';

// Define the correct type to use in CheckoutPage.tsx
export type CheckoutConfigType = Database['public']['Tables']['checkout_config']['Row'] & {
  fonte?: string; // Add the missing property
};

// The user will need to update their CheckoutPage.tsx to use this type
// and ensure it's imported correctly
