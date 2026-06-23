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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      analytics_cache: {
        Row: {
          id: string
          metric_key: string
          metric_value: Json
          refreshed_at: string | null
        }
        Insert: {
          id?: string
          metric_key: string
          metric_value: Json
          refreshed_at?: string | null
        }
        Update: {
          id?: string
          metric_key?: string
          metric_value?: Json
          refreshed_at?: string | null
        }
        Relationships: []
      }
      community_settings: {
        Row: {
          community_name: string
          community_zone_list: string[]
          created_at: string | null
          id: string
          max_listings_per_user: number | null
          request_expiry_days: number | null
          require_approval: boolean | null
          updated_at: string | null
        }
        Insert: {
          community_name: string
          community_zone_list?: string[]
          created_at?: string | null
          id?: string
          max_listings_per_user?: number | null
          request_expiry_days?: number | null
          require_approval?: boolean | null
          updated_at?: string | null
        }
        Update: {
          community_name?: string
          community_zone_list?: string[]
          created_at?: string | null
          id?: string
          max_listings_per_user?: number | null
          request_expiry_days?: number | null
          require_approval?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      exchanges: {
        Row: {
          completed_by: string | null
          created_at: string | null
          id: string
          listing_id: string | null
          offered_skill: string
          provider_id: string
          requester_id: string
          source_request_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          completed_by?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          offered_skill: string
          provider_id: string
          requester_id: string
          source_request_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_by?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          offered_skill?: string
          provider_id?: string
          requester_id?: string
          source_request_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exchanges_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_source_request_id_fkey"
            columns: ["source_request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          availability: string | null
          category: string
          created_at: string | null
          description: string
          exchange_preference: string | null
          fts: unknown
          id: string
          location_note: string | null
          owner_id: string
          status: string | null
          title: string
        }
        Insert: {
          availability?: string | null
          category: string
          created_at?: string | null
          description: string
          exchange_preference?: string | null
          fts?: unknown
          id?: string
          location_note?: string | null
          owner_id: string
          status?: string | null
          title: string
        }
        Update: {
          availability?: string | null
          category?: string
          created_at?: string | null
          description?: string
          exchange_preference?: string | null
          fts?: unknown
          id?: string
          location_note?: string | null
          owner_id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          exchange_id: string
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          exchange_id: string
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          exchange_id?: string
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "exchanges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          moderator_id: string
          reason: string
          target_content_id: string | null
          target_user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          moderator_id: string
          reason: string
          target_content_id?: string | null
          target_user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          moderator_id?: string
          reason?: string
          target_content_id?: string | null
          target_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_log_moderator_id_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_log_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          community_zone: string
          created_at: string | null
          exchange_count: number | null
          full_name: string
          id: string
          phone_number: string | null
          reputation_score: number | null
          role: string | null
          status: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          community_zone: string
          created_at?: string | null
          exchange_count?: number | null
          full_name: string
          id: string
          phone_number?: string | null
          reputation_score?: number | null
          role?: string | null
          status?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          community_zone?: string
          created_at?: string | null
          exchange_count?: number | null
          full_name?: string
          id?: string
          phone_number?: string | null
          reputation_score?: number | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          details: string | null
          id: string
          reason: string
          reporter_id: string
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          id?: string
          reason: string
          reporter_id: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string | null
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          category: string
          created_at: string | null
          description: string
          desired_timeframe: string | null
          expires_at: string | null
          id: string
          offered_in_return: string
          owner_id: string
          status: string | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          desired_timeframe?: string | null
          expires_at?: string | null
          id?: string
          offered_in_return: string
          owner_id: string
          status?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          desired_timeframe?: string | null
          expires_at?: string | null
          id?: string
          offered_in_return?: string
          owner_id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          exchange_id: string
          id: string
          is_published: boolean | null
          rating: number
          reviewer_id: string
          target_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          exchange_id: string
          id?: string
          is_published?: boolean | null
          rating: number
          reviewer_id: string
          target_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          exchange_id?: string
          id?: string
          is_published?: boolean | null
          rating?: number
          reviewer_id?: string
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "exchanges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_proposal: { Args: { exchange_id: string }; Returns: undefined }
      mark_complete: { Args: { exchange_id: string }; Returns: undefined }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
