
import { useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, UseFormReturn } from 'react-hook-form';
import { formSchema } from './schema';
import { z } from 'zod';
import { getConfig } from '@/services/configService';
import { toast } from "@/components/ui/use-toast";

interface ConfigDataLoaderProps {
  children: (form: UseFormReturn<z.infer<typeof formSchema>>) => ReactNode;
}

export function ConfigDataLoader({ children }: ConfigDataLoaderProps) {
  const { id: productId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      backgroundColor: '#ffffff',
      buttonColor: '#30b968',
      buttonText: 'Finalizar Compra',
      pixMessage: '',
      qrCodeUrl: '',
      pixKey: '',
      expirationTime: 15,
      beneficiaryName: '',
      showTestimonials: true,
      showVisitorCounter: true,
      showHeader: true,
      showFooter: true,
      timerEnabled: false,
      timerMinutes: 15,
      timerText: 'Oferta expira em:',
      timerBgColor: '#000000',
      timerTextColor: '#ffffff',
      discountBadgeEnabled: false,
      discountBadgeText: 'Oferta especial',
      discountAmount: 0,
      headerMessage: 'Tempo restante! Garanta sua oferta',
      headerBgColor: '#df2020',
      headerTextColor: '#ffffff',
      footerText: 'Todos os direitos reservados © 2023',
      testimonialsTitle: 'O que dizem nossos clientes',
      blockedCpfs: '',
      oneCheckoutEnabled: false,
      formHeaderText: 'PREENCHA SEUS DADOS ABAIXO',
      formHeaderBgColor: '#dc2626',
      formHeaderTextColor: '#ffffff',
      companyName: 'PixPortal',
      companyDescription: 'Soluções de pagamento para aumentar suas vendas online.',
      contactEmail: 'contato@pixportal.com.br',
      contactPhone: '(11) 99999-9999',
      showTermsLink: true,
      showPrivacyLink: true,
      termsUrl: '/termos',
      privacyUrl: '/privacidade',
    },
  });

  useEffect(() => {
    if (productId) {
      setLoading(true);
      getConfig(productId)
        .then(data => {
          console.log('Loaded config data:', data);
          if (data) {
            form.reset({
              backgroundColor: data.cor_fundo || '#ffffff',
              buttonColor: data.cor_botao || '#30b968',
              buttonText: data.texto_botao || 'Finalizar Compra',
              pixMessage: data.mensagem_pix || '',
              qrCodeUrl: data.qr_code || '',
              pixKey: data.chave_pix || '',
              expirationTime: data.tempo_expiracao || 15,
              beneficiaryName: data.nome_beneficiario || '',
              showTestimonials: data.exibir_testemunhos !== false,
              showVisitorCounter: data.numero_aleatorio_visitas !== false,
              showHeader: data.show_header !== false,
              showFooter: data.show_footer !== false,
              timerEnabled: data.timer_enabled || false,
              timerMinutes: data.timer_minutes || 15,
              timerText: data.timer_text || 'Oferta expira em:',
              timerBgColor: data.timer_bg_color || '#000000',
              timerTextColor: data.timer_text_color || '#ffffff',
              discountBadgeEnabled: data.discount_badge_enabled || false,
              discountBadgeText: data.discount_badge_text || 'Oferta especial',
              discountAmount: data.discount_amount || 0,
              originalPrice: data.original_price || null,
              headerMessage: data.header_message || 'Tempo restante! Garanta sua oferta',
              headerBgColor: data.header_bg_color || '#df2020',
              headerTextColor: data.header_text_color || '#ffffff',
              footerText: data.footer_text || 'Todos os direitos reservados © 2023',
              testimonialsTitle: data.testimonials_title || 'O que dizem nossos clientes',
              blockedCpfs: data.bloquear_cpfs?.join(", ") || '',
              oneCheckoutEnabled: data.one_checkout_enabled || false,
              formHeaderText: data.form_header_text || 'PREENCHA SEUS DADOS ABAIXO',
              formHeaderBgColor: data.form_header_bg_color || '#dc2626',
              formHeaderTextColor: data.form_header_text_color || '#ffffff',
              companyName: data.company_name || 'PixPortal',
              companyDescription: data.company_description || 'Soluções de pagamento para aumentar suas vendas online.',
              contactEmail: data.contact_email || 'contato@pixportal.com.br',
              contactPhone: data.contact_phone || '(11) 99999-9999',
              showTermsLink: data.show_terms_link !== false,
              showPrivacyLink: data.show_privacy_link !== false,
              termsUrl: data.terms_url || '/termos',
              privacyUrl: data.privacy_url || '/privacidade',
            });
          }
        })
        .catch(error => {
          console.error("Error fetching config:", error);
          toast({
            title: "Erro ao carregar configuração",
            description: "Ocorreu um erro ao carregar os dados da configuração.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId, form]);

  return <>{children(form)}</>;
}
