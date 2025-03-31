
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
}

// Handle errors
function handleError(error: Error, status = 400) {
  console.error("Error:", error.message);
  return new Response(
    JSON.stringify({ 
      error: error.message 
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Main function to serve HTTP requests
serve(async (req) => {
  // Check if it's a CORS preflight request
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get environment variables
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  // Validate environment variables
  if (!supabaseUrl || !supabaseServiceKey) {
    return handleError(new Error("Missing environment variables"), 500);
  }

  // Create Supabase admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Parse the request body
    const { action, data } = await req.json();
    
    // Get Asaas settings
    const { data: settingsData, error: settingsError } = await supabase
      .from("asaas_settings")
      .select("*")
      .limit(1)
      .single();
    
    if (settingsError) {
      throw new Error(`Failed to fetch Asaas settings: ${settingsError.message}`);
    }

    const useProduction = !settingsData.use_sandbox;
    const apiKey = useProduction ? settingsData.api_key_production : settingsData.api_key_sandbox;
    const baseUrl = useProduction 
      ? "https://www.asaas.com/api/v3" 
      : "https://sandbox.asaas.com/api/v3";

    // Check if API key is available
    if (!apiKey) {
      throw new Error("Asaas API key not configured");
    }

    // Check if integration is enabled
    if (!settingsData.integration_enabled) {
      throw new Error("Asaas integration is disabled");
    }

    // Handle different actions
    switch (action) {
      case "createCustomer": {
        const customerData = data;
        
        // Validate required customer fields
        if (!customerData.name || !customerData.email || !customerData.cpfCnpj) {
          throw new Error("Missing required customer data");
        }
        
        // Call Asaas API to create customer
        const response = await fetch(`${baseUrl}/customers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access_token": apiKey
          },
          body: JSON.stringify({
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone || "",
            cpfCnpj: customerData.cpfCnpj.replace(/\D/g, "") // Remove non-digits
          })
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(`Asaas API error: ${responseData.errors?.[0]?.description || "Unknown error"}`);
        }
        
        return new Response(JSON.stringify(responseData), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      case "createPixPayment": {
        const paymentData = data;
        
        // Validate required payment fields
        if (!paymentData.customer || !paymentData.value) {
          throw new Error("Missing required payment data");
        }
        
        // Check if PIX is enabled
        if (!settingsData.pix_enabled) {
          throw new Error("PIX payments are currently disabled");
        }
        
        // Call Asaas API to create PIX payment
        const response = await fetch(`${baseUrl}/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access_token": apiKey
          },
          body: JSON.stringify({
            customer: paymentData.customer,
            billingType: "PIX",
            value: paymentData.value,
            dueDate: new Date().toISOString().split('T')[0], // Today
            description: paymentData.description || "Payment for products/services"
          })
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(`Asaas API error: ${responseData.errors?.[0]?.description || "Unknown error"}`);
        }
        
        return new Response(JSON.stringify(responseData), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      case "getPixQrCode": {
        const { id } = data;
        
        if (!id) {
          throw new Error("Payment ID is required");
        }
        
        // Call Asaas API to get PIX QR code
        const response = await fetch(`${baseUrl}/payments/${id}/pixQrCode`, {
          headers: {
            "access_token": apiKey
          },
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(`Asaas API error: ${responseData.errors?.[0]?.description || "Unknown error"}`);
        }
        
        return new Response(JSON.stringify(responseData), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      case "createCardPayment": {
        const paymentData = data;
        
        // Validate required payment fields
        if (!paymentData.customer || !paymentData.value || !paymentData.creditCard || !paymentData.creditCardHolderInfo) {
          throw new Error("Missing required payment data");
        }
        
        // Check if credit card payments are enabled
        if (!settingsData.credit_card_enabled) {
          throw new Error("Credit card payments are currently disabled");
        }
        
        // Call Asaas API to create credit card payment
        const response = await fetch(`${baseUrl}/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access_token": apiKey
          },
          body: JSON.stringify({
            customer: paymentData.customer,
            billingType: "CREDIT_CARD",
            value: paymentData.value,
            dueDate: new Date().toISOString().split('T')[0], // Today
            description: paymentData.description || "Payment for products/services",
            creditCard: paymentData.creditCard,
            creditCardHolderInfo: paymentData.creditCardHolderInfo
          })
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(`Asaas API error: ${responseData.errors?.[0]?.description || "Unknown error"}`);
        }
        
        return new Response(JSON.stringify(responseData), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      case "checkPaymentStatus": {
        const { id } = data;
        
        if (!id) {
          throw new Error("Payment ID is required");
        }
        
        // Call Asaas API to check payment status
        const response = await fetch(`${baseUrl}/payments/${id}`, {
          headers: {
            "access_token": apiKey
          },
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(`Asaas API error: ${responseData.errors?.[0]?.description || "Unknown error"}`);
        }
        
        return new Response(JSON.stringify(responseData), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  } catch (error) {
    return handleError(error);
  }
});
