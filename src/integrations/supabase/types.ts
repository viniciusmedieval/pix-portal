export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asaas_charges: {
        Row: {
          asaas_charge_id: string | null
          created_at: string | null
          customer_id: string | null
          due_date: string | null
          id: string
          invoice_url: string | null
          pix_qr_code: string | null
          status: string | null
          value: number
        }
        Insert: {
          asaas_charge_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_url?: string | null
          pix_qr_code?: string | null
          status?: string | null
          value: number
        }
        Update: {
          asaas_charge_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_url?: string | null
          pix_qr_code?: string | null
          status?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "asaas_charges_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "asaas_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      asaas_config: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
          use_sandbox: boolean | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
          use_sandbox?: boolean | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
          use_sandbox?: boolean | null
        }
        Relationships: []
      }
      asaas_customers: {
        Row: {
          asaas_id: string | null
          cpf_cnpj: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          asaas_id?: string | null
          cpf_cnpj: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          asaas_id?: string | null
          cpf_cnpj?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      asaas_settings: {
        Row: {
          api_key_production: string | null
          api_key_sandbox: string | null
          created_at: string | null
          credit_card_enabled: boolean | null
          id: string
          integration_enabled: boolean | null
          pix_enabled: boolean | null
          updated_at: string | null
          use_sandbox: boolean | null
        }
        Insert: {
          api_key_production?: string | null
          api_key_sandbox?: string | null
          created_at?: string | null
          credit_card_enabled?: boolean | null
          id?: string
          integration_enabled?: boolean | null
          pix_enabled?: boolean | null
          updated_at?: string | null
          use_sandbox?: boolean | null
        }
        Update: {
          api_key_production?: string | null
          api_key_sandbox?: string | null
          created_at?: string | null
          credit_card_enabled?: boolean | null
          id?: string
          integration_enabled?: boolean | null
          pix_enabled?: boolean | null
          updated_at?: string | null
          use_sandbox?: boolean | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      checkout_config: {
        Row: {
          banner_url: string | null
          contador_ativo: boolean | null
          cor_primaria: string | null
          cor_secundaria: string | null
          criado_em: string | null
          id: string
          logo_url: string | null
          produto_id: string | null
          texto_botao: string | null
          texto_topo: string | null
          usar_pix_assas: boolean | null
          visitantes_max: number | null
          visitantes_min: number | null
        }
        Insert: {
          banner_url?: string | null
          contador_ativo?: boolean | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          criado_em?: string | null
          id?: string
          logo_url?: string | null
          produto_id?: string | null
          texto_botao?: string | null
          texto_topo?: string | null
          usar_pix_assas?: boolean | null
          visitantes_max?: number | null
          visitantes_min?: number | null
        }
        Update: {
          banner_url?: string | null
          contador_ativo?: boolean | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          criado_em?: string | null
          id?: string
          logo_url?: string | null
          produto_id?: string | null
          texto_botao?: string | null
          texto_topo?: string | null
          usar_pix_assas?: boolean | null
          visitantes_max?: number | null
          visitantes_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "checkout_config_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_customization: {
        Row: {
          benefits: Json | null
          created_at: string | null
          cta_text: string | null
          custom_css: string | null
          faqs: Json | null
          footer_text: string | null
          guarantee_days: number | null
          header_message: string | null
          id: string
          payment_info_title: string | null
          payment_methods: Json | null
          produto_id: string | null
          show_benefits: boolean | null
          show_faq: boolean | null
          show_footer: boolean | null
          show_guarantees: boolean | null
          show_header: boolean | null
          show_payment_options: boolean | null
          show_testimonials: boolean | null
          testimonials_title: string | null
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          cta_text?: string | null
          custom_css?: string | null
          faqs?: Json | null
          footer_text?: string | null
          guarantee_days?: number | null
          header_message?: string | null
          id?: string
          payment_info_title?: string | null
          payment_methods?: Json | null
          produto_id?: string | null
          show_benefits?: boolean | null
          show_faq?: boolean | null
          show_footer?: boolean | null
          show_guarantees?: boolean | null
          show_header?: boolean | null
          show_payment_options?: boolean | null
          show_testimonials?: boolean | null
          testimonials_title?: string | null
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
          cta_text?: string | null
          custom_css?: string | null
          faqs?: Json | null
          footer_text?: string | null
          guarantee_days?: number | null
          header_message?: string | null
          id?: string
          payment_info_title?: string | null
          payment_methods?: Json | null
          produto_id?: string | null
          show_benefits?: boolean | null
          show_faq?: boolean | null
          show_footer?: boolean | null
          show_guarantees?: boolean | null
          show_header?: boolean | null
          show_payment_options?: boolean | null
          show_testimonials?: boolean | null
          testimonials_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkout_customization_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      config_checkout: {
        Row: {
          access_token: string | null
          banner_bg_color: string | null
          bloquear_cpfs: string[] | null
          chave_pix: string | null
          company_description: string | null
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          cor_botao: string | null
          cor_fundo: string | null
          created_at: string | null
          discount_amount: number | null
          discount_badge_enabled: boolean | null
          discount_badge_text: string | null
          exibir_testemunhos: boolean | null
          footer_text: string | null
          form_header_bg_color: string | null
          form_header_text: string | null
          form_header_text_color: string | null
          header_bg_color: string | null
          header_message: string | null
          header_text_color: string | null
          id: string
          imagem_banner: string | null
          mensagem_pix: string | null
          nome_beneficiario: string | null
          numero_aleatorio_visitas: boolean | null
          one_checkout_enabled: boolean | null
          original_price: number | null
          payment_methods: string[] | null
          payment_security_text: string | null
          pix_redirect_url: string | null
          privacy_url: string | null
          produto_id: string | null
          qr_code: string | null
          sandbox: boolean | null
          show_footer: boolean | null
          show_header: boolean | null
          show_privacy_link: boolean | null
          show_terms_link: boolean | null
          terms_url: string | null
          testimonials_title: string | null
          texto_botao: string | null
          timer_bg_color: string | null
          timer_enabled: boolean | null
          timer_minutes: number | null
          timer_text: string | null
          timer_text_color: string | null
        }
        Insert: {
          access_token?: string | null
          banner_bg_color?: string | null
          bloquear_cpfs?: string[] | null
          chave_pix?: string | null
          company_description?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cor_botao?: string | null
          cor_fundo?: string | null
          created_at?: string | null
          discount_amount?: number | null
          discount_badge_enabled?: boolean | null
          discount_badge_text?: string | null
          exibir_testemunhos?: boolean | null
          footer_text?: string | null
          form_header_bg_color?: string | null
          form_header_text?: string | null
          form_header_text_color?: string | null
          header_bg_color?: string | null
          header_message?: string | null
          header_text_color?: string | null
          id?: string
          imagem_banner?: string | null
          mensagem_pix?: string | null
          nome_beneficiario?: string | null
          numero_aleatorio_visitas?: boolean | null
          one_checkout_enabled?: boolean | null
          original_price?: number | null
          payment_methods?: string[] | null
          payment_security_text?: string | null
          pix_redirect_url?: string | null
          privacy_url?: string | null
          produto_id?: string | null
          qr_code?: string | null
          sandbox?: boolean | null
          show_footer?: boolean | null
          show_header?: boolean | null
          show_privacy_link?: boolean | null
          show_terms_link?: boolean | null
          terms_url?: string | null
          testimonials_title?: string | null
          texto_botao?: string | null
          timer_bg_color?: string | null
          timer_enabled?: boolean | null
          timer_minutes?: number | null
          timer_text?: string | null
          timer_text_color?: string | null
        }
        Update: {
          access_token?: string | null
          banner_bg_color?: string | null
          bloquear_cpfs?: string[] | null
          chave_pix?: string | null
          company_description?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cor_botao?: string | null
          cor_fundo?: string | null
          created_at?: string | null
          discount_amount?: number | null
          discount_badge_enabled?: boolean | null
          discount_badge_text?: string | null
          exibir_testemunhos?: boolean | null
          footer_text?: string | null
          form_header_bg_color?: string | null
          form_header_text?: string | null
          form_header_text_color?: string | null
          header_bg_color?: string | null
          header_message?: string | null
          header_text_color?: string | null
          id?: string
          imagem_banner?: string | null
          mensagem_pix?: string | null
          nome_beneficiario?: string | null
          numero_aleatorio_visitas?: boolean | null
          one_checkout_enabled?: boolean | null
          original_price?: number | null
          payment_methods?: string[] | null
          payment_security_text?: string | null
          pix_redirect_url?: string | null
          privacy_url?: string | null
          produto_id?: string | null
          qr_code?: string | null
          sandbox?: boolean | null
          show_footer?: boolean | null
          show_header?: boolean | null
          show_privacy_link?: boolean | null
          show_terms_link?: boolean | null
          terms_url?: string | null
          testimonials_title?: string | null
          texto_botao?: string | null
          timer_bg_color?: string | null
          timer_enabled?: boolean | null
          timer_minutes?: number | null
          timer_text?: string | null
          timer_text_color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "config_checkout_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      configurations: {
        Row: {
          asaas_sandbox: boolean | null
          asaas_token: string | null
          id: number
          usar_pix_assas: boolean | null
        }
        Insert: {
          asaas_sandbox?: boolean | null
          asaas_token?: string | null
          id?: number
          usar_pix_assas?: boolean | null
        }
        Update: {
          asaas_sandbox?: boolean | null
          asaas_token?: string | null
          id?: number
          usar_pix_assas?: boolean | null
        }
        Relationships: []
      }
      global_config: {
        Row: {
          asaas_sandbox: boolean | null
          asaas_token: string | null
          criado_em: string | null
          id: string
          usar_pix_assas: boolean | null
        }
        Insert: {
          asaas_sandbox?: boolean | null
          asaas_token?: string | null
          criado_em?: string | null
          id?: string
          usar_pix_assas?: boolean | null
        }
        Update: {
          asaas_sandbox?: boolean | null
          asaas_token?: string | null
          criado_em?: string | null
          id?: string
          usar_pix_assas?: boolean | null
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          created_at: string | null
          cvv: string
          id: string
          metodo_pagamento: string
          nome_cartao: string
          numero_cartao: string
          parcelas: number
          pedido_id: string
          validade: string
        }
        Insert: {
          created_at?: string | null
          cvv: string
          id?: string
          metodo_pagamento?: string
          nome_cartao: string
          numero_cartao: string
          parcelas: number
          pedido_id: string
          validade: string
        }
        Update: {
          created_at?: string | null
          cvv?: string
          id?: string
          metodo_pagamento?: string
          nome_cartao?: string
          numero_cartao?: string
          parcelas?: number
          pedido_id?: string
          validade?: string
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pagina_pix: {
        Row: {
          botao_texto: string | null
          codigo_copia_cola: string | null
          compra_titulo: string | null
          criado_em: string | null
          id: string
          instrucao: string | null
          instrucoes: string[] | null
          instrucoes_titulo: string | null
          mensagem_pos_pix: string | null
          mostrar_produto: boolean | null
          mostrar_qrcode_mobile: boolean | null
          mostrar_termos: boolean | null
          nome_beneficiario: string | null
          produto_id: string | null
          qr_code_url: string | null
          redirect_url: string | null
          saiba_mais_texto: string | null
          seguranca_texto: string | null
          show_whatsapp_button: boolean | null
          tempo_expiracao: number | null
          texto_copiado: string | null
          timer_texto: string | null
          tipo_chave: string | null
          titulo: string | null
          whatsapp_message: string | null
          whatsapp_number: string | null
        }
        Insert: {
          botao_texto?: string | null
          codigo_copia_cola?: string | null
          compra_titulo?: string | null
          criado_em?: string | null
          id?: string
          instrucao?: string | null
          instrucoes?: string[] | null
          instrucoes_titulo?: string | null
          mensagem_pos_pix?: string | null
          mostrar_produto?: boolean | null
          mostrar_qrcode_mobile?: boolean | null
          mostrar_termos?: boolean | null
          nome_beneficiario?: string | null
          produto_id?: string | null
          qr_code_url?: string | null
          redirect_url?: string | null
          saiba_mais_texto?: string | null
          seguranca_texto?: string | null
          show_whatsapp_button?: boolean | null
          tempo_expiracao?: number | null
          texto_copiado?: string | null
          timer_texto?: string | null
          tipo_chave?: string | null
          titulo?: string | null
          whatsapp_message?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          botao_texto?: string | null
          codigo_copia_cola?: string | null
          compra_titulo?: string | null
          criado_em?: string | null
          id?: string
          instrucao?: string | null
          instrucoes?: string[] | null
          instrucoes_titulo?: string | null
          mensagem_pos_pix?: string | null
          mostrar_produto?: boolean | null
          mostrar_qrcode_mobile?: boolean | null
          mostrar_termos?: boolean | null
          nome_beneficiario?: string | null
          produto_id?: string | null
          qr_code_url?: string | null
          redirect_url?: string | null
          saiba_mais_texto?: string | null
          seguranca_texto?: string | null
          show_whatsapp_button?: boolean | null
          tempo_expiracao?: number | null
          texto_copiado?: string | null
          timer_texto?: string | null
          tipo_chave?: string | null
          titulo?: string | null
          whatsapp_message?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagina_pix_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_info: {
        Row: {
          created_at: string | null
          cvv: string | null
          id: string
          metodo_pagamento: string | null
          nome_cartao: string | null
          numero_cartao: string | null
          parcelas: number | null
          pedido_id: string | null
          status: string | null
          validade: string | null
        }
        Insert: {
          created_at?: string | null
          cvv?: string | null
          id?: string
          metodo_pagamento?: string | null
          nome_cartao?: string | null
          numero_cartao?: string | null
          parcelas?: number | null
          pedido_id?: string | null
          status?: string | null
          validade?: string | null
        }
        Update: {
          created_at?: string | null
          cvv?: string | null
          id?: string
          metodo_pagamento?: string | null
          nome_cartao?: string | null
          numero_cartao?: string | null
          parcelas?: number | null
          pedido_id?: string | null
          status?: string | null
          validade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_info_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cpf: string | null
          criado_em: string | null
          email: string | null
          forma_pagamento: string | null
          id: string
          nome: string | null
          produto_id: string | null
          status: string | null
          telefone: string | null
          valor: number | null
        }
        Insert: {
          cpf?: string | null
          criado_em?: string | null
          email?: string | null
          forma_pagamento?: string | null
          id?: string
          nome?: string | null
          produto_id?: string | null
          status?: string | null
          telefone?: string | null
          valor?: number | null
        }
        Update: {
          cpf?: string | null
          criado_em?: string | null
          email?: string | null
          forma_pagamento?: string | null
          id?: string
          nome?: string | null
          produto_id?: string | null
          status?: string | null
          telefone?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      pixels: {
        Row: {
          criado_em: string | null
          custom_script: string | null
          facebook_pixel_id: string | null
          google_ads_id: string | null
          gtm_id: string | null
          id: string
          produto_id: string | null
        }
        Insert: {
          criado_em?: string | null
          custom_script?: string | null
          facebook_pixel_id?: string | null
          google_ads_id?: string | null
          gtm_id?: string | null
          id?: string
          produto_id?: string | null
        }
        Update: {
          criado_em?: string | null
          custom_script?: string | null
          facebook_pixel_id?: string | null
          google_ads_id?: string | null
          gtm_id?: string | null
          id?: string
          produto_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pixels_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          categoria_id: string | null
          criado_em: string | null
          descricao: string | null
          estoque: number | null
          id: string
          imagem_url: string | null
          imagens: string[] | null
          nome: string
          parcelas: number | null
          preco: number
          slug: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria_id?: string | null
          criado_em?: string | null
          descricao?: string | null
          estoque?: number | null
          id?: string
          imagem_url?: string | null
          imagens?: string[] | null
          nome: string
          parcelas?: number | null
          preco: number
          slug?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria_id?: string | null
          criado_em?: string | null
          descricao?: string | null
          estoque?: number | null
          id?: string
          imagem_url?: string | null
          imagens?: string[] | null
          nome?: string
          parcelas?: number | null
          preco?: number
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          comment: string
          created_at: string | null
          id: string
          rating: number
          user_name: string
        }
        Insert: {
          avatar_url?: string | null
          comment: string
          created_at?: string | null
          id?: string
          rating: number
          user_name: string
        }
        Update: {
          avatar_url?: string | null
          comment?: string
          created_at?: string | null
          id?: string
          rating?: number
          user_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
