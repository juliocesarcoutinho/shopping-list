package br.com.shooping.list.domain.shoppinglist;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Objects;

/**
 * Entity que representa um item individual dentro de uma lista de compras.
 * Cada item possui nome, quantidade, unidade de medida opcional e status de compra.
 * Regras de negócio:
 * - Item não pode existir sem uma lista pai (relacionamento obrigatório)
 * - Nome do item é obrigatório e validado pelo Value Object ItemName
 * - Quantidade é obrigatória e validada pelo Value Object Quantity
 * - Unidade de medida é opcional (pode ser null)
 * - Status padrão é PENDING (não comprado)
 * - Ao marcar como comprado, timestamp updatedAt é atualizado
 * Nota: Esta classe não tem anotações JPA propositalmente.
 * O modelo de domínio deve ser puro, sem dependências de frameworks.
 * As anotações JPA serão adicionadas na camada de infraestrutura se necessário,
 * ou podemos usar esta mesma classe como entidade JPA nas próximas iterações.
 */
@Getter
@Setter
public class ListItem {

    private Long id;
    private final ShoppingList shoppingList;
    private ItemName name;
    private Quantity quantity;
    private String unit;
    private ItemStatus status;
    private final Instant createdAt;
    private Instant updatedAt;

    /**
     * Construtor privado.
     * Use o factory method create() para criar instâncias.
     */
    private ListItem(ShoppingList shoppingList, ItemName name, Quantity quantity, String unit) {
        validateShoppingList(shoppingList);
        this.shoppingList = shoppingList;
        this.name = name;
        this.quantity = quantity;
        this.unit = validateUnit(unit);
        this.status = ItemStatus.PENDING;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    /**
     * Factory method para criar um novo item.
     *
     * @param shoppingList lista pai (obrigatório)
     * @param name nome do item (obrigatório)
     * @param quantity quantidade (obrigatório)
     * @param unit unidade de medida (opcional)
     * @return nova instância de ListItem
     * @throws IllegalArgumentException se lista for nula
     */
    public static ListItem create(ShoppingList shoppingList, ItemName name, Quantity quantity, String unit) {
        return new ListItem(shoppingList, name, quantity, unit);
    }

    private void validateShoppingList(ShoppingList shoppingList) {
        if (shoppingList == null) {
            throw new IllegalArgumentException("Lista de compras não pode ser nula");
        }
    }

    private String validateUnit(String unit) {
        if (unit == null) {
            return null;
        }

        String trimmed = unit.trim();
        if (trimmed.isEmpty()) {
            return null;
        }

        if (trimmed.length() > 20) {
            throw new IllegalArgumentException("Unidade de medida não pode ter mais de 20 caracteres");
        }

        return trimmed;
    }

    /**
     * Marca o item como comprado.
     * Atualiza o status para PURCHASED e o timestamp updatedAt.
     */
    public void markAsPurchased() {
        if (this.status == ItemStatus.PURCHASED) {
            return;
        }
        this.status = ItemStatus.PURCHASED;
        this.updatedAt = Instant.now();
    }

    /**
     * Marca o item como não comprado.
     * Atualiza o status para PENDING e o timestamp updatedAt.
     */
    public void markAsPending() {
        if (this.status == ItemStatus.PENDING) {
            return;
        }
        this.status = ItemStatus.PENDING;
        this.updatedAt = Instant.now();
    }

    /**
     * Atualiza a quantidade do item.
     *
     * @param quantity nova quantidade (deve ser válida)
     */
    public void updateQuantity(Quantity quantity) {
        if (quantity == null) {
            throw new IllegalArgumentException("Quantidade não pode ser nula");
        }
        this.quantity = quantity;
        this.updatedAt = Instant.now();
    }

    /**
     * Atualiza o nome do item.
     *
     * @param name novo nome (deve ser válido)
     */
    public void updateName(ItemName name) {
        if (name == null) {
            throw new IllegalArgumentException("Nome não pode ser nulo");
        }
        this.name = name;
        this.updatedAt = Instant.now();
    }

    /**
     * Atualiza a unidade de medida do item.
     *
     * @param unit nova unidade (pode ser null)
     */
    public void updateUnit(String unit) {
        this.unit = validateUnit(unit);
        this.updatedAt = Instant.now();
    }

    /**
     * Verifica se o ‘item’ está comprado.
     */
    public boolean isPurchased() {
        return this.status == ItemStatus.PURCHASED;
    }

    /**
     * Verifica se o ‘item’ está pendente (não comprado).
     */
    public boolean isPending() {
        return this.status == ItemStatus.PENDING;
    }

    /**
     * Verifica se este item tem o mesmo nome que outro (case-insensitive).
     * Útil para detectar duplicatas na lista.
     */
    public boolean hasSameNameAs(ListItem other) {
        if (other == null) {
            return false;
        }
        return this.name.isSameAs(other.name);
    }

    /**
     * Verifica se este item tem o mesmo nome que um ItemName (case-insensitive).
     */
    public boolean hasName(ItemName itemName) {
        return this.name.isSameAs(itemName);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ListItem listItem = (ListItem) o;
        return Objects.equals(id, listItem.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "ListItem{" +
                "id=" + id +
                ", name=" + name +
                ", quantity=" + quantity +
                ", unit='" + unit + '\'' +
                ", status=" + status +
                '}';
    }
}
