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
      document_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_documents: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          prompt_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt_id?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      llm_system_messages: {
        Row: {
          content: string
          created_at: string | null
          created_by_admin_id: string | null
          id: string
          is_default: boolean
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by_admin_id?: string | null
          id?: string
          is_default?: boolean
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by_admin_id?: string | null
          id?: string
          is_default?: boolean
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "llm_system_messages_created_by_admin_id_fkey"
            columns: ["created_by_admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
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
          {
            foreignKeyName: "prompt_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
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
        Relationships: [
          {
            foreignKeyName: "prompts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      user_llm_apis: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_tested_at: string | null
          models: string[] | null
          provider: Database["public"]["Enums"]["llm_provider"]
          test_status: Database["public"]["Enums"]["api_test_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_tested_at?: string | null
          models?: string[] | null
          provider: Database["public"]["Enums"]["llm_provider"]
          test_status?: Database["public"]["Enums"]["api_test_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_tested_at?: string | null
          models?: string[] | null
          provider?: Database["public"]["Enums"]["llm_provider"]
          test_status?: Database["public"]["Enums"]["api_test_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_llm_apis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "admin_users_view"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
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
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
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
      admin_user_view: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          plan_name: string | null
          role_id: string | null
          role_name: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users_view: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          plan_name: string | null
          role_id: string | null
          role_name: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_auth_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          is_authenticated: boolean
          current_user_id: string
          has_rls_enabled: boolean
        }[]
      }
      clear_user_session: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
      http_setup_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      setup_new_user: {
        Args: { user_id: string }
        Returns: undefined
      }
      sync_existing_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          synced_user_id: string
          profile_created: boolean
          role_assigned: boolean
          subscription_created: boolean
        }[]
      }
      test_api_access: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          has_policy: boolean
          policy_roles: string[]
          table_grants: string[]
        }[]
      }
      validate_user_metadata: {
        Args: { metadata: Json }
        Returns: Json
      }
    }
    Enums: {
      api_test_status: "untested" | "success" | "failure"
      llm_provider: "openai" | "gemini" | "groq" | "deepseek" | "grok"
      provider_enum: "openai" | "anthropic" | "google" | "mistral"
      test_status_enum: "pending" | "success" | "failed"
    }
    CompositeTypes: {
      admin_user_view_type: {
        id: string | null
        email: string | null
        full_name: string | null
        avatar_url: string | null
        created_at: string | null
        updated_at: string | null
        role_id: string | null
        role_name: string | null
        subscription_status: string | null
        plan_name: string | null
      }
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
    Enums: {
      api_test_status: ["untested", "success", "failure"],
      llm_provider: ["openai", "gemini", "groq", "deepseek", "grok"],
      provider_enum: ["openai", "anthropic", "google", "mistral"],
      test_status_enum: ["pending", "success", "failed"],
    },
  },
} as const
