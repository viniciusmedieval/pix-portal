
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";

interface PixTabProps {
  form: UseFormReturn<any>;
}

export const PixTab = ({ form }: PixTabProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pixInstrucoes"
  });

  return (
    <TabsContent value="pix" className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações da Página PIX</h3>
        <p className="text-sm text-gray-500">
          Personalize como será exibida a página de pagamento PIX.
        </p>
      </div>
      <Separator />

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pixTitulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Página</FormLabel>
                <FormControl>
                  <Input placeholder="Aqui está o PIX copia e cola" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pixSubtitulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtítulo da Página</FormLabel>
                <FormControl>
                  <Input placeholder="Copie o código ou use a câmera..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="pixTimerTexto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto do Temporizador</FormLabel>
              <FormDescription>
                Use {'{minutos}'} e {'{segundos}'} como marcadores para o tempo restante.
              </FormDescription>
              <FormControl>
                <Input placeholder="Faltam {minutos}:{segundos} para o pagamento expirar..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pixBotaoTexto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto do Botão</FormLabel>
              <FormControl>
                <Input placeholder="Confirmar pagamento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pixSegurancaTexto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto de Segurança</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos..." 
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pixCompraTitulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Seção de Compra</FormLabel>
                <FormControl>
                  <Input placeholder="Sua Compra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pixSaibaMaisTexto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto do Link "Saiba Mais"</FormLabel>
                <FormControl>
                  <Input placeholder="Saiba mais" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pixMostrarProduto"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Mostrar Detalhes do Produto</FormLabel>
                  <FormDescription>
                    Exibe um resumo do produto sendo adquirido
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pixMostrarTermos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Mostrar Links de Termos</FormLabel>
                  <FormDescription>
                    Exibe links para termos de uso e privacidade
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="pixTextoCopied"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto de Confirmação de Cópia</FormLabel>
              <FormControl>
                <Input placeholder="Código copiado!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pixInstrucoesTitulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título das Instruções</FormLabel>
              <FormControl>
                <Input placeholder="Para realizar o pagamento:" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <FormLabel>Instruções de Pagamento</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append('')}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <FormField
                control={form.control}
                name={`pixInstrucoes.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder={`Instrução ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => remove(index)}
                className="flex-shrink-0 h-10 w-10 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-sm text-gray-500">
              Adicione instruções para ajudar o cliente a fazer o pagamento.
            </p>
          )}
        </div>
      </div>
    </TabsContent>
  );
};
