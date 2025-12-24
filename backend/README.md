# Shopping List API

Backend da aplicação **Shopping List**, desenvolvido com **Java LTS** e **Spring Boot**, seguindo princípios de **Clean Architecture**, **SOLID** e boas práticas de desenvolvimento.

> 🚧 Projeto em fase inicial (bootstrap da aplicação).

---

## 🚀 Tecnologias Utilizadas

- **Java LTS**
- **Spring Boot**
  - Spring Web
  - Validation
  - Actuator
- **Maven**
- **JUnit 5**

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Java LTS** configurado no PATH
- **Maven Wrapper** (já incluso no projeto)
- **Git**

Para verificar:
```bash
java -version
```

---

## ▶️ Como executar o projeto

### 1️⃣ Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd shopping-list-api
```

### 2️⃣ Executar a aplicação
```bash
./mvnw spring-boot:run
```

> Em ambientes Windows:
```bash
mvnw spring-boot:run
```

---

## 🔎 Verificando se a aplicação está no ar

- Aplicação:
```
http://localhost:8080
```
> Pode retornar **404**, o importante é a aplicação estar ativa.

- Health Check (Actuator):
```
http://localhost:8080/actuator/health
```

Resposta esperada:
```json
{
  "status": "UP"
}
```

---

## 🧪 Executando os testes

```bash
./mvnw test
```

Ou em modo silencioso:
```bash
./mvnw -q test
```

---

## 📦 Estrutura Inicial do Projeto

```text
src
├── main
│   └── java
│       └── com.shoppinglist
│           └── ShoppingListApplication.java
└── test
    └── java
        └── com.shoppinglist
            └── ShoppingListApplicationTests.java
```

---

## 📌 Observações

- Este projeto inicia apenas com a **estrutura base** do backend.
- Persistência, segurança, autenticação e demais módulos serão adicionados em stories futuras.
- O foco atual é garantir **build verde**, **startup limpo** e **base arquitetural sólida**.

---

## 📝 Licença

Este projeto é de uso educacional e pessoal.
