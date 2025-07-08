export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          category_type: string
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category_type?: string
          color: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category_type?: string
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          category: string | null
          coordinates: unknown
          created_at: string
          id: string
          notes: string | null
          place_address: string | null
          place_name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          coordinates: unknown
          created_at?: string
          id?: string
          notes?: string | null
          place_address?: string | null
          place_name: string
          user_id: string
        }
        Update: {
          category?: string | null
          coordinates?: unknown
          created_at?: string
          id?: string
          notes?: string | null
          place_address?: string | null
          place_name?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          category: string | null
          coordinates: unknown | null
          created_at: string
          id: string
          location: string | null
          query: string
          results_count: number | null
          transport_mode: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          location?: string | null
          query: string
          results_count?: number | null
          transport_mode?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          location?: string | null
          query?: string
          results_count?: number | null
          transport_mode?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          search_terms: string[] | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
          search_terms?: string[] | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          search_terms?: string[] | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_modes: {
        Row: {
          created_at: string
          default_color: string
          icon: string
          id: string
          mapbox_profile: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          default_color: string
          icon: string
          id?: string
          mapbox_profile: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          default_color?: string
          icon?: string
          id?: string
          mapbox_profile?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address: string
          category_type: string
          company_name: string | null
          coordinates: unknown
          created_at: string
          id: string
          is_primary: boolean | null
          name: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          category_type: string
          company_name?: string | null
          coordinates: unknown
          created_at?: string
          id?: string
          is_primary?: boolean | null
          name: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          category_type?: string
          company_name?: string | null
          coordinates?: unknown
          created_at?: string
          id?: string
          is_primary?: boolean | null
          name?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_transport_preferences: {
        Row: {
          created_at: string
          custom_color: string
          id: string
          transport_mode_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_color: string
          id?: string
          transport_mode_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_color?: string
          id?: string
          transport_mode_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_transport_preferences_transport_mode_id_fkey"
            columns: ["transport_mode_id"]
            isOneToOne: false
            referencedRelation: "transport_modes"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
