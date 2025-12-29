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
  if (!dto.id || !dto.title || !dto.items || !dto.created_at || !dto.updated_at) {
    throw new Error('Campos obrigatórios ausentes em ShoppingListDto');
  }
  return {
    id: dto.id,
    title: dto.title,
    items: dto.items.map(mapShoppingItemDtoToDomain),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

// Se necessário, pode-se criar o caminho inverso (domain -> dto) futuramente.
