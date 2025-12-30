/**
 * Domain Layer - Use Cases
 *
 * Business logic and application-specific rules.
 * Orchestrate data flow between repositories and presentation layer.
 */

import { ShoppingItem, ShoppingList } from '../entities';
import { ShoppingItemRepository, ShoppingListRepository } from '../repositories';

export * from './create-list-use-case';
export * from './delete-shopping-list-use-case';
export * from './get-my-lists-use-case';

export class GetShoppingListsUseCase {
  constructor(private shoppingListRepository: ShoppingListRepository) {}

  async execute(): Promise<ShoppingList[]> {
    return this.shoppingListRepository.getAll();
  }
}

export class CreateShoppingListUseCase {
  constructor(private shoppingListRepository: ShoppingListRepository) {}

  async execute(title: string): Promise<ShoppingList> {
    if (!title.trim()) {
      throw new Error('List title cannot be empty');
    }

    return this.shoppingListRepository.create({
      title: title.trim(),
      items: [],
    });
  }
}

export class AddItemToListUseCase {
  constructor(
    private shoppingItemRepository: ShoppingItemRepository,
    private shoppingListRepository: ShoppingListRepository
  ) {}

  async execute(listId: string, itemName: string, quantity: number = 1): Promise<ShoppingItem> {
    if (!itemName.trim()) {
      throw new Error('Item name cannot be empty');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const list = await this.shoppingListRepository.getById(listId);
    if (!list) {
      throw new Error('Shopping list not found');
    }

    return this.shoppingItemRepository.create(listId, {
      name: itemName.trim(),
      quantity,
      isPurchased: false,
    });
  }
}

export class ToggleItemCompletionUseCase {
  constructor(private shoppingItemRepository: ShoppingItemRepository) {}

  async execute(itemId: string): Promise<ShoppingItem> {
    return this.shoppingItemRepository.update(itemId, {
      isPurchased: true, // This would typically fetch current state and toggle
    });
  }
}
