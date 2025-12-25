package br.com.shooping.list.interfaces.rest.v1;

import br.com.shooping.list.application.dto.auth.LoginRequest;
import br.com.shooping.list.application.dto.auth.LoginResponse;
import br.com.shooping.list.application.dto.auth.RefreshTokenRequest;
import br.com.shooping.list.application.dto.auth.RefreshTokenResponse;
import br.com.shooping.list.application.dto.auth.RegisterRequest;
import br.com.shooping.list.application.dto.auth.RegisterResponse;
import br.com.shooping.list.application.usecase.LoginUserUseCase;
import br.com.shooping.list.application.usecase.RefreshTokenUseCase;
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
    private final RefreshTokenUseCase refreshTokenUseCase;

    /**
     * Endpoint para registro de novo usuário LOCAL
     *
     * @param request dados do usuário (email, nome, senha)
     * @return usuário criado (sem dados sensíveis)
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Requisição de registro recebida para email: {}", request.getEmail());

        var response = registerUserUseCase.execute(request);

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

        var response = loginUserUseCase.execute(request, userAgent, ip);

        log.info("Login realizado com sucesso para email: {}", request.getEmail());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para renovação de access token via refresh token
     *
     * @param request refresh token a ser validado e rotacionado
     * @param httpRequest requisição HTTP para extrair metadata
     * @return novo access token e novo refresh token (rotacionado)
     */
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpRequest
    ) {
        log.info("Requisição de refresh token recebida");

        String userAgent = httpRequest.getHeader("User-Agent");
        String ip = extractClientIp(httpRequest);

        var response = refreshTokenUseCase.execute(request, userAgent, ip);

        log.info("Refresh token rotacionado com sucesso");
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
