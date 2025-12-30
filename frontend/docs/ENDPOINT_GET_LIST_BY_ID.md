# Endpoint GET /api/v1/lists/{id} - Necessário Implementar

## Situação Atual

O frontend está tentando chamar o endpoint `GET /api/v1/lists/{id}` para buscar os detalhes de uma lista específica com todos os itens, mas este endpoint **não está implementado no backend**.

## Endpoints Disponíveis no Backend

Atualmente o backend possui os seguintes endpoints para listas:

- ✅ `POST /api/v1/lists` - Criar nova lista
- ✅ `GET /api/v1/lists` - Listar minhas listas (retorna resumos sem itens)
- ✅ `PATCH /api/v1/lists/{id}` - Atualizar lista (título e/ou descrição)
- ✅ `DELETE /api/v1/lists/{id}` - Deletar lista
- ❌ `GET /api/v1/lists/{id}` - **NÃO IMPLEMENTADO** (necessário para tela de detalhes)

## Impacto

A tela de detalhes (`ListDetailsScreen`) não consegue carregar os itens da lista porque depende deste endpoint.

**Erro atual:** HTTP 500 ao tentar acessar `GET /api/v1/lists/{id}`

## Solução: Implementar no Backend

O backend precisa implementar o endpoint `GET /api/v1/lists/{id}` que deve:

1. **Autenticação:** Requer JWT válido
2. **Autorização:** Validar que a lista pertence ao usuário autenticado
3. **Resposta:** Retornar `ShoppingListResponse` completo com:
   - `id`, `title`, `description`
   - `items` (array completo de itens com todos os campos)
   - `itemsCount`, `pendingItemsCount`, `purchasedItemsCount`
   - `createdAt`, `updatedAt`

### Exemplo de Resposta Esperada

```json
{
  "id": 1,
  "ownerId": 1,
  "title": "Lista da Feira",
  "description": "Compras semanais",
  "items": [
    {
      "id": 1,
      "name": "Leite",
      "quantity": 2,
      "unitPrice": 4.5,
      "status": "PENDING",
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  ],
  "itemsCount": 1,
  "pendingItemsCount": 1,
  "purchasedItemsCount": 0,
  "createdAt": "2025-12-30T09:00:00.000Z",
  "updatedAt": "2025-12-30T10:00:00.000Z"
}
```

### Implementação Sugerida no Backend

```java
@GetMapping("/{id}")
public ResponseEntity<ShoppingListResponse> getListById(
    @PathVariable Long id,
    Authentication authentication
) {
    Long ownerId = Long.parseLong(authentication.getName());
    ShoppingListResponse response = getListDetailsUseCase.execute(ownerId, id);
    return ResponseEntity.ok(response);
}
```

## Status do Frontend

O frontend está preparado para consumir este endpoint assim que for implementado:

- ✅ `ShoppingListRemoteDataSource.getListById()` - Pronto
- ✅ `ShoppingListRepository.getById()` - Pronto
- ✅ `GetListDetailsUseCase` - Pronto
- ✅ `ListDetailsScreen` - Pronto (mostra erro amigável até endpoint estar disponível)

## Tratamento de Erro Atual

Quando o endpoint não está disponível, a tela exibe:

> "Endpoint não disponível. O backend precisa implementar GET /api/v1/lists/{id} para buscar detalhes da lista com itens."

## Próximos Passos

1. Implementar `GET /api/v1/lists/{id}` no backend
2. Testar o endpoint com dados reais
3. Verificar se a resposta inclui todos os campos necessários
4. A tela de detalhes funcionará automaticamente após implementação



