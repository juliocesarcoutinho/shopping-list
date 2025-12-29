# Shopping List App

Aplicação de Lista de Compras desenvolvida com Clean Architecture e React Native.

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar ambiente:**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

3. **Iniciar o desenvolvimento:**
   ```bash
   npm start
   ```

4. **Executar em dispositivos específicos:**
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

## ⚙️ Configuração de Ambiente

O projeto usa variáveis de ambiente para configuração:

### **Arquivos de configuração:**
- `.env.example` - Template com todas as variáveis disponíveis
- `.env` - Configuração local (não commitada no git)
- `app.config.js` - Configuração do Expo que carrega as variáveis

### **Variáveis disponíveis:**

```bash
# API Configuration
API_URL=http://192.168.x.x:8080/api/v1  # URL do backend (use IP da máquina, não localhost)
API_TIMEOUT=30000                        # Timeout em ms

# App Configuration  
APP_NAME=Shopping List                   # Nome da aplicação
APP_ENV=development                      # Ambiente (development/staging/production)

# Google OAuth2
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com  # Client ID do Google Console

# Feature Flags
ENABLE_MOCK_API=false                    # Usar API mock (false para API real)
ENABLE_DEBUG_LOGS=true                   # Logs de debug
```

**Importante:**
- `API_URL` deve usar o **IP da máquina** (não `localhost`) para funcionar em dispositivos físicos/emuladores
- Descobrir IP: `hostname -I` ou `ip -4 addr show`
- Exemplo: `API_URL=http://192.168.10.2:8080/api/v1`
- Backend deve estar com `server.address=0.0.0.0` e porta 8080 liberada no firewall

### **Como usar:**

```typescript
import { env } from '@/src/infrastructure/config/env';

// Acessar configurações
console.log(env.apiUrl);              // http://localhost:3000/api
console.log(env.enableMockApi);       // true

// Helpers de ambiente
import { isDevelopment, isProduction } from '@/src/infrastructure/config/env';

if (isDevelopment) {
  console.log('Modo desenvolvimento');
}
```

### **Tela de configurações:**

Acesse `/settings` no app para visualizar todas as variáveis de ambiente carregadas.

## 📋 Scripts Disponíveis

- `npm start` - Iniciar o servidor de desenvolvimento
- `npm run lint` - Verificar código com ESLint
- `npm run lint:fix` - Corrigir problemas automaticamente
- `npm run format` - Formatar código com Prettier
- `npm run typecheck` - Verificar tipos TypeScript
- `npm run check-all` - Executar todas as verificações

## 🏗️ Arquitetura

Este projeto segue os princípios da **Clean Architecture**, organizando o código em camadas bem definidas:

```
src/
├── domain/              # 🧠 Regras de Negócio
│   ├── entities/        # Entidades do domínio
│   ├── repositories/    # Interfaces de repositório  
│   └── use-cases/       # Casos de uso
├── data/                # 📊 Acesso a Dados
│   ├── models/          # DTOs e modelos de API
│   ├── data-sources/    # Interfaces de fontes de dados
│   └── repositories/    # Implementações de repositório
├── presentation/        # 🎨 Interface do Usuário
│   ├── screens/         # Telas da aplicação
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contexts (Auth, etc)
│   ├── hooks/           # Hooks personalizados
│   ├── theme/           # Design System
│   └── navigation/      # Configuração de rotas
└── infrastructure/      # 🔧 Serviços Externos
    ├── http/           # Cliente HTTP
    ├── storage/        # Armazenamento local
    └── services/       # Implementações de serviços
```

## 🔐 Sistema de Autenticação

O app possui sistema de autenticação completo com navegação condicional:

### **Auth Stack (Não autenticado)**
- `/login` - Tela de login
- `/register` - Tela de cadastro

### **App Stack (Autenticado)**
- `/(tabs)` - Navegação por abas
  - `/` - Home
  - `/explore` - Explorar
  - `/playground` - Playground de componentes

### **Como funciona:**
1. App verifica estado de autenticação no `AuthContext`
2. Redireciona automaticamente para login se não autenticado
3. Após login bem-sucedido, navega para área protegida
4. Botão "Sair" faz logout e retorna para login

