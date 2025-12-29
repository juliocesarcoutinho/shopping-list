// Testes unitários para ShoppingListRepositoryImpl
// Mocka o data source remoto e cobre sucesso, erro 401 e erro 500

import { ShoppingListRemoteDataSource } from '../../data-sources/shopping-list-remote-data-source';
import { ShoppingListDto } from '../../models';
import { ShoppingListRepositoryImpl } from '../shopping-list-repository';

jest.mock('../../data-sources/shopping-list-remote-data-source');

const mockLists: ShoppingListDto[] = [
  {
    id: '1',
    title: 'Supermercado',
    items: [],
    created_at: '2025-12-29T09:00:00Z',
    updated_at: '2025-12-29T09:30:00Z',
  },
];

describe('ShoppingListRepositoryImpl', () => {
  let remote: jest.Mocked<ShoppingListRemoteDataSource>;
  let repo: ShoppingListRepositoryImpl;

  beforeEach(() => {
    remote = new ShoppingListRemoteDataSource() as jest.Mocked<ShoppingListRemoteDataSource>;
    repo = new ShoppingListRepositoryImpl(remote);
  });

  it('deve retornar listas de compras no formato de domínio', async () => {
    remote.getMyLists.mockResolvedValueOnce(mockLists);
    const result = await repo.getMyLists();
    expect(result[0]).toHaveProperty('id', '1');
    expect(result[0]).toHaveProperty('title', 'Supermercado');
    expect(result[0]).toHaveProperty('createdAt', '2025-12-29T09:00:00Z');
    expect(result[0]).toHaveProperty('updatedAt', '2025-12-29T09:30:00Z');
  });

  it('deve lançar erro normalizado 401', async () => {
    remote.getMyLists.mockRejectedValueOnce({ message: 'Não autorizado', status: 401 });
    await expect(repo.getMyLists()).rejects.toMatchObject({
      message: 'Não autorizado',
      status: 401,
    });
  });

  it('deve lançar erro normalizado 500', async () => {
    remote.getMyLists.mockRejectedValueOnce({ message: 'Erro interno', status: 500 });
    await expect(repo.getMyLists()).rejects.toMatchObject({ message: 'Erro interno', status: 500 });
  });
});
