# Shopping List API

Backend da aplicação **Shopping List**, desenvolvido com **Java LTS** e **Spring Boot**, seguindo princípios de **Clean Architecture**, **SOLID** e boas práticas de desenvolvimento.

> 🚧 Projeto em fase inicial (bootstrap da aplicação).

---

## 🚀 Tecnologias Utilizadas

- **Java 21 (LTS)**
- **Spring Boot 3.4.1**
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - Validation
  - Actuator
- **Maven**
- **JUnit 5**
- **Lombok**
- **MySQL 9** (Desenvolvimento)
- **H2 Database** (Testes)
- **Docker & Docker Compose**
- **Hikari CP** (Connection Pool)
- **Flyway** (Database Migrations)
- **BCrypt** (Password Hashing)
- **JWT (JSON Web Token)** - jjwt-api, jjwt-impl, jjwt-jackson
- **Spring Dotenv** - Carregamento automático de variáveis .env

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Java LTS** configurado no PATH
- **Maven Wrapper** (já incluso no projeto)
- **Git**
- **Docker** e **Docker Compose**

Para verificar:
```bash
java -version
docker --version
docker compose version
```

---

## 🐳 Banco de Dados (MySQL com Docker)

O projeto utiliza MySQL como banco de dados, executado em container Docker para facilitar o desenvolvimento local.

### Configuração

As credenciais e configurações do banco são definidas no arquivo `.env` na raiz do projeto:

```env
# MySQL
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=shoppinglist_db
MYSQL_USER=admin
MYSQL_PASSWORD=admin
MYSQL_PORT=3306

# JWT (⚠️ OBRIGATÓRIO - Mínimo 32 caracteres / 256 bits)
JWT_SECRET=sua-chave-super-secreta-com-minimo-32-caracteres-aqui
JWT_ISSUER=shopping-list-api

# Application
APP_NAME=shopping-list
PROFILE=dev
```

> ⚠️ **Importante:** 
> - O arquivo `.env` contém credenciais sensíveis e **não deve ser commitado** no repositório
> - Use o arquivo `.env.example` como referência
> - **JWT_SECRET deve ter no mínimo 32 caracteres** (256 bits) para HS256
> - Gere um secret seguro: `openssl rand -base64 32`

### Comandos Docker

#### Subir o container MySQL
```bash
docker compose up -d
```

#### Verificar status do container
```bash
docker compose ps
```

#### Ver logs do MySQL
```bash
docker compose logs -f mysql
```

#### Parar o container
```bash
docker compose down
```

#### Remover container e dados (⚠️ cuidado: apaga todos os dados)
```bash
docker compose down -v
```

### Conexão com o Banco

Após subir o container, você pode conectar ao MySQL usando:

- **Host:** `localhost`
- **Porta:** `3306` (ou a porta definida em `MYSQL_PORT`)
- **Database:** `shoppinglist_db`
- **Usuário:** `admin`
- **Senha:** `admin`

**String de conexão:**
```
jdbc:mysql://localhost:3306/shoppinglist_db
```

### Health Check

O container possui verificação automática de saúde (healthcheck) que testa a conexão com o MySQL a cada 10 segundos.

### Configuração do Datasource (Profile Dev)

No perfil `dev`, a aplicação está configurada para conectar automaticamente ao MySQL usando as variáveis de ambiente do `.env`:

#### **Datasource**
- **Driver:** MySQL Connector/J (`com.mysql.cj.jdbc.Driver`)
- **URL:** `jdbc:mysql://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}`
- **Pool de Conexões:** HikariCP

#### **HikariCP (Connection Pool)**
- `maximum-pool-size`: 10 conexões
- `minimum-idle`: 5 conexões ociosas
- `connection-timeout`: 30 segundos
- `idle-timeout`: 30 segundos
- `max-lifetime`: 10 minutos

#### **JPA/Hibernate**
- `ddl-auto`: **update** (cria/atualiza schema automaticamente no dev)
- `show-sql`: true (exibe SQL no console)
- `format_sql`: true (formata SQL para melhor legibilidade)
- `use_sql_comments`: true (adiciona comentários no SQL gerado)

> ⚠️ **Importante:** O `ddl-auto: update` está configurado apenas para **desenvolvimento**. Em produção, use `validate` ou `none` e gerencie o schema via migrations (Flyway/Liquibase).

---

