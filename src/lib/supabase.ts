import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Comprehensive database types matching your schema
export type Database = {
	public: {
		Tables: {
			restaurants: {
				Row: {
					id: string;
					name: string;
					slug: string;
					email: string;
					phone: string | null;
					address: string | null;
					logo_url: string | null;
					cover_image_url: string | null;
					currency: string;
					timezone: string;
					omega_integration_enabled: boolean;
					omega_api_endpoint: string | null;
					omega_api_key: string | null;
					settings: Record<string, unknown>;
					is_active: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					slug: string;
					email: string;
					phone?: string | null;
					address?: string | null;
					logo_url?: string | null;
					cover_image_url?: string | null;
					currency?: string;
					timezone?: string;
					omega_integration_enabled?: boolean;
					omega_api_endpoint?: string | null;
					omega_api_key?: string | null;
					settings?: Record<string, unknown>;
					is_active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					slug?: string;
					email?: string;
					phone?: string | null;
					address?: string | null;
					logo_url?: string | null;
					cover_image_url?: string | null;
					currency?: string;
					timezone?: string;
					omega_integration_enabled?: boolean;
					omega_api_endpoint?: string | null;
					omega_api_key?: string | null;
					settings?: Record<string, unknown>;
					is_active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			restaurant_staff: {
				Row: {
					id: string;
					restaurant_id: string;
					email: string;
					password_hash: string;
					full_name: string;
					role: "owner" | "manager" | "waiter" | "kitchen";
					is_active: boolean;
					last_login_at: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					restaurant_id: string;
					email: string;
					password_hash: string;
					full_name: string;
					role: "owner" | "manager" | "waiter" | "kitchen";
					is_active?: boolean;
					last_login_at?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					restaurant_id?: string;
					email?: string;
					password_hash?: string;
					full_name?: string;
					role?: "owner" | "manager" | "waiter" | "kitchen";
					is_active?: boolean;
					last_login_at?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			tables: {
				Row: {
					id: string;
					restaurant_id: string;
					table_number: string;
					table_name: string | null;
					capacity: number;
					qr_code_url: string | null;
					is_active: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					restaurant_id: string;
					table_number: string;
					table_name?: string | null;
					capacity?: number;
					qr_code_url?: string | null;
					is_active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					restaurant_id?: string;
					table_number?: string;
					table_name?: string | null;
					capacity?: number;
					qr_code_url?: string | null;
					is_active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			menu_categories: {
				Row: {
					id: string;
					restaurant_id: string;
					name: string;
					description: string | null;
					display_order: number;
					is_active: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					restaurant_id: string;
					name: string;
					description?: string | null;
					display_order?: number;
					is_active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					restaurant_id?: string;
					name?: string;
					description?: string | null;
					display_order?: number;
					is_active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			menu_items: {
				Row: {
					id: string;
					restaurant_id: string;
					category_id: string | null;
					name: string;
					description: string | null;
					price: number;
					image_url: string | null;
					ingredients: string[] | null;
					allergens: string[] | null;
					dietary_info: string[] | null;
					preparation_time: number | null;
					is_available: boolean;
					display_order: number;
					omega_item_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					restaurant_id: string;
					category_id?: string | null;
					name: string;
					description?: string | null;
					price: number;
					image_url?: string | null;
					ingredients?: string[] | null;
					allergens?: string[] | null;
					dietary_info?: string[] | null;
					preparation_time?: number | null;
					is_available?: boolean;
					display_order?: number;
					omega_item_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					restaurant_id?: string;
					category_id?: string | null;
					name?: string;
					description?: string | null;
					price?: number;
					image_url?: string | null;
					ingredients?: string[] | null;
					allergens?: string[] | null;
					dietary_info?: string[] | null;
					preparation_time?: number | null;
					is_available?: boolean;
					display_order?: number;
					omega_item_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			table_sessions: {
				Row: {
					id: string;
					table_id: string;
					restaurant_id: string;
					status: "active" | "ordering" | "submitted" | "completed" | "cancelled";
					session_token: string;
					expires_at: string;
					total_amount: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					table_id: string;
					restaurant_id: string;
					status?: "active" | "ordering" | "submitted" | "completed" | "cancelled";
					session_token: string;
					expires_at?: string;
					total_amount?: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					table_id?: string;
					restaurant_id?: string;
					status?: "active" | "ordering" | "submitted" | "completed" | "cancelled";
					session_token?: string;
					expires_at?: string;
					total_amount?: number;
					created_at?: string;
					updated_at?: string;
				};
			};
			session_participants: {
				Row: {
					id: string;
					session_id: string;
					display_name: string;
					color_code: string;
					joined_at: string;
					last_active_at: string;
				};
				Insert: {
					id?: string;
					session_id: string;
					display_name: string;
					color_code?: string;
					joined_at?: string;
					last_active_at?: string;
				};
				Update: {
					id?: string;
					session_id?: string;
					display_name?: string;
					color_code?: string;
					joined_at?: string;
					last_active_at?: string;
				};
			};
			orders: {
				Row: {
					id: string;
					session_id: string;
					participant_id: string | null;
					status: "cart" | "submitted" | "preparing" | "ready" | "served";
					subtotal: number;
					notes: string | null;
					omega_order_id: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					session_id: string;
					participant_id: string | null;
					status?: "cart" | "submitted" | "preparing" | "ready" | "served";
					subtotal?: number;
					notes?: string | null;
					omega_order_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					session_id?: string;
					participant_id: string | null;
					status?: "cart" | "submitted" | "preparing" | "ready" | "served";
					subtotal?: number;
					notes?: string | null;
					omega_order_id?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			order_items: {
				Row: {
					id: string;
					order_id: string;
					menu_item_id: string;
					quantity: number;
					unit_price: number;
					total_price: number;
					customizations: string[] | null;
					notes: string | null;
					added_by_participant_id: string | null; // ADD THIS LINE
					created_at: string;
				};
				Insert: {
					id?: string;
					order_id: string;
					menu_item_id: string;
					quantity: number;
					unit_price: number;
					total_price: number;
					customizations?: string[] | null;
					notes?: string | null;
					added_by_participant_id?: string | null; // ADD THIS LINE
					created_at?: string;
				};
				Update: {
					id?: string;
					order_id?: string;
					menu_item_id?: string;
					quantity?: number;
					unit_price?: number;
					total_price?: number;
					customizations?: string[] | null;
					notes?: string | null;
					added_by_participant_id?: string | null; // ADD THIS LINE
					created_at?: string;
				};
			};
			service_requests: {
				Row: {
					id: string;
					session_id: string;
					table_id: string;
					participant_id: string | null;
					request_type: "call_waiter" | "water_refill" | "check_please" | "assistance" | "complaint" | "compliment";
					message: string | null;
					status: "pending" | "acknowledged" | "completed" | "cancelled";
					handled_by: string | null;
					handled_at: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					session_id: string;
					table_id: string;
					participant_id?: string | null;
					request_type: "call_waiter" | "water_refill" | "check_please" | "assistance" | "complaint" | "compliment";
					message?: string | null;
					status?: "pending" | "acknowledged" | "completed" | "cancelled";
					handled_by?: string | null;
					handled_at?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					session_id?: string;
					table_id?: string;
					participant_id?: string | null;
					request_type?: "call_waiter" | "water_refill" | "check_please" | "assistance" | "complaint" | "compliment";
					message?: string | null;
					status?: "pending" | "acknowledged" | "completed" | "cancelled";
					handled_by?: string | null;
					handled_at?: string | null;
					created_at?: string;
				};
			};
			session_analytics: {
				Row: {
					id: string;
					session_id: string;
					restaurant_id: string;
					participant_count: number;
					total_items: number;
					session_duration_minutes: number | null;
					avg_order_value: number | null;
					peak_concurrent_users: number;
					created_at: string;
				};
				Insert: {
					id?: string;
					session_id: string;
					restaurant_id: string;
					participant_count?: number;
					total_items?: number;
					session_duration_minutes?: number | null;
					avg_order_value?: number | null;
					peak_concurrent_users?: number;
					created_at?: string;
				};
				Update: {
					id?: string;
					session_id?: string;
					restaurant_id?: string;
					participant_count?: number;
					total_items?: number;
					session_duration_minutes?: number | null;
					avg_order_value?: number | null;
					peak_concurrent_users?: number;
					created_at?: string;
				};
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
};

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export useful type helpers
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];

// Specific type exports for common use
export type Restaurant = Tables<"restaurants">;
export type MenuItem = Tables<"menu_items">;
export type TableSession = Tables<"table_sessions">;
export type SessionParticipant = Tables<"session_participants">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type ServiceRequest = Tables<"service_requests">;

// Insert types for forms
export type RestaurantInsert = InsertTables<"restaurants">;
export type MenuItemInsert = InsertTables<"menu_items">;
export type OrderInsert = InsertTables<"orders">;
export type OrderItemInsert = InsertTables<"order_items">;

// Update types for mutations
export type RestaurantUpdate = UpdateTables<"restaurants">;
export type MenuItemUpdate = UpdateTables<"menu_items">;
export type OrderUpdate = UpdateTables<"orders">;
