
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
      products: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          price: number
          image_url: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          price: number
          image_url?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_active?: boolean
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