## ▶️ Como executar o projeto

### 1️⃣ Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd shopping-list/backend
```

### 2️⃣ Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e ajuste as credenciais se necessário:
```bash
cp .env.example .env
```

### 3️⃣ Subir o banco de dados MySQL
```bash
docker compose up -d
```

Aguarde alguns segundos para o MySQL inicializar completamente. Você pode verificar o status com:
```bash
docker compose logs -f mysql
```

### 4️⃣ Executar a aplicação
```bash
./mvnw spring-boot:run
```

> Em ambientes Windows:
```bash
mvnw spring-boot:run
```

### 5️⃣ Perfis de Execução

A aplicação suporta diferentes perfis de configuração:

#### **test** (padrão)
Perfil para testes automatizados com banco de dados em memória
- **Banco de dados:** H2 em memória (modo MySQL)
- **Hibernate ddl-auto:** create-drop (recria schema a cada execução)
- **Isolamento:** Banco zerado a cada execução de teste
- **Performance:** Rápido, sem dependência de Docker
- **Logs:** SQL desabilitado para testes mais limpos
- **CI/CD friendly:** Funciona em qualquer ambiente

#### **dev**
Perfil para desenvolvimento local com logs detalhados e conexão MySQL
- **Datasource:** Conecta ao MySQL via Docker
- **Hibernate ddl-auto:** update (gerencia schema automaticamente)
- **Logs detalhados:**
  - **root**: INFO
  - **com.shoppinglist**: DEBUG
  - **org.springframework.web**: DEBUG
  - **org.hibernate.SQL**: DEBUG
  - **org.hibernate.orm.jdbc.bind**: TRACE
- **Connection Pool:** HikariCP com 10 conexões máximas

Para executar com um perfil específico:

```bash
# Desenvolvimento (com MySQL)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Teste (com H2 em memória)
./mvnw spring-boot:run -Dspring-boot.run.profiles=test
```

Ou definindo a variável de ambiente:
```bash
export PROFILE=dev
./mvnw spring-boot:run
```

> **Nota:** Por padrão, se nenhum perfil for especificado, a aplicação usará o perfil **test**.

---

## 🔎 Verificando se a aplicação está no ar

### Health Check (Actuator)
Endpoint padrão do Spring Boot Actuator:
```
http://localhost:8080/actuator/health
```

Resposta esperada:
```json
{
  "status": "UP"
}
```

### Health Check Customizado (API v1)
Endpoint customizado seguindo a arquitetura da aplicação:
```
http://localhost:8080/api/v1/health
```

Resposta esperada:
```json
{
  "status": "UP"
}
```

---

## 🧪 Executando os testes

Os testes utilizam **H2 Database em memória**, garantindo isolamento e performance sem depender do MySQL ou Docker.

### Executar todos os testes
```bash
./mvnw test
```

### Executar em modo silencioso
```bash
./mvnw -q test
```

### Executar testes de uma classe específica
```bash
./mvnw test -Dtest=HealthControllerTest
```

### Características dos Testes

- ✅ **Banco H2 em memória** com modo de compatibilidade MySQL
- ✅ **Schema recriado automaticamente** a cada execução (`ddl-auto: create-drop`)
- ✅ **Isolamento total** entre execuções
- ✅ **Rápido**: Não depende de containers Docker
- ✅ **CI/CD friendly**: Funciona em qualquer ambiente (GitHub Actions, GitLab CI, etc.)
- ✅ **Sem configuração adicional**: Basta rodar `mvn test`

### Console H2 (Debug)

Para inspecionar o banco durante os testes (útil para debug):

1. Adicione um breakpoint no teste
2. Acesse: `http://localhost:8080/h2-console`
3. Configure:
   - **JDBC URL:** `jdbc:h2:mem:testdb`
   - **User:** `sa`
   - **Password:** (deixe vazio)

### Estatísticas de Testes

```
📊 Cobertura de Testes (última execução)

Testes Unitários:
  ✅ RegisterUserUseCase     : 6 testes (100% passed)
  ✅ LoginUserUseCase        : 7 testes (100% passed)
  ✅ JwtService             : 13 testes (100% passed)
  Total: 26 testes unitários

Testes de Integração:
  ✅ AuthController (Register) : 6 testes (100% passed)
  ✅ AuthController (Login)    : 10 testes (100% passed)
  ✅ HealthController          : 1 teste  (100% passed)
  ✅ SecurityConfig            : 5 testes (83% passed - 1 failure conhecido)
  Total: 22 testes de integração

📈 Total Geral: 48 testes | 47 passing | 1 known issue
⚡ Tempo médio de execução: ~12 segundos
```

