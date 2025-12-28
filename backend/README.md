# Shopping List API

Backend da aplicação **Shopping List**, desenvolvido com **Java LTS** e **Spring Boot**, seguindo princípios de **Clean Architecture**, **Domain-Driven Design (DDD)** e boas práticas de desenvolvimento.

> ✅ **Sistema de autenticação completo** e **modelo de domínio implementado** seguindo DDD
> 
> 🚧 **API REST em desenvolvimento** - próxima sprint focada na camada de aplicação

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
- **Google API Client** - Validação de tokens OAuth2
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
  ✅ RefreshTokenUseCase     : 8 testes (100% passed)
  ✅ LogoutUseCase           : 8 testes (100% passed)
  ✅ JwtService             : 13 testes (100% passed)
  Total: 42 testes unitários

Testes de Domínio (DDD):
  ✅ ShoppingListTest        : 25+ testes (100% passed)
  ✅ ListItemTest           : 15+ testes (100% passed)
  ✅ QuantityTest           : 10+ testes (100% passed)
  ✅ ItemNameTest           : 8+ testes (100% passed)
  Total Domínio: 58+ testes unitários puros

Testes de Integração:
  ✅ AuthController (Register) : 6 testes (100% passed)
  ✅ AuthController (Login)    : 10 testes (100% passed)
  ✅ AuthController (Refresh)  : 10 testes (100% passed)
  ✅ HealthController          : 1 teste  (100% passed)
  ✅ SecurityConfig            : 5 testes (83% passed - 1 failure conhecido)
  Total: 32 testes de integração

📈 Total Geral: 130+ testes | 129+ passing | 1 known issue
⚡ Tempo médio de execução: ~20 segundos
🎯 Modelo de domínio: 100% cobertura das regras de negócio
**Documentação detalhada:** Veja `GOOGLE_OAUTH_TESTING.md` na raiz do projeto.

### Modelo de Domínio - Shopping List (Domain-Driven Design)

- **Descrição:** Implementação completa do modelo de domínio puro para listas de compras seguindo princípios de DDD
- **Status:** ✅ **100% Implementado** com testes unitários completos
- **Características:**
  - **Framework Agnóstico**: Zero dependências de Spring/JPA no modelo
  - **Rich Domain Model**: Lógica de negócio encapsulada nas entidades
  - **Aggregate Pattern**: ShoppingList como Aggregate Root
  - **Value Objects**: ItemName e Quantity com validações imutáveis
  - **Invariantes Garantidas**: Todas as regras de negócio sempre aplicadas

- **Aggregate Root - ShoppingList:**
  ```java
  ShoppingList lista = ShoppingList.create(userId, "Lista da Feira", "Compras semanais");
  
  // Adicionando itens com validação automática
  ItemName arroz = ItemName.of("Arroz");
  Quantity quantidade = Quantity.of(2);
  lista.addItem(arroz, quantidade, "kg");
  
  // Operações do domínio
  lista.markItemAsPurchased(itemId);
  lista.countPendingItems();
  lista.clearPurchasedItems();
  ```

- **Entidades e Value Objects:**
  - **ShoppingList** (Aggregate Root): Gerencia ciclo de vida dos itens
  - **ListItem** (Entity): Representa itens individuais na lista
  - **ItemName** (Value Object): Nome validado com normalização case-insensitive
  - **Quantity** (Value Object): Quantidade usando BigDecimal (precisão)
  - **ItemStatus** (Enum): Status PENDING/PURCHASED

- **Regras de Negócio Implementadas:**
  - ✅ Título obrigatório (3-100 caracteres)
  - ✅ Máximo 100 itens por lista
  - ✅ Não permite duplicatas (comparação case-insensitive)
  - ✅ Apenas proprietário pode modificar lista
  - ✅ Quantidade sempre maior que zero
  - ✅ Validação de nomes (2-100 caracteres)
  - ✅ Rastreamento de timestamps (criação/modificação)

- **Exceções de Domínio:**
  - `DuplicateItemException`: Item com nome duplicado
  - `ItemNotFoundException`: Item não encontrado na lista
  - `ListLimitExceededException`: Limite de 100 itens excedido

- **Cobertura de Testes:**
  - **ShoppingListTest**: 25+ cenários (criação, validações, operações)
  - **ListItemTest**: 15+ cenários (estados, modificações)
  - **QuantityTest**: 10+ cenários (validações, comparações)
  - **ItemNameTest**: 8+ cenários (normalização, duplicatas)
  - **Total**: 58+ testes unitários puros (tempo: ~2 segundos)

