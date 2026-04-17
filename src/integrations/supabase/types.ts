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
          audit_followup_error: string | null
          audit_invite_expires_at: string | null
          audit_invite_token: string | null
          audit_followup_scheduled_at: string | null
          audit_followup_sent_at: string | null
          audit_followup_status: string | null
          city: string | null
          company: string
          created_at: string
          country: string | null
          email: string
          full_name: string
          id: string
          language: string
          last_portal_login_at: string | null
          message: string | null
          participants: number | null
          phone: string
          privacy_consent: boolean
          profession: string | null
          prospect_password_hash: string | null
          prospect_portal_status: string
          prospect_username: string | null
          request_intent: string
          requested_domain: string | null
          requested_formations: string | null
          sector: string | null
          source_page: string
          wants_expert_appointment: boolean
        }
        Insert: {
          audit_followup_error?: string | null
          audit_invite_expires_at?: string | null
          audit_invite_token?: string | null
          audit_followup_scheduled_at?: string | null
          audit_followup_sent_at?: string | null
          audit_followup_status?: string | null
          city?: string | null
          company: string
          created_at?: string
          country?: string | null
          email: string
          full_name: string
          id?: string
          language?: string
          last_portal_login_at?: string | null
          message?: string | null
          participants?: number | null
          phone: string
          privacy_consent?: boolean
          profession?: string | null
          prospect_password_hash?: string | null
          prospect_portal_status?: string
          prospect_username?: string | null
          request_intent?: string
          requested_domain?: string | null
          requested_formations?: string | null
          sector?: string | null
          source_page?: string
          wants_expert_appointment?: boolean
        }
        Update: {
          audit_followup_error?: string | null
          audit_invite_expires_at?: string | null
          audit_invite_token?: string | null
          audit_followup_scheduled_at?: string | null
          audit_followup_sent_at?: string | null
          audit_followup_status?: string | null
          city?: string | null
          company?: string
          created_at?: string
          country?: string | null
          email?: string
          full_name?: string
          id?: string
          language?: string
          last_portal_login_at?: string | null
          message?: string | null
          participants?: number | null
          phone?: string
          privacy_consent?: boolean
          profession?: string | null
          prospect_password_hash?: string | null
          prospect_portal_status?: string
          prospect_username?: string | null
          request_intent?: string
          requested_domain?: string | null
          requested_formations?: string | null
          sector?: string | null
          source_page?: string
          wants_expert_appointment?: boolean
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
      editorial_jobs: {
        Row: {
          created_at: string
          error_message: string | null
          finished_at: string | null
          id: string
          input_payload: Json | null
          job_type: string
          model: string | null
          output_payload: Json | null
          provider: string
          resource_post_id: string | null
          source_signal_id: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          input_payload?: Json | null
          job_type: string
          model?: string | null
          output_payload?: Json | null
          provider: string
          resource_post_id?: string | null
          source_signal_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          input_payload?: Json | null
          job_type?: string
          model?: string | null
          output_payload?: Json | null
          provider?: string
          resource_post_id?: string | null
          source_signal_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_jobs_resource_post_id_fkey"
            columns: ["resource_post_id"]
            isOneToOne: false
            referencedRelation: "resource_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editorial_jobs_source_signal_id_fkey"
            columns: ["source_signal_id"]
            isOneToOne: false
            referencedRelation: "source_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          language: string
          source_page: string | null
          status: string
          subscribed_domains: string[]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          language?: string
          source_page?: string | null
          status?: string
          subscribed_domains?: string[]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          language?: string
          source_page?: string | null
          status?: string
          subscribed_domains?: string[]
        }
        Relationships: []
      }
      prospect_email_delivery_logs: {
        Row: {
          contact_request_id: string | null
          created_at: string
          delivery_type: string
          error_message: string | null
          id: string
          metadata: Json
          provider: string
          provider_message_id: string | null
          recipient_email: string
          sent_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          contact_request_id?: string | null
          created_at?: string
          delivery_type: string
          error_message?: string | null
          id?: string
          metadata?: Json
          provider?: string
          provider_message_id?: string | null
          recipient_email: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          contact_request_id?: string | null
          created_at?: string
          delivery_type?: string
          error_message?: string | null
          id?: string
          metadata?: Json
          provider?: string
          provider_message_id?: string | null
          recipient_email?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospect_email_delivery_logs_contact_request_id_fkey"
            columns: ["contact_request_id"]
            isOneToOne: false
            referencedRelation: "contact_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_issues: {
        Row: {
          approved_at: string | null
          body_html: string | null
          body_markdown: string | null
          created_at: string
          cta_label: string | null
          cta_url: string | null
          generation_notes: string | null
          generation_source: string
          highlight_summary: string | null
          highlight_title: string | null
          highlight_url: string | null
          id: string
          intro: string | null
          issue_date: string
          language: string
          last_test_sent_at: string | null
          meta: Json | null
          preheader: string | null
          prompt_body: string | null
          prompt_title: string | null
          recipient_count: number
          scheduled_for: string | null
          send_count: number
          sent_at: string | null
          source_post_ids: string[]
          status: string
          subject: string
          target_domains: string[]
          tip_body: string | null
          tip_title: string | null
          title: string
          tool_category: string | null
          tool_name: string | null
          tool_summary: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          body_html?: string | null
          body_markdown?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          generation_notes?: string | null
          generation_source?: string
          highlight_summary?: string | null
          highlight_title?: string | null
          highlight_url?: string | null
          id?: string
          intro?: string | null
          issue_date?: string
          language?: string
          last_test_sent_at?: string | null
          meta?: Json | null
          preheader?: string | null
          prompt_body?: string | null
          prompt_title?: string | null
          recipient_count?: number
          scheduled_for?: string | null
          send_count?: number
          sent_at?: string | null
          source_post_ids?: string[]
          status?: string
          subject: string
          target_domains?: string[]
          tip_body?: string | null
          tip_title?: string | null
          title: string
          tool_category?: string | null
          tool_name?: string | null
          tool_summary?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          body_html?: string | null
          body_markdown?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          generation_notes?: string | null
          generation_source?: string
          highlight_summary?: string | null
          highlight_title?: string | null
          highlight_url?: string | null
          id?: string
          intro?: string | null
          issue_date?: string
          language?: string
          last_test_sent_at?: string | null
          meta?: Json | null
          preheader?: string | null
          prompt_body?: string | null
          prompt_title?: string | null
          recipient_count?: number
          scheduled_for?: string | null
          send_count?: number
          sent_at?: string | null
          source_post_ids?: string[]
          status?: string
          subject?: string
          target_domains?: string[]
          tip_body?: string | null
          tip_title?: string | null
          title?: string
          tool_category?: string | null
          tool_name?: string | null
          tool_summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_delivery_logs: {
        Row: {
          created_at: string
          delivery_type: string
          error_message: string | null
          id: string
          language: string
          newsletter_issue_id: string
          payload: Json | null
          provider: string
          provider_message_id: string | null
          recipient_email: string
          sent_at: string | null
          status: string
          subscribed_domains: string[]
        }
        Insert: {
          created_at?: string
          delivery_type?: string
          error_message?: string | null
          id?: string
          language?: string
          newsletter_issue_id: string
          payload?: Json | null
          provider?: string
          provider_message_id?: string | null
          recipient_email: string
          sent_at?: string | null
          status?: string
          subscribed_domains?: string[]
        }
        Update: {
          created_at?: string
          delivery_type?: string
          error_message?: string | null
          id?: string
          language?: string
          newsletter_issue_id?: string
          payload?: Json | null
          provider?: string
          provider_message_id?: string | null
          recipient_email?: string
          sent_at?: string | null
          status?: string
          subscribed_domains?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_delivery_logs_newsletter_issue_id_fkey"
            columns: ["newsletter_issue_id"]
            isOneToOne: false
            referencedRelation: "newsletter_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_posts: {
        Row: {
          category_key: string
          content_en: string | null
          content_fr: string | null
          cover_image_url: string | null
          created_at: string
          editorial_status: string
          excerpt_en: string
          excerpt_fr: string
          id: string
          is_featured: boolean
          is_new_manual: boolean
          origin_signal_id: string | null
          published_at: string
          read_time_minutes: number | null
          review_notes: string | null
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
          translated_from_post_id: string | null
          updated_at: string
        }
        Insert: {
          category_key: string
          content_en?: string | null
          content_fr?: string | null
          cover_image_url?: string | null
          created_at?: string
          editorial_status?: string
          excerpt_en: string
          excerpt_fr: string
          id?: string
          is_featured?: boolean
          is_new_manual?: boolean
          origin_signal_id?: string | null
          published_at?: string
          read_time_minutes?: number | null
          review_notes?: string | null
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
          translated_from_post_id?: string | null
          updated_at?: string
        }
        Update: {
          category_key?: string
          content_en?: string | null
          content_fr?: string | null
          cover_image_url?: string | null
          created_at?: string
          editorial_status?: string
          excerpt_en?: string
          excerpt_fr?: string
          id?: string
          is_featured?: boolean
          is_new_manual?: boolean
          origin_signal_id?: string | null
          published_at?: string
          read_time_minutes?: number | null
          review_notes?: string | null
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
          translated_from_post_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_posts_origin_signal_id_fkey"
            columns: ["origin_signal_id"]
            isOneToOne: false
            referencedRelation: "source_signals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_posts_translated_from_post_id_fkey"
            columns: ["translated_from_post_id"]
            isOneToOne: false
            referencedRelation: "resource_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      source_feeds: {
        Row: {
          country_focus: string | null
          created_at: string
          domain_focus: string | null
          feed_type: string
          id: string
          is_active: boolean
          language: string
          name: string
          notes: string | null
          publisher: string | null
          region_focus: string | null
          trust_score: number
          updated_at: string
          url: string
        }
        Insert: {
          country_focus?: string | null
          created_at?: string
          domain_focus?: string | null
          feed_type?: string
          id?: string
          is_active?: boolean
          language?: string
          name: string
          notes?: string | null
          publisher?: string | null
          region_focus?: string | null
          trust_score?: number
          updated_at?: string
          url: string
        }
        Update: {
          country_focus?: string | null
          created_at?: string
          domain_focus?: string | null
          feed_type?: string
          id?: string
          is_active?: boolean
          language?: string
          name?: string
          notes?: string | null
          publisher?: string | null
          region_focus?: string | null
          trust_score?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      source_signals: {
        Row: {
          content_type_detected: string | null
          country_detected: string | null
          created_at: string
          credibility_score: number | null
          domain_detected: string | null
          external_id: string | null
          hash: string | null
          id: string
          language: string | null
          priority_score: number | null
          published_at: string | null
          raw_summary: string | null
          raw_text: string | null
          region_detected: string | null
          relevance_score: number | null
          review_notes: string | null
          source_feed_id: string | null
          status: string
          tags: string[]
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          content_type_detected?: string | null
          country_detected?: string | null
          created_at?: string
          credibility_score?: number | null
          domain_detected?: string | null
          external_id?: string | null
          hash?: string | null
          id?: string
          language?: string | null
          priority_score?: number | null
          published_at?: string | null
          raw_summary?: string | null
          raw_text?: string | null
          region_detected?: string | null
          relevance_score?: number | null
          review_notes?: string | null
          source_feed_id?: string | null
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          content_type_detected?: string | null
          country_detected?: string | null
          created_at?: string
          credibility_score?: number | null
          domain_detected?: string | null
          external_id?: string | null
          hash?: string | null
          id?: string
          language?: string | null
          priority_score?: number | null
          published_at?: string | null
          raw_summary?: string | null
          raw_text?: string | null
          region_detected?: string | null
          relevance_score?: number | null
          review_notes?: string | null
          source_feed_id?: string | null
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_signals_source_feed_id_fkey"
            columns: ["source_feed_id"]
            isOneToOne: false
            referencedRelation: "source_feeds"
            referencedColumns: ["id"]
          },
        ]
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
          profession_input?: string | null
          request_intent_input?: string | null
          requested_domain_input?: string | null
          requested_formations_input?: string | null
          country_input?: string | null
          sector_input?: string | null
          source_page_input?: string | null
          wants_expert_appointment_input?: boolean | null
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
