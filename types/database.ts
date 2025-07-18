export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          name: string | null
          email: string
          password_hash: string | null
          role: string | null
          created_at: string | null
          is_verified: boolean | null
        }
        Insert: {
          id?: number
          name?: string | null
          email: string
          password_hash?: string | null
          role?: string | null
          created_at?: string | null
          is_verified?: boolean | null
        }
        Update: {
          id?: number
          name?: string | null
          email?: string
          password_hash?: string | null
          role?: string | null
          created_at?: string | null
          is_verified?: boolean | null
        }
      }
      sellers: {
        Row: {
          user_id: number
          seller_type: string | null
          profile_picture_url: string | null
          landing_description: string | null
          social_links: string | null
          fe_active: boolean | null
        }
        Insert: {
          user_id: number
          seller_type?: string | null
          profile_picture_url?: string | null
          landing_description?: string | null
          social_links?: string | null
          fe_active?: boolean | null
        }
        Update: {
          user_id?: number
          seller_type?: string | null
          profile_picture_url?: string | null
          landing_description?: string | null
          social_links?: string | null
          fe_active?: boolean | null
        }
      }
      products: {
        Row: {
          id: number
          seller_id: number | null
          name: string | null
          description: string | null
          price: number | null
          category: string | null
          is_active: boolean | null
          is_promoted: boolean | null
          stock_quantity: number | null
          created_at: string | null
        }
        Insert: {
          id?: number
          seller_id?: number | null
          name?: string | null
          description?: string | null
          price?: number | null
          category?: string | null
          is_active?: boolean | null
          is_promoted?: boolean | null
          stock_quantity?: number | null
          created_at?: string | null
        }
        Update: {
          id?: number
          seller_id?: number | null
          name?: string | null
          description?: string | null
          price?: number | null
          category?: string | null
          is_active?: boolean | null
          is_promoted?: boolean | null
          stock_quantity?: number | null
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: number
          buyer_id: number | null
          total: number | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          buyer_id?: number | null
          total?: number | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          buyer_id?: number | null
          total?: number | null
          status?: string | null
          created_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number | null
          product_id: number | null
          quantity: number | null
          unit_price: number | null
        }
        Insert: {
          id?: number
          order_id?: number | null
          product_id?: number | null
          quantity?: number | null
          unit_price?: number | null
        }
        Update: {
          id?: number
          order_id?: number | null
          product_id?: number | null
          quantity?: number | null
          unit_price?: number | null
        }
      }
      payments: {
        Row: {
          id: number
          user_id: number | null
          order_id: number | null
          amount: number | null
          method: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: number | null
          order_id?: number | null
          amount?: number | null
          method?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: number | null
          order_id?: number | null
          amount?: number | null
          method?: string | null
          status?: string | null
          created_at?: string | null
        }
      }
      wishlists: {
        Row: {
          id: number
          user_id: number | null
          product_id: number | null
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: number | null
          product_id?: number | null
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: number | null
          product_id?: number | null
          created_at?: string | null
        }
      }
      product_reviews: {
        Row: {
          id: number
          product_id: number | null
          user_id: number | null
          rating: number | null
          comment: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          product_id?: number | null
          user_id?: number | null
          rating?: number | null
          comment?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          product_id?: number | null
          user_id?: number | null
          rating?: number | null
          comment?: string | null
          created_at?: string | null
        }
      }
      conversations: {
        Row: {
          id: number
          buyer_id: number | null
          seller_id: number | null
          started_at: string | null
        }
        Insert: {
          id?: number
          buyer_id?: number | null
          seller_id?: number | null
          started_at?: string | null
        }
        Update: {
          id?: number
          buyer_id?: number | null
          seller_id?: number | null
          started_at?: string | null
        }
      }
      messages: {
        Row: {
          id: number
          conversation_id: number | null
          sender_id: number | null
          content: string | null
          sent_at: string | null
          is_read: boolean | null
        }
        Insert: {
          id?: number
          conversation_id?: number | null
          sender_id?: number | null
          content?: string | null
          sent_at?: string | null
          is_read?: boolean | null
        }
        Update: {
          id?: number
          conversation_id?: number | null
          sender_id?: number | null
          content?: string | null
          sent_at?: string | null
          is_read?: boolean | null
        }
      }
      cart_items: {
        Row: {
          id: number
          user_id: number
          product_id: number
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: number
          product_id: number
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          product_id?: number
          quantity?: number
          created_at?: string
          updated_at?: string
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
  }
}
