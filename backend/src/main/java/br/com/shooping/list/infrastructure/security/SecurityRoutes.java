package br.com.shooping.list.infrastructure.security;

/**
 * Documentação de rotas públicas e protegidas da aplicação.
 * <p>
 * Esta classe serve como referência centralizada para entender
 * quais endpoints são públicos e quais requerem autenticação.
 */
public final class SecurityRoutes {

    private SecurityRoutes() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Rotas públicas - não requerem autenticação.
     */
    public static final class Public {

        /**
         * Health check da aplicação.
         * GET /api/v1/health
         * GET /actuator/health
         */
        public static final String HEALTH = "/api/v1/health";
        public static final String ACTUATOR_HEALTH = "/actuator/health";

        /**
         * Autenticação e registro.
         * POST /api/v1/auth/login - Login com email/senha
         * POST /api/v1/auth/register - Registro de novo usuário
         * POST /api/v1/auth/refresh - Refresh de access token
         * POST /api/v1/auth/google - Login via Google OAuth
         */
        public static final String AUTH_BASE = "/api/v1/auth/**";
        public static final String AUTH_LOGIN = "/api/v1/auth/login";
        public static final String AUTH_REGISTER = "/api/v1/auth/register";
        public static final String AUTH_REFRESH = "/api/v1/auth/refresh";
        public static final String AUTH_GOOGLE = "/api/v1/auth/google";

        /**
         * Console H2 (apenas desenvolvimento).
         * /h2-console/**
         */
        public static final String H2_CONSOLE = "/h2-console/**";

        /**
         * Documentação OpenAPI/Swagger (quando habilitado).
         * /v3/api-docs/**
         * /swagger-ui/**
         * /swagger-ui.html
         */
        public static final String SWAGGER_API_DOCS = "/v3/api-docs/**";
        public static final String SWAGGER_UI = "/swagger-ui/**";
        public static final String SWAGGER_UI_HTML = "/swagger-ui.html";

        /**
         * Página de erro do Spring Boot.
         * /error
         */
        public static final String ERROR = "/error";

        private Public() {
            throw new UnsupportedOperationException("Utility class");
        }

        /**
         * Rotas protegidas - requerem autenticação JWT.
         */
        public static final class Protected {

            /**
             * Gerenciamento de perfil do usuário.
             * GET /api/v1/users/me - Dados do usuário autenticado
             * PUT /api/v1/users/me - Atualizar dados do usuário
             * DELETE /api/v1/users/me - Deletar conta
             */
            public static final String USER_PROFILE = "/api/v1/users/me";

            /**
             * Logout (revogação de tokens).
             * POST /api/v1/auth/logout - Revoga refresh token atual
             * POST /api/v1/auth/logout-all - Revoga todos os refresh tokens
             */
            public static final String AUTH_LOGOUT = "/api/v1/auth/logout";
            public static final String AUTH_LOGOUT_ALL = "/api/v1/auth/logout-all";

            /**
             * Recursos da aplicação (a serem implementados).
             * /api/v1/shopping-lists/**
             * /api/v1/items/**
             */
            public static final String SHOPPING_LISTS = "/api/v1/shopping-lists/**";
            public static final String ITEMS = "/api/v1/items/**";

            private Protected() {
                throw new UnsupportedOperationException("Utility class");
            }
        }
    }
}

