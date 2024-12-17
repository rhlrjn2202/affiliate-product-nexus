export interface Profile {
  created_at: string;
  id: string;
  role: string;
}

export interface ProfileInsert {
  created_at?: string;
  id: string;
  role?: string;
}

export interface ProfileUpdate {
  created_at?: string;
  id?: string;
  role?: string;
}