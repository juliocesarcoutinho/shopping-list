/**
 * Domain Layer - Repository Interfaces
 *
 * Abstract contracts for data access.
 * These define what data operations are needed without caring about implementation.
 */

import { ShoppingItem, ShoppingList, User } from '../entities';

export interface ShoppingListRepository {
  getAll(): Promise<ShoppingList[]>;
  getById(id: string): Promise<ShoppingList | null>;
  create(list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingList>;
  update(id: string, list: Partial<ShoppingList>): Promise<ShoppingList>;
  delete(id: string): Promise<void>;
}

export interface ShoppingItemRepository {
  create(
    listId: string,
    item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ShoppingItem>;
  update(id: string, item: Partial<ShoppingItem>): Promise<ShoppingItem>;
  delete(id: string): Promise<void>;
}

export interface UserRepository {
  getProfile(): Promise<User | null>;
  updateProfile(user: Partial<User>): Promise<User>;
}
