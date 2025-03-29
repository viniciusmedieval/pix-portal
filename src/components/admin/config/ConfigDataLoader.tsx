
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './schema';
import { getConfig } from '@/services/configService';
import { getProdutoById } from '@/services/produtoService';
import { z } from 'zod';

// Define the correct type for the children prop
interface ConfigDataLoaderProps {
  children: (form: UseFormReturn<z.infer<typeof formSchema>>) => React.ReactNode;
}

export function ConfigDataLoader({ children }: ConfigDataLoaderProps) {
  const { id: productId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      price: 0,
      backgroundColor: '#f9fafb',
      buttonColor: '#22c55e',
      buttonText: 'Comprar agora',
      headerMessage: 'Tempo restante! Garanta sua oferta',
      headerBgColor: '#000000',
      headerTextColor: '#ffffff',
      showHeader: true,
      formHeaderText: 'PREENCHA SEUS DADOS ABAIXO',
      formHeaderBgColor: '#dc2626',
      formHeaderTextColor: '#ffffff',
      showFooter: true,
      footerText: 'Todos os direitos reservados © 2023',
      showTestimonials: true,
      showVisitorCounter: true,
      testimonialTitle: 'O que dizem nossos clientes',
      blockedCpfs: '',
      timerEnabled: false,
      timerMinutes: 15,
      timerText: 'Oferta expira em:',
      timerBgColor: '#000000',
      timerTextColor: '#ffffff',
      discountBadgeEnabled: false,
      discountBadgeText: 'Oferta especial',
      discountAmount: 0,
      originalPrice: null,
      pixKey: '',
      beneficiaryName: '',
      qrCodeUrl: '',
      pixMessage: '',
      expirationTime: 15,
      oneCheckoutEnabled: false,
      companyName: 'PixPortal',
      companyDescription: 'Soluções de pagamento para aumentar suas vendas online.',
      contactEmail: 'contato@pixportal.com.br',
      contactPhone: '(11) 99999-9999',
      showTermsLink: true,
      showPrivacyLink: true,
      termsUrl: '/termos',
      privacyUrl: '/privacidade',
      // New PIX page customization fields
      pixTitulo: 'Aqui está o PIX copia e cola',
      pixSubtitulo: 'Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.',
      pixTimerTexto: 'Faltam {minutos}:{segundos} minutos para o pagamento expirar...',
      pixBotaoTexto: 'Confirmar pagamento',
      pixSegurancaTexto: 'Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.',
      pixCompraTitulo: 'Sua Compra',
      pixMostrarProduto: true,
      pixMostrarTermos: true,
      pixSaibaMaisTexto: 'Saiba mais',
      pixTextoCopied: 'Código copiado!',
      pixInstrucoesTitulo: 'Para realizar o pagamento:',
      pixInstrucoes: [
        'Abra o aplicativo do seu banco',
        'Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code',
        'Confirme as informações e finalize o pagamento'
      ]
    },
    mode: "onChange"
  });

  useEffect(() => {
    const loadConfigData = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const product = await getProdutoById(productId);
        const config = await getConfig(productId);
        
        if (product && config) {
          // Create a safe access function to handle potentially undefined properties
          const safeGet = <T>(value: T | undefined, defaultValue: T): T => 
            value !== undefined ? value : defaultValue;
          
          form.reset({
            productName: product.nome,
            price: product.preco,
            backgroundColor: config.cor_fundo,
            buttonColor: config.cor_botao,
            buttonText: config.texto_botao,
            headerMessage: config.header_message,
            headerBgColor: config.header_bg_color,
            headerTextColor: config.header_text_color,
            showHeader: config.show_header,
            formHeaderText: config.form_header_text,
            formHeaderBgColor: config.form_header_bg_color,
            formHeaderTextColor: config.form_header_text_color,
            showFooter: config.show_footer,
            footerText: config.footer_text,
            showTestimonials: config.exibir_testemunhos,
            showVisitorCounter: config.numero_aleatorio_visitas,
            testimonialTitle: config.testimonials_title,
            blockedCpfs: config.bloquear_cpfs?.join(', ') || '',
            timerEnabled: config.timer_enabled,
            timerMinutes: config.timer_minutes,
            timerText: config.timer_text,
            timerBgColor: config.timer_bg_color,
            timerTextColor: config.timer_text_color,
            discountBadgeEnabled: config.discount_badge_enabled,
            discountBadgeText: config.discount_badge_text,
            discountAmount: config.discount_amount,
            originalPrice: safeGet(config.original_price, null),
            pixKey: config.chave_pix,
            beneficiaryName: config.nome_beneficiario,
            qrCodeUrl: config.qr_code,
            pixMessage: config.mensagem_pix,
            expirationTime: config.tempo_expiracao,
            oneCheckoutEnabled: config.one_checkout_enabled,
            companyName: config.company_name,
            companyDescription: config.company_description,
            contactEmail: config.contact_email,
            contactPhone: config.contact_phone,
            showTermsLink: config.show_terms_link,
            showPrivacyLink: config.show_privacy_link,
            termsUrl: config.terms_url,
            privacyUrl: config.privacy_url,
            // New PIX page customization fields - safely handle with defaults
            pixTitulo: safeGet(config.pix_titulo, 'Aqui está o PIX copia e cola'),
            pixSubtitulo: safeGet(config.pix_subtitulo, 'Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.'),
            pixTimerTexto: safeGet(config.pix_timer_texto, 'Faltam {minutos}:{segundos} minutos para o pagamento expirar...'),
            pixBotaoTexto: safeGet(config.pix_botao_texto, 'Confirmar pagamento'),
            pixSegurancaTexto: safeGet(config.pix_seguranca_texto, 'Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.'),
            pixCompraTitulo: safeGet(config.pix_compra_titulo, 'Sua Compra'),
            pixMostrarProduto: safeGet(config.pix_mostrar_produto, true),
            pixMostrarTermos: safeGet(config.pix_mostrar_termos, true),
            pixSaibaMaisTexto: safeGet(config.pix_saiba_mais_texto, 'Saiba mais'),
            pixTextoCopied: safeGet(config.pix_texto_copiado, 'Código copiado!'),
            pixInstrucoesTitulo: safeGet(config.pix_instrucoes_titulo, 'Para realizar o pagamento:'),
            pixInstrucoes: safeGet(config.pix_instrucoes, [
              'Abra o aplicativo do seu banco',
              'Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code',
              'Confirme as informações e finalize o pagamento'
            ])
          });
        }
      } catch (error) {
        console.error('Error loading config data:', error);
        setError('Erro ao carregar as configurações');
      } finally {
        setLoading(false);
      }
    };
    
    loadConfigData();
  }, [productId, form]);

  if (loading) {
    return <div>Carregando configurações...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return <>{children(form)}</>;
}
