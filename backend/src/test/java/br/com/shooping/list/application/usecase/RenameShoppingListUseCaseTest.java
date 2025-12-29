package br.com.shooping.list.application.usecase;

import br.com.shooping.list.application.dto.shoppinglist.RenameShoppingListRequest;
import br.com.shooping.list.application.dto.shoppinglist.ShoppingListResponse;
import br.com.shooping.list.domain.shoppinglist.ShoppingList;
import br.com.shooping.list.domain.shoppinglist.ShoppingListRepository;
import br.com.shooping.list.infrastructure.exception.ShoppingListNotFoundException;
import br.com.shooping.list.infrastructure.exception.UnauthorizedShoppingListAccessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes unitários para RenameShoppingListUseCase.
 * Valida a renomeação de listas com validação de ownership.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("RenameShoppingListUseCase - Testes Unitários")
class RenameShoppingListUseCaseTest {

    @Mock
    private ShoppingListRepository shoppingListRepository;

    @InjectMocks
    private RenameShoppingListUseCase renameShoppingListUseCase;

    private RenameShoppingListRequest validRequest;
    private Long ownerId;
    private Long listId;
    private ShoppingList existingList;

    @BeforeEach
    void setUp() {
        ownerId = 1L;
        listId = 10L;
        validRequest = new RenameShoppingListRequest("Novo Título da Lista");

        existingList = ShoppingList.create(ownerId, "Título Antigo", "Descrição");
        setField(existingList, "id", listId);
    }

    @Test
    @DisplayName("Deve renomear lista com sucesso quando usuário é o dono")
    void shouldRenameShoppingListSuccessfullyWhenUserIsOwner() {
        // Arrange
        when(shoppingListRepository.findById(listId)).thenReturn(Optional.of(existingList));
        when(shoppingListRepository.save(any(ShoppingList.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ShoppingListResponse response = renameShoppingListUseCase.execute(ownerId, listId, validRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(listId);
        assertThat(response.getTitle()).isEqualTo("Novo Título da Lista");
        assertThat(response.getOwnerId()).isEqualTo(ownerId);

        verify(shoppingListRepository).findById(listId);
        verify(shoppingListRepository).save(existingList);
    }

    @Test
    @DisplayName("Deve lançar exceção quando lista não existe")
    void shouldThrowExceptionWhenListDoesNotExist() {
        // Arrange
        when(shoppingListRepository.findById(listId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> renameShoppingListUseCase.execute(ownerId, listId, validRequest))
                .isInstanceOf(ShoppingListNotFoundException.class)
                .hasMessageContaining("não encontrada");

        verify(shoppingListRepository).findById(listId);
        verify(shoppingListRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando usuário não é o dono da lista")
    void shouldThrowExceptionWhenUserIsNotOwner() {
        // Arrange
        Long differentOwnerId = 999L;
        when(shoppingListRepository.findById(listId)).thenReturn(Optional.of(existingList));

        // Act & Assert
        assertThatThrownBy(() -> renameShoppingListUseCase.execute(differentOwnerId, listId, validRequest))
                .isInstanceOf(UnauthorizedShoppingListAccessException.class)
                .hasMessageContaining("não tem permissão");

        verify(shoppingListRepository).findById(listId);
        verify(shoppingListRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve delegar validação de título ao domínio")
    void shouldDelegateTitleValidationToDomain() {
        // Arrange
        when(shoppingListRepository.findById(listId)).thenReturn(Optional.of(existingList));
        when(shoppingListRepository.save(any(ShoppingList.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        renameShoppingListUseCase.execute(ownerId, listId, validRequest);

        // Assert - Verificar que o título foi atualizado via método do domínio
        assertThat(existingList.getTitle()).isEqualTo("Novo Título da Lista");
    }

    /**
     * Usa reflexão para setar campo privado (simula ID gerado pelo banco).
     */
    private void setField(Object target, String fieldName, Object value) {
        try {
            var field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao setar campo via reflexão", e);
        }
    }
}