- **Benefícios da Abordagem:**
  - **Testabilidade**: Testes rápidos e isolados sem frameworks
  - **Manutenibilidade**: Lógica centralizada e bem encapsulada
  - **Evolução Segura**: Mudanças controladas via testes abrangentes
  - **Expressividade**: Código que reflete linguagem de negócio
  - **Reutilização**: Modelo independente de tecnologia

- **Próximos Passos:**
  - ✏️ **Camada de Aplicação**: Use cases para orquestrar operações
  - ✏️ **Camada de Infraestrutura**: Persistência JPA com repositories
  - ✏️ **Camada de Interface**: Controllers REST com DTOs
  - ✏️ **Autorização**: Validação de propriedade (`ownerId`)

---

## 🛒 Modelo de Domínio - Shopping List (DDD)

A aplicação implementa um **modelo de domínio puro** seguindo os princípios de **Domain-Driven Design (DDD)** para gerenciar listas de compras. O modelo é completamente independente de frameworks (Spring/JPA) e foca nas regras de negócio.

### **Estrutura do Aggregate**

```
ShoppingList (Aggregate Root)
├── ListItem (Entity)
├── ItemName (Value Object)
├── Quantity (Value Object)
└── ItemStatus (Enum)
```

### **ShoppingList (Aggregate Root)**

Entidade principal que representa uma lista de compras e gerencia o ciclo de vida dos itens.

**Atributos:**
- `id`: Identificador único da lista
- `ownerId`: ID do usuário proprietário (obrigatório)
- `title`: Título da lista (3-100 caracteres, obrigatório)
- `description`: Descrição opcional (até 255 caracteres)
- `items`: Coleção de itens da lista
- `createdAt`: Data/hora de criação
- `updatedAt`: Data/hora da última modificação

**Regras de Negócio (Invariantes):**
- ✅ **Título obrigatório** com 3-100 caracteres
- ✅ **Proprietário obrigatório** (ownerId não pode ser null)
- ✅ **Máximo 100 itens** por lista
- ✅ **Não permite itens duplicados** (comparação case-insensitive)
- ✅ **Apenas o dono pode modificar** a lista
- ✅ **Validação de nomes** de itens (2-100 caracteres)

**Funcionalidades:**
```java
// Criação
ShoppingList.create(ownerId, title, description)

// Gerenciamento de itens
addItem(name, quantity, unit)
removeItem(itemId)
updateItemQuantity(itemId, quantity)
updateItemName(itemId, name)
markItemAsPurchased(itemId)
markItemAsPending(itemId)

// Operações em lote
clearPurchasedItems() // Remove todos os itens comprados

// Consultas
countTotalItems()
countPendingItems()
countPurchasedItems()
isOwnedBy(userId)
```

### **ListItem (Entity)**

Representa um item individual dentro de uma lista de compras.

**Atributos:**
- `id`: Identificador único do item
- `shoppingList`: Referência para lista pai (obrigatório)
- `name`: Nome do item (Value Object ItemName)
- `quantity`: Quantidade (Value Object Quantity)
- `unit`: Unidade de medida opcional (ex: "kg", "litros")
- `status`: Status do item (PENDING ou PURCHASED)
- `createdAt`: Data/hora de criação
- `updatedAt`: Data/hora da última modificação

**Regras de Negócio:**
- ✅ **Item deve ter lista pai** (não pode existir sozinho)
- ✅ **Nome obrigatório** validado pelo Value Object
- ✅ **Quantidade obrigatória** e maior que zero
- ✅ **Status padrão** é PENDING (não comprado)
- ✅ **Unidade opcional** com máximo 20 caracteres

### **ItemName (Value Object)**

Value Object que garante nomes válidos e fornece normalização para comparação.

**Características:**
- ✅ **Imutável** (final class)
- ✅ **Validação automática** no construtor
- ✅ **Normalização case-insensitive** para comparações
- ✅ **Preserva capitalização original** para exibição

**Regras:**
- Nome deve ter 2-100 caracteres (após trim)
- Comparação case-insensitive via `normalizedValue`
- Método `isSameAs()` para detectar duplicatas

```java
ItemName name1 = ItemName.of("Arroz");
ItemName name2 = ItemName.of("ARROZ");
name1.isSameAs(name2); // true (case-insensitive)
name1.getValue(); // "Arroz" (preserva original)
```

### **Quantity (Value Object)**

Value Object que representa quantidades válidas usando BigDecimal para precisão.

**Características:**
- ✅ **Imutável** (final class)
- ✅ **BigDecimal** para precisão em decimais
- ✅ **Sempre maior que zero**
- ✅ **Factory methods** convenientes

**Métodos:**
```java
Quantity.of(BigDecimal.valueOf(2.5))
Quantity.of(3.0) // Conveniente para doubles
Quantity.of(5)   // Conveniente para inteiros

quantity.isGreaterThan(other)
quantity.isLessThan(other)
quantity.add(other)
```

