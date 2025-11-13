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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      act_disasters: {
        Row: {
          agrn: string | null
          disaster_name: string | null
          disaster_types: string | null
          disaster_url: string | null
          end_date: string | null
          id: string
          last_updated: string | null
          lgas: string[] | null
          scraped_date: string | null
          start_date: string | null
          state_territory: string
        }
        Insert: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Update: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Relationships: []
      }
      active_disasters: {
        Row: {
          agrn: string | null
          created_at: string | null
          disaster_name: string
          disaster_type: string | null
          id: number
          scraped_at: string | null
          start_date: string | null
          state: string
          url: string | null
        }
        Insert: {
          agrn?: string | null
          created_at?: string | null
          disaster_name: string
          disaster_type?: string | null
          id?: number
          scraped_at?: string | null
          start_date?: string | null
          state: string
          url?: string | null
        }
        Update: {
          agrn?: string | null
          created_at?: string | null
          disaster_name?: string
          disaster_type?: string | null
          id?: number
          scraped_at?: string | null
          start_date?: string | null
          state?: string
          url?: string | null
        }
        Relationships: []
      }
      admin_emails: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string | null
          notes: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          notes?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      admin_scan_reports: {
        Row: {
          created_at: string | null
          id: number
          report_data: Json
          report_type: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          report_data: Json
          report_type: string
        }
        Update: {
          created_at?: string | null
          id?: number
          report_data?: Json
          report_type?: string
        }
        Relationships: []
      }
      ai_circuit_breaker_status: {
        Row: {
          failure_count: number
          function_name: string
          id: string
          is_open: boolean
          last_failure_at: string | null
          last_reset_at: string | null
          total_failures: number
          total_successes: number
          updated_at: string
        }
        Insert: {
          failure_count?: number
          function_name: string
          id?: string
          is_open?: boolean
          last_failure_at?: string | null
          last_reset_at?: string | null
          total_failures?: number
          total_successes?: number
          updated_at?: string
        }
        Update: {
          failure_count?: number
          function_name?: string
          id?: string
          is_open?: boolean
          last_failure_at?: string | null
          last_reset_at?: string | null
          total_failures?: number
          total_successes?: number
          updated_at?: string
        }
        Relationships: []
      }
      ai_rate_limits: {
        Row: {
          function_name: string
          id: string
          max_requests: number
          request_count: number
          user_id: string
          window_end: string
          window_start: string
        }
        Insert: {
          function_name: string
          id?: string
          max_requests?: number
          request_count?: number
          user_id: string
          window_end: string
          window_start?: string
        }
        Update: {
          function_name?: string
          id?: string
          max_requests?: number
          request_count?: number
          user_id?: string
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      ai_request_logs: {
        Row: {
          cached_response: boolean
          clinic_name: string | null
          created_at: string
          error_message: string | null
          function_name: string
          id: string
          input_size: number
          ip_address: unknown | null
          model_used: string | null
          output_size: number
          processing_time_ms: number | null
          rate_limited: boolean
          request_type: string
          service_tier: string
          success: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          cached_response?: boolean
          clinic_name?: string | null
          created_at?: string
          error_message?: string | null
          function_name: string
          id?: string
          input_size?: number
          ip_address?: unknown | null
          model_used?: string | null
          output_size?: number
          processing_time_ms?: number | null
          rate_limited?: boolean
          request_type: string
          service_tier?: string
          success?: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          cached_response?: boolean
          clinic_name?: string | null
          created_at?: string
          error_message?: string | null
          function_name?: string
          id?: string
          input_size?: number
          ip_address?: unknown | null
          model_used?: string | null
          output_size?: number
          processing_time_ms?: number | null
          rate_limited?: boolean
          request_type?: string
          service_tier?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_usage_analytics: {
        Row: {
          cached_requests: number
          date: string
          failed_requests: number
          function_name: string
          id: string
          successful_requests: number
          total_cost_cents: number
          total_input_tokens: number
          total_output_tokens: number
          total_processing_time_ms: number
          total_requests: number
          user_id: string
        }
        Insert: {
          cached_requests?: number
          date?: string
          failed_requests?: number
          function_name: string
          id?: string
          successful_requests?: number
          total_cost_cents?: number
          total_input_tokens?: number
          total_output_tokens?: number
          total_processing_time_ms?: number
          total_requests?: number
          user_id: string
        }
        Update: {
          cached_requests?: number
          date?: string
          failed_requests?: number
          function_name?: string
          id?: string
          successful_requests?: number
          total_cost_cents?: number
          total_input_tokens?: number
          total_output_tokens?: number
          total_processing_time_ms?: number
          total_requests?: number
          user_id?: string
        }
        Relationships: []
      }
      asgs_remoteness_areas: {
        Row: {
          created_at: string | null
          id: number
          postcode: string
          remoteness_area: string
          remoteness_code: number
          state: string
          suburb: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          postcode: string
          remoteness_area: string
          remoteness_code: number
          state: string
          suburb?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          postcode?: string
          remoteness_area?: string
          remoteness_code?: number
          state?: string
          suburb?: string | null
        }
        Relationships: []
      }
      audit_log_archives: {
        Row: {
          archive_date: string
          checksum: string
          compressed_data: string | null
          created_at: string
          end_timestamp: string
          id: string
          record_count: number
          start_timestamp: string
        }
        Insert: {
          archive_date: string
          checksum: string
          compressed_data?: string | null
          created_at?: string
          end_timestamp: string
          id?: string
          record_count: number
          start_timestamp: string
        }
        Update: {
          archive_date?: string
          checksum?: string
          compressed_data?: string | null
          created_at?: string
          end_timestamp?: string
          id?: string
          record_count?: number
          start_timestamp?: string
        }
        Relationships: []
      }
      audit_log_summaries: {
        Row: {
          count: number
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          severity: string
          summary_date: string
          unique_users: number
        }
        Insert: {
          count?: number
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          severity: string
          summary_date: string
          unique_users?: number
        }
        Update: {
          count?: number
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          severity?: string
          summary_date?: string
          unique_users?: number
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string | null
          created_at: string
          error_message: string | null
          event_type: string
          hash: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          previous_hash: string | null
          resource_id: string | null
          resource_type: string | null
          result: string | null
          session_id: string | null
          severity: string
          stack_trace: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string
          error_message?: string | null
          event_type: string
          hash: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          previous_hash?: string | null
          resource_id?: string | null
          resource_type?: string | null
          result?: string | null
          session_id?: string | null
          severity: string
          stack_trace?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string
          error_message?: string | null
          event_type?: string
          hash?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          previous_hash?: string | null
          resource_id?: string | null
          resource_type?: string | null
          result?: string | null
          session_id?: string | null
          severity?: string
          stack_trace?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      australian_lgas_postcodes_simple: {
        Row: {
          created_at: string | null
          id: number
          lga: string
          postcode: string
          state: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga: string
          postcode: string
          state: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string
          postcode?: string
          state?: string
        }
        Relationships: []
      }
      australian_lgas_with_postcodes: {
        Row: {
          created_at: string | null
          id: number
          lga: string
          postcode_count: number | null
          postcodes: string | null
          state: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga: string
          postcode_count?: number | null
          postcodes?: string | null
          state: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string
          postcode_count?: number | null
          postcodes?: string | null
          state?: string
        }
        Relationships: []
      }
      australian_postcodes_act: {
        Row: {
          created_at: string | null
          id: number
          lga: string | null
          postcode: string
          state: string
          suburb: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode: string
          state: string
          suburb: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode?: string
          state?: string
          suburb?: string
        }
        Relationships: []
      }
      australian_postcodes_all_states: {
        Row: {
          created_at: string | null
          id: number
          lga: string | null
          postcode: string
          state: string
          suburb: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode: string
          state: string
          suburb: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode?: string
          state?: string
          suburb?: string
        }
        Relationships: []
      }
      australian_postcodes_nsw: {
        Row: {
          created_at: string | null
          id: number
          lga: string | null
          postcode: string
          state: string
          suburb: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode: string
          state: string
          suburb: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode?: string
          state?: string
          suburb?: string
        }
        Relationships: []
      }
      australian_postcodes_nt: {
        Row: {
          created_at: string | null
          id: number
          lga: string | null
          postcode: string
          state: string
          suburb: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode: string
          state: string
          suburb: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode?: string
          state?: string
          suburb?: string
        }
        Relationships: []
      }
      australian_postcodes_qld: {
        Row: {
          created_at: string | null
          id: number
          lga: string | null
          postcode: string
          state: string
          suburb: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode: string
          state: string
          suburb: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode?: string
          state?: string
          suburb?: string
        }
        Relationships: []
      }
      australian_postcodes_sa: {
        Row: {
          created_at: string | null
          id: number
          lga: string | null
          postcode: string
          state: string
          suburb: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode: string
          state: string
          suburb: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode?: string
          state?: string
          suburb?: string
        }
        Relationships: []
      }
      australian_postcodes_tas: {
        Row: {
          created_at: string | null
          id: number
          lga: string | null
          postcode: string
          state: string
          suburb: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode: string
          state: string
          suburb: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode?: string
          state?: string
          suburb?: string
        }
        Relationships: []
      }
      australian_postcodes_vic: {
        Row: {
          created_at: string | null
          id: number
          lga: string | null
          postcode: string
          state: string
          suburb: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode: string
          state: string
          suburb: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode?: string
          state?: string
          suburb?: string
        }
        Relationships: []
      }
      australian_postcodes_wa: {
        Row: {
          created_at: string | null
          id: number
          lga: string | null
          postcode: string
          state: string
          suburb: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode: string
          state: string
          suburb: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga?: string | null
          postcode?: string
          state?: string
          suburb?: string
        }
        Relationships: []
      }
      clinic_analysis_results: {
        Row: {
          age_band: string | null
          bulk_analysis_id: string
          created_at: string | null
          disaster_count: number | null
          disasters: Json | null
          file_format: string | null
          gender: string | null
          id: string
          is_eligible: boolean
          lga: string | null
          lga_code: string | null
          postcode: string
          processing_time_ms: number | null
          raw_data: Json | null
          remoteness_area: string | null
          remoteness_code: number | null
          state: string | null
          suburb: string | null
        }
        Insert: {
          age_band?: string | null
          bulk_analysis_id: string
          created_at?: string | null
          disaster_count?: number | null
          disasters?: Json | null
          file_format?: string | null
          gender?: string | null
          id?: string
          is_eligible: boolean
          lga?: string | null
          lga_code?: string | null
          postcode: string
          processing_time_ms?: number | null
          raw_data?: Json | null
          remoteness_area?: string | null
          remoteness_code?: number | null
          state?: string | null
          suburb?: string | null
        }
        Update: {
          age_band?: string | null
          bulk_analysis_id?: string
          created_at?: string | null
          disaster_count?: number | null
          disasters?: Json | null
          file_format?: string | null
          gender?: string | null
          id?: string
          is_eligible?: boolean
          lga?: string | null
          lga_code?: string | null
          postcode?: string
          processing_time_ms?: number | null
          raw_data?: Json | null
          remoteness_area?: string | null
          remoteness_code?: number | null
          state?: string | null
          suburb?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinic_analysis_results_bulk_analysis_id_fkey"
            columns: ["bulk_analysis_id"]
            isOneToOne: false
            referencedRelation: "clinic_bulk_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_bulk_analyses: {
        Row: {
          analysis_date: string | null
          clinic_name: string | null
          created_at: string | null
          demographic_stats: Json | null
          eligible_count: number | null
          error_message: string | null
          file_name: string | null
          file_size_bytes: number | null
          geographic_stats: Json | null
          has_demographics: boolean | null
          id: string
          ineligible_count: number | null
          processing_completed_at: string | null
          processing_started_at: string | null
          processing_status: string | null
          summary_stats: Json | null
          total_postcodes: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analysis_date?: string | null
          clinic_name?: string | null
          created_at?: string | null
          demographic_stats?: Json | null
          eligible_count?: number | null
          error_message?: string | null
          file_name?: string | null
          file_size_bytes?: number | null
          geographic_stats?: Json | null
          has_demographics?: boolean | null
          id?: string
          ineligible_count?: number | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          processing_status?: string | null
          summary_stats?: Json | null
          total_postcodes: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analysis_date?: string | null
          clinic_name?: string | null
          created_at?: string | null
          demographic_stats?: Json | null
          eligible_count?: number | null
          error_message?: string | null
          file_name?: string | null
          file_size_bytes?: number | null
          geographic_stats?: Json | null
          has_demographics?: boolean | null
          id?: string
          ineligible_count?: number | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          processing_status?: string | null
          summary_stats?: Json | null
          total_postcodes?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      csrf_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          user_id?: string | null
        }
        Relationships: []
      }
      data_access_audit: {
        Row: {
          action: string
          created_at: string
          data_id: string | null
          data_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          data_id?: string | null
          data_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          data_id?: string | null
          data_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      data_consistency_reports: {
        Row: {
          compliance_score: number
          created_at: string | null
          findings: Json
          generated_at: string
          id: string
          report_data: Json
          report_type: string
          status: string
          total_checks: number
          updated_at: string | null
        }
        Insert: {
          compliance_score?: number
          created_at?: string | null
          findings?: Json
          generated_at?: string
          id: string
          report_data?: Json
          report_type?: string
          status?: string
          total_checks?: number
          updated_at?: string | null
        }
        Update: {
          compliance_score?: number
          created_at?: string | null
          findings?: Json
          generated_at?: string
          id?: string
          report_data?: Json
          report_type?: string
          status?: string
          total_checks?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      data_retention_policies: {
        Row: {
          created_at: string
          data_type: string
          description: string | null
          id: string
          is_active: boolean | null
          retention_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_type: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          retention_days: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_type?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          retention_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      data_update_history: {
        Row: {
          created_at: string | null
          id: string
          rollback_data: Json | null
          status: string | null
          summary: Json
          timestamp: string | null
          update_type: string | null
          user_email: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rollback_data?: Json | null
          status?: string | null
          summary: Json
          timestamp?: string | null
          update_type?: string | null
          user_email: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rollback_data?: Json | null
          status?: string | null
          summary?: Json
          timestamp?: string | null
          update_type?: string | null
          user_email?: string
        }
        Relationships: []
      }
      deleted_users: {
        Row: {
          data_retained: Json | null
          deleted_at: string
          deletion_reason: string | null
          email_hash: string | null
          id: string
          original_user_id: string
          purged: boolean | null
          purged_at: string | null
          scheduled_purge_at: string
        }
        Insert: {
          data_retained?: Json | null
          deleted_at?: string
          deletion_reason?: string | null
          email_hash?: string | null
          id?: string
          original_user_id: string
          purged?: boolean | null
          purged_at?: string | null
          scheduled_purge_at: string
        }
        Update: {
          data_retained?: Json | null
          deleted_at?: string
          deletion_reason?: string | null
          email_hash?: string | null
          id?: string
          original_user_id?: string
          purged?: boolean | null
          purged_at?: string | null
          scheduled_purge_at?: string
        }
        Relationships: []
      }
      disaster_lgas: {
        Row: {
          agrn: string | null
          created_at: string | null
          id: number
          lga_code: string | null
        }
        Insert: {
          agrn?: string | null
          created_at?: string | null
          id?: number
          lga_code?: string | null
        }
        Update: {
          agrn?: string | null
          created_at?: string | null
          id?: number
          lga_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "disasters"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "medicare_act"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "medicare_disaster_eligibility"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "medicare_disaster_eligibility_nsw"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "medicare_nsw"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "medicare_nt"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "medicare_qld"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "medicare_sa"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "medicare_tas"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "medicare_vic"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_agrn_fkey"
            columns: ["agrn"]
            isOneToOne: false
            referencedRelation: "medicare_wa"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "disaster_lgas_lga_code_fkey"
            columns: ["lga_code"]
            isOneToOne: false
            referencedRelation: "lgas"
            referencedColumns: ["lga_code"]
          },
          {
            foreignKeyName: "disaster_lgas_lga_code_fkey"
            columns: ["lga_code"]
            isOneToOne: false
            referencedRelation: "medicare_act"
            referencedColumns: ["lga_code"]
          },
          {
            foreignKeyName: "disaster_lgas_lga_code_fkey"
            columns: ["lga_code"]
            isOneToOne: false
            referencedRelation: "medicare_disaster_eligibility"
            referencedColumns: ["lga_code"]
          },
          {
            foreignKeyName: "disaster_lgas_lga_code_fkey"
            columns: ["lga_code"]
            isOneToOne: false
            referencedRelation: "medicare_nsw"
            referencedColumns: ["lga_code"]
          },
          {
            foreignKeyName: "disaster_lgas_lga_code_fkey"
            columns: ["lga_code"]
            isOneToOne: false
            referencedRelation: "medicare_nt"
            referencedColumns: ["lga_code"]
          },
          {
            foreignKeyName: "disaster_lgas_lga_code_fkey"
            columns: ["lga_code"]
            isOneToOne: false
            referencedRelation: "medicare_qld"
            referencedColumns: ["lga_code"]
          },
          {
            foreignKeyName: "disaster_lgas_lga_code_fkey"
            columns: ["lga_code"]
            isOneToOne: false
            referencedRelation: "medicare_sa"
            referencedColumns: ["lga_code"]
          },
          {
            foreignKeyName: "disaster_lgas_lga_code_fkey"
            columns: ["lga_code"]
            isOneToOne: false
            referencedRelation: "medicare_tas"
            referencedColumns: ["lga_code"]
          },
          {
            foreignKeyName: "disaster_lgas_lga_code_fkey"
            columns: ["lga_code"]
            isOneToOne: false
            referencedRelation: "medicare_vic"
            referencedColumns: ["lga_code"]
          },
          {
            foreignKeyName: "disaster_lgas_lga_code_fkey"
            columns: ["lga_code"]
            isOneToOne: false
            referencedRelation: "medicare_wa"
            referencedColumns: ["lga_code"]
          },
        ]
      }
      disasters: {
        Row: {
          agdrp: boolean | null
          agrn: string
          canonical_set_at: string | null
          created_at: string | null
          dra: boolean | null
          drfa_category: string | null
          end_date: string | null
          hazard_type: string | null
          last_updated: string | null
          scraped_at: string | null
          search_query: string | null
          start_date: string | null
          state: string | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          agdrp?: boolean | null
          agrn: string
          canonical_set_at?: string | null
          created_at?: string | null
          dra?: boolean | null
          drfa_category?: string | null
          end_date?: string | null
          hazard_type?: string | null
          last_updated?: string | null
          scraped_at?: string | null
          search_query?: string | null
          start_date?: string | null
          state?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          agdrp?: boolean | null
          agrn?: string
          canonical_set_at?: string | null
          created_at?: string | null
          dra?: boolean | null
          drfa_category?: string | null
          end_date?: string | null
          hazard_type?: string | null
          last_updated?: string | null
          scraped_at?: string | null
          search_query?: string | null
          start_date?: string | null
          state?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      disasters_pass1: {
        Row: {
          agrn: number
          agrn_raw: string | null
          disaster_type: string | null
          end_date: string | null
          end_date_changed: boolean | null
          end_date_parsed: string | null
          id: string
          is_ongoing: boolean | null
          previous_end_date: string | null
          scraped_at: string | null
          source_page: number | null
          start_date: string | null
          start_date_parsed: string | null
          state: string | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          agrn: number
          agrn_raw?: string | null
          disaster_type?: string | null
          end_date?: string | null
          end_date_changed?: boolean | null
          end_date_parsed?: string | null
          id?: string
          is_ongoing?: boolean | null
          previous_end_date?: string | null
          scraped_at?: string | null
          source_page?: number | null
          start_date?: string | null
          start_date_parsed?: string | null
          state?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          agrn?: number
          agrn_raw?: string | null
          disaster_type?: string | null
          end_date?: string | null
          end_date_changed?: boolean | null
          end_date_parsed?: string | null
          id?: string
          is_ongoing?: boolean | null
          previous_end_date?: string | null
          scraped_at?: string | null
          source_page?: number | null
          start_date?: string | null
          start_date_parsed?: string | null
          state?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      disasters_pass2: {
        Row: {
          agrn: number
          canonical_url: string | null
          created_at: string | null
          disaster_type: string | null
          end_date: string | null
          id: number
          is_ongoing: boolean | null
          last_updated: string | null
          lgas: string[] | null
          lgas_changed: boolean | null
          pass1_scraped_at: string | null
          pass2_scraped_at: string | null
          previous_lgas: string[] | null
          previous_url: string | null
          start_date: string | null
          state: string | null
          title: string
          updated_at: string | null
          url_changed: boolean | null
        }
        Insert: {
          agrn: number
          canonical_url?: string | null
          created_at?: string | null
          disaster_type?: string | null
          end_date?: string | null
          id?: number
          is_ongoing?: boolean | null
          last_updated?: string | null
          lgas?: string[] | null
          lgas_changed?: boolean | null
          pass1_scraped_at?: string | null
          pass2_scraped_at?: string | null
          previous_lgas?: string[] | null
          previous_url?: string | null
          start_date?: string | null
          state?: string | null
          title: string
          updated_at?: string | null
          url_changed?: boolean | null
        }
        Update: {
          agrn?: number
          canonical_url?: string | null
          created_at?: string | null
          disaster_type?: string | null
          end_date?: string | null
          id?: number
          is_ongoing?: boolean | null
          last_updated?: string | null
          lgas?: string[] | null
          lgas_changed?: boolean | null
          pass1_scraped_at?: string | null
          pass2_scraped_at?: string | null
          previous_lgas?: string[] | null
          previous_url?: string | null
          start_date?: string | null
          state?: string | null
          title?: string
          updated_at?: string | null
          url_changed?: boolean | null
        }
        Relationships: []
      }
      eligibility_checks: {
        Row: {
          affected_lga: string | null
          created_at: string
          disasters: Json | null
          id: string
          is_eligible: boolean
          notes_proforma: string | null
          postcode: string
          state: string | null
          total_disasters: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          affected_lga?: string | null
          created_at?: string
          disasters?: Json | null
          id?: string
          is_eligible: boolean
          notes_proforma?: string | null
          postcode: string
          state?: string | null
          total_disasters?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          affected_lga?: string | null
          created_at?: string
          disasters?: Json | null
          id?: string
          is_eligible?: boolean
          notes_proforma?: string | null
          postcode?: string
          state?: string | null
          total_disasters?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_config: {
        Row: {
          bounce_webhook_url: string | null
          complaint_webhook_url: string | null
          created_at: string | null
          from_email: string | null
          from_name: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          provider: string
          rate_limit_per_day: number | null
          rate_limit_per_hour: number | null
          region: string | null
          reply_to_email: string | null
          smtp_host: string | null
          smtp_pass: string | null
          smtp_port: number | null
          smtp_secure: boolean | null
          smtp_user: string | null
          updated_at: string | null
        }
        Insert: {
          bounce_webhook_url?: string | null
          complaint_webhook_url?: string | null
          created_at?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          provider?: string
          rate_limit_per_day?: number | null
          rate_limit_per_hour?: number | null
          region?: string | null
          reply_to_email?: string | null
          smtp_host?: string | null
          smtp_pass?: string | null
          smtp_port?: number | null
          smtp_secure?: boolean | null
          smtp_user?: string | null
          updated_at?: string | null
        }
        Update: {
          bounce_webhook_url?: string | null
          complaint_webhook_url?: string | null
          created_at?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          provider?: string
          rate_limit_per_day?: number | null
          rate_limit_per_hour?: number | null
          region?: string | null
          reply_to_email?: string | null
          smtp_host?: string | null
          smtp_pass?: string | null
          smtp_port?: number | null
          smtp_secure?: boolean | null
          smtp_user?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          from_email: string
          id: string
          message_id: string | null
          metadata: Json | null
          provider: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          template_id: string | null
          to_email: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          from_email: string
          id?: string
          message_id?: string | null
          metadata?: Json | null
          provider?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          to_email: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          from_email?: string
          id?: string
          message_id?: string | null
          metadata?: Json | null
          provider?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          to_email?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string | null
          html_body: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          text_body: string | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          html_body: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          text_body?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          html_body?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          text_body?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      encrypted_data: {
        Row: {
          access_count: number | null
          accessed_at: string | null
          created_at: string
          data_type: string
          encrypted_value: string
          encryption_iv: string
          encryption_tag: string
          id: string
          key_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_count?: number | null
          accessed_at?: string | null
          created_at?: string
          data_type: string
          encrypted_value: string
          encryption_iv: string
          encryption_tag: string
          id?: string
          key_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_count?: number | null
          accessed_at?: string | null
          created_at?: string
          data_type?: string
          encrypted_value?: string
          encryption_iv?: string
          encryption_tag?: string
          id?: string
          key_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "encrypted_data_key_id_fkey"
            columns: ["key_id"]
            isOneToOne: false
            referencedRelation: "encryption_keys"
            referencedColumns: ["key_id"]
          },
        ]
      }
      encryption_keys: {
        Row: {
          algorithm: string | null
          created_at: string
          expires_at: string
          id: string
          is_active: boolean | null
          key_id: string
          metadata: Json | null
          rotated_at: string | null
          rotation_count: number | null
        }
        Insert: {
          algorithm?: string | null
          created_at?: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          key_id: string
          metadata?: Json | null
          rotated_at?: string | null
          rotation_count?: number | null
        }
        Update: {
          algorithm?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          key_id?: string
          metadata?: Json | null
          rotated_at?: string | null
          rotation_count?: number | null
        }
        Relationships: []
      }
      generated_reports: {
        Row: {
          clinic_name: string
          created_at: string | null
          eligible_patients: number
          eligible_percentage: number
          file_name: string
          file_size: number
          id: string
          metadata: Json | null
          pdf_base64: string
          report_data: Json
          report_type: string
          total_patients: number
          user_id: string
        }
        Insert: {
          clinic_name: string
          created_at?: string | null
          eligible_patients: number
          eligible_percentage: number
          file_name: string
          file_size: number
          id?: string
          metadata?: Json | null
          pdf_base64: string
          report_data: Json
          report_type?: string
          total_patients: number
          user_id: string
        }
        Update: {
          clinic_name?: string
          created_at?: string | null
          eligible_patients?: number
          eligible_percentage?: number
          file_name?: string
          file_size?: number
          id?: string
          metadata?: Json | null
          pdf_base64?: string
          report_data?: Json
          report_type?: string
          total_patients?: number
          user_id?: string
        }
        Relationships: []
      }
      healthcare_audit_logs: {
        Row: {
          action_type: string
          audit_timestamp: string | null
          compliance_category: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          patient_data_accessed: boolean | null
          resource_id: string | null
          resource_type: string
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          audit_timestamp?: string | null
          compliance_category?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          patient_data_accessed?: boolean | null
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          audit_timestamp?: string | null
          compliance_category?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          patient_data_accessed?: boolean | null
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      lga_populations: {
        Row: {
          created_at: string
          id: string
          lga_code: string
          lga_name: string
          population_2021: number
          state: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lga_code: string
          lga_name: string
          population_2021: number
          state: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lga_code?: string
          lga_name?: string
          population_2021?: number
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      lgas: {
        Row: {
          created_at: string | null
          lga_code: string
          lga_name: string
          state: string | null
        }
        Insert: {
          created_at?: string | null
          lga_code: string
          lga_name: string
          state?: string | null
        }
        Update: {
          created_at?: string | null
          lga_code?: string
          lga_name?: string
          state?: string | null
        }
        Relationships: []
      }
      nsw_disasters: {
        Row: {
          agrn: string | null
          disaster_name: string | null
          disaster_types: string | null
          disaster_url: string | null
          end_date: string | null
          id: string
          last_updated: string | null
          lgas: string[] | null
          scraped_date: string | null
          start_date: string | null
          state_territory: string
        }
        Insert: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Update: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Relationships: []
      }
      nt_disasters: {
        Row: {
          agrn: string | null
          disaster_name: string | null
          disaster_types: string | null
          disaster_url: string | null
          end_date: string | null
          id: string
          last_updated: string | null
          lgas: string[] | null
          scraped_date: string | null
          start_date: string | null
          state_territory: string
        }
        Insert: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Update: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Relationships: []
      }
      password_policies: {
        Row: {
          created_at: string | null
          id: string
          last_password_change: string | null
          password_strength_score: number | null
          requires_change: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_password_change?: string | null
          password_strength_score?: number | null
          requires_change?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_password_change?: string | null
          password_strength_score?: number | null
          requires_change?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      pii_masking_rules: {
        Row: {
          created_at: string
          field_name: string
          field_type: string
          id: string
          is_active: boolean | null
          masking_pattern: string
        }
        Insert: {
          created_at?: string
          field_name: string
          field_type: string
          id?: string
          is_active?: boolean | null
          masking_pattern: string
        }
        Update: {
          created_at?: string
          field_name?: string
          field_type?: string
          id?: string
          is_active?: boolean | null
          masking_pattern?: string
        }
        Relationships: []
      }
      postcode_lga_mapping: {
        Row: {
          created_at: string | null
          id: number
          lga_code: string
          lga_name: string
          postcode: string
          state: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          lga_code: string
          lga_name: string
          postcode: string
          state: string
        }
        Update: {
          created_at?: string | null
          id?: number
          lga_code?: string
          lga_name?: string
          postcode?: string
          state?: string
        }
        Relationships: []
      }
      postcodes: {
        Row: {
          created_at: string | null
          latitude: number | null
          lga: string | null
          longitude: number | null
          postcode: string | null
          remoteness_area: string | null
          remoteness_code: number | null
          state: string | null
          suburb: string | null
        }
        Insert: {
          created_at?: string | null
          latitude?: number | null
          lga?: string | null
          longitude?: number | null
          postcode?: string | null
          remoteness_area?: string | null
          remoteness_code?: number | null
          state?: string | null
          suburb?: string | null
        }
        Update: {
          created_at?: string | null
          latitude?: number | null
          lga?: string | null
          longitude?: number | null
          postcode?: string | null
          remoteness_area?: string | null
          remoteness_code?: number | null
          state?: string | null
          suburb?: string | null
        }
        Relationships: []
      }
      postcodes_dirty_backup: {
        Row: {
          created_at: string | null
          latitude: number | null
          lga: string | null
          longitude: number | null
          postcode: string | null
          remoteness_area: string | null
          remoteness_code: number | null
          state: string | null
          suburb: string | null
        }
        Insert: {
          created_at?: string | null
          latitude?: number | null
          lga?: string | null
          longitude?: number | null
          postcode?: string | null
          remoteness_area?: string | null
          remoteness_code?: number | null
          state?: string | null
          suburb?: string | null
        }
        Update: {
          created_at?: string | null
          latitude?: number | null
          lga?: string | null
          longitude?: number | null
          postcode?: string | null
          remoteness_area?: string | null
          remoteness_code?: number | null
          state?: string | null
          suburb?: string | null
        }
        Relationships: []
      }
      postcodes_old: {
        Row: {
          created_at: string | null
          latitude: number | null
          lga: string | null
          longitude: number | null
          postcode: string
          remoteness_area: string | null
          remoteness_code: number | null
          state: string | null
          suburb: string | null
        }
        Insert: {
          created_at?: string | null
          latitude?: number | null
          lga?: string | null
          longitude?: number | null
          postcode: string
          remoteness_area?: string | null
          remoteness_code?: number | null
          state?: string | null
          suburb?: string | null
        }
        Update: {
          created_at?: string | null
          latitude?: number | null
          lga?: string | null
          longitude?: number | null
          postcode?: string
          remoteness_area?: string | null
          remoteness_code?: number | null
          state?: string | null
          suburb?: string | null
        }
        Relationships: []
      }
      practice_configurations: {
        Row: {
          created_at: string | null
          id: string
          practitioner_postcodes: string[]
          service_model: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          practitioner_postcodes: string[]
          service_model: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          practitioner_postcodes?: string[]
          service_model?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          abn: string | null
          avatar_url: string | null
          billing_address: string | null
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country: string | null
          billing_postcode: string | null
          billing_state: string | null
          cancellation_feedback: string | null
          company_name: string | null
          created_at: string | null
          custom_eligible_template: string | null
          custom_not_eligible_template: string | null
          display_name: string | null
          email: string | null
          first_name: string | null
          font_size_preference: number | null
          full_name: string | null
          id: string
          last_ip: string | null
          last_login_at: string | null
          last_name: string | null
          last_webhook_event_id: string | null
          locale: string | null
          location: string | null
          marketing_consent: boolean | null
          metadata: Json | null
          mobile: string | null
          notification_prefs: Json | null
          onboarding_completed: boolean | null
          password_set: boolean | null
          password_set_at: string | null
          phone: string | null
          phone_number: string | null
          pref_billing_alerts: boolean | null
          pref_marketing_emails: boolean | null
          pref_product_updates: boolean | null
          pref_push_notifications: boolean | null
          privacy_accepted_date: string | null
          privacy_accepted_version: string | null
          privacy_policy_accepted_at: string | null
          profession: Database["public"]["Enums"]["profession_type"] | null
          reduce_motion: boolean | null
          reduced_motion: boolean | null
          role: string | null
          signup_source: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          tax_id: string | null
          terms_accepted_at: string | null
          terms_accepted_date: string | null
          terms_accepted_version: string | null
          theme: string | null
          theme_mode: Database["public"]["Enums"]["theme_mode"] | null
          timezone: string | null
          trial_end: string | null
          two_factor_backup_codes: string[] | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          two_factor_setup_expires: string | null
          two_factor_temp_secret: string | null
          two_factor_verified_at: string | null
          updated_at: string | null
          use_custom_templates: boolean | null
          user_id: string | null
          user_type: string | null
          verified: boolean | null
        }
        Insert: {
          abn?: string | null
          avatar_url?: string | null
          billing_address?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postcode?: string | null
          billing_state?: string | null
          cancellation_feedback?: string | null
          company_name?: string | null
          created_at?: string | null
          custom_eligible_template?: string | null
          custom_not_eligible_template?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          font_size_preference?: number | null
          full_name?: string | null
          id?: string
          last_ip?: string | null
          last_login_at?: string | null
          last_name?: string | null
          last_webhook_event_id?: string | null
          locale?: string | null
          location?: string | null
          marketing_consent?: boolean | null
          metadata?: Json | null
          mobile?: string | null
          notification_prefs?: Json | null
          onboarding_completed?: boolean | null
          password_set?: boolean | null
          password_set_at?: string | null
          phone?: string | null
          phone_number?: string | null
          pref_billing_alerts?: boolean | null
          pref_marketing_emails?: boolean | null
          pref_product_updates?: boolean | null
          pref_push_notifications?: boolean | null
          privacy_accepted_date?: string | null
          privacy_accepted_version?: string | null
          privacy_policy_accepted_at?: string | null
          profession?: Database["public"]["Enums"]["profession_type"] | null
          reduce_motion?: boolean | null
          reduced_motion?: boolean | null
          role?: string | null
          signup_source?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          tax_id?: string | null
          terms_accepted_at?: string | null
          terms_accepted_date?: string | null
          terms_accepted_version?: string | null
          theme?: string | null
          theme_mode?: Database["public"]["Enums"]["theme_mode"] | null
          timezone?: string | null
          trial_end?: string | null
          two_factor_backup_codes?: string[] | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          two_factor_setup_expires?: string | null
          two_factor_temp_secret?: string | null
          two_factor_verified_at?: string | null
          updated_at?: string | null
          use_custom_templates?: boolean | null
          user_id?: string | null
          user_type?: string | null
          verified?: boolean | null
        }
        Update: {
          abn?: string | null
          avatar_url?: string | null
          billing_address?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postcode?: string | null
          billing_state?: string | null
          cancellation_feedback?: string | null
          company_name?: string | null
          created_at?: string | null
          custom_eligible_template?: string | null
          custom_not_eligible_template?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          font_size_preference?: number | null
          full_name?: string | null
          id?: string
          last_ip?: string | null
          last_login_at?: string | null
          last_name?: string | null
          last_webhook_event_id?: string | null
          locale?: string | null
          location?: string | null
          marketing_consent?: boolean | null
          metadata?: Json | null
          mobile?: string | null
          notification_prefs?: Json | null
          onboarding_completed?: boolean | null
          password_set?: boolean | null
          password_set_at?: string | null
          phone?: string | null
          phone_number?: string | null
          pref_billing_alerts?: boolean | null
          pref_marketing_emails?: boolean | null
          pref_product_updates?: boolean | null
          pref_push_notifications?: boolean | null
          privacy_accepted_date?: string | null
          privacy_accepted_version?: string | null
          privacy_policy_accepted_at?: string | null
          profession?: Database["public"]["Enums"]["profession_type"] | null
          reduce_motion?: boolean | null
          reduced_motion?: boolean | null
          role?: string | null
          signup_source?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          tax_id?: string | null
          terms_accepted_at?: string | null
          terms_accepted_date?: string | null
          terms_accepted_version?: string | null
          theme?: string | null
          theme_mode?: Database["public"]["Enums"]["theme_mode"] | null
          timezone?: string | null
          trial_end?: string | null
          two_factor_backup_codes?: string[] | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          two_factor_setup_expires?: string | null
          two_factor_temp_secret?: string | null
          two_factor_verified_at?: string | null
          updated_at?: string | null
          use_custom_templates?: boolean | null
          user_id?: string | null
          user_type?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      qld_disasters: {
        Row: {
          agrn: string | null
          disaster_name: string | null
          disaster_types: string | null
          disaster_url: string | null
          end_date: string | null
          id: string
          last_updated: string | null
          lgas: string[] | null
          scraped_date: string | null
          start_date: string | null
          state_territory: string
        }
        Insert: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Update: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          endpoint: string
          id: string
          last_request: string | null
          request_count: number | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          endpoint: string
          id?: string
          last_request?: string | null
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          endpoint?: string
          id?: string
          last_request?: string | null
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      report_queue: {
        Row: {
          analysis_id: string
          clinic_name: string
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          estimated_completion: string | null
          file_url: string | null
          format: string
          id: string
          metadata: Json | null
          patient_count: number
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          analysis_id: string
          clinic_name: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          estimated_completion?: string | null
          file_url?: string | null
          format?: string
          id?: string
          metadata?: Json | null
          patient_count: number
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          analysis_id?: string
          clinic_name?: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          estimated_completion?: string | null
          file_url?: string | null
          format?: string
          id?: string
          metadata?: Json | null
          patient_count?: number
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      sa_disasters: {
        Row: {
          agrn: string | null
          disaster_name: string | null
          disaster_types: string | null
          disaster_url: string | null
          end_date: string | null
          id: string
          last_updated: string | null
          lgas: string[] | null
          scraped_date: string | null
          start_date: string | null
          state_territory: string
        }
        Insert: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Update: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Relationships: []
      }
      saved_checks: {
        Row: {
          check_date: string | null
          created_at: string | null
          disaster_agrn: string | null
          id: string
          is_eligible: boolean
          notes: string | null
          patient_identifier: string
          postcode: string
          user_id: string
        }
        Insert: {
          check_date?: string | null
          created_at?: string | null
          disaster_agrn?: string | null
          id?: string
          is_eligible: boolean
          notes?: string | null
          patient_identifier: string
          postcode: string
          user_id: string
        }
        Update: {
          check_date?: string | null
          created_at?: string | null
          disaster_agrn?: string | null
          id?: string
          is_eligible?: boolean
          notes?: string | null
          patient_identifier?: string
          postcode?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "disasters"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "medicare_act"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "medicare_disaster_eligibility"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "medicare_disaster_eligibility_nsw"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "medicare_nsw"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "medicare_nt"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "medicare_qld"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "medicare_sa"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "medicare_tas"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "medicare_vic"
            referencedColumns: ["agrn"]
          },
          {
            foreignKeyName: "saved_checks_disaster_agrn_fkey"
            columns: ["disaster_agrn"]
            isOneToOne: false
            referencedRelation: "medicare_wa"
            referencedColumns: ["agrn"]
          },
        ]
      }
      saved_clinic_reports: {
        Row: {
          analysis_id: string
          analysis_version: string | null
          clinic_identifier: string | null
          clinic_location: string | null
          clinic_name: string
          created_at: string | null
          csv_url: string | null
          eligibility_percentage: number
          eligible_patients: number
          file_format: string | null
          id: string
          ineligible_patients: number
          inner_regional_count: number | null
          is_starred: boolean | null
          last_12_months: number | null
          last_2_years: number | null
          last_5_years: number | null
          major_cities_count: number | null
          notes: string | null
          older_than_5_years: number | null
          outer_regional_count: number | null
          pdf_url: string | null
          raw_data: Json | null
          remote_count: number | null
          report_date: string | null
          state_breakdown: Json | null
          tags: string[] | null
          top_disasters: Json | null
          total_patients: number
          updated_at: string | null
          user_id: string
          very_remote_count: number | null
        }
        Insert: {
          analysis_id: string
          analysis_version?: string | null
          clinic_identifier?: string | null
          clinic_location?: string | null
          clinic_name: string
          created_at?: string | null
          csv_url?: string | null
          eligibility_percentage: number
          eligible_patients: number
          file_format?: string | null
          id?: string
          ineligible_patients: number
          inner_regional_count?: number | null
          is_starred?: boolean | null
          last_12_months?: number | null
          last_2_years?: number | null
          last_5_years?: number | null
          major_cities_count?: number | null
          notes?: string | null
          older_than_5_years?: number | null
          outer_regional_count?: number | null
          pdf_url?: string | null
          raw_data?: Json | null
          remote_count?: number | null
          report_date?: string | null
          state_breakdown?: Json | null
          tags?: string[] | null
          top_disasters?: Json | null
          total_patients: number
          updated_at?: string | null
          user_id: string
          very_remote_count?: number | null
        }
        Update: {
          analysis_id?: string
          analysis_version?: string | null
          clinic_identifier?: string | null
          clinic_location?: string | null
          clinic_name?: string
          created_at?: string | null
          csv_url?: string | null
          eligibility_percentage?: number
          eligible_patients?: number
          file_format?: string | null
          id?: string
          ineligible_patients?: number
          inner_regional_count?: number | null
          is_starred?: boolean | null
          last_12_months?: number | null
          last_2_years?: number | null
          last_5_years?: number | null
          major_cities_count?: number | null
          notes?: string | null
          older_than_5_years?: number | null
          outer_regional_count?: number | null
          pdf_url?: string | null
          raw_data?: Json | null
          remote_count?: number | null
          report_date?: string | null
          state_breakdown?: Json | null
          tags?: string[] | null
          top_disasters?: Json | null
          total_patients?: number
          updated_at?: string | null
          user_id?: string
          very_remote_count?: number | null
        }
        Relationships: []
      }
      saved_searches_outseta: {
        Row: {
          created_at: string | null
          disasters: Json | null
          id: string
          is_eligible: boolean | null
          lga: string | null
          metadata: Json | null
          notes: string | null
          postcode: string
          result_summary: string | null
          search_criteria: Json | null
          state: string | null
          suburb: string | null
          total_disasters: number | null
          updated_at: string | null
          user_email: string
        }
        Insert: {
          created_at?: string | null
          disasters?: Json | null
          id?: string
          is_eligible?: boolean | null
          lga?: string | null
          metadata?: Json | null
          notes?: string | null
          postcode: string
          result_summary?: string | null
          search_criteria?: Json | null
          state?: string | null
          suburb?: string | null
          total_disasters?: number | null
          updated_at?: string | null
          user_email: string
        }
        Update: {
          created_at?: string | null
          disasters?: Json | null
          id?: string
          is_eligible?: boolean | null
          lga?: string | null
          metadata?: Json | null
          notes?: string | null
          postcode?: string
          result_summary?: string | null
          search_criteria?: Json | null
          state?: string | null
          suburb?: string | null
          total_disasters?: number | null
          updated_at?: string | null
          user_email?: string
        }
        Relationships: []
      }
      scrape_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          records_processed: number | null
          records_updated: number | null
          scrape_type: string
          started_at: string | null
          status: string
          triggered_by: string | null
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_processed?: number | null
          records_updated?: number | null
          scrape_type: string
          started_at?: string | null
          status: string
          triggered_by?: string | null
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_processed?: number | null
          records_updated?: number | null
          scrape_type?: string
          started_at?: string | null
          status?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          resolution_notes: string | null
          resolved: boolean | null
          resolved_at: string | null
          session_id: string | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          session_id?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          session_id?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      session_activity_log: {
        Row: {
          activity_type: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_metadata: {
        Row: {
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      system_status: {
        Row: {
          error_message: string | null
          id: string
          last_check: string | null
          response_time_ms: number | null
          service_name: string
          status: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          last_check?: string | null
          response_time_ms?: number | null
          service_name: string
          status: string
        }
        Update: {
          error_message?: string | null
          id?: string
          last_check?: string | null
          response_time_ms?: number | null
          service_name?: string
          status?: string
        }
        Relationships: []
      }
      tas_disasters: {
        Row: {
          agrn: string | null
          disaster_name: string | null
          disaster_types: string | null
          disaster_url: string | null
          end_date: string | null
          id: string
          last_updated: string | null
          lgas: string[] | null
          scraped_date: string | null
          start_date: string | null
          state_territory: string
        }
        Insert: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Update: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Relationships: []
      }
      trusted_devices: {
        Row: {
          created_at: string
          device_fingerprint: string
          device_name: string | null
          expires_at: string
          id: string
          is_active: boolean | null
          last_used: string
          trust_level: number | null
          trust_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          device_name?: string | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          last_used?: string
          trust_level?: number | null
          trust_token: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          device_name?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          last_used?: string
          trust_level?: number | null
          trust_token?: string
          user_id?: string
        }
        Relationships: []
      }
      two_factor_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "two_factor_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_reports_outseta: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          report_data: Json
          report_title: string | null
          report_type: string
          updated_at: string | null
          user_email: string
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          report_data: Json
          report_title?: string | null
          report_type?: string
          updated_at?: string | null
          user_email: string
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          report_data?: Json
          report_title?: string | null
          report_type?: string
          updated_at?: string | null
          user_email?: string
        }
        Relationships: []
      }
      verification_usage: {
        Row: {
          affected_lga: string | null
          agrns: string[] | null
          created_at: string
          disasters: Json | null
          email: string
          id: string
          is_eligible: boolean | null
          lga_code: string | null
          postcode: string | null
          source_urls: string[] | null
          state: string | null
          total_disasters: number | null
          user_id: string
        }
        Insert: {
          affected_lga?: string | null
          agrns?: string[] | null
          created_at?: string
          disasters?: Json | null
          email: string
          id?: string
          is_eligible?: boolean | null
          lga_code?: string | null
          postcode?: string | null
          source_urls?: string[] | null
          state?: string | null
          total_disasters?: number | null
          user_id: string
        }
        Update: {
          affected_lga?: string | null
          agrns?: string[] | null
          created_at?: string
          disasters?: Json | null
          email?: string
          id?: string
          is_eligible?: boolean | null
          lga_code?: string | null
          postcode?: string | null
          source_urls?: string[] | null
          state?: string | null
          total_disasters?: number | null
          user_id?: string
        }
        Relationships: []
      }
      vic_disasters: {
        Row: {
          agrn: string | null
          disaster_name: string | null
          disaster_types: string | null
          disaster_url: string | null
          end_date: string | null
          id: string
          last_updated: string | null
          lgas: string[] | null
          scraped_date: string | null
          start_date: string | null
          state_territory: string
        }
        Insert: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Update: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
        }
        Relationships: []
      }
      wa_disasters: {
        Row: {
          agrn: string | null
          disaster_name: string | null
          disaster_types: string | null
          disaster_url: string | null
          end_date: string | null
          id: string
          last_updated: string | null
          lgas: string[] | null
          scraped_date: string | null
          start_date: string | null
          state_territory: string
          updated_date: string | null
        }
        Insert: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
          updated_date?: string | null
        }
        Update: {
          agrn?: string | null
          disaster_name?: string | null
          disaster_types?: string | null
          disaster_url?: string | null
          end_date?: string | null
          id?: string
          last_updated?: string | null
          lgas?: string[] | null
          scraped_date?: string | null
          start_date?: string | null
          state_territory?: string
          updated_date?: string | null
        }
        Relationships: []
      }
      webauthn_credentials: {
        Row: {
          created_at: string | null
          credential_id: string
          device_name: string
          id: string
          last_used: string | null
          public_key: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credential_id: string
          device_name: string
          id?: string
          last_used?: string | null
          public_key: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          credential_id?: string
          device_name?: string
          id?: string
          last_used?: string | null
          public_key?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          error: string | null
          id: string
          last_retry_at: string | null
          payload: Json
          processed: boolean | null
          processed_at: string | null
          retry_count: number | null
          stripe_event_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          id?: string
          last_retry_at?: string | null
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          retry_count?: number | null
          stripe_event_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error?: string | null
          id?: string
          last_retry_at?: string | null
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          retry_count?: number | null
          stripe_event_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      current_disaster_coverage_cache: {
        Row: {
          last_updated: string | null
          lga_count: number | null
          postcode_count: number | null
          total_population: number | null
        }
        Relationships: []
      }
      disasters_combined: {
        Row: {
          agrn: number | null
          canonical_url: string | null
          data_status: string | null
          disaster_type: string | null
          end_date: string | null
          end_date_changed: boolean | null
          is_ongoing: boolean | null
          last_updated: string | null
          lgas: string[] | null
          lgas_changed: boolean | null
          pass1_scraped_at: string | null
          pass2_scraped_at: string | null
          start_date: string | null
          state: string | null
          title: string | null
          url_changed: boolean | null
        }
        Relationships: []
      }
      medicare_act: {
        Row: {
          agrn: string | null
          days_until_expiry: number | null
          disaster_created_at: string | null
          disaster_lga_created_at: string | null
          disaster_state: string | null
          disaster_title: string | null
          disaster_updated_at: string | null
          eligibility_status: string | null
          end_date: string | null
          lga_code: string | null
          lga_name: string | null
          locality: string | null
          postcode: string | null
          postcode_lat: number | null
          postcode_long: number | null
          remoteness_area: string | null
          remoteness_code: number | null
          start_date: string | null
          state: string | null
          url: string | null
        }
        Relationships: []
      }
      medicare_disaster_eligibility: {
        Row: {
          agrn: string | null
          days_until_expiry: number | null
          disaster_created_at: string | null
          disaster_lga_created_at: string | null
          disaster_state: string | null
          disaster_title: string | null
          disaster_updated_at: string | null
          eligibility_status: string | null
          end_date: string | null
          lga_code: string | null
          lga_name: string | null
          locality: string | null
          postcode: string | null
          postcode_lat: number | null
          postcode_long: number | null
          remoteness_area: string | null
          remoteness_code: number | null
          start_date: string | null
          state: string | null
          url: string | null
        }
        Relationships: []
      }
      medicare_disaster_eligibility_nsw: {
        Row: {
          agrn: string | null
          disaster_state: string | null
          eligibility_status: string | null
          end_date: string | null
          lga_name: string | null
          postcode: string | null
          start_date: string | null
          state_abbrev: string | null
        }
        Relationships: []
      }
      medicare_nsw: {
        Row: {
          agrn: string | null
          days_until_expiry: number | null
          disaster_created_at: string | null
          disaster_lga_created_at: string | null
          disaster_state: string | null
          disaster_title: string | null
          disaster_updated_at: string | null
          eligibility_status: string | null
          end_date: string | null
          lga_code: string | null
          lga_name: string | null
          locality: string | null
          postcode: string | null
          postcode_lat: number | null
          postcode_long: number | null
          remoteness_area: string | null
          remoteness_code: number | null
          start_date: string | null
          state: string | null
          url: string | null
        }
        Relationships: []
      }
      medicare_nt: {
        Row: {
          agrn: string | null
          days_until_expiry: number | null
          disaster_created_at: string | null
          disaster_lga_created_at: string | null
          disaster_state: string | null
          disaster_title: string | null
          disaster_updated_at: string | null
          eligibility_status: string | null
          end_date: string | null
          lga_code: string | null
          lga_name: string | null
          locality: string | null
          postcode: string | null
          postcode_lat: number | null
          postcode_long: number | null
          remoteness_area: string | null
          remoteness_code: number | null
          start_date: string | null
          state: string | null
          url: string | null
        }
        Relationships: []
      }
      medicare_qld: {
        Row: {
          agrn: string | null
          days_until_expiry: number | null
          disaster_created_at: string | null
          disaster_lga_created_at: string | null
          disaster_state: string | null
          disaster_title: string | null
          disaster_updated_at: string | null
          eligibility_status: string | null
          end_date: string | null
          lga_code: string | null
          lga_name: string | null
          locality: string | null
          postcode: string | null
          postcode_lat: number | null
          postcode_long: number | null
          remoteness_area: string | null
          remoteness_code: number | null
          start_date: string | null
          state: string | null
          url: string | null
        }
        Relationships: []
      }
      medicare_sa: {
        Row: {
          agrn: string | null
          days_until_expiry: number | null
          disaster_created_at: string | null
          disaster_lga_created_at: string | null
          disaster_state: string | null
          disaster_title: string | null
          disaster_updated_at: string | null
          eligibility_status: string | null
          end_date: string | null
          lga_code: string | null
          lga_name: string | null
          locality: string | null
          postcode: string | null
          postcode_lat: number | null
          postcode_long: number | null
          remoteness_area: string | null
          remoteness_code: number | null
          start_date: string | null
          state: string | null
          url: string | null
        }
        Relationships: []
      }
      medicare_tas: {
        Row: {
          agrn: string | null
          days_until_expiry: number | null
          disaster_created_at: string | null
          disaster_lga_created_at: string | null
          disaster_state: string | null
          disaster_title: string | null
          disaster_updated_at: string | null
          eligibility_status: string | null
          end_date: string | null
          lga_code: string | null
          lga_name: string | null
          locality: string | null
          postcode: string | null
          postcode_lat: number | null
          postcode_long: number | null
          remoteness_area: string | null
          remoteness_code: number | null
          start_date: string | null
          state: string | null
          url: string | null
        }
        Relationships: []
      }
      medicare_vic: {
        Row: {
          agrn: string | null
          days_until_expiry: number | null
          disaster_created_at: string | null
          disaster_lga_created_at: string | null
          disaster_state: string | null
          disaster_title: string | null
          disaster_updated_at: string | null
          eligibility_status: string | null
          end_date: string | null
          lga_code: string | null
          lga_name: string | null
          locality: string | null
          postcode: string | null
          postcode_lat: number | null
          postcode_long: number | null
          remoteness_area: string | null
          remoteness_code: number | null
          start_date: string | null
          state: string | null
          url: string | null
        }
        Relationships: []
      }
      medicare_wa: {
        Row: {
          agrn: string | null
          days_until_expiry: number | null
          disaster_created_at: string | null
          disaster_lga_created_at: string | null
          disaster_state: string | null
          disaster_title: string | null
          disaster_updated_at: string | null
          eligibility_status: string | null
          end_date: string | null
          lga_code: string | null
          lga_name: string | null
          locality: string | null
          postcode: string | null
          postcode_lat: number | null
          postcode_long: number | null
          remoteness_area: string | null
          remoteness_code: number | null
          start_date: string | null
          state: string | null
          url: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _assert_auth_identity_uniqueness: {
        Args: { _email: string; _phone: string; _user_id: string }
        Returns: undefined
      }
      _normalize_phone: {
        Args: { _phone: string }
        Returns: string
      }
      admin_analyze_stripe_customer: {
        Args: { customer_email: string }
        Returns: Json
      }
      admin_delete_user_completely: {
        Args: { user_email: string }
        Returns: Json
      }
      admin_sync_all_stripe_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      analyze_clinic_analysis: {
        Args:
          | { p_clinic_name?: string; p_postcodes: string[] }
          | {
              p_clinic_name?: string
              p_postcodes: string[]
              p_practitioner_postcodes?: string[]
              p_selected_metrics?: Json
            }
        Returns: {
          analysis_id: string
          eligible_count: number
          eligible_percentage: number
          ineligible_count: number
          summary: Json
          total_analyzed: number
          unique_postcodes: number
        }[]
      }
      analyze_clinic_comprehensive_all_metrics: {
        Args: {
          p_clinic_data?: Json
          p_clinic_name?: string
          p_postcodes: string[]
          p_selected_metrics?: Json
        }
        Returns: Json
      }
      analyze_clinic_patients_comprehensive: {
        Args: { postcodes: string[] }
        Returns: Json
      }
      analyze_clinic_patients_comprehensive_fixed: {
        Args: { postcodes: string[] }
        Returns: Json
      }
      analyze_clinic_postcodes: {
        Args: { p_clinic_name?: string; p_postcodes: string[] }
        Returns: {
          analysis_id: string
          eligible_count: number
          eligible_percentage: number
          ineligible_count: number
          summary: Json
          total_analyzed: number
          unique_postcodes: number
        }[]
      }
      analyze_clinic_postcodes_enhanced: {
        Args: {
          p_clinic_name?: string
          p_demographics?: Json[]
          p_postcodes: string[]
        }
        Returns: {
          analysis_id: string
          eligible_count: number
          eligible_percentage: number
          ineligible_count: number
          summary: Json
          total_analyzed: number
          unique_postcodes: number
        }[]
      }
      analyze_referential_integrity: {
        Args: Record<PropertyKey, never>
        Returns: {
          integrity_score: number
          orphaned_records: number
          reference_table: string
          table_name: string
        }[]
      }
      calculate_affected_population: {
        Args: { months_back?: number }
        Returns: {
          lga_count: number
          state_count: number
          total_population: number
        }[]
      }
      can_cancel_subscription: {
        Args: { _user_id: string }
        Returns: boolean
      }
      cancel_stripe_subscription: {
        Args: { subscription_id_param: string }
        Returns: Json
      }
      check_admin_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          isadmin: boolean
        }[]
      }
      check_ai_rate_limit: {
        Args: {
          p_function_name: string
          p_max_requests?: number
          p_user_id: string
          p_window_minutes?: number
        }
        Returns: Json
      }
      check_email_rate_limit: {
        Args: { p_email: string }
        Returns: boolean
      }
      check_medicare_eligibility: {
        Args: { check_postcode: string }
        Returns: {
          active_disasters: number
          agrn_codes: string[]
          disaster_titles: string[]
          is_eligible: boolean
          postcode: string
        }[]
      }
      check_postcode_eligibility: {
        Args: { input_postcode: string }
        Returns: {
          disaster_agrn: string
          disaster_name: string
          eligible: boolean
          matching_lga: string
          state: string
        }[]
      }
      check_rate_limit: {
        Args: {
          p_endpoint: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: Json
      }
      check_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      check_stripe_subscription_status: {
        Args: { p_user_email: string }
        Returns: {
          customer_id: string
          has_active_subscription: boolean
          status: string
          subscription_id: string
          subscription_tier: string
        }[]
      }
      check_subscription_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          current_period_end: string
          customer_email: string
          has_subscription: boolean
          subscription_status: string
          subscription_tier: string
        }[]
      }
      check_table_rls: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      check_telehealth_eligibility: {
        Args: { check_postcode: string }
        Returns: {
          affected_lga: string
          disasters: Json
          is_eligible: boolean
          lga_code: string
          postcode: string
          state: string
          suburb: string
          total_disasters: number
        }[]
      }
      check_telehealth_eligibility_v2: {
        Args: { check_postcode: string }
        Returns: {
          affected_lga: string
          disasters: Json
          is_eligible: boolean
          lga_code: string
          postcode: string
          state: string
          suburb: string
          total_disasters: number
        }[]
      }
      check_user_subscription: {
        Args: { user_email: string }
        Returns: {
          customer_id: string
          status: string
          subscription_id: string
        }[]
      }
      cleanup_expired_csrf_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_ai_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_consistency_reports: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      compare_clinics: {
        Args: { p_clinic_names: string[]; p_user_id: string }
        Returns: {
          clinic_name: string
          eligibility_percentage: number
          latest_report_date: string
          major_cities_percentage: number
          remote_percentage: number
          total_patients: number
        }[]
      }
      count_invalid_disaster_dates: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      create_accounts_for_orphaned_customers: {
        Args: Record<PropertyKey, never>
        Returns: {
          action_type: string
          email: string
          result: string
          stripe_customer_id: string
        }[]
      }
      create_stripe_checkout_session: {
        Args: {
          cancel_url: string
          price_id: string
          success_url: string
          user_email: string
          user_id: string
        }
        Returns: Json
      }
      create_user_for_stripe: {
        Args: {
          stripe_customer_id: string
          subscription_id: string
          user_email: string
        }
        Returns: string
      }
      current_disaster_coverage: {
        Args: Record<PropertyKey, never>
        Returns: {
          lga_count: number
          postcode_count: number
          total_population: number
        }[]
      }
      delete_stripe_customer: {
        Args: { customer_id_param: string }
        Returns: Json
      }
      delete_user_auth: {
        Args: { user_id_to_delete: string }
        Returns: Json
      }
      detect_suspicious_activity: {
        Args: Record<PropertyKey, never>
        Returns: {
          activity_count: number
          first_occurrence: string
          last_occurrence: string
          suspicious_activity_type: string
          user_id: string
        }[]
      }
      emergency_stripe_sync: {
        Args: Record<PropertyKey, never>
        Returns: {
          action_type: string
          customer_email: string
          details: string
          status: string
          stripe_customer_id: string
        }[]
      }
      enforce_session_timeout: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      execute_consistency_check: {
        Args: { check_query: string }
        Returns: {
          count: number
        }[]
      }
      get_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          last_sign_in_at: string
          role: string
          subscribed: boolean
          subscription_status: string
          user_created_at: string
          user_id: string
        }[]
      }
      get_clinic_reports_summary: {
        Args: { p_user_id: string }
        Returns: {
          average_eligibility_rate: number
          clinic_count: number
          most_recent_report: string
          total_patients_analyzed: number
          total_reports: number
        }[]
      }
      get_current_postcode_eligibility: {
        Args: { p_postcode: string; p_state?: string }
        Returns: {
          disaster_count: number
          disasters: Json
          is_eligible: boolean
          last_updated: string
          lga: string
          lga_code: string
          postcode: string
          state: string
          suburb: string
        }[]
      }
      get_customer_active_subscriptions: {
        Args: { customer_id: string }
        Returns: {
          id: string
        }[]
      }
      get_customer_invoices: {
        Args: { user_email: string }
        Returns: {
          amount_due: number
          amount_paid: number
          created: string
          currency: string
          hosted_invoice_url: string
          invoice_id: string
          invoice_pdf: string
          number: string
          status: string
        }[]
      }
      get_data_quality_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          metric_value: number
          severity: string
          status: string
          threshold_value: number
        }[]
      }
      get_database_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_database_size: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_disaster_compliance_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_disasters: number
          compliance_percentage: number
          expired_disasters: number
          missing_end_dates: number
          total_disasters: number
        }[]
      }
      get_orphaned_customers: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_subscriptions: number
          customer_since: string
          email: string
          monthly_revenue_loss: number
          stripe_customer_id: string
          stripe_name: string
        }[]
      }
      get_stripe_customers: {
        Args: Record<PropertyKey, never> | { limit_count?: number }
        Returns: {
          attrs: Json
          created: string
          description: string
          email: string
          id: string
          name: string
        }[]
      }
      get_stripe_invoices: {
        Args: Record<PropertyKey, never>
        Returns: {
          amount_paid: number
          attrs: Json
          created_at: number
          currency: string
          customer: string
          id: string
          status: string
        }[]
      }
      get_stripe_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_stripe_subscription_by_email: {
        Args: { customer_email: string }
        Returns: Json
      }
      get_stripe_subscriptions: {
        Args: Record<PropertyKey, never> | { limit_count?: number }
        Returns: {
          attrs: Json
          cancel_at_period_end: boolean
          current_period_end: string
          current_period_start: string
          customer: string
          id: string
          status: string
        }[]
      }
      get_user_ai_usage_stats: {
        Args: { p_user_id?: string }
        Returns: {
          avg_processing_time_ms: number
          cached_requests: number
          date: string
          failed_requests: number
          function_name: string
          success_rate: number
          successful_requests: number
          total_requests: number
        }[]
      }
      get_user_by_email: {
        Args: { user_email: string }
        Returns: {
          email: string
          id: string
        }[]
      }
      get_user_email: {
        Args: { p_user_id: string }
        Returns: string
      }
      has_active_subscription: {
        Args: { user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      haversine_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      invalidate_user_sessions: {
        Args: { reason?: string; target_user_id: string }
        Returns: number
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      log_admin_access: {
        Args: { p_ip_address?: string; p_path?: string; p_user_agent?: string }
        Returns: undefined
      }
      log_ai_request: {
        Args: {
          p_cached_response?: boolean
          p_clinic_name?: string
          p_error_message?: string
          p_function_name: string
          p_input_size?: number
          p_model_used?: string
          p_output_size?: number
          p_processing_time_ms?: number
          p_rate_limited?: boolean
          p_request_type: string
          p_service_tier?: string
          p_success?: boolean
          p_user_id: string
        }
        Returns: string
      }
      manual_refresh_coverage_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      merge_duplicate_stripe_customers: {
        Args: { duplicate_customer_ids: string[]; primary_customer_id: string }
        Returns: Json
      }
      postgres_fdw_disconnect: {
        Args: { "": string }
        Returns: boolean
      }
      postgres_fdw_disconnect_all: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      postgres_fdw_get_connections: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
      postgres_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      process_pending_checkouts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      process_stripe_payment_by_email: {
        Args: {
          p_customer_email: string
          p_customer_id: string
          p_subscription_id: string
        }
        Returns: Json
      }
      process_webhook_event: {
        Args: { event_id: string; event_type: string; processed?: boolean }
        Returns: boolean
      }
      protected_operation: {
        Args: { p_csrf_token: string; p_data?: Json; p_operation: string }
        Returns: Json
      }
      quick_make_admin: {
        Args: { user_email: string }
        Returns: string
      }
      rate_limited_operation: {
        Args: {
          p_data?: Json
          p_endpoint: string
          p_max_requests?: number
          p_operation: string
          p_window_minutes?: number
        }
        Returns: Json
      }
      refresh_coverage_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_disasters_combined: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_medicare_eligibility_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      resolve_duplicate_stripe_customers: {
        Args: Record<PropertyKey, never>
        Returns: {
          customer_count: number
          customer_ids: string[]
          email: string
        }[]
      }
      send_email: {
        Args: {
          p_template_name: string
          p_to_email: string
          p_user_id?: string
          p_variables?: Json
        }
        Returns: string
      }
      send_test_email: {
        Args: { p_email: string; p_template?: string }
        Returns: string
      }
      stripe_webhook_handler: {
        Args: { event_data: Json; event_type: string }
        Returns: string
      }
      sync_all_stripe_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sync_payment_link_subscription: {
        Args: {
          p_customer_id: string
          p_email?: string
          p_subscription_id: string
          p_user_id: string
        }
        Returns: Json
      }
      sync_stripe_after_checkout: {
        Args: { checkout_session_id: string }
        Returns: Json
      }
      sync_stripe_subscription_status: {
        Args:
          | Record<PropertyKey, never>
          | { user_email: string }
          | { user_id: string }
        Returns: undefined
      }
      test_auth_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      trigger_stripe_cancellation_processing: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      upsert_subscription_contact: {
        Args:
          | {
              _email: string
              _mobile: string
              _stripe_customer_id: string
              _user_id?: string
            }
          | {
              _email?: string
              _full_name?: string
              _mobile?: string
              _stripe_customer_id: string
              _user_id?: string
            }
        Returns: undefined
      }
      user_has_active_sub: {
        Args: { u: string }
        Returns: boolean
      }
      user_has_active_subscription: {
        Args: { user_email: string }
        Returns: boolean
      }
      validate_csrf_token: {
        Args: { p_token: string }
        Returns: boolean
      }
      validate_parsed_data_with_ai: {
        Args: { data_to_validate: Json; validation_type?: string }
        Returns: Json
      }
      verify_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_subscription_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user" | "consumer"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      profession_type:
        | "General Practitioner"
        | "Specialist Doctor"
        | "Nurse"
        | "Nurse Practitioner"
        | "Allied Health Professional"
        | "Practice Manager"
        | "Administration Staff"
        | "Medical Receptionist"
        | "Other Healthcare Professional"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
      theme_mode: "light" | "dark" | "system"
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
    Enums: {
      app_role: ["admin", "user", "consumer"],
      pricing_plan_interval: ["day", "week", "month", "year"],
      pricing_type: ["one_time", "recurring"],
      profession_type: [
        "General Practitioner",
        "Specialist Doctor",
        "Nurse",
        "Nurse Practitioner",
        "Allied Health Professional",
        "Practice Manager",
        "Administration Staff",
        "Medical Receptionist",
        "Other Healthcare Professional",
      ],
      subscription_status: [
        "trialing",
        "active",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "unpaid",
        "paused",
      ],
      theme_mode: ["light", "dark", "system"],
    },
  },
} as const
