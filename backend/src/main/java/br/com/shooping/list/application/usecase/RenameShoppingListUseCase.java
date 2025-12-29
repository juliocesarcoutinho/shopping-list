package br.com.shooping.list.application.usecase;

import br.com.shooping.list.application.dto.shoppinglist.RenameShoppingListRequest;
import br.com.shooping.list.application.dto.shoppinglist.ShoppingListResponse;
import br.com.shooping.list.domain.shoppinglist.ShoppingList;
import br.com.shooping.list.domain.shoppinglist.ShoppingListRepository;
import br.com.shooping.list.infrastructure.exception.ShoppingListNotFoundException;
import br.com.shooping.list.infrastructure.exception.UnauthorizedShoppingListAccessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Caso de uso para renomear uma lista de compras.
 *
 * Responsabilidades:
 * - Buscar lista existente
 * - Validar ownership (apenas dono pode renomear)
 * - Delegar atualização ao domínio (ShoppingList.updateTitle)
 * - Persistir alteração
 * - Retornar resposta atualizada
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RenameShoppingListUseCase {

    private final ShoppingListRepository shoppingListRepository;

    /**
     * Renomeia uma lista de compras do usuário autenticado.
     *
     * @param ownerId ID do usuário proprietário (extraído do JWT)
     * @param listId ID da lista a ser renomeada (extraído da URL)
     * @param request dados com novo título
     * @return lista atualizada
     * @throws ShoppingListNotFoundException se lista não existir
     * @throws UnauthorizedShoppingListAccessException se usuário não for o dono
     */
    @Transactional
    public ShoppingListResponse execute(Long ownerId, Long listId, RenameShoppingListRequest request) {
        log.info("Renomeando lista de compras: listId={}, ownerId={}, newTitle={}",
                listId, ownerId, request.getNewTitle());

        // Buscar lista
        ShoppingList list = shoppingListRepository.findById(listId)
                .orElseThrow(() -> {
                    log.warn("Lista não encontrada: listId={}", listId);
                    return new ShoppingListNotFoundException(listId);
                });

        // Validar ownership
        if (!list.isOwnedBy(ownerId)) {
            log.warn("Tentativa de acesso não autorizado: listId={}, ownerId={}, realOwnerId={}",
                    listId, ownerId, list.getOwnerId());
            throw new UnauthorizedShoppingListAccessException(listId);
        }

        // Delegar atualização ao domínio (valida regras de título)
        list.updateTitle(request.getNewTitle());

        // Persistir
        ShoppingList updatedList = shoppingListRepository.save(list);
        log.info("Lista renomeada com sucesso: listId={}", updatedList.getId());

        // Mapear para resposta
        return mapToResponse(updatedList);
    }

    /**
     * Mapeia entidade de domínio para DTO de resposta.
     */
    private ShoppingListResponse mapToResponse(ShoppingList list) {
        return ShoppingListResponse.builder()
                .id(list.getId())
                .ownerId(list.getOwnerId())
                .title(list.getTitle())
                .description(list.getDescription())
                .itemsCount(list.countTotalItems())
                .pendingItemsCount(list.countPendingItems())
                .purchasedItemsCount(list.countPurchasedItems())
                .createdAt(list.getCreatedAt())
                .updatedAt(list.getUpdatedAt())
                .build();
    }
}

