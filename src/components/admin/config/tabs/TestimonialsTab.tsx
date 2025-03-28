
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { UseFormReturn } from "react-hook-form";

interface TestimonialsTabProps {
  form: UseFormReturn<any>;
}

export const TestimonialsTab = ({ form }: TestimonialsTabProps) => {
  return (
    <TabsContent value="testimonials" className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Depoimentos</h3>
        <p className="text-sm text-gray-500">
          Configure como os depoimentos de clientes serão exibidos no checkout.
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="showTestimonials"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Exibir Depoimentos</FormLabel>
                <p className="text-sm text-gray-500">
                  Mostre depoimentos de clientes satisfeitos no checkout para aumentar a confiança.
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="testimonialTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da Seção de Depoimentos</FormLabel>
              <FormControl>
                <Input placeholder="O que dizem nossos clientes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  );
};
