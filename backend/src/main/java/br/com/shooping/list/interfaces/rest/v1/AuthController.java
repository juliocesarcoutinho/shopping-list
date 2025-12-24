package br.com.shooping.list.interfaces.rest.v1;

import br.com.shooping.list.application.dto.RegisterRequest;
import br.com.shooping.list.application.dto.RegisterResponse;
import br.com.shooping.list.application.usecase.RegisterUserUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST para operações de autenticação
 * Base path: /api/v1/auth
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;

    /**
     * Endpoint para registro de novo usuário LOCAL
     *
     * @param request dados do usuário (email, nome, senha)
     * @return usuário criado (sem dados sensíveis)
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Requisição de registro recebida para email: {}", request.getEmail());

        RegisterResponse response = registerUserUseCase.execute(request);

        log.info("Usuário registrado com sucesso: id={}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