## 🎨 Design System

rSistema completo de Design Tokens com a **Paleta Fresh Market**:

### **🌿 Paleta Fresh Market**
Design minimalista focado em frescor e naturalidade, ideal para aplicações de marketplace:

**Cores Principais:**
- **Primary (Verde suave):** `#2ECC71` - Botões principais, CTAs e ações positivas
- **Secondary (Verde forte):** `#27AE60` - Hover states, detalhes interativos e ícones
- **Background:** `#F9FAF7` - Fundo principal confortável e espaçoso
- **Surface:** `#FFFFFF` - Cards, modais e elementos em destaque

**Cores de Texto:**
- **Text Principal:** `#2C3E50` - Títulos, cabeçalhos e textos importantes
- **Text Muted:** `#7F8C8D` - Textos secundários, descrições e subtítulos

**Estados e Feedback:**
- **Success:** `#2ECC71` - Confirmações e feedback positivo
- **Error:** `#E74C3C` - Alertas, erros e avisos importantes
- **Warning:** `#F39C12` - Avisos e atenções

**Psicologia das Cores:**
- 🟢 Verde = Natureza, frescor, produtos frescos
- 🤍 Fundo claro = Limpeza, organização, espaço
- ⬛ Texto escuro = Legibilidade máxima, profissionalismo

### **Tokens Disponíveis:**
- **Cores:** Paleta Fresh Market light/dark (60+ tokens)
- **Tipografia:** Inter + fallbacks (14 presets)
- **Espaçamento:** Escala baseada em 4px (13 níveis)
- **Bordas:** Border radius (8 variações)
- **Sombras:** Depth levels (6 níveis)

### **Como usar:**
```tsx
import { useAppTheme } from '@/src/presentation/hooks';

function MeuComponente() {
  const theme = useAppTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>
        Texto com tema dinâmico
      </Text>
    </View>
  );
}
```

## 🧩 Componentes Reutilizáveis

Sistema completo de componentes com estados, variações e validações:

### **Componentes Disponíveis:**

- **Button** 
  - 3 tamanhos (small, medium, large)
  - 2 variantes (primary Fresh Market, secondary outlined)
  - Estados: loading, disabled
  - Cores dinâmicas do tema

- **TextField** 
  - 2 variantes (outlined, filled)
  - Estados: error, focus, disabled
  - Validação com mensagens de erro
  - Integração com React Hook Form
  - Suporte a labels e placeholders

- **Card** 
  - 3 variantes (elevated, outlined, filled)
  - Clicável opcional
  - Sombras e bordas do tema
  - Totalmente customizável

- **Divider** 
  - Orientações: horizontal/vertical
  - Espessura e cor customizáveis
  - Margin configurável

- **Loader** 
  - 3 variações (spinner, dots, pulse)
  - 3 tamanhos
  - Texto opcional
  - Cor customizável

### **Validação de Formulários:**

**Stack Tecnológico:**
- `react-hook-form` - Gerenciamento de formulários performático
- `zod` - Schema validation com TypeScript
- `@hookform/resolvers` - Integração RHF + Zod

