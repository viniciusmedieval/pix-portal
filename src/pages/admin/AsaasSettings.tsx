
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getAsaasSettings, updateAsaasSettings, AsaasSettings } from '@/services/asaasService';
import { Loader2, AlertCircle } from 'lucide-react';

// Schema for form validation
const formSchema = z.object({
  api_key_production: z.string().optional(),
  api_key_sandbox: z.string().optional(),
  use_sandbox: z.boolean().default(true),
  pix_enabled: z.boolean().default(true),
  credit_card_enabled: z.boolean().default(true),
  integration_enabled: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function AsaasSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Initialize form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      api_key_production: '',
      api_key_sandbox: '',
      use_sandbox: true,
      pix_enabled: true,
      credit_card_enabled: true,
      integration_enabled: false,
    },
  });

  // Watch values for rendering
  const useSandbox = watch('use_sandbox');
  const integrationEnabled = watch('integration_enabled');
  const pixEnabled = watch('pix_enabled');
  const cardEnabled = watch('credit_card_enabled');

  // Load settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getAsaasSettings();
        
        if (settings) {
          // Store ID for later updates
          setSettingsId(settings.id || null);
          
          // Reset form with settings values
          reset({
            api_key_production: settings.api_key_production || '',
            api_key_sandbox: settings.api_key_sandbox || '',
            use_sandbox: settings.use_sandbox,
            pix_enabled: settings.pix_enabled,
            credit_card_enabled: settings.credit_card_enabled,
            integration_enabled: settings.integration_enabled,
          });
        }
      } catch (error) {
        console.error('Error loading Asaas settings:', error);
        toast.error('Erro ao carregar configurações do Asaas');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSettings();
  }, [reset]);

  // Save settings
  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    
    try {
      // Prepare update data
      const updateData: Partial<AsaasSettings> = {
        ...data,
      };
      
      // Add ID if we have one
      if (settingsId) {
        updateData.id = settingsId;
      }
      
      // Update settings
      const result = await updateAsaasSettings(updateData);
      
      if (result) {
        // Update stored ID in case this was a new record
        setSettingsId(result.id);
        toast.success('Configurações do Asaas salvas com sucesso');
      } else {
        throw new Error('Falha ao salvar configurações');
      }
    } catch (error) {
      console.error('Error saving Asaas settings:', error);
      toast.error('Erro ao salvar configurações do Asaas');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle handlers
  const handleToggle = (field: keyof FormValues, value: boolean) => {
    setValue(field, value, { shouldDirty: true });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações do Asaas</h1>
          <p className="text-gray-500">
            Configure a integração com a API do Asaas para processamento de pagamentos
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          {/* Main Settings Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Status da Integração</CardTitle>
              <CardDescription>
                Ative ou desative a integração com o Asaas e escolha o ambiente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="integration-toggle">Ativar Integração com Asaas</Label>
                  <p className="text-sm text-gray-500">
                    Quando ativado, os pagamentos serão processados pelo Asaas
                  </p>
                </div>
                <Switch
                  id="integration-toggle"
                  checked={integrationEnabled}
                  onCheckedChange={(checked) => handleToggle('integration_enabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sandbox-toggle">Usar Ambiente Sandbox</Label>
                  <p className="text-sm text-gray-500">
                    Use o ambiente de testes do Asaas para testar a integração
                  </p>
                </div>
                <Switch
                  id="sandbox-toggle"
                  checked={useSandbox}
                  onCheckedChange={(checked) => handleToggle('use_sandbox', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* API Keys Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Chaves de API</CardTitle>
              <CardDescription>
                Configure suas chaves de API do Asaas para os ambientes de produção e sandbox
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api_key_production">
                  Chave de API - Produção {!useSandbox && integrationEnabled && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="api_key_production"
                  type="password"
                  placeholder="Chave de API do ambiente de produção"
                  {...register('api_key_production')}
                  className="font-mono"
                />
                {errors.api_key_production && (
                  <p className="text-red-500 text-sm">{errors.api_key_production.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="api_key_sandbox">
                  Chave de API - Sandbox {useSandbox && integrationEnabled && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="api_key_sandbox"
                  type="password"
                  placeholder="Chave de API do ambiente sandbox"
                  {...register('api_key_sandbox')}
                  className="font-mono"
                />
                {errors.api_key_sandbox && (
                  <p className="text-red-500 text-sm">{errors.api_key_sandbox.message}</p>
                )}
              </div>
              
              {integrationEnabled && (
                <div className="flex p-3 rounded-md bg-amber-50 border border-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    {useSandbox ? 
                      'Você está usando o ambiente de testes (sandbox). Os pagamentos não serão reais.' :
                      'Você está usando o ambiente de produção. Os pagamentos serão reais e serão cobrados dos clientes.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>
                Configure quais métodos de pagamento serão aceitos no checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pix-enabled"
                  checked={pixEnabled}
                  onCheckedChange={(checked) => handleToggle('pix_enabled', !!checked)}
                />
                <Label htmlFor="pix-enabled">Permitir Pagamentos via PIX</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="card-enabled"
                  checked={cardEnabled}
                  onCheckedChange={(checked) => handleToggle('credit_card_enabled', !!checked)}
                />
                <Label htmlFor="card-enabled">Permitir Pagamentos via Cartão de Crédito</Label>
              </div>
              
              {integrationEnabled && !pixEnabled && !cardEnabled && (
                <div className="flex p-3 rounded-md bg-red-50 border border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-700">
                    Atenção: você precisa habilitar pelo menos um método de pagamento para que o checkout funcione.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Footer */}
          <CardFooter className="flex justify-end bg-white rounded-lg shadow-sm p-6">
            <Button
              type="submit"
              disabled={isSaving || !isDirty}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Configurações'
              )}
            </Button>
          </CardFooter>
        </div>
      </form>
    </div>
  );
}
