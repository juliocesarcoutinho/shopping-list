package br.com.shooping.list.application.dto.shoppinglist;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para requisição de renomeação de lista de compras.
 * Permite alterar apenas o título da lista.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RenameShoppingListRequest {

    @NotNull(message = "ID da lista é obrigatório")
    private Long listId;

    @NotBlank(message = "Novo título é obrigatório")
    @Size(min = 3, max = 100, message = "Título deve ter entre 3 e 100 caracteres")
    private String newTitle;
}