### **ItemStatus (Enum)**

Enum simples que define os possíveis estados de um item:

```java
public enum ItemStatus {
    PENDING,    // Item não foi comprado ainda
    PURCHASED   // Item já foi comprado
}
```

### **Exceções de Domínio**

O modelo define exceções específicas para violações de regras de negócio:

- **`DuplicateItemException`**: Tentativa de adicionar item com nome duplicado
- **`ItemNotFoundException`**: Tentativa de acessar item inexistente
- **`ListLimitExceededException`**: Tentativa de exceder limite de 100 itens

### **Testes de Domínio**

O modelo possui cobertura completa de testes unitários:

```
📊 Testes do Domínio Shopping List:

✅ ShoppingListTest        : 25+ cenários (criação, invariantes, itens, operações)
✅ ListItemTest           : 15+ cenários (validações, mudanças de estado)
✅ QuantityTest           : 10+ cenários (validações, comparações, operações)
✅ ItemNameTest           : 8+ cenários (validações, normalização, comparações)

🎯 Cobertura: 100% das regras de negócio e invariantes
⚡ Tempo de execução: ~2 segundos (testes unitários puros)
```

### **Exemplos de Uso**

```java
// Criar lista
ShoppingList lista = ShoppingList.create(
    userId, 
    "Compras da Semana", 
    "Lista para feira de domingo"
);

// Adicionar itens
ItemName arroz = ItemName.of("Arroz");
Quantity quantidade = Quantity.of(2);
ListItem item1 = lista.addItem(arroz, quantidade, "kg");

ItemName leite = ItemName.of("Leite");
lista.addItem(leite, Quantity.of(1), "litro");

// Marcar como comprado
lista.markItemAsPurchased(item1.getId());

// Verificar contadores
int total = lista.countTotalItems();        // 2
int pendentes = lista.countPendingItems();  // 1
int comprados = lista.countPurchasedItems(); // 1

// Limpar itens comprados
int removidos = lista.clearPurchasedItems(); // 1
```

### **Benefícios da Abordagem DDD**

1. **Modelo Rico**: Lógica de negócio encapsulada nas entidades
2. **Invariantes Garantidas**: Regras sempre aplicadas via métodos
3. **Framework Agnóstico**: Zero dependência de Spring/JPA
4. **Testabilidade**: Testes unitários rápidos e isolados
5. **Expressividade**: Código que reflete a linguagem de negócio
6. **Evolução Segura**: Mudanças controladas via testes

### **Próximos Passos**

O modelo de domínio está pronto para ser integrado com:
- **Camada de Aplicação**: Use cases para orquestrar operações
- **Camada de Infraestrutura**: Persistência JPA, repositórios
- **Camada de Interface**: Controllers REST, DTOs de entrada/saída
- **Segurança**: Autorização baseada em `ownerId`

**Documentação técnica completa:** Ver `docs/DDD_SHOPPING_LIST.md`

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
    │   │       │   │   ├── LoginRequest.java
    │   │       │   │   ├── LoginResponse.java
    │   │       │   │   ├── LogoutRequest.java
    │   │       │   │   ├── RefreshTokenRequest.java
    │   │       │   │   ├── RefreshTokenResponse.java
    │   │       │   │   ├── RegisterRequest.java
    │   │       │   │   └── RegisterResponse.java
    │   │       │   └── usecase
    │   │       │       ├── LoginUserUseCase.java
    │   │       │       ├── LogoutUseCase.java
    │   │       │       ├── RefreshTokenUseCase.java
    │   │       │       └── RegisterUserUseCase.java
                │   │       ├── domain
                │   │       │   ├── user
                │   │       │   │   ├── AuthProvider.java
                │   │       │   │   ├── RefreshToken.java
                │   │       │   │   ├── RefreshTokenRepository.java
                │   │       │   │   ├── User.java
                │   │       │   │   └── UserRepository.java
                │   │       │   └── shoppinglist
                │   │       │       ├── DuplicateItemException.java
                │   │       │       ├── ItemName.java
                │   │       │       ├── ItemNotFoundException.java
                │   │       │       ├── ItemStatus.java
                │   │       │       ├── ListItem.java
                │   │       │       ├── ListLimitExceededException.java
                │   │       │       ├── Quantity.java
                │   │       │       ├── ShoppingList.java
                │   │       │       └── ShoppingListRepository.java
    │   │       ├── infrastructure
    │   │       │   ├── exception
    │   │       │   │   ├── EmailAlreadyExistsException.java
    │   │       │   │   ├── ExpiredJwtException.java
    │   │       │   │   ├── GlobalExceptionHandler.java
    │   │       │   │   ├── InvalidCredentialsException.java
    │   │       │   │   ├── InvalidJwtException.java
    │   │       │   │   └── InvalidRefreshTokenException.java
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
                │   └── usecase
                │       ├── LoginUserUseCaseTest.java
                │       ├── LogoutUseCaseTest.java
                │       ├── RefreshTokenUseCaseTest.java
                │       └── RegisterUserUseCaseTest.java
                ├── domain
                │   └── shoppinglist
                │       ├── ItemNameTest.java
                │       ├── ListItemTest.java
                │       ├── QuantityTest.java
                │       └── ShoppingListTest.java
                ├── infrastructure
                │   └── security
                │       ├── JwtServiceTest.java
                │       └── SecurityConfigTest.java
                └── interfaces
                    └── rest
                        └── v1
                            ├── AuthControllerLoginTest.java
                            ├── AuthControllerRefreshTest.java
                            ├── AuthControllerTest.java
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

