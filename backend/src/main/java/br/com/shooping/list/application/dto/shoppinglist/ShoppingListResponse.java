package br.com.shooping.list.application.dto.shoppinglist;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * DTO de resposta completo para uma lista de compras.
 * Inclui detalhes completos da lista e contadores de itens.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingListResponse {

    /**
     * ID único da lista
     */
    private Long id;

    /**
     * ID do proprietário da lista
     */
    private Long ownerId;

    /**
     * Título da lista
     */
    private String title;

    /**
     * Descrição da lista (opcional)
     */
    private String description;

    /**
     * Total de itens na lista
     */
    private int itemsCount;

    /**
     * Total de itens pendentes (não comprados)
     */
    private int pendingItemsCount;

    /**
     * Total de itens comprados
     */
    private int purchasedItemsCount;

    /**
     * Data de criação da lista
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant createdAt;

    /**
     * Data da última atualização
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant updatedAt;
}

