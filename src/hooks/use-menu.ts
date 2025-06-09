// src/hooks/use-menu.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase, type MenuItem, type Database } from "@/lib/supabase";

// Menu category type
type MenuCategory = Database["public"]["Tables"]["menu_categories"]["Row"];

interface MenuState {
	categories: MenuCategory[];
	items: MenuItem[];
	isLoading: boolean;
	error: string | null;
	selectedCategory: string | null;
}

interface UseMenuReturn extends MenuState {
	setSelectedCategory: (categoryId: string | null) => void;
	filteredItems: MenuItem[];
	searchItems: (query: string) => MenuItem[];
	getItemsByCategory: (categoryId: string) => MenuItem[];
}

export const useMenu = (restaurantId: string): UseMenuReturn => {
	const [state, setState] = useState<MenuState>({
		categories: [],
		items: [],
		isLoading: true,
		error: null,
		selectedCategory: null,
	});

	// Load menu data
	useEffect(() => {
		if (!restaurantId) return;

		loadMenuData();
	}, [restaurantId]);

	const loadMenuData = async () => {
		try {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			// Load categories and items in parallel
			const [categoriesResult, itemsResult] = await Promise.all([
				supabase
					.from("menu_categories")
					.select("*")
					.eq("restaurant_id", restaurantId)
					.eq("is_active", true)
					.order("display_order", { ascending: true }),

				supabase
					.from("menu_items")
					.select("*")
					.eq("restaurant_id", restaurantId)
					.eq("is_available", true)
					.order("display_order", { ascending: true }),
			]);

			if (categoriesResult.error) {
				throw new Error("Failed to load menu categories");
			}

			if (itemsResult.error) {
				throw new Error("Failed to load menu items");
			}

			setState((prev) => ({
				...prev,
				categories: categoriesResult.data || [],
				items: itemsResult.data || [],
				isLoading: false,
				// Auto-select first category if none selected
				selectedCategory: prev.selectedCategory || null,
			}));
		} catch (error) {
			setState((prev) => ({
				...prev,
				error: error instanceof Error ? error.message : "Failed to load menu",
				isLoading: false,
			}));
		}
	};

	// Set selected category
	const setSelectedCategory = (categoryId: string | null) => {
		setState((prev) => ({
			...prev,
			selectedCategory: categoryId,
		}));
	};

	// Get filtered items based on selected category
	const filteredItems = useMemo(() => {
		if (!state.selectedCategory) {
			return state.items;
		}
		return state.items.filter((item) => item.category_id === state.selectedCategory);
	}, [state.items, state.selectedCategory]);

	// Search items by name or description
	const searchItems = (query: string): MenuItem[] => {
		if (!query.trim()) {
			return filteredItems;
		}

		const searchTerm = query.toLowerCase();
		return state.items.filter(
			(item) =>
				item.name.toLowerCase().includes(searchTerm) ||
				item.description?.toLowerCase().includes(searchTerm) ||
				item.ingredients?.some((ingredient) => ingredient.toLowerCase().includes(searchTerm))
		);
	};

	// Get items by specific category
	const getItemsByCategory = (categoryId: string): MenuItem[] => {
		return state.items.filter((item) => item.category_id === categoryId);
	};

	return {
		...state,
		setSelectedCategory,
		filteredItems,
		searchItems,
		getItemsByCategory,
	};
};

// Hook for managing dietary filters
export const useDietaryFilters = (items: MenuItem[]) => {
	const [activeFilters, setActiveFilters] = useState<string[]>([]);

	// Get all available dietary options from items
	const availableDietaryOptions = useMemo(() => {
		const options = new Set<string>();
		items.forEach((item) => {
			item.dietary_info?.forEach((info) => options.add(info));
		});
		return Array.from(options).sort();
	}, [items]);

	// Filter items based on active dietary filters
	const filteredItems = useMemo(() => {
		if (activeFilters.length === 0) {
			return items;
		}

		return items.filter((item) => {
			// Item must have ALL active filters
			return activeFilters.every((filter) => item.dietary_info?.includes(filter));
		});
	}, [items, activeFilters]);

	const toggleFilter = (filter: string) => {
		setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));
	};

	const clearFilters = () => {
		setActiveFilters([]);
	};

	return {
		activeFilters,
		availableDietaryOptions,
		filteredItems,
		toggleFilter,
		clearFilters,
	};
};
