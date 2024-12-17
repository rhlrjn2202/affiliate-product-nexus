export interface Click {
  clicked_at: string;
  id: string;
  product_id: string | null;
  user_id: string | null;
}

export interface ClickInsert {
  clicked_at?: string;
  id?: string;
  product_id?: string | null;
  user_id?: string | null;
}

export interface ClickUpdate {
  clicked_at?: string;
  id?: string;
  product_id?: string | null;
  user_id?: string | null;
}