**Exemplo de uso:**
```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

**Teste no Playground:** Aba 🎮 Playground

## 📱 Tecnologias

**Core:**
- **React Native** - Framework mobile multiplataforma
- **Expo** - Plataforma de desenvolvimento e build
- **TypeScript** - Tipagem estática e segurança de tipos
- **Expo Router** - Roteamento baseado em arquivos

**State Management & Storage:**
- **React Context API** - Gerenciamento de estado global (Auth)
- **AsyncStorage** - Armazenamento local persistente

**Formulários & Validação:**
- **React Hook Form** - Gerenciamento de formulários performático
- **Zod** - Schema validation com inferência de tipos
- **@hookform/resolvers** - Integração RHF + Zod

**Navegação:**
- **React Navigation** - Sistema de navegação nativo
- **Expo Router** - File-based routing

**Developer Experience:**
- **ESLint** - Linter de código
- **Prettier** - Formatação automática
- **TypeScript** - Type checking
- **dotenv** - Gerenciamento de variáveis de ambiente



## 🛒 Listas de Compras - Acesso a Dados

O acesso às listas do usuário autenticado segue Clean Architecture, desacoplado de UI e com tratamento de erros padronizado.

### Data Source Remoto

Arquivo: `src/data/data-sources/shopping-list-remote-data-source.ts`

Responsável por consumir GET `/api/v1/lists` usando o `apiClient` padrão:

```typescript
export class ShoppingListRemoteDataSource {
  async getMyLists(): Promise<ShoppingListDto[]> {
    try {
      return await apiClient.get<ShoppingListDto[]>("/lists");
    } catch (error) {
      // Normalização de erro conforme padrão do projeto
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as any;
        throw {
          message: err.response?.data?.message || 'Erro ao buscar listas',
          status: err.response?.status,
        };
      }
      throw { message: 'Erro desconhecido ao buscar listas' };
    }
  }
}
```

### Repository

Arquivo: `src/data/repositories/shopping-list-repository.ts`

Implementa o contrato de domínio, retorna entidades já mapeadas:

```typescript
export class ShoppingListRepositoryImpl {
  constructor(private readonly remote: ShoppingListRemoteDataSource) {}

  async getMyLists(): Promise<ShoppingList[]> {
    try {
      const dtos = await this.remote.getMyLists();
      return dtos.map(mapShoppingListDtoToDomain);
    } catch (error) {
      throw error; // Erro já normalizado
    }
  }
}
```

### Tratamento de Erros
- Todos os erros são normalizados (mensagem + status) conforme padrão do `apiClient`.
- Não há lógica de UI ou dependência de presentation.


### Use Case: Buscar Listas do Usuário

Arquivo: `src/domain/use-cases/get-my-lists-use-case.ts`

Orquestra a busca das listas do usuário, aplicando regras de negócio:

- Retorna listas ordenadas por `updatedAt` (mais recentes primeiro)
- Se não houver listas, retorna array vazio
- Em erro, propaga erro normalizado (status/message)

```typescript
export class GetMyListsUseCase {
  constructor(private readonly repository: ShoppingListRepository) {}

