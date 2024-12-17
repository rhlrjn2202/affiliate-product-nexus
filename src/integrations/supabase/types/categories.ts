export interface Category {
  created_at: string;
  id: string;
  name: string;
}

export interface CategoryInsert {
  created_at?: string;
  id?: string;
  name: string;
}

export interface CategoryUpdate {
  created_at?: string;
  id?: string;
  name?: string;
}