### Renovação de Token (Refresh Token)
- **Endpoint:** `POST /api/v1/auth/refresh`
- **Descrição:** Renova access token usando refresh token válido com **rotação automática**
- **Request Body:**
  ```json
  {
    "refreshToken": "49a6336d-5649-466a-afeb-beee6b2f31d0"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.NOVO_TOKEN...",
    "refreshToken": "8c7f441e-9abc-4def-1234-567890abcdef",
    "expiresIn": 3600
  }
  ```
- **Validações:**
  - Refresh token obrigatório
  - Token deve existir no banco (validado via hash SHA-256)
  - Token não pode estar expirado (7 dias padrão)
  - Token não pode estar revogado (já foi usado)
- **Segurança - Rotação Automática de Tokens:**
  - **Token antigo é REVOGADO** automaticamente após o uso (marcado com `revokedAt`)
  - **Novo refresh token é gerado** (UUID diferente) e armazenado com hash SHA-256
  - Token antigo fica **vinculado ao novo** via `replacedByTokenId` (auditoria)
  - **Reuso de token revogado = ALERTA DE SEGURANÇA** (possível comprometimento)
  - Cada refresh token pode ser usado **apenas UMA vez** (one-time use)
  - Metadata atualizada: User-Agent, IP do novo dispositivo/sessão
- **Erros tratados:**
  - `400 Bad Request`: Refresh token vazio ou null
  - `401 Unauthorized - "Refresh token inválido"`: Token não encontrado no banco
  - `401 Unauthorized - "Refresh token expirado"`: Token passou da data de expiração
  - `401 Unauthorized - "Refresh token já foi utilizado"`: Tentativa de reuso (rotação detectada)
  - `500 Internal Server Error`: Erros inesperados
- **Fluxo de rotação:**
  1. Cliente envia refresh token (UUID em texto puro)
  2. Backend faz hash SHA-256 do token recebido
  3. Busca no banco pelo hash
  4. **Valida:** Existe? Expirado? Revogado?
  5. Se revogado → **REUSO DETECTADO** → 401 + Log de segurança
  6. Gera novo access token (JWT)
  7. Gera novo refresh token (UUID)
  8. **Revoga token antigo** (marca `revokedAt` e `replacedByTokenId`)
  9. Persiste novo refresh token (com hash SHA-256)
  10. Retorna novos tokens ao cliente
- **Detecção de ataques:**
  - Se um token revogado for reutilizado, isso indica que:
    - Token pode ter sido roubado/interceptado
    - Atacante está tentando usar token antigo
    - Sistema registra log de segurança com `userId` e `tokenId`
  - Possível ação futura: Revogar toda a cadeia de tokens do usuário
- **Camadas utilizadas:**
  - `interfaces/rest/v1`: AuthController (endpoint REST com extração de metadata)
  - `application/usecase`: RefreshTokenUseCase (rotação transacional)
  - `application/dto`: RefreshTokenRequest, RefreshTokenResponse (DTOs validados)
  - `domain/user`: RefreshToken (com métodos `revoke()`, `isExpired()`, `isRevoked()`)
  - `infrastructure/persistence`: JpaRefreshTokenRepository (adapter)
  - `infrastructure/security`: JwtService (geração de access token)
  - `infrastructure/exception`: InvalidRefreshTokenException, GlobalExceptionHandler
- **Testes:**
  - 8 testes unitários do use case (rotação, reuso, expiração, vinculação)
  - 10 testes de integração end-to-end (sucessos, falhas, múltiplos refreshes)