---

## 📦 Estrutura do Projeto

```text
backend/
├── docker-compose.yml
├── .env (não versionado)
├── .env.example
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── br.com.shooping.list
    │   │       ├── StartupApplication.java
    │   │       ├── application
    │   │       │   ├── dto
    │   │       │   │   ├── ErrorResponse.java
    │   │       │   │   ├── HealthResponse.java
    │   │       │   │   ├── RegisterRequest.java
    │   │       │   │   └── RegisterResponse.java
    │   │       │   └── usecase
    │   │       │       └── RegisterUserUseCase.java
    │   │       ├── domain
    │   │       │   └── user
    │   │       │       ├── AuthProvider.java
    │   │       │       ├── RefreshToken.java
    │   │       │       ├── RefreshTokenRepository.java
    │   │       │       ├── User.java
    │   │       │       └── UserRepository.java
    │   │       ├── infrastructure
    │   │       │   ├── exception
    │   │       │   │   ├── EmailAlreadyExistsException.java
    │   │       │   │   ├── ExpiredJwtException.java
    │   │       │   │   ├── GlobalExceptionHandler.java
    │   │       │   │   ├── InvalidCredentialsException.java
    │   │       │   │   └── InvalidJwtException.java
    │   │       │   ├── persistence
    │   │       │   │   └── user
    │   │       │   │       ├── JpaRefreshTokenRepository.java
    │   │       │   │       └── JpaUserRepository.java
    │   │       │   └── security
    │   │       │       ├── CorsProperties.java
    │   │       │       ├── JwtAuthenticationEntryPoint.java
    │   │       │       ├── JwtProperties.java
    │   │       │       ├── JwtService.java
    │   │       │       ├── SecurityConfig.java
    │   │       │       └── SecurityRoutes.java
    │   │       └── interfaces
    │   │           └── rest
    │   │               └── v1
    │   │                   ├── AuthController.java
    │   │                   ├── HealthController.java
    │   │                   └── ProtectedTestController.java
    │   └── resources
    │       ├── application.yml
    │       ├── application-dev.yml
    │       ├── application-test.yml
    │       └── db
    │           └── migration
    │               ├── V1__create_users.sql
    │               └── V2__create_refresh_tokens.sql
    └── test
        └── java
            └── br.com.shooping.list
                ├── StartupApplicationTests.java
                ├── application
                │   └── usecase
                │       ├── LoginUserUseCaseTest.java
                │       ├── LoginUserUseCaseTest.java
                │       └── RegisterUserUseCaseTest.java
                ├── infrastructure
                │   └── security
                │       ├── JwtServiceTest.java
                │       └── SecurityConfigTest.java
                └── interfaces
                    └── rest
                        └── v1
                            ├── AuthControllerLoginTest.java
                            ├── AuthControllerTest.java
                            └── HealthControllerTest.java
                            └── HealthControllerTest.java
```

---

## 🧱 Arquitetura (Clean Architecture)

O projeto é organizado em camadas para manter responsabilidades bem separadas:

- **domain**: regras de negócio (Entidades, Value Objects, Aggregates, serviços de domínio, contratos de repositório).  
  Não depende de Spring nem de detalhes de infraestrutura.

- **application**: casos de uso (orquestração), DTOs e mapeamentos.  
  Depende do **domain**.

- **infrastructure**: detalhes técnicos (persistência, integrações, configurações).  
  Implementa contratos definidos nas camadas internas.

- **interfaces**: entrada/saída da aplicação (Controllers REST, handlers, modelos de API).  
  Chama os casos de uso da camada **application**.

**Regra de dependência:** `interfaces -> application -> domain` e `infrastructure -> application/domain` (nunca o contrário).

---

## ✅ Funcionalidades Implementadas

### Health Check Endpoint
- **Endpoint:** `GET /api/v1/health`
- **Descrição:** Verifica o status da aplicação
- **Resposta:**
  ```json
  {
    "status": "UP"
  }
  ```
- **Camadas utilizadas:**
  - `interfaces/rest/v1`: HealthController (camada de apresentação)
  - `application/dto`: HealthResponse (DTO de resposta)
