import type { Category, CategoryInsert, CategoryUpdate } from './categories';
import type { Click, ClickInsert, ClickUpdate } from './clicks';
import type { Product, ProductInsert, ProductUpdate } from './products';
import type { Profile, ProfileInsert, ProfileUpdate } from './profiles';
import type { Settings, SettingsInsert, SettingsUpdate } from './settings';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
        Relationships: [];
      };
      clicks: {
        Row: Click;
        Insert: ClickInsert;
        Update: ClickUpdate;
        Relationships: [
          {
            foreignKeyName: "clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ];
      };
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ];
      };
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      settings: {
        Row: Settings;
        Insert: SettingsInsert;
        Update: SettingsUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Re-export all types
export type {
  Category,
  CategoryInsert,
  CategoryUpdate,
  Click,
  ClickInsert,
  ClickUpdate,
  Product,
  ProductInsert,
  ProductUpdate,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Settings,
  SettingsInsert,
  SettingsUpdate,
};