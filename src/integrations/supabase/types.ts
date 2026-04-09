export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      contact_requests: {
        Row: {
          city: string | null
          company: string
          created_at: string
          email: string
          full_name: string
          id: string
          language: string
          message: string | null
          participants: number | null
          phone: string
          privacy_consent: boolean
          request_intent: string
          requested_domain: string | null
          requested_formations: string | null
          sector: string | null
          source_page: string
        }
        Insert: {
          city?: string | null
          company: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          language?: string
          message?: string | null
          participants?: number | null
          phone: string
          privacy_consent?: boolean
          request_intent?: string
          requested_domain?: string | null
          requested_formations?: string | null
          sector?: string | null
          source_page?: string
        }
        Update: {
          city?: string | null
          company?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          language?: string
          message?: string | null
          participants?: number | null
          phone?: string
          privacy_consent?: boolean
          request_intent?: string
          requested_domain?: string | null
          requested_formations?: string | null
          sector?: string | null
          source_page?: string
        }
        Relationships: []
      }
      job_opportunities: {
        Row: {
          apply_url: string | null
          compensation_label: string | null
          created_at: string
          id: string
          is_featured: boolean
          is_new_manual: boolean
          location_en: string
          location_fr: string
          market_key: string
          opportunity_type: string
          published_at: string
          slug: string
          source_name: string
          source_url: string | null
          status: string
          summary_en: string
          summary_fr: string
          title: string
          updated_at: string
          work_mode: string
        }
        Insert: {
          apply_url?: string | null
          compensation_label?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          is_new_manual?: boolean
          location_en: string
          location_fr: string
          market_key: string
          opportunity_type?: string
          published_at?: string
          slug: string
          source_name: string
          source_url?: string | null
          status?: string
          summary_en: string
          summary_fr: string
          title: string
          updated_at?: string
          work_mode?: string
        }
        Update: {
          apply_url?: string | null
          compensation_label?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          is_new_manual?: boolean
          location_en?: string
          location_fr?: string
          market_key?: string
          opportunity_type?: string
          published_at?: string
          slug?: string
          source_name?: string
          source_url?: string | null
          status?: string
          summary_en?: string
          summary_fr?: string
          title?: string
          updated_at?: string
          work_mode?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          id: string
          page_path: string
          user_agent: string | null
          visited_at: string
          visitor_ip: string | null
        }
        Insert: {
          id?: string
          page_path?: string
          user_agent?: string | null
          visited_at?: string
          visitor_ip?: string | null
        }
        Update: {
          id?: string
          page_path?: string
          user_agent?: string | null
          visited_at?: string
          visitor_ip?: string | null
        }
        Relationships: []
      }
      resource_posts: {
        Row: {
          category_key: string
          content_en: string | null
          content_fr: string | null
          cover_image_url: string | null
          created_at: string
          excerpt_en: string
          excerpt_fr: string
          id: string
          is_featured: boolean
          is_new_manual: boolean
          published_at: string
          read_time_minutes: number | null
          sector_key: string | null
          seo_description_en: string | null
          seo_description_fr: string | null
          seo_title_en: string | null
          seo_title_fr: string | null
          slug: string
          source_name: string | null
          source_url: string | null
          sources_json: Json | null
          status: string
          tags: string[]
          title_en: string
          title_fr: string
          updated_at: string
        }
        Insert: {
          category_key: string
          content_en?: string | null
          content_fr?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt_en: string
          excerpt_fr: string
          id?: string
          is_featured?: boolean
          is_new_manual?: boolean
          published_at?: string
          read_time_minutes?: number | null
          sector_key?: string | null
          seo_description_en?: string | null
          seo_description_fr?: string | null
          seo_title_en?: string | null
          seo_title_fr?: string | null
          slug: string
          source_name?: string | null
          source_url?: string | null
          sources_json?: Json | null
          status?: string
          tags?: string[]
          title_en: string
          title_fr: string
          updated_at?: string
        }
        Update: {
          category_key?: string
          content_en?: string | null
          content_fr?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string
          excerpt_fr?: string
          id?: string
          is_featured?: boolean
          is_new_manual?: boolean
          published_at?: string
          read_time_minutes?: number | null
          sector_key?: string | null
          seo_description_en?: string | null
          seo_description_fr?: string | null
          seo_title_en?: string | null
          seo_title_fr?: string | null
          slug?: string
          source_name?: string | null
          source_url?: string | null
          sources_json?: Json | null
          status?: string
          tags?: string[]
          title_en?: string
          title_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      registration_requests: {
        Row: {
          company: string
          created_at: string
          email: string
          first_name: string
          formation_id: string | null
          formation_title: string
          id: string
          language: string
          last_name: string
          message: string | null
          participants: number
          phone: string
          position: string | null
          privacy_consent: boolean
          source_page: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          first_name: string
          formation_id?: string | null
          formation_title: string
          id?: string
          language?: string
          last_name: string
          message?: string | null
          participants?: number
          phone: string
          position?: string | null
          privacy_consent?: boolean
          source_page?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          first_name?: string
          formation_id?: string | null
          formation_title?: string
          id?: string
          language?: string
          last_name?: string
          message?: string | null
          participants?: number
          phone?: string
          position?: string | null
          privacy_consent?: boolean
          source_page?: string
        }
        Relationships: []
      }
    }
    Views: {
    }
    Functions: {
      get_public_page_view_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_views: number
          views_today: number
        }[]
      }
      submit_contact_request: {
        Args: {
          city_input?: string | null
          company_input: string
          email_input: string
          full_name_input: string
          honeypot_input?: string | null
          language_input?: string | null
          message_input?: string | null
          participants_input?: number | null
          phone_input: string
          privacy_consent_input?: boolean | null
          request_intent_input?: string | null
          requested_domain_input?: string | null
          requested_formations_input?: string | null
          sector_input?: string | null
          source_page_input?: string | null
        }
        Returns: string
      }
      submit_registration_request: {
        Args: {
          company_input: string
          email_input: string
          first_name_input: string
          formation_id_input?: string | null
          formation_title_input: string
          honeypot_input?: string | null
          language_input?: string | null
          last_name_input: string
          message_input?: string | null
          participants_input?: number | null
          phone_input: string
          position_input?: string | null
          privacy_consent_input?: boolean | null
          source_page_input?: string | null
        }
        Returns: string
      }
      track_page_view: {
        Args: {
          page_path_input?: string | null
        }
        Returns: undefined
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