- **Testes:** Teste de integração com `@WebMvcTest` validando o comportamento do endpoint

### Registro de Usuário (User Registration)
- **Endpoint:** `POST /api/v1/auth/register`
- **Descrição:** Registra novo usuário LOCAL com email e senha
- **Request Body:**
  ```json
  {
    "email": "usuario@exemplo.com",
    "name": "João Silva",
    "password": "senha@Segura123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": 1,
    "email": "usuario@exemplo.com",
    "name": "João Silva",
    "provider": "LOCAL",
    "status": "ACTIVE",
    "createdAt": "2025-12-24T18:52:34.741Z"
  }
  ```
- **Validações:**
  - Email obrigatório e formato válido
  - Nome obrigatório (3-150 caracteres)
  - Senha obrigatória (8-100 caracteres)
  - Email deve ser único no sistema
- **Segurança:**
  - Senha armazenada com **BCrypt hash** (10 rounds)
  - Senha **nunca exposta** em logs ou respostas
  - Validação de email duplicado antes de criar usuário
- **Erros tratados:**
  - `400 Bad Request`: Validação de campos (email inválido, senha curta, campos obrigatórios)
  - `409 Conflict`: Email já cadastrado
  - `500 Internal Server Error`: Erros inesperados
- **Camadas utilizadas:**
  - `interfaces/rest/v1`: AuthController (endpoint REST)
  - `application/usecase`: RegisterUserUseCase (orquestração transacional)
  - `application/dto`: RegisterRequest, RegisterResponse (DTOs validados)
  - `domain/user`: User (agregado), UserRepository (port)
  - `infrastructure/persistence`: JpaUserRepository (adapter)
  - `infrastructure/exception`: EmailAlreadyExistsException, GlobalExceptionHandler
- **Testes:**
  - 6 testes unitários do use case (validações, hash de senha, email duplicado)
  - 6 testes de integração end-to-end (cenários de sucesso e falha)

**Exemplo de uso (cURL):**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "name": "João Silva",
    "password": "senha@123"
  }'
```

### Login de Usuário (User Login)
- **Endpoint:** `POST /api/v1/auth/login`
- **Descrição:** Autentica usuário LOCAL e retorna tokens de acesso
- **Request Body:**
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha@Segura123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6IkxPQ0FMIiwibmFtZSI6Ikpvw6NvIFNpbHZhIiwiZW1haWwiOiJ0ZXN0ZUBlbWFpbC5jb20iLCJzdWIiOiIxIiwiaXNzIjoic2hvcHBpbmctbGlzdC1hcGkiLCJpYXQiOjE3NjY2MDQ0MjIsImV4cCI6MTc2NjYwODAyMn0...",
    "refreshToken": "49a6336d-5649-466a-afeb-beee6b2f31d0",
    "expiresIn": 3600
  }
  ```
- **Validações:**
  - Email obrigatório e formato válido
  - Senha obrigatória
  - Usuário deve existir e estar ativo (status ACTIVE)
  - Senha deve corresponder ao hash armazenado
- **Segurança:**
  - **Access Token (JWT):** Token assinado com HS256, expira em 1 hora (configurável)
  - **Refresh Token (UUID):** Token único para renovação, expira em 7 dias (configurável)
  - Refresh token **armazenado como hash SHA-256** no banco (nunca em texto puro)
  - Senha validada com **BCrypt**
  - Metadata capturada: User-Agent, IP (para auditoria e segurança)
  - Logs estruturados para tentativas de login
- **Erros tratados:**
  - `400 Bad Request`: Validação de campos (email inválido, campos obrigatórios)
  - `401 Unauthorized`: Credenciais inválidas (email não existe, senha incorreta, usuário inativo)
  - `500 Internal Server Error`: Erros inesperados
- **Fluxo de segurança do Refresh Token:**
  1. Gerado UUID único: `49a6336d-5649-466a-afeb-beee6b2f31d0`
  2. Hash SHA-256 calculado: `8Zv+9kF3pL2mN4qR7tY1wX5cA0bD6eH8...`
  3. **Banco armazena:** Apenas o hash SHA-256
  4. **Cliente recebe:** UUID em texto puro
  5. **Validação futura:** Cliente envia UUID → Hasheamos → Comparamos com banco
