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
- Banner de erro amigável
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

### **Fluxo Completo:**

```
┌──────────────┐
│ App Inicia   │
│ Verifica auth│
└──────┬───────┘
       │
       ├─ Não autenticado ──► LoginScreen
       │                          │
       │                          ├─ Login email/senha ──► Mock API
       │                          ├─ Login Google ──────► Mock API
       │                          └─ "Criar conta" ────► RegisterScreen
       │                                                      │
       │                                                      └─ Cadastro ──► Mock API
       │                                                                          │
       └─ Autenticado ───────────────────────────────────────────────────────────┘
                                                                                   │
                                                                                   ▼
                                                                            ┌──────────────┐
                                                                            │ HomeScreen   │
                                                                            │ (tabs)       │
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
Request → 401 → Já refreshing? 
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
- [x] **Auto-refresh de tokens expirados no startup**
- [x] **Interceptor HTTP com refresh automático em 401**
- [x] **Fila de requests durante refresh**
- [x] **Google OAuth2 integrado (Android/iOS)**

### **🚀 Próximas Features:**

**Fase 1 - Autenticação (✅ CONCLUÍDA):**
- [x] Integrar API real de autenticação
- [x] Implementar refresh token com rotação
- [x] Tratamento de erros de rede
- [x] Persistência de sessão
- [x] Guard de rotas
- [x] Interceptor automático para renovação de token
- [x] Google OAuth2

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

**Clean Architecture + Design System + Autenticação = Base sólida para escalar! 🏗️✨**

# Shopping List App

Aplicação de Lista de Compras desenvolvida com Clean Architecture e React Native.

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
│   ├── hooks/           # Hooks personalizados
│   └── navigation/      # Configuração de rotas
└── infrastructure/      # 🔧 Serviços Externos
    ├── http/           # Cliente HTTP
    ├── storage/        # Armazenamento local
    └── services/       # Implementações de serviços
```

## 📱 Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router** - Roteamento baseado em arquivos
- **AsyncStorage** - Armazenamento local
- **ESLint + Prettier** - Qualidade e formatação do código

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o desenvolvimento:**
   ```bash
   npm start
   ```

3. **Executar em dispositivos específicos:**
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

## 📋 Scripts Disponíveis

- `npm start` - Iniciar o servidor de desenvolvimento
- `npm run lint` - Verificar código com ESLint
- `npm run lint:fix` - Corrigir problemas automaticamente
- `npm run format` - Formatar código com Prettier
- `npm run typecheck` - Verificar tipos TypeScript
- `npm run check-all` - Executar todas as verificações

## 🏛️ Estrutura Clean Architecture

### Domain Layer (Núcleo)
- **Entities**: Modelos de dados fundamentais
- **Use Cases**: Lógica de negócio da aplicação
- **Repository Interfaces**: Contratos para acesso a dados

### Data Layer
- **Models**: DTOs para comunicação com APIs
- **Data Sources**: Interfaces para fontes de dados
- **Repositories**: Implementações concretas dos contratos

### Presentation Layer
- **Screens**: Telas da aplicação
- **Components**: Componentes UI reutilizáveis
- **Hooks**: Lógica de estado e efeitos

### Infrastructure Layer
- **HTTP**: Cliente para comunicação com APIs
- **Storage**: Serviços de armazenamento local
- **Services**: Implementações de serviços externos

## 📖 Documentação Adicional

- **`CLEAN_ARCHITECTURE.md`** - Guia completo de arquitetura e convenções
- **`COMPONENTS.md`** - Documentação detalhada dos componentes
- **`FRESH_MARKET_PALETTE.md`** - Guia da paleta de cores

## ✨ Features Implementadas

### **🎨 Design System**
- ✅ Paleta Fresh Market (verde minimalista)
- ✅ Design tokens completos (cores, tipografia, espaçamento)
- ✅ Tema claro/escuro automático
- ✅ 60+ tokens de cores
- ✅ Sistema de componentes reutilizáveis

### **🔐 Autenticação**
- ✅ Login com email/senha
- ✅ Login com Google (mock)
- ✅ Registro com validação forte
- ✅ Senha segura (8+ chars, maiúscula, número, especial)
- ✅ Persistência com AsyncStorage
- ✅ Navegação automática baseada em auth
- ✅ Mock API funcionando

### **📱 Componentes**
- ✅ Button (3 tamanhos, loading, disabled)
- ✅ TextField (validação, error states)
- ✅ Card (3 variantes)
- ✅ Loader (3 animações)
- ✅ Divider (horizontal/vertical)

### **🛠️ Validação**
- ✅ React Hook Form + Zod
- ✅ Validação em tempo real
- ✅ Mensagens de erro customizadas
- ✅ Type-safe schemas

### **⚙️ Configuração**
- ✅ Variáveis de ambiente (.env)
- ✅ Configuração por ambiente (dev/staging/prod)
- ✅ Tela de settings para debug
- ✅ API URL configurável

### **🏗️ Arquitetura**
- ✅ Clean Architecture com 4 camadas
- ✅ Separação clara de responsabilidades
- ✅ Barrel exports organizados
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier configurados

---

**🛒 Shopping List App - Base sólida para crescer! 💚✨**

Desenvolvido com Clean Architecture + Design System Fresh Market
