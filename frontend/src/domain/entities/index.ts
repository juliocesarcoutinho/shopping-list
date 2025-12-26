/**
 * Domain Layer - Entities
 *
 * Business entities representing the core data models of the application.
 * These are pure TypeScript interfaces/types with business logic.
 */

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
