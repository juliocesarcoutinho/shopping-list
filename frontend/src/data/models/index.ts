/**
 * Data Layer - Models
 *
 * DTOs and data transfer objects for external APIs and data sources.
 * These may differ from domain entities to handle API-specific formats.
 */

export interface ShoppingItemDto {
  id: string;
  name: string;
  quantity: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListDto {
  id: string;
  title: string;
  items: ShoppingItemDto[];
  created_at: string;
  updated_at: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface CreateShoppingListRequest {
  title: string;
}

export interface CreateShoppingItemRequest {
  name: string;
  quantity: number;
}

export interface UpdateShoppingItemRequest {
  name?: string;
  quantity?: number;
  is_completed?: boolean;
}