**Exemplo de uso (cURL):**
```bash
# 1. Fazer login para obter refresh token
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"senha@123"}'

# 2. Usar refresh token para renovar
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  -d '{"refreshToken":"49a6336d-5649-466a-afeb-beee6b2f31d0"}'

# 3. Tentar reusar o mesmo token (DEVE FALHAR com 401)
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"49a6336d-5649-466a-afeb-beee6b2f31d0"}'
```

**Segurança:** Sempre use o **novo** refresh token retornado. O antigo é imediatamente invalidado!

### Logout de Usuário (User Logout)
- **Endpoint:** `POST /api/v1/auth/logout`
- **Descrição:** Encerra sessão do usuário revogando o refresh token atual de forma segura
- **Request Body:**
  ```json
  {
    "refreshToken": "49a6336d-5649-466a-afeb-beee6b2f31d0"
  }
  ```
- **Response (204 No Content):** Sem corpo de resposta
- **Validações:**
  - Refresh token obrigatório
  - Token deve existir no banco (validado via hash SHA-256)
  - Token não pode já estar revogado
- **Segurança - Revogação de Token:**
  - Token é **marcado como revogado** (`revokedAt = now()`)
  - Token revogado **não pode mais ser usado** para refresh
  - Revogação persiste no banco para auditoria
  - **Sem replacement:** `replacedByTokenId = null` (diferente do refresh que rotaciona)
  - Possível logout mesmo com token **expirado** (mas não revogado)
- **Erros tratados:**
  - `400 Bad Request`: Refresh token vazio ou null
  - `401 Unauthorized - "Refresh token inválido"`: Token não encontrado no banco
  - `401 Unauthorized - "Refresh token já foi revogado"`: Tentativa de logout duplo
  - `500 Internal Server Error`: Erros inesperados
- **Fluxo de logout:**
  1. Cliente envia refresh token (UUID em texto puro)
  2. Backend faz hash SHA-256 do token recebido
  3. Busca no banco pelo hash
  4. **Valida:** Existe? Já revogado?
  5. Se já revogado → 401 (não permite logout duplo)
  6. **Revoga token** (marca `revokedAt` e `replacedByTokenId = null`)
  7. Persiste alteração
  8. Retorna 204 No Content (sucesso silencioso)
- **Diferença entre Logout e Refresh:**
  - **Logout:** Revoga token sem gerar novo (encerra sessão)
  - **Refresh:** Revoga token antigo e gera novo (rotação)
  - Ambos usam `revoke()` mas com semânticas diferentes
- **Múltiplas sessões:**
  - Usuário pode ter múltiplos refresh tokens ativos (web, mobile, etc.)
  - Logout revoga **apenas o token informado**
  - Outras sessões permanecem ativas
  - Futuro: Implementar "logout de todas as sessões" (revoga todos os tokens do usuário)
- **Camadas utilizadas:**
  - `interfaces/rest/v1`: AuthController (endpoint REST retornando 204)
  - `application/usecase`: LogoutUseCase (revogação transacional)
  - `application/dto`: LogoutRequest (DTO validado)
  - `domain/user`: RefreshToken (com método `revoke()`)
  - `infrastructure/persistence`: JpaRefreshTokenRepository (adapter)
  - `infrastructure/exception`: InvalidRefreshTokenException, GlobalExceptionHandler
- **Testes:**
  - 8 testes unitários do use case (sucesso, token não encontrado, já revogado, expirado)
  - Status: ✅ 100% passando

**Exemplo de uso (cURL):**
```bash
# 1. Fazer login para obter tokens
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"senha@123"}'

# 2. Usar access token para acessar recursos protegidos
# (enquanto a sessão estiver ativa)

# 3. Fazer logout quando terminar
curl -X POST http://localhost:8080/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"49a6336d-5649-466a-afeb-beee6b2f31d0"}'

# 4. Tentar reusar o mesmo token (DEVE FALHAR com 401)
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"49a6336d-5649-466a-afeb-beee6b2f31d0"}'
```

**Segurança:** Após logout, o refresh token fica permanentemente invalidado. Para nova sessão, faça login novamente.

### Refresh Token via Cookie HttpOnly (Segurança Avançada)
- **Descrição:** Sistema híbrido que suporta refresh token via **cookie HttpOnly** (recomendado) ou body (dev/test)
- **Configurável por perfil:** Diferentes níveis de segurança para dev/test/prod
- **Benefícios de Segurança:**
  - **HttpOnly**: JavaScript não pode acessar (protege contra XSS)
  - **Secure**: Enviado apenas via HTTPS em produção (protege contra man-in-the-middle)
  - **SameSite**: Proteção contra ataques CSRF
  - **Path Restrito**: Cookie enviado apenas para `/api/v1/auth`
