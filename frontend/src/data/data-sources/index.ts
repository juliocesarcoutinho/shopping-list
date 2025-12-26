/**
 * Data Layer - Data Sources
 *
 * Contracts for external data sources (API, local storage, etc.).
 * These define how to access data from different sources.
 */

import {
  ShoppingListDto,
  ShoppingItemDto,
  UserDto,
  CreateShoppingListRequest,
  CreateShoppingItemRequest,
  UpdateShoppingItemRequest,
} from '../models';

export interface RemoteDataSource {
  // Shopping Lists
  getShoppingLists(): Promise<ShoppingListDto[]>;
  getShoppingList(id: string): Promise<ShoppingListDto>;
  createShoppingList(request: CreateShoppingListRequest): Promise<ShoppingListDto>;
  updateShoppingList(
    id: string,
    request: Partial<CreateShoppingListRequest>
  ): Promise<ShoppingListDto>;
  deleteShoppingList(id: string): Promise<void>;

  // Shopping Items
  createShoppingItem(listId: string, request: CreateShoppingItemRequest): Promise<ShoppingItemDto>;
  updateShoppingItem(id: string, request: UpdateShoppingItemRequest): Promise<ShoppingItemDto>;
  deleteShoppingItem(id: string): Promise<void>;

  // User
  getUserProfile(): Promise<UserDto>;
  updateUserProfile(request: Partial<UserDto>): Promise<UserDto>;
}

export interface LocalDataSource {
  // Cache management
  cacheShoppingLists(lists: ShoppingListDto[]): Promise<void>;
  getCachedShoppingLists(): Promise<ShoppingListDto[]>;
  clearCache(): Promise<void>;

  // Offline storage
  saveOfflineItem(listId: string, item: CreateShoppingItemRequest): Promise<void>;
  getOfflineItems(): Promise<{ listId: string; item: CreateShoppingItemRequest }[]>;
  clearOfflineItems(): Promise<void>;
}
