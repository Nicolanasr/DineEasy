// src/lib/types.ts

// Order related interfaces
export interface Order {
  id: string;
  session_id: string;
  participant_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  special_instructions?: string;
  menu_item?: MenuItem;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  is_available: boolean;
  image_url?: string;
  allergens?: string[];
  dietary_info?: string[];
  customizations?: MenuItemCustomization[];
}

export interface MenuItemCustomization {
  id: string;
  menu_item_id: string;
  restaurant_id: string;
  name: string;
  type: "option" | "choice" | "addon";
  price_adjustment: number;
  is_required: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Real-time subscription payload interfaces
export interface RealtimePayload<T = Record<string, unknown>> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: T;
  old?: T;
}

export interface ParticipantChangePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: SessionParticipant;
  old?: SessionParticipant;
}

export interface SessionUpdatePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: TableSession;
  old?: TableSession;
}

// Component prop interfaces
export interface SharedCartTabProps {
  session: TableSession | null;
  currentParticipant: SessionParticipant | null;
  participants: SessionParticipant[];
}

export interface ParticipantsCardProps {
  participants: SessionParticipant[];
  currentParticipant: SessionParticipant | null;
  isConnected: boolean;
}

// Form data interfaces
export interface JoinSessionFormData {
  displayName: string;
}

// Additional utility types
export type SessionStatus = 'active' | 'completed' | 'expired';
export type CloseReason = 'customer_left' | 'manual_close' | 'new_customers' | 'staff_reset';
export type RestaurantType = 'fast-casual' | 'casual-dining' | 'fine-dining' | 'cafe' | 'bar';

// Import types from supabase for reference
import type { TableSession, SessionParticipant } from './supabase';