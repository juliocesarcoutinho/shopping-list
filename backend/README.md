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
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=shoppinglist_db
MYSQL_USER=admin
MYSQL_PASSWORD=admin
MYSQL_PORT=3306
```

> ⚠️ **Importante:** O arquivo `.env` contém credenciais sensíveis e **não deve ser commitado** no repositório. Use o arquivo `.env.example` como referência.

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
    │   │       │   └── dto
    │   │       │       └── HealthResponse.java
    │   │       ├── domain
    │   │       ├── infrastructure
    │   │       └── interfaces
    │   │           └── rest
    │   │               └── v1
    │   │                   └── HealthController.java
    │   └── resources
    │       ├── application.yml
    │       ├── application-dev.yml
    │       └── application-test.yml
    └── test
        └── java
            └── br.com.shooping.list
                ├── StartupApplicationTests.java
                └── interfaces
                    └── rest
                        └── v1
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

### Banco de Dados MySQL
- **Container:** MySQL 9 via Docker Compose
- **Configuração:** Credenciais via arquivo `.env`
- **Volume persistente:** Dados mantidos em volume Docker (`mysql-data`)
- **Health Check:** Verificação automática de disponibilidade do banco
- **Porta:** 3306 (configurável via `MYSQL_PORT`)
- **Database inicial:** `shoppinglist_db` criado automaticamente

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
  - JWT Secret (mínimo 256 bits para HS256)
- **JWT implementado** com geração, validação e exceções customizadas.
- **Domínio User/RefreshToken** implementado seguindo DDD.
- **Próximas funcionalidades:**
  - JWT Authentication Filter
  - Endpoints de autenticação (login, register, refresh)
  - Repository layer para User e RefreshToken
  - Casos de uso (Use Cases) na camada application
- O foco continua sendo **build verde**, **startup limpo**, **testes passando** e **base arquitetural sólida**.

---

## 📝 Licença

Este projeto é de uso educacional e pessoal.
