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
}
