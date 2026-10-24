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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      barmode_attempts: {
        Row: {
          created_at: string
          id: string
          missed: number[]
          plan: string | null
          revisit: boolean
          score: number
          total: number
          track: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          missed?: number[]
          plan?: string | null
          revisit?: boolean
          score: number
          total: number
          track: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          missed?: number[]
          plan?: string | null
          revisit?: boolean
          score?: number
          total?: number
          track?: string
          user_id?: string
        }
        Relationships: []
      }
      barmode_progress: {
        Row: {
          missed: number[]
          track: string
          updated_at: string
          user_id: string
        }
        Insert: {
          missed?: number[]
          track: string
          updated_at?: string
          user_id: string
        }
        Update: {
          missed?: number[]
          track?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      barmode_unlocks: {
        Row: {
          amount_inr: number
          provider: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          amount_inr?: number
          provider?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          amount_inr?: number
          provider?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          created_at: string
          id: string
          job_id: string
          note: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          note?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          note?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          city: string
          company: string
          created_at: string
          id: string
          pay: string
          per: string
          role: string
          title: string
          type: string
          user_id: string
          when_text: string
        }
        Insert: {
          city: string
          company: string
          created_at?: string
          id?: string
          pay: string
          per?: string
          role: string
          title: string
          type: string
          user_id: string
          when_text?: string
        }
        Update: {
          city?: string
          company?: string
          created_at?: string
          id?: string
          pay?: string
          per?: string
          role?: string
          title?: string
          type?: string
          user_id?: string
          when_text?: string
        }
        Relationships: []
      }
      mentor_requests: {
        Row: {
          answer: string | null
          created_at: string
          id: string
          question: string
          status: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: string
          question: string
          status?: string
          user_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: string
          question?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_name: string
          author_role: string
          body: string
          created_at: string
          id: string
          likes: number
          tag: string
          user_id: string
        }
        Insert: {
          author_name: string
          author_role?: string
          body: string
          created_at?: string
          id?: string
          likes?: number
          tag?: string
          user_id: string
        }
        Update: {
          author_name?: string
          author_role?: string
          body?: string
          created_at?: string
          id?: string
          likes?: number
          tag?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string
          city: string
          created_at: string
          experience: string
          headline: string
          id: string
          name: string
          skills: string[]
          updated_at: string
        }
        Insert: {
          bio?: string
          city?: string
          created_at?: string
          experience?: string
          headline?: string
          id: string
          name?: string
          skills?: string[]
          updated_at?: string
        }
        Update: {
          bio?: string
          city?: string
          created_at?: string
          experience?: string
          headline?: string
          id?: string
          name?: string
          skills?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      venue_messages: {
        Row: {
          author_alias: string
          body: string
          created_at: string
          id: string
          session_id: string
          user_id: string
          venue_id: string
        }
        Insert: {
          author_alias: string
          body: string
          created_at?: string
          id?: string
          session_id: string
          user_id: string
          venue_id: string
        }
        Update: {
          author_alias?: string
          body?: string
          created_at?: string
          id?: string
          session_id?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "venue_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_sessions: {
        Row: {
          alias: string
          ended_at: string | null
          expires_at: string
          id: string
          intent: string
          role: string
          started_at: string
          tags: string[]
          user_id: string
          venue_id: string
          venue_name: string
        }
        Insert: {
          alias: string
          ended_at?: string | null
          expires_at: string
          id?: string
          intent?: string
          role?: string
          started_at?: string
          tags?: string[]
          user_id: string
          venue_id: string
          venue_name: string
        }
        Update: {
          alias?: string
          ended_at?: string | null
          expires_at?: string
          id?: string
          intent?: string
          role?: string
          started_at?: string
          tags?: string[]
          user_id?: string
          venue_id?: string
          venue_name?: string
        }
        Relationships: []
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
