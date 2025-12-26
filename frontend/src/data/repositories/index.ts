/**
 * Data Layer - Repository Implementations
 *
 * Concrete implementations of domain repository interfaces.
 * Handle data mapping, caching, and coordination between data sources.
 */

import {
  ShoppingListRepository,
  ShoppingItemRepository,
  UserRepository,
  RemoteDataSource,
  LocalDataSource,
  ShoppingListDto,
  ShoppingItemDto,
  UserDto,
  ShoppingList,
  ShoppingItem,
  User,
} from '@/src';

export * from './auth-repository';

export class ShoppingListRepositoryImpl implements ShoppingListRepository {
  constructor(
    private remoteDataSource: RemoteDataSource,
    private localDataSource: LocalDataSource
  ) {}

  async getAll(): Promise<ShoppingList[]> {
    try {
      const dtos = await this.remoteDataSource.getShoppingLists();
      await this.localDataSource.cacheShoppingLists(dtos);
      return dtos.map(this.mapDtoToEntity);
    } catch (_error) {
      // Fallback to cached data
      const cachedDtos = await this.localDataSource.getCachedShoppingLists();
      return cachedDtos.map(this.mapDtoToEntity);
    }
  }

  async getById(id: string): Promise<ShoppingList | null> {
    try {
      const dto = await this.remoteDataSource.getShoppingList(id);
      return this.mapDtoToEntity(dto);
    } catch (_error) {
      console.warn('Failed to fetch shopping list from remote:', _error);
      return null;
    }
  }

  async create(list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingList> {
    const dto = await this.remoteDataSource.createShoppingList({
      title: list.title,
    });
    return this.mapDtoToEntity(dto);
  }

  async update(id: string, list: Partial<ShoppingList>): Promise<ShoppingList> {
    const dto = await this.remoteDataSource.updateShoppingList(id, {
      title: list.title,
    });
    return this.mapDtoToEntity(dto);
  }

  async delete(id: string): Promise<void> {
    await this.remoteDataSource.deleteShoppingList(id);
  }

  private mapDtoToEntity(dto: ShoppingListDto): ShoppingList {
    return {
      id: dto.id,
      title: dto.title,
      items: dto.items.map(this.mapItemDtoToEntity),
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }

  private mapItemDtoToEntity(dto: ShoppingItemDto): ShoppingItem {
    return {
      id: dto.id,
      name: dto.name,
      quantity: dto.quantity,
      isCompleted: dto.is_completed,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }
}

export class ShoppingItemRepositoryImpl implements ShoppingItemRepository {
  constructor(private remoteDataSource: RemoteDataSource) {}

  async create(
    listId: string,
    item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ShoppingItem> {
    const dto = await this.remoteDataSource.createShoppingItem(listId, {
      name: item.name,
      quantity: item.quantity,
    });
    return this.mapDtoToEntity(dto);
  }

  async update(id: string, item: Partial<ShoppingItem>): Promise<ShoppingItem> {
    const dto = await this.remoteDataSource.updateShoppingItem(id, {
      name: item.name,
      quantity: item.quantity,
      is_completed: item.isCompleted,
    });
    return this.mapDtoToEntity(dto);
  }

  async delete(id: string): Promise<void> {
    await this.remoteDataSource.deleteShoppingItem(id);
  }

  private mapDtoToEntity(dto: ShoppingItemDto): ShoppingItem {
    return {
      id: dto.id,
      name: dto.name,
      quantity: dto.quantity,
      isCompleted: dto.is_completed,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private remoteDataSource: RemoteDataSource) {}

  async getProfile(): Promise<User | null> {
    try {
      const dto = await this.remoteDataSource.getUserProfile();
      return this.mapDtoToEntity(dto);
    } catch (error) {
      console.warn('Failed to fetch user profile:', error);
      return null;
    }
  }

  async updateProfile(user: Partial<User>): Promise<User> {
    const dto = await this.remoteDataSource.updateUserProfile({
      email: user.email,
      name: user.name,
    });
    return this.mapDtoToEntity(dto);
  }

  private mapDtoToEntity(dto: UserDto): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      provider: 'LOCAL',
      status: 'ACTIVE',
      createdAt: dto.created_at,
    };
  }
}
