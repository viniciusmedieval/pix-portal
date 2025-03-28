
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';

interface AppearanceTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function AppearanceTab({ form }: AppearanceTabProps) {
  return (
    <TabsContent value="appearance" className="space-y-6">
      <h3 className="text-lg font-medium">Configurações de Aparência</h3>
      
      <FormField
        control={form.control}
        name="backgroundColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor de Fundo</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input type="color" className="w-12 h-10 p-1" {...field} />
                <Input placeholder="Cor de fundo (ex: #ffffff)" {...field} />
              </div>
            </FormControl>
            <FormDescription>
              Cor de fundo da página de checkout.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="buttonColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor do Botão</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input type="color" className="w-12 h-10 p-1" {...field} />
                <Input placeholder="Cor do botão (ex: #30b968)" {...field} />
              </div>
            </FormControl>
            <FormDescription>
              Cor do botão de compra.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="buttonText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Texto do Botão</FormLabel>
            <FormControl>
              <Input placeholder="Texto do botão (ex: Finalizar Compra)" {...field} />
            </FormControl>
            <FormDescription>
              Texto exibido no botão de compra.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Separator />
      
      <h3 className="text-lg font-medium">Configurações do Cabeçalho</h3>
      
      <FormField
        control={form.control}
        name="headerBgColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor de Fundo do Cabeçalho</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input type="color" className="w-12 h-10 p-1" {...field} />
                <Input placeholder="Cor do cabeçalho (ex: #df2020)" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="headerTextColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor do Texto do Cabeçalho</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <Input type="color" className="w-12 h-10 p-1" {...field} />
                <Input placeholder="Cor do texto (ex: #ffffff)" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Separator />
      
      <h3 className="text-lg font-medium">Configurações do Cronômetro</h3>
      
      <FormField
        control={form.control}
        name="timerEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Ativar Cronômetro</FormLabel>
              <FormDescription>
                Exibir um cronômetro de contagem regressiva.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      
      {form.watch('timerEnabled') && (
        <>
          <FormField
            control={form.control}
            name="timerMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração do Cronômetro (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timerText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto do Cronômetro</FormLabel>
                <FormControl>
                  <Input placeholder="Texto exibido junto ao cronômetro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="timerBgColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor de Fundo do Cronômetro</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input type="color" className="w-12 h-10 p-1" {...field} />
                      <Input placeholder="Cor de fundo" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timerTextColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor do Texto do Cronômetro</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input type="color" className="w-12 h-10 p-1" {...field} />
                      <Input placeholder="Cor do texto" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
      
      <Separator />
      
      <h3 className="text-lg font-medium">Configurações de Promoção</h3>
      
      <FormField
        control={form.control}
        name="discountBadgeEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Ativar Selo de Desconto</FormLabel>
              <FormDescription>
                Exibir um selo de oferta especial na página.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      
      {form.watch('discountBadgeEnabled') && (
        <>
          <FormField
            control={form.control}
            name="discountBadgeText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto do Selo de Desconto</FormLabel>
                <FormControl>
                  <Input placeholder="Texto do selo de desconto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="discountAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Desconto</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Valor do desconto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field: { value, onChange, ...rest }}) => (
              <FormItem>
                <FormLabel>Preço Original</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Preço original" 
                    value={value === null ? '' : value}
                    onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </TabsContent>
  );
}
