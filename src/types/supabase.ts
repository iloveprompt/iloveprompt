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
      // ... outras tabelas existentes
    }
    Views: {
      admin_users_view: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
          role_id: string | null
          role_name: string | null
          subscription_status: string
          plan_name: string
        }
      }
    }
  }
}

export interface WizardItem {
  id: string;
  label: string;
  description: string;
  category?: string;
  value?: string;
  disabled?: boolean;
} 