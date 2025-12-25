package br.com.shooping.list.infrastructure.security;

import br.com.shooping.list.domain.user.Role;
import br.com.shooping.list.domain.user.User;
import br.com.shooping.list.domain.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Filtro de autenticação JWT que intercepta todas as requisições.
 * Responsabilidades:
 * - Extrair token JWT do header Authorization (formato: "Bearer {token}")
 * - Validar o token usando JwtService
 * - Extrair claims do token (userId, email, etc)
 * - Buscar roles do usuário no banco de dados
 * - Criar objeto Authentication e colocar no SecurityContext
 * - Permitir que a requisição continue se o token for válido
 * Este filtro é executado UMA VEZ por requisição (OncePerRequestFilter)
 * antes do filtro de autorização do Spring Security.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final int BEARER_PREFIX_LENGTH = 7;

    private final JwtService jwtService;
    private final UserRepository userRepository;

    /**
     * Método principal do filtro, executado para cada requisição HTTP.
     *
     * @param request     requisição HTTP
     * @param response    resposta HTTP
     * @param filterChain cadeia de filtros do Spring Security
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            // 1. Extrair token do header Authorization
            String token = extractTokenFromRequest(request);

            // 2. Se não houver token, continua sem autenticação (rotas públicas)
            if (token == null) {
                log.debug("Nenhum token JWT encontrado na requisição: {} {}",
                         request.getMethod(), request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }

            // 3. Se já existe autenticação no contexto, não sobrescreve
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                log.debug("Usuário já autenticado no contexto de segurança");
                filterChain.doFilter(request, response);
                return;
            }

            // 4. Validar token (lança exceção se inválido/expirado)
            jwtService.validateToken(token);

            // 5. Extrair informações do usuário do token
            String userId = jwtService.extractUserId(token);
            String email = jwtService.extractEmail(token);

            log.debug("Token JWT válido para userId={}, email={}", userId, email);

            // 6. Buscar usuário e suas roles do banco de dados
            User user = userRepository.findById(Long.parseLong(userId))
                    .orElseThrow(() -> {
                        log.warn("Usuário não encontrado no banco: userId={}", userId);
                        return new IllegalArgumentException("Usuário não encontrado");
                    });

            // 7. Converter roles do usuário em authorities do Spring Security
            List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority(role.getNameWithPrefix()))
                    .collect(Collectors.toList());

            log.debug("Roles carregadas para userId={}: {}", userId,
                    user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));

            // 8. Criar objeto Authentication com roles dinâmicas
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,        // Principal (identificador do usuário)
                            null,          // Credentials (não precisamos da senha aqui)
                            authorities    // Authorities/Roles do banco
                    );

            // 9. Adicionar detalhes da requisição (IP, session, etc)
            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            // 10. Colocar autenticação no contexto do Spring Security
            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.info("Usuário autenticado via JWT: userId={}, email={}, roles={}",
                    userId, email, authorities.stream().map(SimpleGrantedAuthority::getAuthority).collect(Collectors.toList()));

            // 11. Continuar com a cadeia de filtros
            filterChain.doFilter(request, response);

        } catch (Exception ex) {
            // Qualquer exceção (token inválido, expirado, usuário não encontrado) limpa o contexto
            // e continua o filter chain. O AuthorizationFilter vai detectar que
            // não há autenticação e o JwtAuthenticationEntryPoint vai tratar.
            log.warn("Erro ao processar token JWT: {}", ex.getMessage());

            // Limpa o contexto de segurança se houver erro
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
        }
    }

    /**
     * Extrai o token JWT do header Authorization.
     * Formato esperado: "Authorization: Bearer {token}"
     *
     * @param request requisição HTTP
     * @return token JWT (sem o prefixo "Bearer ") ou null se não existir
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);

        // Verifica se o header existe e começa com "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith(BEARER_PREFIX)) {
            String token = authorizationHeader.substring(BEARER_PREFIX_LENGTH);

            // Valida que o token não está vazio após remover o prefixo
            if (!token.isBlank()) {
                return token;
            }
        }

        return null;
    }

    /**
     * Define se o filtro deve ser executado para a requisição atual.
     * <p>
     * Por padrão, executa para TODAS as requisições.
     * Rotas públicas são tratadas pela ausência de token.
     *
     * @param request requisição HTTP
     * @return true para executar o filtro, false para pular
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        // Executa para todas as requisições
        // A diferenciação entre público/protegido é feita pela presença do token
        // e pela configuração do SecurityFilterChain
        return false;
    }
}

