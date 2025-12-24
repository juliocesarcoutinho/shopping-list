package br.com.shooping.list.domain.user;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "tb_user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "password_hash", columnDefinition = "TEXT")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuthProvider provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // Construtor para criação via LOCAL
    private User(String email, String name, String passwordHash, AuthProvider provider) {
        validateLocalUser(email, name, passwordHash, provider);
        this.email = email;
        this.name = name;
        this.passwordHash = passwordHash;
        this.provider = provider;
        this.status = UserStatus.ACTIVE;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Construtor para criação via GOOGLE
    private User(String email, String name, AuthProvider provider) {
        validateGoogleUser(email, name, provider);
        this.email = email;
        this.name = name;
        this.passwordHash = null;
        this.provider = provider;
        this.status = UserStatus.ACTIVE;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Factory method para usuário LOCAL
    public static User createLocalUser(String email, String name, String passwordHash) {
        return new User(email, name, passwordHash, AuthProvider.LOCAL);
    }

    // Factory method para usuário GOOGLE
    public static User createGoogleUser(String email, String name) {
        return new User(email, name, AuthProvider.GOOGLE);
    }

    // Validações
    private void validateLocalUser(String email, String name, String passwordHash, AuthProvider provider) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email não pode ser vazio");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        if (provider == AuthProvider.LOCAL && (passwordHash == null || passwordHash.isBlank())) {
            throw new IllegalArgumentException("Password hash é obrigatório para usuários LOCAL");
        }
    }

    private void validateGoogleUser(String email, String name, AuthProvider provider) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email não pode ser vazio");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        if (provider != AuthProvider.GOOGLE) {
            throw new IllegalArgumentException("Provider deve ser GOOGLE");
        }
    }

    // Métodos de negócio
    public void disable() {
        this.status = UserStatus.DISABLED;
        this.updatedAt = Instant.now();
    }

    public void activate() {
        this.status = UserStatus.ACTIVE;
        this.updatedAt = Instant.now();
    }

    public void updateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        this.name = name;
        this.updatedAt = Instant.now();
    }

    public void updatePassword(String passwordHash) {
        if (this.provider != AuthProvider.LOCAL) {
            throw new IllegalStateException("Não é possível alterar senha de usuário não LOCAL");
        }
        if (passwordHash == null || passwordHash.isBlank()) {
            throw new IllegalArgumentException("Password hash não pode ser vazio");
        }
        this.passwordHash = passwordHash;
        this.updatedAt = Instant.now();
    }

    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }

    public boolean isLocal() {
        return this.provider == AuthProvider.LOCAL;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
