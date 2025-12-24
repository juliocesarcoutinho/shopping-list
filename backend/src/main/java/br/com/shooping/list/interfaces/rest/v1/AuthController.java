package br.com.shooping.list.interfaces.rest.v1;

import br.com.shooping.list.application.dto.LoginRequest;
import br.com.shooping.list.application.dto.LoginResponse;
import br.com.shooping.list.application.dto.RegisterRequest;
import br.com.shooping.list.application.dto.RegisterResponse;
import br.com.shooping.list.application.usecase.LoginUserUseCase;
import br.com.shooping.list.application.usecase.RegisterUserUseCase;
import jakarta.servlet.http.HttpServletRequest;
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
    private final LoginUserUseCase loginUserUseCase;

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

    /**
     * Endpoint para login de usuário LOCAL
     *
     * @param request dados de login (email, senha)
     * @param httpRequest requisição HTTP para extrair metadata
     * @return tokens de acesso e refresh
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        log.info("Requisição de login recebida para email: {}", request.getEmail());

        String userAgent = httpRequest.getHeader("User-Agent");
        String ip = extractClientIp(httpRequest);

        LoginResponse response = loginUserUseCase.execute(request, userAgent, ip);

        log.info("Login realizado com sucesso para email: {}", request.getEmail());
        return ResponseEntity.ok(response);
    }

    /**
     * Extrai o IP real do cliente, considerando proxies e load balancers
     */
    private String extractClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // Se houver múltiplos IPs (proxy chain), pega o primeiro
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
