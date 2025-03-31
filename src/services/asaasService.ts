
import { supabase } from '@/integrations/supabase/client';

export interface AsaasSettings {
  id?: string;
  api_key_production?: string;
  api_key_sandbox?: string;
  use_sandbox: boolean;
  pix_enabled: boolean;
  credit_card_enabled: boolean;
  integration_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AsaasCustomer {
  name: string;
  email: string;
  phone?: string;
  cpfCnpj: string;
}

export interface AsaasPaymentResponse {
  id: string;
  dateCreated: string;
  customer: string;
  value: number;
  netValue: number;
  billingType: string;
  status: string;
  dueDate: string;
}

export interface AsaasPixQrCodeResponse {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

export interface AsaasCreditCard {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface AsaasCreditCardHolderInfo {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  addressComplement?: string;
  phone: string;
}

/**
 * Fetches the current Asaas settings
 */
export async function getAsaasSettings(): Promise<AsaasSettings | null> {
  try {
    const { data, error } = await supabase
      .from('asaas_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching Asaas settings:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAsaasSettings:', error);
    return null;
  }
}

/**
 * Updates Asaas settings
 */
export async function updateAsaasSettings(settings: Partial<AsaasSettings>): Promise<AsaasSettings | null> {
  try {
    const { id, ...updateData } = settings;
    
    // Add updated_at timestamp
    const data = { 
      ...updateData, 
      updated_at: new Date().toISOString() 
    };
    
    let result;
    
    if (id) {
      // Update existing record
      const { data: updatedData, error } = await supabase
        .from('asaas_settings')
        .update(data)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      result = updatedData;
    } else {
      // Get the first record
      const { data: firstRecord, error: fetchError } = await supabase
        .from('asaas_settings')
        .select('id')
        .limit(1)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      if (firstRecord) {
        // Update the first record
        const { data: updatedData, error } = await supabase
          .from('asaas_settings')
          .update(data)
          .eq('id', firstRecord.id)
          .select('*')
          .single();
        
        if (error) throw error;
        result = updatedData;
      } else {
        // Create a new record
        const { data: insertedData, error } = await supabase
          .from('asaas_settings')
          .insert(data)
          .select('*')
          .single();
        
        if (error) throw error;
        result = insertedData;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error updating Asaas settings:', error);
    return null;
  }
}

/**
 * Creates a customer in Asaas
 */
export async function createAsaasCustomer(customer: AsaasCustomer): Promise<string | null> {
  try {
    const response = await supabase.functions.invoke('asaas-api', {
      body: {
        action: 'createCustomer',
        data: customer
      }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data.id;
  } catch (error) {
    console.error('Error creating Asaas customer:', error);
    throw error;
  }
}

/**
 * Creates a PIX payment in Asaas
 */
export async function createAsaasPixPayment(
  customerId: string, 
  value: number, 
  description?: string
): Promise<AsaasPaymentResponse> {
  try {
    const response = await supabase.functions.invoke('asaas-api', {
      body: {
        action: 'createPixPayment',
        data: {
          customer: customerId,
          value,
          description
        }
      }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error('Error creating Asaas PIX payment:', error);
    throw error;
  }
}

/**
 * Gets PIX QR code from Asaas
 */
export async function getAsaasPixQrCode(paymentId: string): Promise<AsaasPixQrCodeResponse> {
  try {
    const response = await supabase.functions.invoke('asaas-api', {
      body: {
        action: 'getPixQrCode',
        data: { id: paymentId }
      }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error('Error getting Asaas PIX QR code:', error);
    throw error;
  }
}

/**
 * Creates a credit card payment in Asaas
 */
export async function createAsaasCardPayment(
  customerId: string, 
  value: number, 
  creditCard: AsaasCreditCard,
  creditCardHolderInfo: AsaasCreditCardHolderInfo,
  description?: string
): Promise<AsaasPaymentResponse> {
  try {
    const response = await supabase.functions.invoke('asaas-api', {
      body: {
        action: 'createCardPayment',
        data: {
          customer: customerId,
          value,
          description,
          creditCard,
          creditCardHolderInfo
        }
      }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error('Error creating Asaas card payment:', error);
    throw error;
  }
}

/**
 * Checks payment status in Asaas
 */
export async function checkAsaasPaymentStatus(paymentId: string): Promise<AsaasPaymentResponse> {
  try {
    const response = await supabase.functions.invoke('asaas-api', {
      body: {
        action: 'checkPaymentStatus',
        data: { id: paymentId }
      }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error('Error checking Asaas payment status:', error);
    throw error;
  }
}