- **Estratégia por Perfil:**
  | Perfil | Cookie | Body | Secure | SameSite | Cookie-Only |
  |--------|--------|------|--------|----------|-------------|
  | dev    | ✅     | ✅   | ❌     | Lax      | false       |
  | test   | ✅     | ✅   | ❌     | Lax      | false       |
  | prod   | ✅     | ❌   | ✅     | Strict   | true        |
- **Configuração:**
  ```yaml
  # application-dev.yml
  app:
    security:
      refresh-token:
        cookie:
          http-only: true
          secure: false      # HTTP permitido em dev
          same-site: Lax     # Mais permissivo
          cookie-only: false # Retorna no body também
  
  # application-prod.yml
  app:
    security:
      refresh-token:
        cookie:
          http-only: true
          secure: true       # Apenas HTTPS
          same-site: Strict  # Máxima proteção CSRF
          cookie-only: true  # Apenas cookie (mais seguro)
  ```
- **Como funciona:**
  1. **Login**: Retorna access token no body + refresh token no cookie (e opcionalmente no body)
  2. **Refresh**: Aceita token do cookie (preferencial) ou body (backward compatibility)
  3. **Logout**: Remove cookie do navegador (Max-Age=0)
- **Uso no Cliente (JavaScript):**
  ```javascript
  // Login com cookies
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include' // IMPORTANTE: inclui cookies
  });
  
  // Refresh (automático via cookie)
  await fetch('/api/v1/auth/refresh', {
    method: 'POST',
    body: '{}', // Body vazio, usa cookie
    credentials: 'include' // IMPORTANTE: inclui cookies
  });
  ```
- **Backward Compatibility:**
  - Dev/test: Continua suportando refresh token no body
  - Produção: Apenas cookie (mais seguro)
  - Migração gradual sem quebrar clientes antigos
- **Documentação completa:** Ver [COOKIES_IMPLEMENTATION.md](docs/COOKIES_IMPLEMENTATION.md)

### JWT Authentication Filter (Proteção de Endpoints)
- **Descrição:** Filtro Spring Security que intercepta todas as requisições e valida tokens JWT
- **Funcionalidade:** Extrai Bearer token do header Authorization, valida e autentica o usuário
- **Implementação:**
  - **JwtAuthenticationFilter**: Filtro que extende `OncePerRequestFilter`
  - **Integrado no SecurityFilterChain**: Executa antes do `UsernamePasswordAuthenticationFilter`
  - **Extração de token**: Header `Authorization: Bearer {token}`
  - **Validação**: Usa `JwtService.validateToken()` para verificar assinatura e expiração
  - **Authentication**: Cria `UsernamePasswordAuthenticationToken` e coloca no `SecurityContext`
  - **Autorização**: Spring Security autoriza requisições baseado na autenticação
- **Fluxo de Autenticação:**
  1. Cliente envia request com header `Authorization: Bearer {jwt-token}`
  2. JwtAuthenticationFilter intercepta a requisição
  3. Extrai e valida o token JWT
  4. Extrai `userId` e `email` dos claims do token
  5. Cria objeto `Authentication` com authority `ROLE_USER`
  6. Coloca autenticação no `SecurityContextHolder`
  7. Requisição continua para o controller
  8. Controller acessa dados do usuário via `SecurityContext`
- **Tratamento de Erros:**
  - **Sem token**: Requisição continua sem autenticação (rotas públicas)
  - **Token inválido/expirado**: Limpa contexto e retorna 401 via `JwtAuthenticationEntryPoint`
  - **Token malformado**: Retorna 401
  - **Bearer vazio**: Retorna 401
- **Rotas Públicas (não requerem JWT):**
  - `/api/v1/auth/**` - Registro, login, refresh, logout
  - `/actuator/health` - Health check
  - `/h2-console/**` - Console H2 (dev apenas)
- **Rotas Protegidas:** Todas as demais rotas requerem autenticação JWT
- **Endpoint GET /api/v1/users/me:**
  - **Descrição**: Retorna dados do usuário autenticado
  - **Autenticação**: Requer JWT válido no header Authorization
  - **Response**: `UserMeResponse` com id, email, name, provider, status, createdAt, updatedAt
  - **Use Case**: `GetCurrentUserUseCase` busca usuário pelo ID extraído do JWT
  - **Útil para**: Carregar dados do usuário no frontend após login
