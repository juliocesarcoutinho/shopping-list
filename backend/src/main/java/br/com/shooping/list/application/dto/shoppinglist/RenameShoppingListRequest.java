package br.com.shooping.list.application.dto.shoppinglist;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para requisição de renomeação de lista de compras.
 * Permite alterar apenas o título da lista.
 * O ID da lista vem da URL no endpoint PATCH /api/v1/lists/{id}
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RenameShoppingListRequest {


    @NotBlank(message = "Novo título é obrigatório")
    @Size(min = 3, max = 100, message = "Título deve ter entre 3 e 100 caracteres")
    private String newTitle;
}
