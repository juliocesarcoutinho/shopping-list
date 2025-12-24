package br.com.shooping.list.application.usecase;

import br.com.shooping.list.application.dto.LoginRequest;
import br.com.shooping.list.application.dto.LoginResponse;
import br.com.shooping.list.domain.user.RefreshToken;
import br.com.shooping.list.domain.user.RefreshTokenRepository;
import br.com.shooping.list.domain.user.User;
import br.com.shooping.list.domain.user.UserRepository;
import br.com.shooping.list.domain.user.UserStatus;
import br.com.shooping.list.infrastructure.exception.InvalidCredentialsException;
import br.com.shooping.list.infrastructure.security.JwtProperties;
import br.com.shooping.list.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

/**
 * Caso de uso: Login de usuário LOCAL
 *
 * Responsabilidades:
 * - Validar credenciais (email/senha)
 * - Validar status do usuário (ACTIVE)
 * - Gerar access token (JWT)
 * - Gerar refresh token (UUID + hash)
 * - Persistir refresh token
 * - Retornar tokens
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LoginUserUseCase {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    @Transactional
    public LoginResponse execute(LoginRequest request, String userAgent, String ip) {
        log.info("Tentativa de login para email={}", request.getEmail());

        // Buscar usuário por email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login falhou: usuário não encontrado para email={}", request.getEmail());
                    return new InvalidCredentialsException("Credenciais inválidas");
                });

        // Validar senha
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Login falhou: senha incorreta para email={}", request.getEmail());
            throw new InvalidCredentialsException("Credenciais inválidas");
        }

        // Validar status ACTIVE
        if (user.getStatus() != UserStatus.ACTIVE) {
            log.warn("Login falhou: usuário inativo para email={}", request.getEmail());
            throw new InvalidCredentialsException("Usuário inativo");
        }

        log.info("Credenciais válidas para userId={}, email={}", user.getId(), user.getEmail());

        // Gerar access token (JWT)
        String accessToken = jwtService.generateAccessToken(user);
        long expiresIn = jwtProperties.getAccessToken().getExpiration().getSeconds();

        // Gerar refresh token (UUID)
        String refreshTokenValue = UUID.randomUUID().toString();

        // Fazer hash do refresh token (SHA-256)
        String refreshTokenHash = hashToken(refreshTokenValue);

        // Calcular expiração do refresh token
        Instant refreshTokenExpiration = Instant.now()
                .plus(jwtProperties.getRefreshToken().getExpiration());

        // Criar e persistir refresh token
        RefreshToken refreshToken = RefreshToken.create(
                user,
                refreshTokenHash,
                refreshTokenExpiration,
                userAgent,
                ip
        );
        refreshTokenRepository.save(refreshToken);

        log.info("Refresh token criado para userId={}, expiresAt={}", user.getId(), refreshTokenExpiration);
        log.info("Login realizado com sucesso para userId={}, email={}", user.getId(), user.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .expiresIn(expiresIn)
                .build();
    }

    /**
     * Gera hash SHA-256 do token para armazenamento seguro
     */
    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            log.error("Erro ao gerar hash do refresh token", e);
            throw new RuntimeException("Erro ao processar refresh token", e);
        }
    }
}

