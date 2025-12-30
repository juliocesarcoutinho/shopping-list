// Data source remoto para listas de compras
// Responsável por consumir GET /api/v1/lists usando o apiClient padrão

import { apiClient } from '@/src/infrastructure/http/apiClient';

import { ShoppingListDto } from '../models';

export interface CreateListDto {
  title: string;
  description?: string;
}

export class ShoppingListRemoteDataSource {
  async getMyLists(): Promise<ShoppingListDto[]> {
    try {
      return await apiClient.get<ShoppingListDto[]>('/lists');
    } catch (error) {
      // Normalização de erro conforme padrão do projeto
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as any;
        throw {
          message: err.response?.data?.message || 'Erro ao buscar listas',
          status: err.response?.status,
        };
      }
      throw { message: 'Erro desconhecido ao buscar listas' };
    }
  }

  /**
   * Busca uma lista específica por ID com todos os itens
   *
   * IMPORTANTE: Este endpoint (GET /api/v1/lists/{id}) precisa ser implementado no backend.
   * Atualmente o backend só possui:
   * - GET /api/v1/lists (retorna resumos sem itens)
   * - POST /api/v1/lists (criar)
   * - PATCH /api/v1/lists/{id} (atualizar)
   * - DELETE /api/v1/lists/{id} (deletar)
   *
   * Este método retornará erro 500 até que o endpoint seja implementado no backend.
   */
  async getListById(listId: string): Promise<ShoppingListDto> {
    try {
      return await apiClient.get<ShoppingListDto>(`/lists/${listId}`);
    } catch (error) {
      // Repasso erro já normalizado pelo apiClient
      throw error;
    }
  }

  async createList(data: CreateListDto): Promise<ShoppingListDto> {
    try {
      return await apiClient.post<ShoppingListDto>('/lists', data);
    } catch (error) {
      // Repasso erro já normalizado pelo apiClient
      throw error;
    }
  }

  async deleteList(listId: string): Promise<void> {
    try {
      await apiClient.delete(`/lists/${listId}`);
    } catch (error) {
      // Repasso erro já normalizado pelo apiClient
      throw error;
    }
  }
}
