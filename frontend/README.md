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
API_URL=http://localhost:3000/api    # URL do backend
API_TIMEOUT=30000                     # Timeout em ms

# App Configuration  
APP_NAME=Shopping List                # Nome da aplicação
APP_ENV=development                   # Ambiente (development/staging/production)

# Feature Flags
ENABLE_MOCK_API=true                  # Usar API mock
ENABLE_DEBUG_LOGS=true                # Logs de debug
```

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

Sistema completo de Design Tokens com a **Paleta Fresh Market**:

### **🌿 Paleta Fresh Market**
Paleta de cores focada em frescor e naturalidade, ideal para marketplace:

- **Primary (Verde suave):** `#2ECC71` - Botões principais e ações positivas
- **Secondary (Verde forte):** `#27AE60` - Detalhes interativos e hover
- **Background:** `#F9FAF7` - Fundo confortável e espaçoso
- **Surface:** `#FFFFFF` - Cards e elementos em destaque
- **Text:** `#2C3E50` - Textos principais e cabeçalhos
- **Muted Text:** `#7F8C8D` - Textos secundários e descrições
- **Error:** `#E74C3C` - Alertas e mensagens de erro

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

Componentes prontos para uso com estados e variações:

- **Button** - 3 tamanhos, 2 variantes, loading/disabled
- **TextField** - 2 variantes, error/focus/disabled
- **Card** - 3 variantes, clicável opcional
- **Divider** - horizontal/vertical
- **Loader** - 3 variações de animação

**Teste no Playground:** Aba 🎮 Playground

## 📱 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router** - Roteamento baseado em arquivos
- **AsyncStorage** - Armazenamento local
- **ESLint + Prettier** - Qualidade do código

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

1. **Não autenticado** → Mostra tela de Login
2. **Login bem-sucedido** → Salva no AsyncStorage → Navega para Home
3. **App reinicia** → Carrega auth do storage → Mantém autenticado
4. **Logout** → Remove do storage → Volta para Login

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

## 🚧 Próximos Passos

1. Implementar integração com API real
2. Adicionar testes unitários e E2E
3. Implementar funcionalidades de lista de compras
4. Adicionar gerenciamento de estado global
5. Implementar sincronização offline

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

## 📖 Convenções

Consulte o arquivo `CLEAN_ARCHITECTURE.md` para:
- Convenções de nomenclatura
- Regras de dependência entre camadas
- Exemplos de implementação
- Boas práticas

## 🎯 Próximos Passos

1. **Implementar entidades** em `src/domain/entities/`
2. **Criar use cases** em `src/domain/use-cases/`
3. **Desenvolver telas** em `src/presentation/screens/`
4. **Configurar APIs** em `src/infrastructure/http/`
5. **Adicionar testes** para cada camada

---

**Clean Architecture** garante código organizado, testável e escalável! 🏗️
