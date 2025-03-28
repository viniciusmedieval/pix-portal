
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface FooterTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function FooterTab({ form }: FooterTabProps) {
  return (
    <TabsContent value="footer" className="space-y-4">
      <h3 className="text-lg font-medium">Configurações do Rodapé</h3>
      
      <FormField
        control={form.control}
        name="showFooter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Exibir Rodapé</FormLabel>
              <FormDescription>
                Mostrar a área de rodapé na parte inferior da página.
              </FormDescription>
            </div>
            <FormControl>
              <Switch 
                checked={field.value} 
                onCheckedChange={field.onChange} 
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="footerText"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Texto do Rodapé</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Texto do rodapé" />
            </FormControl>
            <FormDescription>
              Texto exibido no rodapé da página.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Nome da Empresa</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome da empresa" />
            </FormControl>
            <FormDescription>
              Nome da empresa exibido no rodapé.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="companyDescription"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Descrição da Empresa</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Descrição da empresa" />
            </FormControl>
            <FormDescription>
              Breve descrição da empresa exibida no rodapé.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactEmail"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Email de Contato</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Email de contato" type="email" />
            </FormControl>
            <FormDescription>
              Email de contato exibido no rodapé.
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactPhone"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Telefone de Contato</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Telefone de contato" />
            </FormControl>
            <FormDescription>
              Telefone de contato exibido no rodapé.
            </FormDescription>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          control={form.control}
          name="showTermsLink"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Exibir Link de Termos</FormLabel>
                <FormDescription>
                  Mostrar link para os termos de uso.
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="showPrivacyLink"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Exibir Link de Privacidade</FormLabel>
                <FormDescription>
                  Mostrar link para a política de privacidade.
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          control={form.control}
          name="termsUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL dos Termos de Uso</FormLabel>
              <FormControl>
                <Input {...field} placeholder="/termos" />
              </FormControl>
              <FormDescription>
                URL para a página de termos de uso.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacyUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Política de Privacidade</FormLabel>
              <FormControl>
                <Input {...field} placeholder="/privacidade" />
              </FormControl>
              <FormDescription>
                URL para a página de política de privacidade.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  );
}
