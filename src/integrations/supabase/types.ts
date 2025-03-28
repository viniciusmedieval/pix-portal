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
      config_checkout: {
        Row: {
          bloquear_cpfs: string[] | null
          chave_pix: string | null
          cor_botao: string | null
          cor_fundo: string | null
          created_at: string | null
          exibir_testemunhos: boolean | null
          id: string
          mensagem_pix: string | null
          numero_aleatorio_visitas: boolean | null
          produto_id: string | null
          qr_code: string | null
          texto_botao: string | null
        }
        Insert: {
          bloquear_cpfs?: string[] | null
          chave_pix?: string | null
          cor_botao?: string | null
          cor_fundo?: string | null
          created_at?: string | null
          exibir_testemunhos?: boolean | null
          id?: string
          mensagem_pix?: string | null
          numero_aleatorio_visitas?: boolean | null
          produto_id?: string | null
          qr_code?: string | null
          texto_botao?: string | null
        }
        Update: {
          bloquear_cpfs?: string[] | null
          chave_pix?: string | null
          cor_botao?: string | null
          cor_fundo?: string | null
          created_at?: string | null
          exibir_testemunhos?: boolean | null
          id?: string
          mensagem_pix?: string | null
          numero_aleatorio_visitas?: boolean | null
          produto_id?: string | null
          qr_code?: string | null
          texto_botao?: string | null
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
      pagina_pix: {
        Row: {
          codigo_copia_cola: string | null
          criado_em: string | null
          id: string
          mensagem_pos_pix: string | null
          nome_beneficiario: string | null
          produto_id: string | null
          qr_code_url: string | null
          tempo_expiracao: number | null
        }
        Insert: {
          codigo_copia_cola?: string | null
          criado_em?: string | null
          id?: string
          mensagem_pos_pix?: string | null
          nome_beneficiario?: string | null
          produto_id?: string | null
          qr_code_url?: string | null
          tempo_expiracao?: number | null
        }
        Update: {
          codigo_copia_cola?: string | null
          criado_em?: string | null
          id?: string
          mensagem_pos_pix?: string | null
          nome_beneficiario?: string | null
          produto_id?: string | null
          qr_code_url?: string | null
          tempo_expiracao?: number | null
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
          criado_em: string | null
          descricao: string | null
          estoque: number | null
          id: string
          imagem_url: string | null
          nome: string
          parcelas: number | null
          preco: number
          slug: string | null
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          estoque?: number | null
          id?: string
          imagem_url?: string | null
          nome: string
          parcelas?: number | null
          preco: number
          slug?: string | null
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          descricao?: string | null
          estoque?: number | null
          id?: string
          imagem_url?: string | null
          nome?: string
          parcelas?: number | null
          preco?: number
          slug?: string | null
        }
        Relationships: []
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
