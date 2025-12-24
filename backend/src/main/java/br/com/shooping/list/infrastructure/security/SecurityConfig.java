package br.com.shooping.list.infrastructure.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


/**
 * Configuração de segurança da aplicação.
 * <p>
 * Define:
 * - API stateless (sem sessão)
 * - CSRF desabilitado (API REST)
 * - CORS configurado para desenvolvimento
 * - Rotas públicas e protegidas
 * - Base para filtros JWT (a serem implementados)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    public SecurityConfig(JwtAuthenticationEntryPoint authenticationEntryPoint) {
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    private static final String[] PUBLIC_ENDPOINTS = {
            SecurityRoutes.Public.HEALTH,
            SecurityRoutes.Public.AUTH_BASE,
            SecurityRoutes.Public.ACTUATOR_HEALTH,
            SecurityRoutes.Public.H2_CONSOLE,
            // Swagger/OpenAPI (quando habilitado)
            SecurityRoutes.Public.SWAGGER_API_DOCS,
            SecurityRoutes.Public.SWAGGER_UI,
            SecurityRoutes.Public.SWAGGER_UI_HTML,
            SecurityRoutes.Public.ERROR
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desabilita CSRF (API stateless não precisa)
                .csrf(AbstractHttpConfigurer::disable)

                // Configura CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Configura gerenciamento de sessão como STATELESS
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Configura autorização de requisições
                .authorizeHttpRequests(auth -> auth
                        // Rotas públicas
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        // Todas as outras requisições precisam autenticação
                        .anyRequest().authenticated()
                )

                // Desabilita frame options para H2 Console (apenas dev)
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                )

                // Configura tratamento de exceções de autenticação
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint)
                );

        return http.build();
    }

    /**
     * Configuração CORS para desenvolvimento.
     * Em produção, deve ser mais restritivo.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origens permitidas (dev)
        configuration.setAllowedOrigins(CorsProperties.AllowedOrigins.getAll());

        // Métodos HTTP permitidos
        configuration.setAllowedMethods(CorsProperties.AllowedMethods.getAll());

        // Headers permitidos
        configuration.setAllowedHeaders(CorsProperties.AllowedHeaders.getAll());

        // Headers expostos
        configuration.setExposedHeaders(CorsProperties.ExposedHeaders.getAll());

        // Permite credenciais
        configuration.setAllowCredentials(CorsProperties.Config.ALLOW_CREDENTIALS);

        // Tempo de cache do preflight
        configuration.setMaxAge(CorsProperties.Config.MAX_AGE_SECONDS);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * Encoder de senhas usando BCrypt.
     * Usado para hash de senhas de usuários LOCAL.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