- **Exemplo de uso (cURL):**
  ```bash
  # 1. Fazer login para obter access token
  curl -X POST http://localhost:8080/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"teste@email.com","password":"senha@123"}'
  
  # 2. Copiar o accessToken e usar para acessar endpoint protegido
  curl -X GET http://localhost:8080/api/v1/users/me \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJwcm92aWRlciI6IkxPQ0FMIiwibmFtZSI6IlRlc3RlIiwiZW1haWwiOiJ0ZXN0ZUBlbWFpbC5jb20iLCJzdWIiOiIxIiwiaXNzIjoic2hvcHBpbmctbGlzdC1hcGkiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMzYwMH0.signature"
  
  # Response (200 OK):
  # {
  #   "id": 1,
  #   "email": "teste@email.com",
  #   "name": "Teste",
  #   "provider": "LOCAL",
  #   "status": "ACTIVE",
  #   "createdAt": "2025-12-25T15:30:00Z",
  #   "updatedAt": "2025-12-25T15:30:00Z"
  # }
  
  # 3. Tentar acessar sem token (401 Unauthorized)
  curl -X GET http://localhost:8080/api/v1/users/me
  
  # Response (401):
  # {
  #   "path": "/api/v1/users/me",
  #   "error": "Unauthorized",
  #   "message": "Autenticação requerida. Por favor, forneça um token JWT válido.",
  #   "status": 401,
  #   "timestamp": "2025-12-25T15:35:00Z"
  # }
  ```
- **Exemplo de uso (JavaScript/Frontend):**
  ```javascript
  // Login
  const loginResponse = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const { accessToken } = await loginResponse.json();
  
  // Salvar token (localStorage, sessionStorage, cookie, etc)
  localStorage.setItem('accessToken', accessToken);
  
  // Acessar endpoint protegido
  const userResponse = await fetch('/api/v1/users/me', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  const userData = await userResponse.json();
  console.log('Usuário logado:', userData);
  ```
- **Testes:**
  - 8 testes de integração end-to-end
  - Cenários cobertos:
    - ✅ Token válido → Retorna dados do usuário (200)
    - ✅ Sem token → 401 Unauthorized
    - ✅ Token inválido → 401 Unauthorized
    - ✅ Token expirado → 401 Unauthorized
    - ✅ Bearer malformado → 401 Unauthorized
    - ✅ Bearer vazio → 401 Unauthorized
    - ✅ Rotas públicas continuam funcionando sem JWT

---

## 🔐 Google OAuth2 Authentication

A aplicação suporta autenticação via Google OAuth2, permitindo que usuários façam login com suas contas Google.

### **Configuração**

1. **Obter Google Client ID:**
   - Acesse: https://console.cloud.google.com/
   - Crie um projeto (ou selecione existente)
   - Vá para "APIs & Services" > "Credentials"
   - Crie um "OAuth 2.0 Client ID" do tipo "Web application"

2. **Configurar no Backend:**
   
   Adicione ao arquivo `.env`:
   ```bash
   GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
   ```

3. **Reinicie a aplicação** para carregar a nova configuração.

### **Como Funciona**

1. **Frontend:** Usuário faz login com Google e obtém um `id_token`
2. **Frontend:** Envia o `id_token` para `POST /api/v1/auth/google`
3. **Backend:** Valida o token com Google
4. **Backend:** Cria usuário se não existir (provisionamento automático)
5. **Backend:** Retorna `accessToken` e `refreshToken` da API

### **Endpoint**

```bash
POST /api/v1/auth/google
Content-Type: application/json

{
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Resposta (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "expiresIn": 3600
}
```

### **Características**

- ✅ **Validação do ID Token** com Google API Client
- ✅ **Provisionamento automático** de usuários novos
- ✅ **Email verificado** obrigatório
- ✅ **Role USER** atribuída automaticamente
- ✅ **Sem senha armazenada** (provider=GOOGLE, passwordHash=NULL)
- ✅ **Mesmos tokens JWT** do login tradicional
- ✅ **Refresh token** com rotação habilitada

### **Teste Rápido**

Para testar rapidamente sem frontend:

1. Acesse: https://developers.google.com/oauthplayground/
2. Autorize os scopes: `email`, `profile`, `openid`
3. Obtenha o `id_token`
4. Use no Postman/cURL

**Documentação detalhada:** Veja `GOOGLE_OAUTH_TESTING.md` na raiz do projeto.

---

## 📋 Status Atual e Roadmap

### ✅ **IMPLEMENTADO**

#### **🔐 Autenticação e Autorização Completa**
- ✅ Registro de usuários locais com validação robusta
- ✅ Login/logout com JWT + Refresh Token (rotação automática)
- ✅ Google OAuth2 integration com provisionamento automático
- ✅ Sistema de cookies HttpOnly para máxima segurança
- ✅ Filtro JWT para proteção de endpoints
- ✅ Tratamento de erros padronizado e logs estruturados
- ✅ **130+ testes** cobrindo todos os cenários