- **Camadas utilizadas:**
  - `interfaces/rest/v1`: AuthController (endpoint REST com extração de metadata)
  - `application/usecase`: LoginUserUseCase (orquestração transacional)
  - `application/dto`: LoginRequest, LoginResponse (DTOs validados)
  - `domain/user`: User, RefreshToken, UserRepository, RefreshTokenRepository (ports)
  - `infrastructure/persistence`: JpaUserRepository, JpaRefreshTokenRepository (adapters)
  - `infrastructure/security`: JwtService (geração de access token)
  - `infrastructure/exception`: InvalidCredentialsException, GlobalExceptionHandler
- **Testes:**
  - 7 testes unitários do use case (credenciais válidas/inválidas, hash de token, usuário inativo)
  - 10 testes de integração end-to-end (sucesso, erros, persistência, metadata)

**Exemplo de uso (cURL):**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  -d '{
    "email": "teste@email.com",
    "password": "senha@123"
  }'
```

**Múltiplos logins:** A API permite múltiplos logins simultâneos do mesmo usuário (ex: web + mobile). Cada login gera um novo refresh token independente.

### Banco de Dados MySQL
- **Container:** MySQL 9 via Docker Compose
- **Configuração:** Credenciais via arquivo `.env`
- **Volume persistente:** Dados mantidos em volume Docker (`mysql-data`)
- **Health Check:** Verificação automática de disponibilidade do banco
- **Porta:** 3306 (configurável via `MYSQL_PORT`)
- **Database inicial:** `shoppinglist_db` criado automaticamente
- **Migrations:** Gerenciadas via Flyway (versionamento de schema)
  - `V1__create_users.sql`: Tabela de usuários com suporte LOCAL/GOOGLE
  - `V2__create_refresh_tokens.sql`: Tabela de refresh tokens com rotação e revogação

### Datasource e Persistência (Profile Dev)
- **Driver:** MySQL Connector/J
- **Connection Pool:** HikariCP com configuração otimizada
  - 10 conexões máximas
  - 5 conexões ociosas mínimas
  - Timeout de 30 segundos
- **JPA/Hibernate:**
  - Gerenciamento automático de schema (`ddl-auto: update`)
  - SQL logging habilitado com formatação
  - Dialect otimizado para MySQL
- **Integração:** Conecta automaticamente ao container Docker via variáveis de ambiente

### H2 Database para Testes (Profile Test)
- **Banco em memória:** Não requer instalação ou Docker
- **Modo MySQL:** Emula comportamento do MySQL para compatibilidade
- **Schema automático:** `ddl-auto: create-drop` (recria a cada execução)
- **Isolamento total:** Cada execução de teste tem banco limpo
- **Performance:** Muito mais rápido que banco persistente
- **CI/CD:** Funciona em qualquer ambiente sem configuração adicional
- **Console H2:** Disponível em `/h2-console` para debug
- **Credenciais:** `sa` / senha vazia

### Spring Security (Configuração Base)
- **Arquitetura:** Stateless (sem sessão no servidor)
- **CSRF:** Desabilitado (API REST stateless)
- **CORS:** Configurado para desenvolvimento (localhost:3000, 4200, 8080)
- **Rotas Públicas:**
  - `/api/v1/health` - Health check
  - `/api/v1/auth/**` - Endpoints de autenticação (login, register, refresh)
  - `/actuator/health` - Actuator health check
  - `/h2-console/**` - Console H2 (dev)
- **Rotas Protegidas:** Todas as demais rotas requerem autenticação JWT
- **Senha:** BCrypt com 10 rounds
- **HTTP 401:** Resposta customizada para requisições não autenticadas
- **Preparado para JWT:** Filtros e providers serão implementados nas próximas stories

### JWT Service (JSON Web Token)
- **Biblioteca:** jjwt (io.jsonwebtoken) versão 0.12.6
- **Algoritmo:** HS256 (HMAC SHA-256)
- **Secret Key:** 256 bits mínimo, configurável via `application.yml`
- **Access Token:**
  - **Tempo de expiração:** 15 minutos (configurável por profile)
  - **Claims incluídas:** userId (subject), email, name, provider, iat, exp, iss
- **Issuer:** `shopping-list-api` (identificador da aplicação)
- **Funcionalidades:**
  - Geração de access token para usuário autenticado
  - Validação de token (assinatura, expiração, estrutura)
  - Extração de claims (userId, email, name, provider)
  - Exceções customizadas (`ExpiredJwtException`, `InvalidJwtException`)
- **Testes:** 13 testes unitários validando geração, validação e casos de erro
- **Segurança:**
  - Secret key externalizado (não commitado)
  - Tokens assinados e verificados
  - Logs de segurança para tentativas inválidas

### Domínio User e RefreshToken (DDD)
- **Agregado User:**
  - Suporte a provedores: `LOCAL` (email/senha) e `GOOGLE` (OAuth2)
  - Status: `ACTIVE` ou `DISABLED`
  - Factory methods: `createLocalUser()`, `createGoogleUser()`
  - Regras de negócio: passwordHash obrigatório apenas para LOCAL
  - Métodos: `disable()`, `activate()`, `updatePassword()`, `updateName()`
- **Entidade RefreshToken:**
  - Relacionamento com User (many-to-one)
  - Suporte a rotação de tokens (`replacedByTokenId`)
  - Revogação explícita (`revokedAt`)
  - Metadata: `userAgent`, `ip`, `lastUsedAt`
  - Apenas hash do token armazenado (nunca o token em texto puro)
- **Repository Pattern:**
  - `UserRepository`: Port (interface no domínio)
  - `JpaUserRepository`: Adapter (implementação Spring Data JPA)
  - Métodos: `save()`, `findByEmail()`, `existsByEmail()`, `findById()`, `deleteAll()`
- **Migrations Flyway:**
  - Schema versionado e rastreável
  - Constraints e índices essenciais
  - Suporte a rollback e auditoria

> 📖 **Documentação detalhada:** Veja [SECURITY.md](SECURITY.md) para guia completo de segurança

---

## 📌 Observações

- Este projeto está em desenvolvimento ativo.
- **Estratégia de banco por perfil:**
  - **dev**: MySQL via Docker para desenvolvimento local
  - **test**: H2 em memória para testes automatizados (sem Docker)
- **Schema gerenciado por:**
  - **Flyway** no perfil `dev` (migrations versionadas)
  - **Hibernate** (`ddl-auto: create-drop`) no perfil `test`
- **Credenciais sensíveis** devem ser mantidas no arquivo `.env` (não versionado):
  - Credenciais MySQL
  - JWT Secret (mínimo 256 bits / 32 caracteres para HS256)
  - **Importante:** Use `openssl rand -base64 32` para gerar secret seguro
- **Carregamento de .env:**
  - Biblioteca `spring-dotenv` carrega automaticamente o arquivo `.env` no startup
  - Variáveis disponíveis via `${NOME_VARIAVEL}` no `application.yml`
- **Arquitetura implementada:**
  - ✅ **Clean Architecture** com separação em 4 camadas
  - ✅ **DDD** (Domain-Driven Design) com agregados User e RefreshToken
  - ✅ **Repository Pattern** com ports e adapters
  - ✅ **Use Cases** na camada application (orquestração transacional)
  - ✅ **JWT Service** para geração e validação de tokens
  - ✅ **Refresh Token** com hash SHA-256 (nunca armazenado em texto puro)
  - ✅ **Global Exception Handler** com respostas padronizadas
  - ✅ **Bean Validation** com validações declarativas nos DTOs
  - ✅ **Flyway Migrations** para versionamento de schema
  - ✅ **Metadata de Sessão** (User-Agent, IP) para auditoria e segurança
- **Testes implementados:**
  - ✅ Testes unitários (use cases, services) - 26 testes
  - ✅ Testes de integração (controllers end-to-end) - 22 testes
  - ✅ Coverage de casos de sucesso e falha
  - ✅ Total: 48 testes | 47 passing
- **Funcionalidades de Autenticação:**
  - ✅ **Registro** de usuário LOCAL (POST /api/v1/auth/register)
  - ✅ **Login** de usuário com JWT + Refresh Token (POST /api/v1/auth/login)
  - 🔜 **Refresh Token** - Renovação de access token (POST /api/v1/auth/refresh)
  - 🔜 **JWT Authentication Filter** - Interceptação e validação de requests
  - 🔜 **Logout** - Revogação de refresh tokens
  - 🔜 **OAuth2 com Google** - Login social
- O foco continua sendo **build verde**, **startup limpo**, **testes passando** e **base arquitetural sólida**.

---

## 📝 Licença

Este projeto é de uso educacional e pessoal.