  async execute(): Promise<ShoppingList[]> {
    const lists = await this.repository.getMyLists();
    return (lists ?? []).slice().sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }
}
```

#### Testes Unitários
- Ordenação correta por `updatedAt desc`
- Retorno vazio se não houver listas
- Propagação de erro do repository

---

---

O projeto implementa modelos, entidades e mappers para listas de compras seguindo Clean Architecture e alinhamento com o backend.

### Entidade de Domínio

Arquivo: `src/domain/entities/index.ts`

```typescript
export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
}
```

### DTO/Model (API)

Arquivo: `src/data/models/index.ts`

```typescript
export interface ShoppingListDto {
  id: string;
  title: string;
  items: ShoppingItemDto[];
  created_at: string;
  updated_at: string;
}
```

### Mapper DTO → Domain

Arquivo: `src/data/mappers/shopping-list-mapper.ts`

Responsável por converter o DTO do backend para a entidade de domínio, validando campos obrigatórios:

```typescript
export function mapShoppingListDtoToDomain(dto: ShoppingListDto): ShoppingList {
  if (!dto.id || !dto.title || !dto.items || !dto.created_at || !dto.updated_at) {
    throw new Error('Campos obrigatórios ausentes em ShoppingListDto');
  }
  return {
    id: dto.id,
    title: dto.title,
    items: dto.items.map(/* ... */),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
```

### Testes Unitários

Arquivo: `src/data/mappers/__tests__/shopping-list-mapper.test.ts`

Cobre casos de mapeamento válido e ausência de campos obrigatórios.

### Padrões Seguidos
- Sem dependência de UI/React em domain/data
- Tipos alinhados com payload do backend
- Separação clara por camadas
- Testes automatizados para o mapper

---
## 📖 Documentação Adicional

- `CLEAN_ARCHITECTURE.md` - Guia de arquitetura e convenções
- `COMPONENTS.md` - Documentação dos componentes

## 🎯 Estrutura de Navegação

```
app/
├── _layout.tsx          # Root layout com AuthProvider
├── login.tsx            # → LoginScreen (Auth)
├── register.tsx         # → RegisterScreen (Auth)
├── modal.tsx            # Modal exemplo
└── (tabs)/             # Área protegida (App)
    ├── _layout.tsx      # Tab navigation
    ├── index.tsx        # → HomeScreen
    ├── explore.tsx      # → ExploreScreen
    ├── account.tsx      # → AccountScreen (👤 Conta)
    └── playground.tsx   # → PlaygroundScreen
```

## 🔄 Fluxo de Autenticação

Sistema completo de autenticação com UI minimalista Fresh Market:

### **Telas Implementadas:**

#### **🔐 Login Screen**
- Email + Senha com validação React Hook Form + Zod
- Botão "Entrar com Google" (OAuth2 integrado)
- Link "Esqueceu a senha?"
- Estados: loading, erro, sucesso
- Validações:
  - Email obrigatório e formato válido
  - Senha mínimo 6 caracteres
- Banner de erro amigável com mensagens específicas do backend
- Navegação automática após login
- Tratamento de erros de rede

#### **📝 Register Screen**
- Nome, Email, Senha e Confirmar Senha
- Validação forte de senha com Zod:
  - Mínimo 8 caracteres
  - Pelo menos uma letra maiúscula
  - Pelo menos um número
  - Pelo menos um caractere especial (!@#$%)
- Card com dicas de senha forte
- Banner de sucesso após cadastro
- Validação: senhas devem conferir
- Navegação automática após registro

#### **🏠 Home Screen**
- Exibe dados do usuário autenticado
- Botão "Sair" para logout seguro
- Informações sobre Clean Architecture
- Acesso às outras abas (Explore, Conta, Playground)

#### **👤 Account Screen**
- Exibe dados detalhados do usuário: Nome, Email, Provider
- Integração com `/api/v1/users/me` para dados reais
- Estados de loading durante carregamento
- Tratamento robusto de erros com mensagens específicas
- Botão "Recarregar Dados" para atualizar informações
- Botão "Sair" para logout direto da tela
- Badges visuais para método de autenticação (Email/Google)
- Status do usuário (Ativo/Inativo)
- Data de cadastro (Membro desde)
- Design card com avatar visual

### **Fluxo Completo:**

```
┌──────────────┐
│ App Inicia   │
│ Verifica auth│
└──────┬───────┘
       │
       ├─ Não autenticado ──► LoginScreen
       │                          │
       │                          ├─ Login email/senha ──► API Backend
       │                          ├─ Login Google ──────► API Backend
       │                          └─ "Criar conta" ────► RegisterScreen
       │                                                      │
       │                                                      └─ Cadastro ──► API Backend
       │                                                                          │
       └─ Autenticado ───────────────────────────────────────────────────────────┘
                                                                                   │
                                                                                   ▼
                                                                            ┌──────────────┐
                                                                            │ HomeScreen   │
                                                                            │ (tabs)       │
                                                                            │ Botão: Sair  │
                                                                            └──────────────┘
```

### **Persistência e Restauração de Sessão:**
1. **Login/Registro** → Salva tokens no AsyncStorage + Define token no apiClient
2. **App reinicia** → Restaura sessão automaticamente:
   - Carrega accessToken, refreshToken e user do AsyncStorage
   - Valida accessToken chamando `GET /api/v1/users/me`
   - Se token inválido/expirado → Tenta refresh automático
   - Se refresh falhar → Limpa storage e redireciona para login
   - Se válido → Mantém usuário logado e entra direto na home
3. **Logout** → Revoga refresh token no backend → Remove do storage → Volta para Login

**Guard de Rotas:**
- Loading screen exibido durante verificação de sessão
- Redirecionamento automático baseado em autenticação:
  - Não autenticado + tentando acessar área protegida → Login
  - Autenticado + na tela de login/register → Home (tabs)
- Validação de sessão executada uma única vez no startup

### **Integração Backend:**
- **Endpoint Login:** `POST /api/v1/auth/login`
- **Endpoint Register:** `POST /api/v1/auth/register`
- **Endpoint Logout:** `POST /api/v1/auth/logout`
- **Endpoint Refresh:** `POST /api/v1/auth/refresh`
- **Endpoint User:** `GET /api/v1/users/me`
- **Tokens:** JWT (Access Token) + UUID (Refresh Token)
- **Expiração:** Access Token 1h, Refresh Token 7 dias
- **Storage:** AsyncStorage persiste: accessToken, refreshToken, user

### **Refresh Automático de Token:**
Sistema inteligente que renova tokens expirados sem interromper a navegação do usuário:

**Interceptor Axios (401):**
- Detecta automaticamente quando access token expira (HTTP 401)
- ⚠️ **Não tenta refresh em endpoints de autenticação** (login, register, logout, google)
- Pausa todos os requests em andamento e coloca em fila
- Tenta refresh do token usando refresh token salvo
- Se sucesso: atualiza token, refaz requests automaticamente
- Se falha: limpa sessão e redireciona para login

**Controle de Concorrência:**
- Flag `isRefreshing` previne múltiplos refreshes simultâneos
- Fila de promises aguarda o refresh e é processada em lote
- Cada request só tenta refresh uma vez (previne loops)

**Fluxo:**
```
Request → 401 → É endpoint de auth?
                ├─ Sim → Retorna erro normalizado
                └─ Não → Já refreshing? 
                          ├─ Sim → Aguarda na fila
                          └─ Não → Inicia refresh
                                    ↓
                              Refresh bem-sucedido?
                              ├─ Sim → Atualiza token, refaz requests
                              └─ Não → Limpa sessão, logout
```

**Benefícios:**
- Usuário não precisa relogar durante uso normal
- Múltiplos requests simultâneos com token expirado são tratados de forma eficiente
- UX transparente: aplicação continua funcionando sem interrupção
- **Auto-refresh:** Se token expirado, renova automaticamente na restauração da sessão

### **Google OAuth2:**
- **Endpoint:** `POST /api/v1/auth/google`
- **Fluxo:** Frontend obtém idToken via expo-auth-session → Envia para backend → Backend valida com Google API → Retorna JWT
- **Configuração:** Requer `GOOGLE_CLIENT_ID` no `.env` (Android/iOS separados)
- **Client IDs:**
  - Desenvolvimento: Android Client ID com package `host.exp.exponent` e SHA-1 do debug.keystore
  - Produção: Android/iOS Client IDs com packages de produção e keystores de release
- **Documentação:** Ver `docs/GOOGLE_OAUTH_SETUP.md` e `docs/FIX_GOOGLE_OAUTH_ERROR.md`

### **🔐 Logout Seguro:**

Implementação segura com três etapas:

**Fluxo Logout:**
```
Usuário clica "Sair" (HomeScreen)
            ↓
      signOut() (Auth Context)
            ↓
      authService.logout()
            ↓
    ┌─────────────────────┐
    │ 1. Chamar backend   │ → POST /api/v1/auth/logout (refresh_token)
    │    (best-effort)    │    Se falhar: ignora e continua
    └─────────────────────┘
            ↓
    ┌─────────────────────┐
    │ 2. Limpar storage   │ → Remove accessToken, refreshToken, user
    │    (local)          │
    └─────────────────────┘
            ↓
    ┌─────────────────────┐
    │ 3. Limpar apiClient │ → Remove token dos headers HTTP
    │    (memory)         │
    └─────────────────────┘
            ↓
      setUser(null) (Context)
            ↓
    Redireciona para LoginScreen
```

**Implementação:**

```typescript
// auth-service.ts
async logout(): Promise<void> {
  const refreshToken = await this.storage.getRefreshToken();

  if (refreshToken) {
    try {
      // Tenta revogar o refresh token no backend
      await this.repository.logout(refreshToken);
    } catch (_error) {
      // Se falhar, ignora (já vamos limpar localmente)
      console.log('Backend logout falhou, limpando localmente');
    }
  }

  // Limpa tokens do storage e remove do client HTTP
  await this.storage.clearSession();
  getApiClient().removeAuthToken();
}

// auth-context.tsx
async function signOut() {
  try {
    await authService.logout();
    setUser(null); // Limpa estado global
    console.log('[AuthContext] Logout realizado com sucesso');
  } catch (error) {
    console.error('[AuthContext] Erro ao fazer logout:', error);
    // Mesmo com erro, limpa o usuário para retornar ao login
    setUser(null);
    throw error;
  }
}
```

**Características:**
- ✅ **Best-effort no backend** - Se servidor cair, ainda faz logout localmente
- ✅ **Três níveis de limpeza** - Backend, Storage, Client HTTP
- ✅ **Sem memória de tokens** - Remove completamente
- ✅ **Redirecionamento garantido** - Volta sempre para login

## 🎯 Tratamento de Erros

Sistema robusto de tratamento e exibição de erros com mensagens específicas:

### **Normalização de Erros (ApiClient):**

O `ApiHttpClient` normaliza todos os erros em um formato consistente:

```typescript
interface ApiError {
  message: string;         // Mensagem legível para o usuário
  status?: number;         // Status HTTP (401, 400, 500, etc)
  code?: string;           // Código de erro do Axios
  data?: unknown;          // Dados originais da API
}
```

**Fluxo de Normalização:**

```
Backend retorna 401 com: { "message": "Email ou senha não conferem" }
                                          ↓
                            normalizeError(AxiosError)
                                          ↓
                    Extrai: error.response.data.message
                                          ↓
                    Retorna ApiError com message customizada
                                          ↓
                            auth-context captura
                                          ↓
                      Exibe no banner de erro
```

### **Mensagens Específicas por Erro:**

**Autenticação (401):**
```
Backend: "Email ou senha não conferem"
UI: "Email ou senha não conferem" ✅ (específico)
```

**Validação (400):**
```
Backend: "Email já registrado"
UI: "Email já registrado" ✅ (específico)
```

**Servidor (500):**
```
Backend: Erro genérico
UI: "Erro ao fazer login. Tente novamente." ✅ (fallback)
```

**Rede:**
```
Sem conexão
UI: "Erro ao fazer login. Tente novamente." ✅ (fallback)
```

### **Implementação no Auth Context:**

```typescript
async function signIn(email: string, password: string) {
  try {
    const session = await authService.login(email, password);
    setUser(session.user);
  } catch (error: any) {
    // Extrai mensagem normalizada do ApiClient
    let errorMessage = 'Erro ao fazer login. Tente novamente.';
    
    if (typeof error === 'object' && error !== null) {
      // Erro normalizado do ApiClient tem .message e .status
      if (error.message && error.status !== undefined) {
        errorMessage = error.message;
      } 
      // Erro comum tem apenas .message
      else if (error.message) {
        errorMessage = error.message;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    console.error('[AuthContext] Erro ao fazer login:', errorMessage);
    
    // Propaga erro para LoginScreen exibir
    const userError = new Error(errorMessage);
    userError.name = 'AuthenticationError';
    throw userError;
  }
}
```

### **Exibição no UI (LoginScreen):**

```tsx
const onSubmit = async (data: LoginFormData) => {
  setIsLoading(true);
  setErrorMessage('');

  try {
    await signIn(data.email, data.password);
    // Navegação automática via _layout.tsx
  } catch (error: unknown) {
    // Extrai mensagem já normalizada
    const apiError = error as { message?: string };
    setErrorMessage(apiError?.message || 'Erro ao fazer login. Tente novamente.');
  } finally {
    setIsLoading(false);
  }
};

// Renderização
{errorMessage ? (
  <View style={[styles.errorBanner, { backgroundColor: theme.colors.error + '15' }]}>
    <Text style={[styles.errorBannerText, { color: theme.colors.error }]}>
      {errorMessage}
    </Text>
  </View>
) : null}
```

### **Casos de Erro Tratados:**

| Erro | Status | Tratamento |
|------|--------|-----------|
| Credenciais inválidas | 401 | Msg específica do backend |
| Email já registrado | 400 | Msg específica do backend |
| Validação fallhou | 400 | Msg específica do backend |
| Token expirado | 401 | Auto-refresh + fila de requests |
| Sem conexão | — | Msg fallback genérica |
| Servidor indisponível | 503 | Msg fallback genérica |
| Erro desconhecido | — | Msg fallback genérica |

### **Logging para Debug:**

Quando `ENABLE_DEBUG_LOGS=true` no `.env`:

```log
[ApiClient] Response Data: {"message":"Email ou senha não conferem"}
[ApiClient] Extracted message: Email ou senha não conferem
[AuthContext] Erro ao fazer login: Email ou senha não conferem
```

---

## 👤 Tela de Conta - UserService

Sistema para exibir dados reais do usuário autenticado após login com design elegante e responsivo:

### **UserService**
Serviço centralizado para operações de usuário:

```typescript
// user-service.ts
export class UserService {
  constructor(private readonly repository: AuthRepository) {}

  /**
   * Busca dados do usuário autenticado
   * GET /api/v1/users/me
   */
  async getMe(): Promise<User> {
    return this.repository.getCurrentUser();
  }
}
```

**Características:**
- Reutiliza `AuthRepository.getCurrentUser()` que chama `/api/v1/users/me`
- Retorna dados completos do usuário (id, name, email, provider, status, createdAt)
- Tipagem forte com interface `User` do domínio
- Tratamento de erro automático via `ApiClient` com normalização

### **AccountScreen - Design Premium**
Tela dedicada para exibir perfil do usuário com design elegante Fresh Market:

**Fluxo de Dados:**
```
AccountScreen renderiza
        ↓
useEffect → userService.getMe()
        ↓
Loading (ActivityIndicator)
        ├─ Sucesso → Exibe card com dados
        └─ Erro → Exibe banner de erro com retry
```

**Design Visual:**
- 🎯 **Avatar Premium**: 100x100px com borda verde (tema primary) e fundo semi-transparente
- 📝 **Nome em Destaque**: Exibido abaixo do avatar com tipografia grande (18px)
- 📋 **Card de Dados**: Com dividers entre campos para separação clara
- 🏷️ **Labels Stylizados**: Uppercase com letter-spacing, ícones integrados
- 🎨 **Badges com Ícones**: Para método de autenticação (📧 Email/🔐 Google) e status (✓ Ativo)
- 💬 **Espaçamento Respirado**: Padding generoso (56px top, 16px lateral) para não sobrepor câmera/status bar
- 📱 **ScrollView Responsivo**: Suporta telas pequenas e grandes sem problemas
- ✨ **Sombra Sofisticada**: elevation 4 e shadow blur para profundidade

**Dados Exibidos com Ícones:**
- 👤 Avatar visual (emoji)
- 📛 Nome do usuário (campo)
- 📧 Email (campo)
- 🔐 Método de autenticação (badge)
- ✓ Status (badge com ícone)
- 📅 Data de cadastro (campo)

**Componentes UI:**
| Componente | Descrição | Estado |
|-----------|-----------|--------|
| Avatar | Círculo com borda, 100x100 | Sempre visível |
| Card | Container com dividers | Sucesso |
| Badge | Pill com ícone e texto | Autenticação e Status |
| Loading | ActivityIndicator + texto | Carregando |
| Error | Card com aviso e retry | Erro |
| Buttons | Recarregar + Sair | Sempre |

**Estados e Tratamento:**
| Estado | UI | Ação |
|--------|-----|------|
| Loading | ActivityIndicator + "Carregando dados..." | Aguarda dados |
| Sucesso | Card com dados + Botões | Exibe informações completas |
| Erro | Error card com mensagem + Retry | Tenta novamente |
| Logout | Redireciona para login | Via signOut() |

**Paleta de Cores Fresh Market:**
- Avatar border: `theme.colors.primary` (verde)
- Avatar background: `primary + 20%` opacity
- Card background: `theme.colors.surface` (branco)
- Card border: `theme.colors.border` (cinza suave)
- Badges: `primary + 15%` background, `primary` text
- Dividers: `theme.colors.border`
- Labels: `theme.colors.textSecondary` (muted)

**Layout Responsivo:**
```
┌─────────────────────────────┐
│  Minha Conta (32px, bold)   │  ← paddingTop: 56px (respeita camera)
│                             │
│         👤                  │  ← Avatar 100x100
│                             │
│  Miriam Aquino Coutinho     │  ← Nome 18px
│                             │
│  ┌───────────────────────┐  │
│  │ 📛 NOME               │  │
│  │ Miriam Aquino...      │  │
│  │ ─────────────────     │  │
│  │ 📧 EMAIL              │  │
│  │ miriaaquicout@g...    │  │
│  │ ─────────────────     │  │
│  │ 🔐 AUTENTICAÇÃO       │  │
│  │ [📧 Email/Senha]      │  │ ← Badge com borda
│  │ ─────────────────     │  │
│  │ ✓ STATUS              │  │
│  │ [✓ Ativo]             │  │ ← Badge com borda
│  │ ─────────────────     │  │
│  │ 📅 MEMBRO DESDE       │  │
│  │ 27/12/2025            │  │
│  └───────────────────────┘  │
│                             │
│  [Recarregar Dados - verde] │
│  [Sair - outlined]          │
│                             │
└─────────────────────────────┘
```

**Tipografia Refinada:**
- Título: 32px, weight 700, letter-spacing 0.5
- Nome: 18px, weight 600, letter-spacing 0.3
- Labels: 11px, weight 700, uppercase, letter-spacing 1
- Valores: 16px, weight 500, line-height 22
- Badges: 13px, weight 600, letter-spacing 0.2


---

## 🏛️ Padrões e Convenções

### **Clean Architecture:**
- Domain independente de frameworks
- Data implementa interfaces do Domain
- Presentation usa cases do Domain
- Infrastructure fornece serviços externos

### **Nomenclatura:**
- **Arquivos:** kebab-case (`home-screen.tsx`)
- **Componentes:** PascalCase (`HomeScreen`)
- **Functions:** camelCase (`useAppTheme`)
- **Constants:** SCREAMING_SNAKE_CASE (`API_URL`)

### **Imports:**
- Use barrel exports (`@/src/presentation`)
- Organize imports por origem
- Evite ciclos de dependência

## 🚧 Roadmap e Próximos Passos

### **✅ Implementado:**
- [x] Clean Architecture com 4 camadas
- [x] Design System Fresh Market completo
- [x] Sistema de navegação com autenticação
- [x] Tela de Login com validação (RHF + Zod)
- [x] Tela de Register com senha forte
- [x] Componentes reutilizáveis (Button, TextField, Card, etc)
- [x] Validação de formulários robusta
- [x] Configuração de ambiente (.env)
- [x] Tema claro/escuro automático
- [x] **Integração com Backend (API REST)**
- [x] **Sistema de autenticação real (JWT + Refresh Token)**
- [x] **Persistência de sessão com AsyncStorage**
- [x] **Auto-refresh de tokens expirados**
- [x] **Interceptor HTTP com refresh automático em 401**
- [x] **Fila de requests durante refresh**
- [x] **Google OAuth2 integrado (Android/iOS)**
- [x] **Logout seguro com 3 camadas de limpeza**
- [x] **Tratamento de erros com mensagens específicas do backend**
- [x] **Normalização de erros padronizada**
- [x] **Logging de debug para erros HTTP**
- [x] **UserService.getMe() - Buscar dados do usuário**
- [x] **AccountScreen - Tela de perfil do usuário**
- [x] **Loading + Erro tratados na AccountScreen**
- [x] **Exibição de dados reais: nome, email, provider**

### **🚀 Próximas Features:**

**Fase 2 - Listas de Compras:**
- [ ] Criar lista de compras
- [ ] Adicionar/remover itens
- [ ] Marcar itens como comprados
- [ ] Compartilhar listas com outros usuários
- [ ] Categorias de produtos

**Fase 3 - Features Avançadas:**
- [ ] Sugestões de produtos
- [ ] Histórico de compras
- [ ] Listas favoritas/templates
- [ ] Notificações push
- [ ] Modo offline completo

**Fase 4 - Qualidade:**
- [ ] Testes unitários (Jest)
- [ ] Testes E2E (Detox)
- [ ] CI/CD pipeline
- [ ] Monitoramento de erros (Sentry)
- [ ] Analytics

**Fase 5 - Otimizações:**
- [ ] Performance profiling
- [ ] Lazy loading de telas
- [ ] Cache de imagens
- [ ] Otimização de bundle size

---

**Clean Architecture + Design System + Autenticação Completa + Dados Reais = Base sólida para escalar! 🏗️✨**