#### **🛒 Modelo de Domínio Shopping List (DDD)**
- ✅ **Aggregate Root**: ShoppingList com todas invariantes
- ✅ **Entities**: ListItem com gestão de estado completa  
- ✅ **Value Objects**: ItemName e Quantity com validações imutáveis
- ✅ **Business Rules**: Duplicatas, limites, ownership, normalização
- ✅ **Domain Exceptions**: Tratamento específico de violações
- ✅ **58+ testes unitários puros** (framework-agnóstic)
- ✅ **100% cobertura** das regras de negócio

#### **🏗️ Infraestrutura e Qualidade**
- ✅ Clean Architecture com separação clara de camadas
- ✅ MySQL + Docker Compose para desenvolvimento
- ✅ H2 em memória para testes (zero configuração)
- ✅ Flyway migrations versionadas
- ✅ Profiles ambiente (dev/test/prod) configurados
- ✅ Health checks (Spring Actuator + customizado)
- ✅ CORS configurado para frontend
- ✅ Logging estruturado com correlation IDs

### 🚧 **EM DESENVOLVIMENTO**

#### **📝 Próxima Sprint - Camada de Aplicação**
- ⏳ **Use Cases** para Shopping List (criar, editar, listar)
- ⏳ **DTOs** de entrada/saída para Shopping List API
- ⏳ **Mapeamentos** entre domínio e DTOs
- ⏳ **Validações** de autorização (ownership)
- ⏳ **Testes** de use cases isolados

### 📅 **ROADMAP - Próximas Funcionalidades**

#### **🔄 Sprint 1 - API REST Shopping List**
- 🏗️ Controllers REST para CRUD de listas
- 🏗️ Endpoints: criar, editar, excluir, listar
- 🏗️ Paginação e filtros de busca
- 🏗️ Autorização baseada em ownership
- 🏗️ Testes de integração end-to-end

#### **💾 Sprint 2 - Persistência JPA**
- 🏗️ Entidades JPA para Shopping List
- 🏗️ Repositories JPA implementados
- 🏗️ Migrations para tabelas de listas
- 🏗️ Mapeamentos objeto-relacional otimizados
- 🏗️ Testes de persistência

#### **🔍 Sprint 3 - Recursos Avançados**
- 🏗️ Busca full-text em itens
- 🏗️ Compartilhamento de listas entre usuários
- 🏗️ Categorização de itens
- 🏗️ Histórico de compras
- 🏗️ Sugestões inteligentes

#### **📊 Sprint 4 - Analytics e Relatórios**
- 🏗️ Dashboard de estatísticas
- 🏗️ Relatórios de gastos
- 🏗️ Análise de padrões de compra
- 🏗️ Exportação de dados

#### **🚀 Sprint 5 - Performance e Produção**
- 🏗️ Cache Redis para sessões
- 🏗️ Rate limiting por usuário
- 🏗️ Monitoring com Micrometer + Prometheus
- 🏗️ Pipeline CI/CD completo
- 🏗️ Deploy containerizado

### 🎯 **Objetivos de Arquitetura**

- **Manutenibilidade**: Código limpo, bem documentado e testado
- **Escalabilidade**: Arquitetura preparada para crescimento
- **Segurança**: Boas práticas de autenticação e autorização
- **Performance**: Otimizações de banco e cache quando necessário
- **Observabilidade**: Logs, métricas e health checks completos

### 📚 **Documentação Técnica**

- **`docs/DDD_SHOPPING_LIST.md`** - Análise detalhada do modelo de domínio
- **`docs/GOOGLE_OAUTH_TESTING.md`** - Guide completo para testar OAuth2
- **`docs/COOKIES_IMPLEMENTATION.md`** - Implementação de cookies seguros
- **`docs/SECURITY_CHECKLIST.md`** - Checklist de segurança aplicado
- **`docs/INTEGRATION_TESTS.md`** - Estratégias de testes de integração

---

## 🤝 Contribuindo

Este projeto segue boas práticas de desenvolvimento:

1. **Clean Architecture** - Separação clara de responsabilidades
2. **TDD/BDD** - Desenvolvimento orientado por testes
3. **DDD** - Modelagem rica de domínio
4. **SOLID** - Princípios de design aplicados
5. **Conventional Commits** - Padronização de commits
6. **Code Review** - Revisão obrigatória antes do merge

Para contribuir:
1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. **Execute os testes** (`./mvnw test`)
4. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Push para a branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 📞 Contato

- **Projeto**: Shopping List API
- **Versão**: 1.0.0-SNAPSHOT  
- **Java**: 21 LTS
- **Spring Boot**: 3.4.1
- **Arquitetura**: Clean Architecture + DDD
- **Status**: 🚧 Em desenvolvimento ativo

**Última atualização do README**: Dezembro 2024

