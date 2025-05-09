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
      prompt_usage: {
        Row: {
          created_at: string | null
          id: string
          prompt_id: string | null
          tokens_used: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt_id?: string | null
          tokens_used?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt_id?: string | null
          tokens_used?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_usage_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
          wizard_data: Json
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
          wizard_data: Json
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          wizard_data?: Json
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          interval: string
          is_active: boolean | null
          name: string
          price: number
          prompt_limit: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval: string
          is_active?: boolean | null
          name: string
          price: number
          prompt_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string
          is_active?: boolean | null
          name?: string
          price?: number
          prompt_limit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity: string
          entity_id: string | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_role_assignments: {
        Row: {
          assigned_at: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          payment_method_id: string | null
          plan_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_method_id?: string | null
          plan_id?: string | null
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_method_id?: string | null
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_categories: {
        Row: {
          active: boolean | null
          color: string
          icon: string
          id: string
          key: string
          sort_order: number
        }
        Insert: {
          active?: boolean | null
          color: string
          icon: string
          id?: string
          key: string
          sort_order: number
        }
        Update: {
          active?: boolean | null
          color?: string
          icon?: string
          id?: string
          key?: string
          sort_order?: number
        }
        Relationships: []
      }
      wizard_category_translations: {
        Row: {
          category_id: string | null
          description: string | null
          id: string
          language: string
          title: string
        }
        Insert: {
          category_id?: string | null
          description?: string | null
          id?: string
          language: string
          title: string
        }
        Update: {
          category_id?: string | null
          description?: string | null
          id?: string
          language?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "wizard_category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "wizard_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_item_examples: {
        Row: {
          active: boolean | null
          id: string
          item_id: string | null
          text: string
        }
        Insert: {
          active?: boolean | null
          id?: string
          item_id?: string | null
          text: string
        }
        Update: {
          active?: boolean | null
          id?: string
          item_id?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "wizard_item_examples_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "wizard_items"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_item_options: {
        Row: {
          active: boolean | null
          id: string
          item_id: string | null
          key: string
          sort_order: number
        }
        Insert: {
          active?: boolean | null
          id?: string
          item_id?: string | null
          key: string
          sort_order: number
        }
        Update: {
          active?: boolean | null
          id?: string
          item_id?: string | null
          key?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "wizard_item_options_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "wizard_items"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_item_translations: {
        Row: {
          help_text: string | null
          id: string
          item_id: string | null
          language: string
          placeholder: string | null
          text: string
        }
        Insert: {
          help_text?: string | null
          id?: string
          item_id?: string | null
          language: string
          placeholder?: string | null
          text: string
        }
        Update: {
          help_text?: string | null
          id?: string
          item_id?: string | null
          language?: string
          placeholder?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "wizard_item_translations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "wizard_items"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_items: {
        Row: {
          active: boolean | null
          category_id: string | null
          has_other_option: boolean | null
          id: string
          key: string
          sort_order: number
          type: string
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          has_other_option?: boolean | null
          id?: string
          key: string
          sort_order: number
          type: string
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          has_other_option?: boolean | null
          id?: string
          key?: string
          sort_order?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wizard_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "wizard_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_option_translations: {
        Row: {
          id: string
          language: string
          option_id: string | null
          text: string
        }
        Insert: {
          id?: string
          language: string
          option_id?: string | null
          text: string
        }
        Update: {
          id?: string
          language?: string
          option_id?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "wizard_option_translations_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "wizard_item_options"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tables: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_user_plan: {
        Args: { user_id: string }
        Returns: {
          plan_id: string
          plan_name: string
          prompt_limit: number
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
