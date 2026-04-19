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
          ai_maturity: string | null
          audit_followup_error: string | null
          audit_followup_scheduled_at: string | null
          audit_followup_sent_at: string | null
          audit_followup_status: string | null
          audit_invite_expires_at: string | null
          audit_invite_token: string | null
          budget_range: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string
          engagement_format: string[] | null
          full_name: string
          id: string
          language: string
          last_portal_login_at: string | null
          message: string | null
          participants: string | null
          phone: string | null
          privacy_consent: boolean
          profession: string | null
          prospect_password_hash: string | null
          prospect_portal_status: string | null
          prospect_type: string | null
          prospect_username: string | null
          request_intent: string
          requested_domain: string | null
          requested_formations: string | null
          scoping_horizon: string | null
          sector: string | null
          source_page: string | null
          status: string
          updated_at: string
          use_cases: string[] | null
          wants_expert_appointment: boolean
        }
        Insert: {
          ai_maturity?: string | null
          audit_followup_error?: string | null
          audit_followup_scheduled_at?: string | null
          audit_followup_sent_at?: string | null
          audit_followup_status?: string | null
          audit_invite_expires_at?: string | null
          audit_invite_token?: string | null
          budget_range?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          engagement_format?: string[] | null
          full_name: string
          id?: string
          language?: string
          last_portal_login_at?: string | null
          message?: string | null
          participants?: string | null
          phone?: string | null
          privacy_consent?: boolean
          profession?: string | null
          prospect_password_hash?: string | null
          prospect_portal_status?: string | null
          prospect_type?: string | null
          prospect_username?: string | null
          request_intent?: string
          requested_domain?: string | null
          requested_formations?: string | null
          scoping_horizon?: string | null
          sector?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          use_cases?: string[] | null
          wants_expert_appointment?: boolean
        }
        Update: {
          ai_maturity?: string | null
          audit_followup_error?: string | null
          audit_followup_scheduled_at?: string | null
          audit_followup_sent_at?: string | null
          audit_followup_status?: string | null
          audit_invite_expires_at?: string | null
          audit_invite_token?: string | null
          budget_range?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          engagement_format?: string[] | null
          full_name?: string
          id?: string
          language?: string
          last_portal_login_at?: string | null
          message?: string | null
          participants?: string | null
          phone?: string | null
          privacy_consent?: boolean
          profession?: string | null
          prospect_password_hash?: string | null
          prospect_portal_status?: string | null
          prospect_type?: string | null
          prospect_username?: string | null
          request_intent?: string
          requested_domain?: string | null
          requested_formations?: string | null
          scoping_horizon?: string | null
          sector?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          use_cases?: string[] | null
          wants_expert_appointment?: boolean
        }
        Relationships: []
      }
      content_feeds: {
        Row: {
          country_focus: string | null
          created_at: string
          domain_focus: string | null
          feed_type: string
          id: string
          is_active: boolean
          language: string
          last_fetched_at: string | null
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
          last_fetched_at?: string | null
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
          last_fetched_at?: string | null
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
      content_signals: {
        Row: {
          classification: Json | null
          created_at: string
          detected_at: string
          feed_id: string | null
          id: string
          language: string | null
          meta: Json | null
          signal_url: string | null
          status: string
          summary: string | null
          title: string | null
        }
        Insert: {
          classification?: Json | null
          created_at?: string
          detected_at?: string
          feed_id?: string | null
          id?: string
          language?: string | null
          meta?: Json | null
          signal_url?: string | null
          status?: string
          summary?: string | null
          title?: string | null
        }
        Update: {
          classification?: Json | null
          created_at?: string
          detected_at?: string
          feed_id?: string | null
          id?: string
          language?: string | null
          meta?: Json | null
          signal_url?: string | null
          status?: string
          summary?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_signals_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "content_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      form_invitations: {
        Row: {
          created_at: string
          draft_form_data: Json | null
          expires_at: string | null
          id: string
          invite_token: string
          invitee_email: string | null
          invitee_name: string | null
          response_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          draft_form_data?: Json | null
          expires_at?: string | null
          id?: string
          invite_token: string
          invitee_email?: string | null
          invitee_name?: string | null
          response_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          draft_form_data?: Json | null
          expires_at?: string | null
          id?: string
          invite_token?: string
          invitee_email?: string | null
          invitee_name?: string | null
          response_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_invitations_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      form_responses: {
        Row: {
          completion_percentage: number
          created_at: string
          form_data: Json
          id: string
          invitation_token: string | null
          is_completed: boolean
          session_id: string | null
          submitted_at: string
          user_email: string | null
          user_entity: string | null
          user_name: string | null
          user_position: string | null
        }
        Insert: {
          completion_percentage?: number
          created_at?: string
          form_data?: Json
          id?: string
          invitation_token?: string | null
          is_completed?: boolean
          session_id?: string | null
          submitted_at?: string
          user_email?: string | null
          user_entity?: string | null
          user_name?: string | null
          user_position?: string | null
        }
        Update: {
          completion_percentage?: number
          created_at?: string
          form_data?: Json
          id?: string
          invitation_token?: string | null
          is_completed?: boolean
          session_id?: string | null
          submitted_at?: string
          user_email?: string | null
          user_entity?: string | null
          user_name?: string | null
          user_position?: string | null
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
      monthly_domain_trends: {
        Row: {
          ai_model: string | null
          ai_provider: string | null
          badge_label_en: string
          badge_label_fr: string
          created_at: string
          domain_key: string
          id: string
          justification_en: string | null
          justification_fr: string | null
          rank: number
          source_signals: Json | null
          status: string
          target_sectors_en: string[]
          target_sectors_fr: string[]
          trend_month: string
          updated_at: string
          webinar_url: string | null
        }
        Insert: {
          ai_model?: string | null
          ai_provider?: string | null
          badge_label_en?: string
          badge_label_fr?: string
          created_at?: string
          domain_key: string
          id?: string
          justification_en?: string | null
          justification_fr?: string | null
          rank: number
          source_signals?: Json | null
          status?: string
          target_sectors_en?: string[]
          target_sectors_fr?: string[]
          trend_month: string
          updated_at?: string
          webinar_url?: string | null
        }
        Update: {
          ai_model?: string | null
          ai_provider?: string | null
          badge_label_en?: string
          badge_label_fr?: string
          created_at?: string
          domain_key?: string
          id?: string
          justification_en?: string | null
          justification_fr?: string | null
          rank?: number
          source_signals?: Json | null
          status?: string
          target_sectors_en?: string[]
          target_sectors_fr?: string[]
          trend_month?: string
          updated_at?: string
          webinar_url?: string | null
        }
        Relationships: []
      }
      newsletter_delivery_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          issue_id: string | null
          language: string | null
          provider_message_id: string | null
          recipient_email: string | null
          sent_at: string | null
          status: string
          subscribed_domains: string[] | null
          subscription_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          issue_id?: string | null
          language?: string | null
          provider_message_id?: string | null
          recipient_email?: string | null
          sent_at?: string | null
          status?: string
          subscribed_domains?: string[] | null
          subscription_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          issue_id?: string | null
          language?: string | null
          provider_message_id?: string | null
          recipient_email?: string | null
          sent_at?: string | null
          status?: string
          subscribed_domains?: string[] | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_delivery_logs_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "newsletter_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_delivery_logs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "newsletter_subscriptions"
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
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          language: string
          source_page: string | null
          status: string
          subscribed_domains: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          language?: string
          source_page?: string | null
          status?: string
          subscribed_domains?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          language?: string
          source_page?: string | null
          status?: string
          subscribed_domains?: string[]
          updated_at?: string
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
      partner_email_templates: {
        Row: {
          body_template: string
          created_at: string
          id: string
          is_active: boolean
          language: string
          meta: Json | null
          subject_template: string
          template_key: string
          updated_at: string
        }
        Insert: {
          body_template: string
          created_at?: string
          id?: string
          is_active?: boolean
          language?: string
          meta?: Json | null
          subject_template: string
          template_key: string
          updated_at?: string
        }
        Update: {
          body_template?: string
          created_at?: string
          id?: string
          is_active?: boolean
          language?: string
          meta?: Json | null
          subject_template?: string
          template_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_followup_jobs: {
        Row: {
          attempt_count: number
          created_at: string
          id: string
          job_status: string
          last_error: string | null
          meta: Json | null
          partner_listing_review_id: string | null
          provider: string
          provider_message_id: string | null
          scheduled_for: string
          sent_at: string | null
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          id?: string
          job_status?: string
          last_error?: string | null
          meta?: Json | null
          partner_listing_review_id?: string | null
          provider?: string
          provider_message_id?: string | null
          scheduled_for?: string
          sent_at?: string | null
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          id?: string
          job_status?: string
          last_error?: string | null
          meta?: Json | null
          partner_listing_review_id?: string | null
          provider?: string
          provider_message_id?: string | null
          scheduled_for?: string
          sent_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_followup_jobs_partner_listing_review_id_fkey"
            columns: ["partner_listing_review_id"]
            isOneToOne: false
            referencedRelation: "partner_listing_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_listing_reviews: {
        Row: {
          admin_notes: string | null
          ai_provider: string | null
          ai_reasoning: Json | null
          ai_recommendation: string | null
          ai_score: number | null
          assigned_to: string | null
          city: string | null
          company: string
          created_at: string
          id: string
          meta: Json | null
          prospect_email: string
          prospect_name: string
          recommended_deliverables: Json | null
          recommended_duration_months: number | null
          recommended_offer_key: string | null
          recommended_price_fcfa: number | null
          request_message: string | null
          requested_timeline: string | null
          requested_visibility_type: string | null
          response_due_at: string | null
          response_email_body_en: string | null
          response_email_body_fr: string | null
          response_email_subject: string | null
          response_sent_at: string | null
          review_status: string
          role: string | null
          sector_activity: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          admin_notes?: string | null
          ai_provider?: string | null
          ai_reasoning?: Json | null
          ai_recommendation?: string | null
          ai_score?: number | null
          assigned_to?: string | null
          city?: string | null
          company: string
          created_at?: string
          id?: string
          meta?: Json | null
          prospect_email: string
          prospect_name: string
          recommended_deliverables?: Json | null
          recommended_duration_months?: number | null
          recommended_offer_key?: string | null
          recommended_price_fcfa?: number | null
          request_message?: string | null
          requested_timeline?: string | null
          requested_visibility_type?: string | null
          response_due_at?: string | null
          response_email_body_en?: string | null
          response_email_body_fr?: string | null
          response_email_subject?: string | null
          response_sent_at?: string | null
          review_status?: string
          role?: string | null
          sector_activity?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          admin_notes?: string | null
          ai_provider?: string | null
          ai_reasoning?: Json | null
          ai_recommendation?: string | null
          ai_score?: number | null
          assigned_to?: string | null
          city?: string | null
          company?: string
          created_at?: string
          id?: string
          meta?: Json | null
          prospect_email?: string
          prospect_name?: string
          recommended_deliverables?: Json | null
          recommended_duration_months?: number | null
          recommended_offer_key?: string | null
          recommended_price_fcfa?: number | null
          request_message?: string | null
          requested_timeline?: string | null
          requested_visibility_type?: string | null
          response_due_at?: string | null
          response_email_body_en?: string | null
          response_email_body_fr?: string | null
          response_email_subject?: string | null
          response_sent_at?: string | null
          review_status?: string
          role?: string | null
          sector_activity?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      partner_offer_catalog: {
        Row: {
          created_at: string
          deliverables_en: Json
          deliverables_fr: Json
          duration_months: number
          id: string
          is_active: boolean
          offer_family: string
          offer_key: string
          offer_name_en: string
          offer_name_fr: string
          price_fcfa: number
          sort_order: number
          summary_en: string | null
          summary_fr: string | null
          updated_at: string
          visibility_level: string
        }
        Insert: {
          created_at?: string
          deliverables_en?: Json
          deliverables_fr?: Json
          duration_months: number
          id?: string
          is_active?: boolean
          offer_family: string
          offer_key: string
          offer_name_en: string
          offer_name_fr: string
          price_fcfa: number
          sort_order?: number
          summary_en?: string | null
          summary_fr?: string | null
          updated_at?: string
          visibility_level?: string
        }
        Update: {
          created_at?: string
          deliverables_en?: Json
          deliverables_fr?: Json
          duration_months?: number
          id?: string
          is_active?: boolean
          offer_family?: string
          offer_key?: string
          offer_name_en?: string
          offer_name_fr?: string
          price_fcfa?: number
          sort_order?: number
          summary_en?: string | null
          summary_fr?: string | null
          updated_at?: string
          visibility_level?: string
        }
        Relationships: []
      }
      prospect_email_delivery_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          intent: string | null
          language: string | null
          meta: Json | null
          provider_message_id: string | null
          recipient_email: string | null
          recipient_type: string | null
          request_id: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          intent?: string | null
          language?: string | null
          meta?: Json | null
          provider_message_id?: string | null
          recipient_email?: string | null
          recipient_type?: string | null
          request_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          intent?: string | null
          language?: string | null
          meta?: Json | null
          provider_message_id?: string | null
          recipient_email?: string | null
          recipient_type?: string | null
          request_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      registration_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          first_name: string
          formation_id: string
          formation_title: string
          id: string
          language: string
          last_name: string
          message: string | null
          participants: number
          phone: string | null
          position: string | null
          privacy_consent: boolean
          source_page: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          first_name: string
          formation_id: string
          formation_title: string
          id?: string
          language?: string
          last_name: string
          message?: string | null
          participants?: number
          phone?: string | null
          position?: string | null
          privacy_consent?: boolean
          source_page?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string
          formation_id?: string
          formation_title?: string
          id?: string
          language?: string
          last_name?: string
          message?: string | null
          participants?: number
          phone?: string | null
          position?: string | null
          privacy_consent?: boolean
          source_page?: string | null
          status?: string
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
          editorial_status: string
          excerpt_en: string | null
          excerpt_fr: string | null
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
          excerpt_en?: string | null
          excerpt_fr?: string | null
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
          excerpt_en?: string | null
          excerpt_fr?: string | null
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
            referencedRelation: "content_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_registrations: {
        Row: {
          admin_notes: string | null
          city: string | null
          country: string | null
          created_at: string
          date_confirmed_at: string | null
          domain_key: string | null
          domain_other: string | null
          email: string
          formation_id: string | null
          formation_other: string | null
          formation_title: string | null
          full_name: string
          id: string
          language: string
          motivation: string | null
          organization: string | null
          participants: number
          phone: string | null
          position: string | null
          privacy_consent: boolean
          reminder_sent_at: string | null
          scheduled_date: string
          sector: string | null
          sector_other: string | null
          source_page: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_confirmed_at?: string | null
          domain_key?: string | null
          domain_other?: string | null
          email: string
          formation_id?: string | null
          formation_other?: string | null
          formation_title?: string | null
          full_name: string
          id?: string
          language?: string
          motivation?: string | null
          organization?: string | null
          participants?: number
          phone?: string | null
          position?: string | null
          privacy_consent?: boolean
          reminder_sent_at?: string | null
          scheduled_date?: string
          sector?: string | null
          sector_other?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_confirmed_at?: string | null
          domain_key?: string | null
          domain_other?: string | null
          email?: string
          formation_id?: string | null
          formation_other?: string | null
          formation_title?: string | null
          full_name?: string
          id?: string
          language?: string
          motivation?: string | null
          organization?: string | null
          participants?: number
          phone?: string | null
          position?: string | null
          privacy_consent?: boolean
          reminder_sent_at?: string | null
          scheduled_date?: string
          sector?: string | null
          sector_other?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      page_view_stats: {
        Row: {
          total_views: number | null
          unique_today: number | null
          unique_visitors: number | null
          views_today: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_public_page_view_stats: {
        Args: never
        Returns: {
          total_views: number
          unique_today: number
          unique_visitors: number
          views_today: number
        }[]
      }
      submit_contact_request:
        | {
            Args: {
              city_input: string
              company_input: string
              email_input: string
              full_name_input: string
              honeypot_input: string
              language_input: string
              message_input: string
              participants_input: string
              phone_input: string
              privacy_consent_input: boolean
              request_intent_input: string
              requested_domain_input: string
              requested_formations_input: string
              sector_input: string
              source_page_input: string
            }
            Returns: string
          }
        | {
            Args: {
              ai_maturity_input?: string
              budget_range_input?: string
              city_input: string
              company_input: string
              email_input: string
              engagement_format_input?: string[]
              full_name_input: string
              honeypot_input: string
              language_input: string
              message_input: string
              participants_input: string
              phone_input: string
              privacy_consent_input: boolean
              request_intent_input: string
              requested_domain_input: string
              requested_formations_input: string
              scoping_horizon_input?: string
              sector_input: string
              source_page_input: string
              use_cases_input?: string[]
            }
            Returns: string
          }
      submit_registration_request: {
        Args: {
          company_input: string
          email_input: string
          first_name_input: string
          formation_id_input: string
          formation_title_input: string
          honeypot_input: string
          language_input: string
          last_name_input: string
          message_input: string
          participants_input: number
          phone_input: string
          position_input: string
          privacy_consent_input: boolean
          source_page_input: string
        }
        Returns: string
      }
      submit_webinar_registration: {
        Args: {
          city_input: string
          country_input: string
          domain_key_input: string
          domain_other_input: string
          email_input: string
          formation_id_input: string
          formation_other_input: string
          formation_title_input: string
          full_name_input: string
          honeypot_input: string
          language_input: string
          motivation_input: string
          organization_input: string
          participants_input: number
          phone_input: string
          position_input: string
          privacy_consent_input: boolean
          sector_input: string
          sector_other_input: string
          source_page_input: string
        }
        Returns: string
      }
      track_page_view: { Args: { page_path_input: string }; Returns: undefined }
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
