// Testes unitários para o mapper ShoppingListDto -> ShoppingList
// Sigo o padrão do projeto, cobrindo casos de entrada válida e campos obrigatórios.

import { ShoppingListDto } from '../../models';
import { mapShoppingListDtoToDomain } from '../shopping-list-mapper';

describe('mapShoppingListDtoToDomain', () => {
  it('deve mapear corretamente um ShoppingListDto válido', () => {
    const dto: ShoppingListDto = {
      id: '1',
      title: 'Supermercado',
      items: [
        {
          id: 'item1',
          name: 'Arroz',
          quantity: 2,
          is_completed: false,
          created_at: '2025-12-29T10:00:00Z',
          updated_at: '2025-12-29T10:00:00Z',
        },
      ],
      created_at: '2025-12-29T09:00:00Z',
      updated_at: '2025-12-29T09:30:00Z',
    };

    const domain = mapShoppingListDtoToDomain(dto);
    expect(domain).toEqual({
      id: '1',
      title: 'Supermercado',
      items: [
        {
          id: 'item1',
          name: 'Arroz',
          quantity: 2,
          isCompleted: false,
          createdAt: '2025-12-29T10:00:00Z',
          updatedAt: '2025-12-29T10:00:00Z',
        },
      ],
      createdAt: '2025-12-29T09:00:00Z',
      updatedAt: '2025-12-29T09:30:00Z',
    });
  });

  it('deve lançar erro se campos obrigatórios estiverem ausentes', () => {
    // Aqui simulo um DTO incompleto para garantir robustez
    const dtoInvalido = {
      id: '2',
      title: 'Padaria',
      items: [],
      // created_at e updated_at ausentes
    } as any;
    expect(() => mapShoppingListDtoToDomain(dtoInvalido)).toThrow();
  });
});
