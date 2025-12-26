# Clean Architecture - Convenções de Nomenclatura e Estrutura

## 📁 Estrutura das Camadas

```
src/
├── domain/              # 🧠 Lógica de Negócio (Core)
│   ├── entities/        # Entidades de domínio
│   ├── repositories/    # Interfaces de repositório
│   └── use-cases/       # Casos de uso
├── data/                # 📊 Acesso a Dados
│   ├── models/          # DTOs e modelos de API
│   ├── data-sources/    # Interfaces de fontes de dados
│   └── repositories/    # Implementações de repositório
├── presentation/        # 🎨 Interface do Usuário
│   ├── screens/         # Telas da aplicação
│   ├── components/      # Componentes reutilizáveis
│   ├── hooks/           # Custom hooks
│   └── navigation/      # Configuração de rotas
└── infrastructure/      # 🔧 Serviços Externos
    ├── http/           # Cliente HTTP
    ├── storage/        # Armazenamento local
    └── services/       # Implementações de serviços
```

## 📋 Convenções de Nomenclatura

### Arquivos e Pastas
- **Pastas**: kebab-case (`use-cases`, `data-sources`)
- **Arquivos TS/TSX**: kebab-case (`home-screen.tsx`, `user-repository.ts`)
- **Barrel exports**: `index.ts` em cada pasta

### Código TypeScript

#### Interfaces e Types
```typescript
// Entities - PascalCase
interface ShoppingList { }
interface User { }

// Props para componentes - PascalCase + Props
interface ButtonProps { }
interface HomeScreenProps { }

// Repository interfaces - PascalCase + Repository
interface ShoppingListRepository { }

// Hook return types - PascalCase + Result
interface UseShoppingListsResult { }
```

#### Classes
```typescript
// Use Cases - PascalCase + UseCase
class GetShoppingListsUseCase { }
class CreateShoppingListUseCase { }

// Repository implementations - PascalCase + RepositoryImpl
class ShoppingListRepositoryImpl implements ShoppingListRepository { }

// Services - PascalCase + Service
class ApiHttpClient { }
class CacheService { }
```

#### Functions e Variables
```typescript
// Functions - camelCase
function useShoppingLists() { }
function createShoppingList() { }

// Variables - camelCase
const shoppingLists = []
const userProfile = {}

// Constants - SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const CACHE_EXPIRY_TIME = 3600
```

#### Components
```typescript
// React Components - PascalCase
export function HomeScreen() { }
export function Button() { }
export function LoadingSpinner() { }

// Component files - kebab-case
// home-screen.tsx, loading-spinner.tsx
```

## 🏗️ Dependências entre Camadas

### ✅ Permitido
- `domain` ← não depende de ninguém (independente)
- `data` ← `domain` (implementa interfaces de domínio)
- `presentation` ← `domain` (usa entities e use cases)
- `infrastructure` ← `data` (implementa data sources)

### ❌ Proibido
- `domain` → qualquer outra camada
- `data` → `presentation`
- `presentation` → `infrastructure` (diretamente)

## 📖 Barrel Exports

Cada pasta deve ter um `index.ts` exportando seus módulos:

```typescript
// src/domain/index.ts
export * from './entities'
export * from './repositories'
export * from './use-cases'

// src/presentation/index.ts  
export * from './components'
export * from './hooks'
export * from './screens'
export * from './navigation'
```

## 🎯 Exemplos de Uso

### Use Case
```typescript
// src/domain/use-cases/get-shopping-lists-use-case.ts
export class GetShoppingListsUseCase {
  constructor(private repository: ShoppingListRepository) {}
  
  async execute(): Promise<ShoppingList[]> {
    return this.repository.getAll()
  }
}
```

### Repository Implementation
```typescript
// src/data/repositories/shopping-list-repository-impl.ts
export class ShoppingListRepositoryImpl implements ShoppingListRepository {
  constructor(
    private remoteDataSource: RemoteDataSource,
    private localDataSource: LocalDataSource
  ) {}
  
  async getAll(): Promise<ShoppingList[]> {
    // Implementation logic
  }
}
```

### React Component with Hook
```typescript
// src/presentation/screens/home-screen.tsx
export function HomeScreen() {
  const { shoppingLists, loading } = useShoppingLists(
    getShoppingListsUseCase,
    createShoppingListUseCase
  )
  
  return (
    <View>
      {/* UI components */}
    </View>
  )
}
```

## 🔄 Injeção de Dependências

Para projetos maiores, considere usar um container DI:

```typescript
// src/di/container.ts
export const container = {
  // Infrastructure
  httpClient: new ApiHttpClient(API_BASE_URL),
  storageService: new AsyncStorageService(),
  
  // Data Sources
  remoteDataSource: new ApiRemoteDataSource(/* deps */),
  localDataSource: new CacheLocalDataSource(/* deps */),
  
  // Repositories
  shoppingListRepository: new ShoppingListRepositoryImpl(/* deps */),
  
  // Use Cases
  getShoppingListsUseCase: new GetShoppingListsUseCase(/* deps */),
}
```
## 📱 **Estrutura Híbrida: Expo Router + Clean Architecture**

### **Pasta `app/` - Routing Layer (Expo Router)**
A pasta `app/` é responsável **APENAS** pelo roteamento e deve ser mantida:

```
app/                    # 🚗 ROUTING LAYER
├── _layout.tsx         # Layout principal (ThemeProvider, StatusBar)
├── modal.tsx           # → ModalScreen
└── (tabs)/            # Grupo de navegação por abas
    ├── _layout.tsx     # Layout das abas (BottomTabs)
    ├── index.tsx       # → HomeScreen
    └── explore.tsx     # → ExploreScreen
```

**Responsabilidade:** Define ONDE navegar (routes) e configurações de layout.

### **Pasta `src/` - Business Logic (Clean Architecture)**
A pasta `src/` contém toda a lógica de negócio e UI:

```
src/                    # 🏗️ BUSINESS LOGIC
├── domain/             # Regras de negócio
├── data/               # Acesso a dados  
├── presentation/       # UI Components + Screens
└── infrastructure/     # Serviços externos
```

**Responsabilidade:** Define O QUE mostrar (content) e COMO funciona (logic).

### **🔗 Integração Entre as Camadas**

Cada arquivo em `app/` é apenas um **"bridge"** para `src/presentation/screens/`:

```typescript
// app/(tabs)/index.tsx - APENAS ROUTING
import { HomeScreen } from '@/src/presentation/screens/home-screen';

export default function TabOneScreen() {
  return <HomeScreen />; // ← Delega para Clean Architecture
}

// src/presentation/screens/home-screen.tsx - BUSINESS LOGIC
export function HomeScreen() {
  const { shoppingLists } = useShoppingLists(/* use cases */);
  // ... lógica de negócio e UI
}
```

### **✅ Vantagens desta Estrutura**

1. **Separação Clara**: Routing vs Business Logic
2. **Expo Router**: File-based routing nativo
3. **Clean Architecture**: Lógica organizadas em camadas  
4. **Escalabilidade**: Fácil adicionar novas telas/funcionalidades
5. **Testabilidade**: UI e lógica separadas
6. **Reutilização**: Screens podem ser usadas em outros contexts
