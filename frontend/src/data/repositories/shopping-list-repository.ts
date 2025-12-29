// Implementação concreta do repositório de listas de compras
// Usa o data source remoto e faz o mapeamento DTO -> domínio

import { ShoppingList } from '@/src/domain/entities';

import { ShoppingListRemoteDataSource } from '../data-sources/shopping-list-remote-data-source';
import { mapShoppingListDtoToDomain } from '../mappers/shopping-list-mapper';

export class ShoppingListRepositoryImpl {
  constructor(private readonly remote: ShoppingListRemoteDataSource) {}

  async getMyLists(): Promise<ShoppingList[]> {
    try {
      const dtos = await this.remote.getMyLists();
      return dtos.map(mapShoppingListDtoToDomain);
    } catch (error) {
      // Repassa erro já normalizado
      throw error;
    }
  }

  async getAll(): Promise<ShoppingList[]> {
    return this.getMyLists();
  }

  async getById(_id: string): Promise<ShoppingList | null> {
    // Implementar quando backend tiver endpoint
    throw new Error('Not implemented');
  }

  async create(list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingList> {
    try {
      const dto = await this.remote.createList({
        title: list.title,
        description: list.description,
      });
      return mapShoppingListDtoToDomain(dto);
    } catch (error) {
      // Repassa erro já normalizado
      throw error;
    }
  }

  async update(_id: string, _list: Partial<ShoppingList>): Promise<ShoppingList> {
    // Implementar quando backend tiver endpoint
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    try {
      await this.remote.deleteList(id);
    } catch (error) {
      // Repassa erro já normalizado
      throw error;
    }
  }
}
