export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      datasets: {
        Row: {
          id: string;
          name: string;
          file_path: string;
          record_count: number | null;
          upload_date: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          file_path: string;
          record_count?: number | null;
          upload_date?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          file_path?: string;
          record_count?: number | null;
          upload_date?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
