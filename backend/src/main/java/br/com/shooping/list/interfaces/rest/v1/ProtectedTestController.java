package br.com.shooping.list.interfaces.rest.v1;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controller de teste para validar endpoints protegidos.
 * Este endpoint requer autenticação JWT.
 */
@RestController
@RequestMapping("/api/v1/protected")
public class ProtectedTestController {

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> protectedEndpoint() {
        return ResponseEntity.ok(Map.of(
                "message", "Este endpoint está protegido!",
                "status", "authenticated"
        ));
    }
}

