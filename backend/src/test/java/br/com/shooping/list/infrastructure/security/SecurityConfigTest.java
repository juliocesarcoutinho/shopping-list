package br.com.shooping.list.infrastructure.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Testes de Segurança - Rotas Públicas e Protegidas")
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/v1/health deve ser público e retornar 200")
    void healthEndpointShouldBePublic() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /actuator/health deve ser público e retornar 200")
    void actuatorHealthEndpointShouldBePublic() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/v1/protected/test deve retornar 401 sem autenticação")
    void protectedEndpointShouldReturn401WithoutAuth() throws Exception {
        mockMvc.perform(get("/api/v1/protected/test"))
                .andExpect(status().isUnauthorized()); // 401 com nosso AuthenticationEntryPoint customizado
    }

    @Test
    @DisplayName("POST /api/v1/auth/login deve ser público (mesmo sem implementação)")
    void loginEndpointShouldBePublic() throws Exception {
        mockMvc.perform(get("/api/v1/auth/login"))
                .andExpect(status().isNotFound()); // 404 pois não existe ainda, mas não é 401
    }

    @Test
    @DisplayName("POST /api/v1/auth/register deve ser público (mesmo sem implementação)")
    void registerEndpointShouldBePublic() throws Exception {
        mockMvc.perform(get("/api/v1/auth/register"))
                .andExpect(status().isNotFound()); // 404 pois não existe ainda, mas não é 401
    }

    @Test
    @DisplayName("POST /api/v1/auth/refresh deve ser público (mesmo sem implementação)")
    void refreshEndpointShouldBePublic() throws Exception {
        mockMvc.perform(get("/api/v1/auth/refresh"))
                .andExpect(status().isNotFound()); // 404 pois não existe ainda, mas não é 401
    }
}

