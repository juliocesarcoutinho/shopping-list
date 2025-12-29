// Mapper para ShoppingListDto <-> ShoppingList
// Sigo o padrão do projeto, mantendo o domínio desacoplado dos DTOs e sem dependências externas.

import { ShoppingList } from '../../domain/entities';
import { ShoppingItemDto, ShoppingListDto } from '../models';

function mapShoppingItemDtoToDomain(dto: ShoppingItemDto) {
  return {
    id: dto.id,
    name: dto.name,
    quantity: dto.quantity,
    isCompleted: dto.is_completed,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapShoppingListDtoToDomain(dto: ShoppingListDto): ShoppingList {
  // Suporto tanto camelCase quanto snake_case para compatibilidade
  const createdAt = dto.createdAt || dto.created_at;
  const updatedAt = dto.updatedAt || dto.updated_at;

  // Valido apenas campos realmente obrigatórios
  if (!dto.id || !dto.title || !createdAt || !updatedAt) {
    console.error('[Mapper] DTO recebido:', JSON.stringify(dto, null, 2));
    throw new Error('Campos obrigatórios ausentes em ShoppingListDto');
  }

  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description,
    // Items pode ser null/undefined, trato como array vazio
    items: Array.isArray(dto.items) ? dto.items.map(mapShoppingItemDtoToDomain) : [],
    createdAt,
    updatedAt,
  };
}

// Se necessário, pode-se criar o caminho inverso (domain -> dto) futuramente.
