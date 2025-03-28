export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      produtos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          preco: number
          parcelas: number
          ativo: boolean
          criado_em: string
          estoque: number | null
          imagem_url: string | null
          slug: string | null
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          preco: number
          parcelas?: number
          ativo?: boolean
          criado_em?: string
          estoque?: number | null
          imagem_url?: string | null
          slug?: string | null
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          preco?: number
          parcelas?: number
          ativo?: boolean
          criado_em?: string
          estoque?: number | null
          imagem_url?: string | null
          slug?: string | null
        }
      }
      checkout_config: {
        Row: {
          id: string
          produto_id: string | null
          cor_primaria: string | null
          cor_secundaria: string | null
          logo_url: string | null
          banner_url: string | null
          texto_topo: string | null
          texto_botao: string | null
          contador_ativo: boolean | null
          visitantes_min: number | null
          visitantes_max: number | null
          criado_em: string | null
        }
        Insert: {
          id?: string
          produto_id?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          logo_url?: string | null
          banner_url?: string | null
          texto_topo?: string | null
          texto_botao?: string | null
          contador_ativo?: boolean | null
          visitantes_min?: number | null
          visitantes_max?: number | null
          criado_em?: string | null
        }
        Update: {
          id?: string
          produto_id?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          logo_url?: string | null
          banner_url?: string | null
          texto_topo?: string | null
          texto_botao?: string | null
          contador_ativo?: boolean | null
          visitantes_min?: number | null
          visitantes_max?: number | null
          criado_em?: string | null
        }
      }
      pagina_pix: {
        Row: {
          id: string
          produto_id: string
          codigo_copia_cola: string | null
          qr_code_url: string | null
          tempo_expiracao: number
          mensagem_pos_pix: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          produto_id: string
          codigo_copia_cola?: string | null
          qr_code_url?: string | null
          tempo_expiracao?: number
          mensagem_pos_pix?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          produto_id?: string
          codigo_copia_cola?: string | null
          qr_code_url?: string | null
          tempo_expiracao?: number
          mensagem_pos_pix?: string | null
          criado_em?: string
        }
      }
      pedidos: {
        Row: {
          id: string
          produto_id: string | null
          nome: string | null
          email: string | null
          telefone: string | null
          cpf: string | null
          valor: number | null
          forma_pagamento: string | null
          status: string
          criado_em: string
        }
        Insert: {
          id?: string
          produto_id?: string | null
          nome?: string | null
          email?: string | null
          telefone?: string | null
          cpf?: string | null
          valor?: number | null
          forma_pagamento?: string | null
          status?: string
          criado_em?: string
        }
        Update: {
          id?: string
          produto_id?: string | null
          nome?: string | null
          email?: string | null
          telefone?: string | null
          cpf?: string | null
          valor?: number | null
          forma_pagamento?: string | null
          status?: string
          criado_em?: string
        }
      }
      pixels: {
        Row: {
          id: string
          produto_id: string | null
          facebook_pixel_id: string | null
          google_ads_id: string | null
          gtm_id: string | null
          custom_script: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          produto_id?: string | null
          facebook_pixel_id?: string | null
          google_ads_id?: string | null
          gtm_id?: string | null
          custom_script?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          produto_id?: string | null
          facebook_pixel_id?: string | null
          google_ads_id?: string | null
          gtm_id?: string | null
          custom_script?: string | null
          criado_em?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          created_at: string
          user_name: string
          rating: number
          comment: string
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_name: string
          rating: number
          comment: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_name?: string
          rating?: number
          comment?: string
          avatar_url?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          user_email: string
          product_id: string
          status: string
          payment_method: string
          payment_status: string
          total_amount: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_email: string
          product_id: string
          status?: string
          payment_method: string
          payment_status?: string
          total_amount: number
        }
        Update: {
          id?: string
          created_at?: string
          user_email?: string
          product_id?: string
          status?: string
          payment_method?: string
          payment_status?: string
          total_amount?: number
        }
      }
      pix_configurations: {
        Row: {
          id: string
          created_at: string
          key_type: string
          key_value: string
          recipient_name: string
          city: string
          expiration_seconds: number
        }
        Insert: {
          id?: string
          created_at?: string
          key_type: string
          key_value: string
          recipient_name: string
          city: string
          expiration_seconds?: number
        }
        Update: {
          id?: string
          created_at?: string
          key_type?: string
          key_value?: string
          recipient_name?: string
          city?: string
          expiration_seconds?: number
        }
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
