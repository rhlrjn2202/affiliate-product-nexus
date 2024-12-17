export interface Settings {
  id: number;
  ga_tag: string | null;
  created_at: string;
  updated_at: string;
}

export interface SettingsInsert {
  id?: number;
  ga_tag?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SettingsUpdate {
  id?: number;
  ga_tag?: string | null;
  created_at?: string;
  updated_at?: string;
}