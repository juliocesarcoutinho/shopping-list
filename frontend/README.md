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
- `npm run android` - Rodar no Android
- `npm run ios` - Rodar no iOS
- `npm run web` - Rodar no navegador
- `npm test` - Executar testes unitários
- `npm run lint` - Verificar código com ESLint
- `npm run lint:fix` - Corrigir problemas automaticamente
- `npm run format` - Formatar código com Prettier
- `npm run typecheck` - Verificar tipos TypeScript
- `npm run check-all` - Executar todas as verificações (lint + format + typecheck)

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
  - Texto principal: #064E3B (verde bem escuro)
  - Texto secundário: #0F766E (verde escuro)
  - Botões/FAB/Avatar: #059669 (verde suave)
  - Card total estimado: #E8F8F0 (verde bem suave)
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
  - 2 variantes (primary verde #059669, secondary outlined)
  - Estados: loading, disabled
  - Cor primária: #059669 (verde suave)

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

- **ConfirmModal** 
  - Modal de confirmação customizado (substitui Alert nativo)
  - Design consistente com o app (Fresh Market)
  - Overlay semi-transparente com animação fade
  - 2 botões: cancelar (outline) e confirmar (primary/destructive)
  - Loading state no botão de confirmação
  - Fecha ao tocar fora do modal
  - Variantes: `primary` (verde) e `destructive` (vermelho)

- **Toast** 
  - Feedback não bloqueante com animações suaves
  - Posicionamento configurável (topo/rodapé)
  - Auto-desaparece após duração configurável (padrão: 3s)
  - 3 tipos: `success` (verde), `error` (vermelho), `info` (azul)

- **AddItemModal**
  - Modal que desliza de baixo para cima com animação suave
  - Validação RHF + Zod (nome 2-80, quantidade >=1, preço >=0)
  - Campos: Nome, Quantidade, Preço Unitário (opcional)
  - Loading durante submit
  - Exibição de erros do backend
  - Fecha automaticamente após sucesso e atualiza lista
  - Textos em verde bem escuro (#064E3B)

- **FloatingActionButton (FAB)**
  - Botão circular flutuante no canto inferior direito
  - Cor verde (#059669)
  - Ícone de "+" branco
  - Sombra e elevação para destaque visual
  - Não bloqueia navegação ou interação
  - Design alinhado ao Fresh Market

- **ShoppingItemRow** 
  - Componente de exibição de item de lista de compras
  - Checkbox interativo (marcar/desmarcar comprado)
  - Checkbox marcado com cor #059669 (verde suave)
  - Nome com strike-through quando comprado
  - Quantidade formatada (ex: "2x")
  - Preço unitário e subtotal opcionais (formatação BRL)
  - Estado loading com skeleton placeholder
  - Acessibilidade completa (roles, labels, testIDs)
  - Suporte a callbacks: `onPress` (editar) e `onTogglePurchased` (checkbox)
  - 22 testes cobrindo props, cálculos e formatação
  - Textos em verde bem escuro (#064E3B)

**Exportação centralizada:**
```tsx
// Importação de componentes
import { Button, TextField, ConfirmModal, Toast } from '@/src/presentation/components';
```

Todos os componentes seguem o Design System Fresh Market e são totalmente tipados com TypeScript.

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




## 🖥️ Dashboard de Listas

Após o login, o usuário autenticado é direcionado automaticamente para a tela principal (dashboard) de listas, acessível na tab Home.

### ListsDashboardScreen
Arquivo: `src/presentation/screens/lists/index.tsx`

**Design Moderno:**
- **Header:** Título "Minhas Listas" + subtítulo "Organize suas compras" + avatar com iniciais do usuário
- **Avatar clicável:** Exibe iniciais (ex: "MC" para Miriã Coutinho) e navega para tela de conta
- **Cards com progresso visual:** Cada lista mostra ícone, título, contador "X of Y items" e barra de progresso
- **FAB (+):** Botão flutuante verde para criar nova lista
- **Safe Area Insets:** Layout adaptado para dispositivos modernos (notch, status bar)

**Características técnicas:**
- Usa `GetMyListsUseCase` para buscar listas do backend
- `useFocusEffect` para atualizar automaticamente ao voltar do modal de criação
- Exibe as listas do usuário em cards (ListCard) usando FlatList para performance
- Integra com Clean Architecture (sem lógica de rede na UI)

**Otimização de Performance - itemsCount:**
- Backend retorna `itemsCount` e `pendingItemsCount` no endpoint `GET /lists`
- Cards calculam progresso sem carregar items completos: `purchasedItems = itemsCount - pendingItemsCount`
- Estratégia híbrida com fallback:
  - Dashboard: Usa contadores da API (eficiente)
  - Detalhes: Calcula de items array quando disponível
  ```typescript
  const totalItems = item.itemsCount ?? item.items.length;
  const purchasedItems = item.pendingItemsCount !== undefined
    ? totalItems - item.pendingItemsCount
    : item.items.filter(i => i.isPurchased).length;
  ```
- Reduz payload da API e melhora tempo de carregamento do dashboard

**Estados tratados:**
- **Loading:** skeletons de ListCard (3 placeholders animados)
- **Empty:** SVG + mensagem amigável + botão "Começar minha lista"
- **Erro:** mensagem amigável + botão "Tentar novamente"
- **Sucesso:** renderiza ListCard para cada lista

**Features:**
- **Atualização automática:** Ao criar uma lista, dashboard atualiza sem refresh manual
- Pull-to-refresh (atualização por gesto)
- Layout responsivo com Safe Area Insets
- Espaçamento otimizado entre cards (gap: 8px)
- Acessibilidade básica com labels
- Uso do tema Fresh Market
- Avatar com iniciais do usuário no header
- Menu de 3 pontos em cada card (preparado para ações futuras)
- Uso do tema Fresh Market
- Sem lógica de rede na UI, apenas consumo do use case

## ✨ Funcionalidades Implementadas

### 📝 Criar Nova Lista

Sistema completo de criação de listas seguindo Clean Architecture com design minimalista.

**Arquivo:** `src/presentation/screens/create-list-screen.tsx`

**Design Clean:**
- Background consistente com tema do app
- Labels discretos ("Nome da Lista", "Descrição (optional)")
- Textarea expandida (5 linhas) para descrição
- Botão único "Criar Lista" (verde, sem botão cancelar)
- Layout limpo sem título/subtítulo centralizados

**Características:**
- Modal apresentado ao clicar no FAB do dashboard
- Formulário com React Hook Form + Zod validation
- Campos:
  - **Título:** obrigatório, 3-100 caracteres
  - **Descrição:** opcional, máximo 255 caracteres
- Validação client-side e business logic no use case
- Loading state durante requisição
- Error banner com mensagens específicas do backend
- **Atualização automática:** Após criar, dashboard é atualizado via `useFocusEffect`

**Use Case:** `CreateListUseCase`
- Validações de negócio (comprimento, campos obrigatórios)
- Trim automático de espaços
- Integração com repository pattern
- Retorna erro normalizado do backend

**Fluxo completo:**
1. Usuário clica no FAB (+) ou botão "Começar minha lista" (empty state)
2. Modal de criação é exibido com apresentação 'modal'
3. Preenche título (obrigatório) e descrição (opcional)
4. Validação acontece em tempo real (RHF + Zod)
5. Ao clicar "Criar Lista", use case valida e envia POST para API
6. Sucesso: `router.back()` fecha modal → Dashboard ganha foco → `useFocusEffect` dispara → Lista aparece no topo
7. Erro: error banner com mensagem específica é exibido

**Testes:**
- 8 testes unitários no CreateListUseCase (validações, trim, erro do repositório)
- 4 testes no mapper de listas
- Cobertura de validações e edge cases
- Todos os testes passando ✅

**Navegação:**
- Rota: `/create-list`
- Tipo: Modal (`presentation: 'modal'`)
- Header: "Nova Lista" (padrão do sistema)

### 🗑️ Excluir Lista

Sistema completo de exclusão de listas com UX profissional e design consistente.

**Arquivos:**
- `src/presentation/screens/lists/index.tsx` - Integração na dashboard
- `src/presentation/components/confirm-modal/index.tsx` - Modal de confirmação customizado
- `src/presentation/components/toast/index.tsx` - Feedback não bloqueante
- `src/domain/use-cases/delete-shopping-list-use-case.ts` - Lógica de negócio

**Fluxo de Exclusão:**
1. Usuário clica no menu "⋮" do ListCard
2. **ConfirmModal customizado** abre com:
   - Título: "Excluir lista?"
   - Mensagem: "Tem certeza que deseja excluir a lista \"{nome}\"? Essa ação não pode ser desfeita."
   - Botão secundário: "Cancelar" (outline)
   - Botão destrutivo: "Excluir lista" (vermelho)
3. Ao confirmar:
   - Loading no botão durante exclusão
   - Chama `DELETE /api/v1/lists/{id}`
   - Modal fecha
   - Lista é removida da UI imediatamente
   - **Toast verde** aparece: "Lista excluída com sucesso"
   - Toast desaparece automaticamente após 3 segundos

**Tratamento de Erros:**
- **404:** Remove da UI + Toast "Lista não encontrada (já foi removida)"
- **403:** Toast "Você não tem permissão para deletar esta lista"
- **401:** Fluxo de auth/refresh automático do app
- **Outros:** Toast com mensagem do backend

**Componentes Criados:**

**ConfirmModal** - Modal de confirmação customizado
- Design consistente com o app (cores, tipografia, bordas arredondadas)
- Overlay semi-transparente com animação fade
- Fecha ao tocar fora do modal
- Loading state no botão de confirmação
- Suporta variantes: `destructive` (vermelho) e `primary` (verde)

**Toast** - Feedback não bloqueante
- Animação suave de entrada/saída
- Posicionamento configurável (topo/rodapé)
- Auto-desaparece após duração configurável (padrão: 3s)
- Tipos: `success` (verde), `error` (vermelho), `info`
- Não bloqueia navegação ou interação
- Design alinhado ao Fresh Market

**Use Case:** `DeleteShoppingListUseCase`
- Validação de ID (obrigatório, não vazio)
- Trim automático
- Delega para repository pattern
- Propaga erros normalizados do backend

**Testes:**
- 11 testes unitários no DeleteShoppingListUseCase
- Cobertura: validações, sucesso, 404, 403, 401, 500
- Todos os testes passando ✅

**UX Profissional:**
- ✅ Confirmação clara para ações destrutivas
- ✅ Feedback não bloqueante (Toast)
- ✅ Consistência visual total
- ✅ Experiência fluida sem interrupções
- ✅ Sem Alert nativo do sistema

### ListCard - Design Moderno com Progresso Visual

Arquivo: `src/presentation/components/list-card/index.tsx`

Componente reutilizável para exibir listas com design moderno focado em escaneabilidade.

**Design Visual:**
- **Ícone:** 🛍️ sacola (listas ativas) ou ✓ check verde (100% completas)
- **Background do ícone:** Semi-transparente (20% opacity) verde primário ou sucesso
- **Título:** 17px, weight 600, truncado em 1 linha
- **Contador:** "X of Y items" em texto secundário (14px)
- **Barra de progresso:** Horizontal, 8px altura, com percentual à direita
- **Menu:** 3 pontos no canto superior direito (preparado para ações)
- **Borda verde:** Quando lista está 100% completa
- **Sombra:** Elevation 3 para profundidade

**Props:**
- `title` - Nome da lista
- `itemsCount` - Total de itens
- `purchasedItemsCount` - Itens comprados (para cálculo de progresso)
- `onPress` - Callback ao clicar no card
- `onMenuPress` - Callback ao clicar no menu (opcional)
- `loading` - Exibe skeleton animado

**Estados:**
- **Normal:** Card com progresso < 100%
- **Completo:** Card com progresso = 100% (ícone check verde, borda verde)
- **Loading:** Skeleton com placeholder de ícone, título e barra

**Cálculo de progresso:**
```typescript
const progress = itemsCount > 0 ? (purchasedItemsCount / itemsCount) * 100 : 0;
const isCompleted = progress === 100;
```

**Acessibilidade:**
- `accessibilityRole='button'`
- `accessibilityLabel` com informação completa da lista
- `testID` para testes automatizados

**Uso:**
```tsx
<ListCard
  title="Compras da Semana"
  itemsCount={12}
  purchasedItemsCount={8}
  onPress={() => router.push(`/lists/${listId}`)}
  onMenuPress={() => openMenu()}
/>
```

### 📋 Visualizar Detalhes da Lista

Navegação para tela de detalhes ao clicar em um card de lista.

**Arquivos:**
- `app/lists/[id].tsx` - Rota dinâmica com parâmetros tipados
- `src/presentation/screens/list-details-screen.tsx` - Tela de detalhes (placeholder)

**Rota:**
- Padrão: `/lists/[id]` (dinâmica)
- Parâmetros: `useLocalSearchParams<{ id: string }>()`
- Navegação: `router.push(\`/lists/${item.id}\`)`

**Design da Tela (Placeholder):**

✅ **Header com Safe Area:**
- Botão back (←) funcional
- Título centralizado da lista
- Contador: "X de Y itens" (comprados/total)
- Menu (⋮) para ações futuras

✅ **Card de Total Estimado:**
- Background verde bem suave e claro (#E8F8F0 - primary50)
- Borda verde suave (#D1F2E1 - primary100)
- "Total estimado:" em verde bem escuro (#064E3B)
- Valor em verde suave (#059669)

✅ **Lista de Itens:**
- Checkbox circular (verde #059669 quando marcado)
- Nome do item em verde bem escuro (#064E3B) (strikethrough quando completo)
- Quantidade: # 2x, # 1x
- Preço unitário: $ R$ X.XX (em verde bem escuro, quando disponível)
- Total calculado: (total: R$ XX.XX) quando há preço
- Cards brancos com border sutil
- Gap de 12px entre itens
- Total estimado calculado automaticamente no topo
- Divisor visual entre itens não comprados e comprados
- Reordenação automática: item comprado desce para baixo imediatamente ao marcar

✅ **FAB (Floating Action Button):**
- Botão circular verde (#059669) no canto inferior direito
- Ícone de "+" branco
- Abre modal de adicionar item ao clicar

✅ **Modal de Adicionar Item:**
- Desliza de baixo para cima com animação suave
- Campos: Nome (obrigatório, 2-80 chars), Quantidade (obrigatório, >=1), Preço Unitário (opcional, >=0)
- Validação RHF + Zod em tempo real
- Loading durante submit
- Exibição de erros do backend
- Fecha automaticamente após sucesso e recarrega lista

✅ **Toggle de Item (Marcar/Desmarcar como Comprado):**
- Checkbox interativo com atualização otimista
- Reordenação automática: item comprado desce para baixo imediatamente
- Divisor visual entre itens não comprados e comprados
- Toast de feedback (sucesso/erro) com cor #059669
- Prevenção de double tap com loading state
- Tratamento de erros (401/403/404/500) com mensagens específicas
- Reversão automática em caso de erro

✅ **Placeholder "Em Construção":**
- Ícone e mensagem informando que é visualização mockada
- Explica que funcionalidade completa vem no próximo épico

**Integração com API:**
- ✅ Carrega dados reais via `GetListDetailsUseCase`
- ✅ Estados de loading, error e empty implementados
- ✅ Pull-to-refresh para atualizar lista
- ✅ `useFocusEffect` recarrega automaticamente ao voltar de outras telas
- ✅ Header exibe título e contadores reais
- ✅ Total estimado calculado dinamicamente dos itens
- ✅ Lista de itens renderizada com `FlatList` usando `ShoppingItemRow`
- ✅ Tratamento de erros (404, 500, etc.) com mensagens amigáveis

**Funcionalidade Atual:**
- ✅ Navegação completa (ida e volta)
- ✅ Layout responsivo com Safe Area
- ✅ Design profissional seguindo Fresh Market
- ✅ Parâmetros tipados (listId)
- ✅ Integração completa com API real
- ✅ **Adicionar item à lista** (modal com validação RHF + Zod)
- ✅ **FAB (Floating Action Button)** para adicionar item
- ✅ **AddItemModal** - Modal que desliza de baixo para cima
- ✅ **AddItemToListUseCase** - Caso de uso completo para adicionar itens
- ⏳ Editar/remover itens (próximo épico)

### Fluxo inicial
- Ao logar, o usuário é direcionado para a tab Home, que agora exibe o dashboard de listas (ListsDashboardScreen)
- Navegação e guards de autenticação garantem acesso seguro

---

O acesso às listas do usuário autenticado segue Clean Architecture, desacoplado de UI e com tratamento de erros padronizado.

### Data Source Remoto

Arquivo: `src/data/data-sources/shopping-list-remote-data-source.ts`

Responsável por consumir as APIs de listas usando o `apiClient` padrão:

**Endpoints:**
- `GET /api/v1/lists` - Buscar listas do usuário (retorna metadados com itemsCount/pendingItemsCount) ✅
- `GET /api/v1/lists/{id}` - Buscar detalhes de uma lista específica (retorna lista com items completos) ✅
- `POST /api/v1/lists` - Criar nova lista ✅
- `DELETE /api/v1/lists/{id}` - Deletar lista por ID ✅

```typescript
export class ShoppingListRemoteDataSource {
  async getMyLists(): Promise<ShoppingListDto[]> {
    try {
      return await apiClient.get<ShoppingListDto[]>("/lists");
    } catch (error) {
      // Normalização de erro conforme padrão do projeto
      throw error;
    }
  }

  async getListById(listId: string): Promise<ShoppingListDto> {
    try {
      return await apiClient.get<ShoppingListDto>(`/lists/${listId}`);
    } catch (error) {
      // Repasso erro já normalizado pelo apiClient
      throw error;
    }
  }

  async createList(data: CreateListDto): Promise<ShoppingListDto> {
    try {
      return await apiClient.post<ShoppingListDto>('/lists', data);
    } catch (error) {
      throw error; // Erro já normalizado pelo apiClient
    }
  }

  async deleteList(listId: string): Promise<void> {
    try {
      await apiClient.delete(`/lists/${listId}`);
    } catch (error) {
      throw error; // Erro já normalizado pelo apiClient
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

  async create(list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingList> {
    try {
      const dto = await this.remote.createList({
        title: list.title,
        description: list.description,
      });
      return mapShoppingListDtoToDomain(dto);
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<ShoppingList | null> {
    try {
      const dto = await this.remote.getListById(id);
      return mapShoppingListDtoToDomain(dto);
    } catch (error) {
      // Se for 404, retorno null conforme contrato
      if (error && typeof error === 'object' && 'status' in error) {
        const err = error as { status?: number };
        if (err.status === 404) {
          return null;
        }
      }
      // Repassa outros erros já normalizados
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.remote.deleteList(id);
    } catch (error) {
      throw error; // Erro já normalizado
    }
  }

  // Métodos update, getById implementados com throw Error('Not implemented')
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

### Use Case: Buscar Detalhes de uma Lista

Arquivo: `src/domain/use-cases/get-list-details-use-case.ts`

Orquestra a busca de uma lista específica por ID, incluindo todos os itens **com ordenação aplicada**:

```typescript
export class GetListDetailsUseCase {
  constructor(private readonly repository: ShoppingListRepository) {}

  async execute(listId: string): Promise<ShoppingList | null> {
    // Valido entrada
    if (!listId || listId.trim().length === 0) {
      throw new Error('ID da lista é obrigatório');
    }

    // Busco no repository (já retorna com items mapeados)
    const list = await this.repository.getById(listId.trim());
    if (!list) return null;

    // Aplico ordenação aos itens:
    // 1. Itens não comprados primeiro (isPurchased: false)
    // 2. Depois itens comprados (isPurchased: true)
    // 3. Dentro de cada grupo: por updatedAt desc (mais recente primeiro)
    const sortedItems = [...list.items].sort((a, b) => {
      if (a.isPurchased !== b.isPurchased) {
        return a.isPurchased ? 1 : -1;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return { ...list, items: sortedItems };
  }
}
```

**Características:**
- Retorna `ShoppingList` com items completos **ordenados** ou `null` se não encontrada (404)
- Validação de entrada: ID obrigatório e trim
- Items automaticamente mapeados de DTO → Domain
- **Ordenação automática aplicada:**
  - Itens não comprados aparecem primeiro
  - Itens comprados aparecem depois
  - Ambos os grupos ordenados por `updatedAt` desc (mais recente primeiro)
- Implementação imutável (usa spread operator)
- Propagação de erros normalizados (401, 500, etc)

#### Testes Unitários (13 testes)
- ✅ Lista com itens retornada corretamente (ordenados)
- ✅ Null quando lista não encontrada (404)
- ✅ Trim do listId antes de buscar
- ✅ Erro se listId vazio ou apenas espaços
- ✅ Propagação de erros (401, 500)
- ✅ Lista com items vazio tratada
- ✅ **Ordenação: itens não comprados antes dos comprados**
- ✅ **Ordenação: itens não comprados por updatedAt desc**
- ✅ **Ordenação: itens comprados por updatedAt desc**
- ✅ **Ordenação: mistura correta de ambos os grupos**

---

### Componente: ShoppingItemRow

Arquivo: `src/presentation/components/shopping-item-row/index.tsx`

Componente reutilizável para exibição de itens em listas de compras:

```tsx
interface ShoppingItemRowProps {
  id: string;
  name: string;
  quantity: number;
  unitPrice?: number;
  isPurchased: boolean;
  loading?: boolean;
  onPress?: () => void;
  onTogglePurchased?: (id: string, newValue: boolean) => void;
  testID?: string;
}

// Exemplo de uso
<ShoppingItemRow
  id="item1"
  name="Leite Integral"
  quantity={2}
  unitPrice={4.5}
  isPurchased={false}
  onTogglePurchased={(id, newValue) => handleToggle(id, newValue)}
  onPress={() => handleEditItem('item1')}
  testID="item-leite"
/>
```

**Características:**
- **Checkbox interativo** com ícone checkmark (Ionicons)
- **Nome com strike-through** quando `isPurchased: true`
- **Quantidade formatada** (ex: "2x", "5x")
- **Preço unitário** opcional formatado em BRL ($ R$ 4,50) quando disponível
- **Subtotal calculado** automaticamente (quantity * unitPrice) quando há preço
- **Total estimado** somado no card superior da lista
- **Estado loading** com skeleton placeholder simples
- **Acessibilidade completa:**
  - `accessibilityRole="button"` na row
  - `accessibilityRole="checkbox"` no checkbox
  - `accessibilityLabel` descritivo com status
  - `accessibilityState.checked` no checkbox
  - testIDs em todos elementos principais

**Formatação BRL:**
```typescript
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
```

**Layout:**
- Segue Fresh Market palette (verde #2ECC71 para success)
- Opacidade reduzida (0.6) quando comprado
- Borda verde quando comprado
- Design responsivo com flex layout

#### Testes Unitários (22 testes)
- ✅ Props interface (5 testes) - mínimas, opcionais, callbacks, loading, testID
- ✅ Cálculo de subtotal (3 testes) - básico, decimais, zero
- ✅ Formatação monetária BRL (3 testes) - valores, centavos, inteiros
- ✅ Estados (2 testes) - purchased, loading
- ✅ Callbacks (4 testes) - onTogglePurchased com true/false, onPress
- ✅ Validações de tipos (5 testes) - id, name, quantity, unitPrice, isPurchased

---

---

O projeto implementa modelos, entidades e mappers para listas de compras seguindo Clean Architecture e alinhamento com o backend.

### Entidade de Domínio

Arquivo: `src/domain/entities/index.ts`

```typescript
export interface ShoppingList {
  id: string;
  title: string;
  description?: string;  // Opcional
  items: ShoppingItem[];
  itemsCount?: number;        // Total de itens (útil quando items não está incluído)
  pendingItemsCount?: number;  // Itens não comprados (útil para cálculo de progresso)
  createdAt: string;
  updatedAt: string;
}
```

**Campos de Contagem:**
- `itemsCount`: Retornado por `GET /lists` para eficiência (evita carregar todos os items)
- `pendingItemsCount`: Quantidade de itens não comprados
- `purchasedItemsCount`: Calculado como `itemsCount - pendingItemsCount`
- Quando `items` array está presente (ex: `GET /lists/{id}`), os valores podem ser calculados dinamicamente

### DTO/Model (API)

Arquivo: `src/data/models/index.ts`

Suporta tanto formato **camelCase** (formato real da API) quanto **snake_case** para compatibilidade:

```typescript
export interface ShoppingListDto {
  id: string | number;
  title: string;
  description?: string;
  items?: ShoppingItemDto[];
  itemsCount?: number;
  pendingItemsCount?: number;
  // API pode retornar camelCase ou snake_case
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Mapper DTO → Domain

Arquivo: `src/data/mappers/shopping-list-mapper.ts`

Responsável por converter o DTO do backend para a entidade de domínio, com flexibilidade para ambos formatos:

```typescript
export function mapShoppingListDtoToDomain(dto: ShoppingListDto): ShoppingList {
  // Suporto tanto camelCase quanto snake_case para compatibilidade
  const createdAt = dto.createdAt || dto.created_at;
  const updatedAt = dto.updatedAt || dto.updated_at;

  if (!dto.id || !dto.title || !createdAt || !updatedAt) {
    console.error('[Mapper] DTO recebido:', JSON.stringify(dto, null, 2));
    throw new Error('Campos obrigatórios ausentes em ShoppingListDto');
  }

  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description,
    // Items pode ser null/undefined, trato como array vazio
    items: Array.isArray(dto.items) ? dto.items.map(mapShoppingItemDtoToDomain) : [],
    // Campos de contagem vindos da API (útil quando items não está incluído)
    itemsCount: dto.itemsCount,
    pendingItemsCount: dto.pendingItemsCount,
    createdAt,
    updatedAt,
  };
}

**Estratégia de Mapeamento:**
- `GET /lists`: DTO tem `itemsCount`/`pendingItemsCount`, items vazio → usa contadores da API
- `GET /lists/{id}`: DTO tem items completos → pode calcular dinamicamente ou usar contadores
- Mapper preserva ambos para máxima flexibilidade na UI
```

---

## 🛒 Shopping Item - Itens de Compras

O projeto implementa entidades, DTOs e mappers robustos para itens individuais de compras com validações completas.

### Entidade de Domínio

Arquivo: `src/domain/entities/index.ts`

```typescript
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice?: number;      // Preço unitário opcional
  isPurchased: boolean;    // Status de compra (renomeado de isCompleted)
  createdAt: string;
  updatedAt: string;
}
```

**Decisões de Design:**
- `isPurchased` (não `isCompleted`): Melhor semântica para contexto de compras
- `unitPrice` opcional: Permite itens sem preço definido
- Todos os campos tipados estritamente para segurança

### DTO/Model (API)

Arquivo: `src/data/models/index.ts`

Suporta múltiplas variações de nomenclatura para máxima compatibilidade:

```typescript
export interface ShoppingItemDto {
  id: string | number;
  name: string;
  quantity: number;
  unit?: string;            // Unidade de medida (opcional)
  unit_price?: number;       // Preço unitário (snake_case - compatibilidade)
  unitPrice?: number;        // Preço unitário (camelCase)
  status?: string;           // "PENDING" ou "PURCHASED" (formato do backend)
  is_purchased?: boolean;
  isPurchased?: boolean;
  is_completed?: boolean;   // Sinônimo aceito
  isCompleted?: boolean;    // Sinônimo aceito
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}
```

**Flexibilidade:**
- Aceita `id` como string ou number (converte para string no mapper)
- Suporta snake_case e camelCase simultaneamente
- Campos de status: `status` (backend: "PENDING"/"PURCHASED"), `is_purchased`, `isPurchased`, `is_completed`, `isCompleted`
- Campos de preço: `unit_price` (snake_case) ou `unitPrice` (camelCase) - opcional
- Timestamps: `created_at`/`createdAt`, `updated_at`/`updatedAt`

### Mapper DTO → Domain

Arquivo: `src/data/mappers/shopping-item-mapper.ts`

Mapper robusto com validações completas e mensagens de erro claras:

```typescript
export function mapShoppingItemDtoToDomain(dto: ShoppingItemDto): ShoppingItem {
  // Suporto tanto camelCase quanto snake_case para compatibilidade
  const id = dto.id ? String(dto.id) : undefined;
  const createdAt = dto.createdAt || dto.created_at;
  const updatedAt = dto.updatedAt || dto.updated_at;
  const unitPrice = dto.unitPrice ?? dto.unit_price;
  
  // Suporta campo status do backend ("PENDING"/"PURCHASED") e campos booleanos
  const isPurchased = dto.status === 'PURCHASED' 
    ? true 
    : (dto.isPurchased ?? dto.is_purchased ?? dto.isCompleted ?? dto.is_completed ?? false);

  // Valido campos obrigatórios
  if (!id || !dto.name || dto.quantity === undefined || !createdAt || !updatedAt) {
    const missingFields = [];
    if (!id) missingFields.push('id');
    if (!dto.name) missingFields.push('name');
    if (dto.quantity === undefined) missingFields.push('quantity');
    if (!createdAt) missingFields.push('createdAt/created_at');
    if (!updatedAt) missingFields.push('updatedAt/updated_at');

    throw new Error(
      `Campos obrigatórios ausentes em ShoppingItemDto: ${missingFields.join(', ')}`
    );
  }

  // Valido tipos básicos
  if (typeof dto.name !== 'string') {
    throw new Error('Campo name deve ser uma string');
  }

  if (typeof dto.quantity !== 'number' || dto.quantity < 0) {
    throw new Error('Campo quantity deve ser um número positivo');
  }

  if (unitPrice !== undefined && (typeof unitPrice !== 'number' || unitPrice < 0)) {
    throw new Error('Campo unitPrice deve ser um número positivo quando fornecido');
  }

  return {
    id,
    name: dto.name.trim(),
    quantity: dto.quantity,
    unitPrice,
    isPurchased,
    createdAt,
    updatedAt,
  };
}
```

**Validações Implementadas:**
- ✅ Campos obrigatórios: `id`, `name`, `quantity`, `createdAt`, `updatedAt`
- ✅ Tipo string para `name`
- ✅ Tipo number positivo para `quantity`
- ✅ Tipo number positivo para `unitPrice` (quando fornecido)
- ✅ Mensagens de erro detalhadas listando campos ausentes
- ✅ Trim automático no nome do item
- ✅ Default `false` para `isPurchased` quando não fornecido

### Testes Unitários

**Mapper Tests:** `src/data/mappers/__tests__/shopping-item-mapper.test.ts`

**18 testes cobrindo:**

1. **Mapeamento válido (7 testes):**
   - ShoppingItemDto completo com snake_case
   - ShoppingItemDto com camelCase
   - unitPrice undefined
   - unitPrice = 0 (permitido)
   - Sinônimos: `is_completed` como `is_purchased`
   - Trim do nome do item
   - Default `false` para isPurchased

2. **Validação de campos obrigatórios (6 testes):**
   - id ausente
   - name ausente
   - quantity ausente
   - createdAt/created_at ausentes
   - updatedAt/updated_at ausentes
   - Múltiplos campos ausentes (mensagem detalhada)

3. **Validação de tipos (5 testes):**
   - name não-string
   - quantity não-number
   - quantity negativo
   - unitPrice não-number
   - unitPrice negativo

**Exemplo de teste:**

```typescript
it('deve mapear corretamente um ShoppingItemDto completo com snake_case', () => {
  const dto: ShoppingItemDto = {
    id: '1',
    name: 'Leite Integral',
    quantity: 2,
    unit_price: 4.5,
    is_purchased: false,
    created_at: '2025-12-30T10:00:00Z',
    updated_at: '2025-12-30T10:00:00Z',
  };

  const domain = mapShoppingItemDtoToDomain(dto);

  expect(domain).toEqual({
    id: '1',
    name: 'Leite Integral',
    quantity: 2,
    unitPrice: 4.5,
    isPurchased: false,
    createdAt: '2025-12-30T10:00:00Z',
    updatedAt: '2025-12-30T10:00:00Z',
  });
});
```

---

### Testes Unitários - Resumo Geral

**Mapper Tests:** `src/data/mappers/__tests__/shopping-list-mapper.test.ts`
- Cobertura: Mapeamento válido e ausência de campos obrigatórios (4 tests)

**Mapper Tests:** `src/data/mappers/__tests__/shopping-item-mapper.test.ts`
- Cobertura: Mapeamento válido, validações de campos obrigatórios, validações de tipos (18 tests)

**Repository Tests:** `src/data/repositories/__tests__/shopping-list-repository.test.ts`
- Cobertura: getMyLists success/error (2 tests)

**Use Case Tests:** `src/domain/use-cases/__tests__/get-my-lists-use-case.test.ts`
- Cobertura: success/error (2 tests)

**Create List Use Case Tests:** `src/domain/use-cases/__tests__/create-list-use-case.test.ts`
- Cobertura: validação de título (min/max/trim), descrição (opcional/max), integração com repositório (8 tests)

**Delete List Use Case Tests:** `src/domain/use-cases/__tests__/delete-shopping-list-use-case.test.ts`
- Cobertura: validações, sucesso, 404, 403, 401, 500 (11 tests)

**Get List Details Use Case Tests:** `src/domain/use-cases/__tests__/get-list-details-use-case.test.ts`
- Cobertura: busca com itens, 404, validações, propagação de erros (8 tests)

Total: 51 testes automatizados (excluindo 1 com problema de configuração Jest/expo-constants)

### Padrões Seguidos
- Sem dependência de UI/React em domain/data
- Tipos alinhados com payload do backend
- Separação clara por camadas
- Testes automatizados para todas as camadas
- Validação defensiva para campos opcionais (items, description)
- Suporte a múltiplos formatos de API (camelCase/snake_case)

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

Sistema para exibir dados reais do usuário autenticado após login com design clean e moderno:

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

### **AccountScreen - Design Clean e Elegante**
Tela de perfil do usuário com foco em legibilidade e hierarquia visual:

**Fluxo de Dados:**
```
AccountScreen renderiza
        ↓
useEffect → userService.getMe()
        ↓
Loading (ActivityIndicator)
        ├─ Sucesso → Exibe perfil clean
        └─ Erro → Exibe banner de erro com retry
```

**Filosofia de Design:**
- ✨ **Layout Hero**: Avatar + nome como elemento principal centralizado
- 📋 **Lista simples**: Informações em lista vertical sem cards pesados
- 🎯 **Hierarquia clara**: Labels discretos, valores em destaque
- 🚫 **Sem ruído visual**: Sem caps lock, sem ícones excessivos, sem dividers
- 💚 **Minimalista**: Design limpo e respirado com espaçamento generoso

**Design Visual Refinado:**
- 🎯 **Avatar com Iniciais**: 96x96px com iniciais reais do usuário (ex: "MC" para Miriã Coutinho)
- 📝 **Nome em Destaque**: 24px, weight 600, centralizado abaixo do avatar
- 📋 **Informações Clean**: Lista simples com gap de 24px entre campos
- 🏷️ **Labels Discretos**: 13px, weight 500, sem uppercase, sem ícones
- 💬 **Valores em Foco**: 17px, weight 500, maior destaque que labels
- 📅 **Data Formatada**: "29 de dezembro de 2025" (formato extenso pt-BR)
- 💚 **Status Verde**: Cor success para indicar conta ativa
- 🔘 **Botões Sutis**: Ambos secondary/medium para não roubar atenção do conteúdo

**Dados Exibidos (sem duplicação):**
- Avatar com iniciais do usuário
- Nome completo (hero section)
- Email
- Método de autenticação (texto simples: "Email/Senha" ou "Google")
- Status (verde se ativo)
- Data de cadastro (formato extenso)

**Componentes UI:**
| Componente | Descrição | Estado |
|-----------|-----------|--------|
| Hero Section | Avatar + Nome centralizado | Sempre visível |
| Info Section | Lista de informações com gap 24px | Sucesso |
| Loading | ActivityIndicator + texto | Carregando |
| Error | Card com aviso e retry | Erro |
| Buttons | Recarregar + Sair (secondary) | Sempre |

**Estados e Tratamento:**
| Estado | UI | Ação |
|--------|-----|------|
| Loading | ActivityIndicator + "Carregando dados..." | Aguarda dados |
| Sucesso | Hero + Info list + Botões | Exibe informações completas |
| Erro | Error card com mensagem + Retry | Tenta novamente |
| Logout | Redireciona para login | Via signOut() |

**Layout Responsivo e Limpo:**
```
┌─────────────────────────────┐
│                             │  ← paddingTop: 72px
│         MC                  │  ← Avatar 96x96 com iniciais
│                             │
│  Miriã Aquino Coutinho      │  ← Nome 24px, weight 600
│                             │  ← gap: 48px
│  Email                      │  ← Label 13px discreto
│  miria@email.com            │  ← Valor 17px em destaque
│                             │  ← gap: 24px
│  Autenticação               │
│  Email/Senha                │  ← Texto simples, sem badge
│                             │
│  Status                     │
│  Ativo                      │  ← Verde (success color)
│                             │
│  Membro desde               │
│  29 de dezembro de 2025     │  ← Data formatada pt-BR
│                             │  ← gap: 48px
│  [Recarregar Dados]         │  ← secondary/medium
│  [Sair]                     │  ← secondary/medium
│                             │
└─────────────────────────────┘
```

**Tipografia Refinada:**
- Avatar iniciais: 36px, weight 700, color primary
- Nome: 24px, weight 600, letter-spacing 0.2
- Labels: 13px, weight 500, letter-spacing 0.2
- Valores: 17px, weight 500, line-height 24
- Espaçamento hero: 48px
- Espaçamento info: 24px entre campos

**Melhorias UX:**
- ✅ Removido título "Minha Conta" duplicado
- ✅ Removido card grande com sombra pesada
- ✅ Removido nome duplicado (antes aparecia 2x)
- ✅ Removido labels em CAPS LOCK com ícones
- ✅ Removido badges visuais excessivos
- ✅ Removido dividers entre campos
- ✅ Adicionado iniciais reais no avatar
- ✅ Adicionado data em formato extenso pt-BR
- ✅ Reduzido tamanho dos botões (medium vs large)
- ✅ Layout mais respirado (padding 24px, gaps 24px/48px)


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
- [x] Componentes reutilizáveis (Button, TextField, Card, FAB, etc)
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
- [x] **Dashboard de Listas - Visualização das listas do usuário**
- [x] **CreateListUseCase - Caso de uso para criação de listas**
- [x] **CreateListScreen - Tela modal para criar nova lista**
- [x] **Validação de formulário (título: 3-100 chars, descrição: 0-255 chars)**
- [x] **Mapper flexível - Suporta camelCase e snake_case da API**
- [x] **Safe Area Insets - Layout responsivo para dispositivos modernos**
- [x] **Testes unitários - 78 testes cobrindo use cases, mappers, repositories e componentes**
- [x] **ConfirmModal - Modal de confirmação customizado (substitui Alert nativo)**
- [x] **Toast - Feedback não bloqueante com animações (success/error)**
- [x] **DeleteShoppingListUseCase - Exclusão de listas com validações**
- [x] **Fluxo UX profissional para exclusão (modal + toast)**
- [x] **Navegação para detalhes da lista - Rota dinâmica /lists/[id]**
- [x] **ListDetailsScreen - Tela de detalhes funcional com dados reais da API**
- [x] **Parâmetros tipados - useLocalSearchParams com TypeScript**
- [x] **ShoppingItem - Entidade de domínio para itens de compras**
- [x] **ShoppingItemDto - DTO com suporte snake_case e camelCase + campo status e unitPrice**
- [x] **shopping-item-mapper - Mapper robusto com 18 testes (validações completas)**
- [x] **Suporte ao campo status do backend ("PENDING"/"PURCHASED") convertido para isPurchased**
- [x] **Suporte ao campo unitPrice para cálculo de total estimado**
- [x] **Validações de tipos e campos obrigatórios com mensagens claras**
- [x] **getListById - Endpoint para buscar lista específica com items completos**
- [x] **GetListDetailsUseCase - Buscar detalhes de lista com validações (13 testes)**
- [x] **Ordenação de itens - Não comprados primeiro, depois comprados, por updatedAt desc**
- [x] **itemsCount e pendingItemsCount - Campos otimizados para dashboard**
- [x] **Estratégia híbrida - Cards usam contadores da API, detalhes calculam de items**
- [x] **ShoppingItemRow - Componente reutilizável para exibição de itens (22 testes)**
- [x] **Checkbox interativo com formatação BRL e subtotal automático**
- [x] **AddItemToListUseCase - Caso de uso para adicionar item à lista**
- [x] **AddItemModal - Modal de adicionar item com validação RHF + Zod**
- [x] **FAB integrado na ListDetailsScreen para adicionar item**
- [x] **Validação completa: nome (2-80), quantidade (>=1), preço (>=0)**
- [x] **Fluxo completo: abrir modal → validar → adicionar → atualizar lista automaticamente**
- [x] **Cores atualizadas: textos #064E3B, botões/FAB #059669, card total #E8F8F0**
- [x] **AddItemToListUseCase - Caso de uso para adicionar item à lista**
- [x] **AddItemModal - Modal de adicionar item com validação RHF + Zod**
- [x] **FAB integrado na ListDetailsScreen para adicionar item**
- [x] **Validação completa: nome (2-80), quantidade (>=1), preço (>=0)**
- [x] **Fluxo completo: abrir modal → validar → adicionar → atualizar lista automaticamente**
- [x] **Cores atualizadas: textos #064E3B, botões/FAB #059669, card total #E8F8F0**
- [x] **ToggleItemPurchasedUseCase - Caso de uso para marcar/desmarcar item como comprado**
- [x] **PATCH updateItem - Endpoint para atualizar item (datasource + repository)**
- [x] **Atualização otimista com reordenação automática**
- [x] **Divisor visual entre itens comprados e não comprados**
- [x] **Toast de feedback integrado (sucesso/erro) com cor #059669**
- [x] **Prevenção de double tap bug com loading state**
- [x] **Testes unitários do ToggleItemPurchasedUseCase (11 testes)**

### **🚀 Próximas Features:**

**Fase 2 - Listas de Compras:**
- [x] Criar lista de compras
- [x] Listar listas do usuário (com itemsCount/pendingItemsCount)
- [x] Excluir lista (com modal de confirmação customizado + toast)
- [x] Visualizar detalhes de uma lista (navegação + tela funcional)
- [x] Base de domínio para ShoppingItem (entity + DTO + mapper)
- [x] getListById no datasource e repository
- [x] GetListDetailsUseCase com validações completas
- [x] Ordenação de itens (não comprados primeiro, por updatedAt desc)
- [x] ShoppingItemRow - Componente de exibição de item
- [x] Integrar dados reais no ListDetailsScreen (GET /api/v1/lists/{id})
- [x] Estados de loading, error e empty na tela de detalhes
- [x] Pull-to-refresh para atualizar lista
- [x] useFocusEffect para recarregar ao voltar de outras telas
- [x] Exibição de preços unitários e cálculo de total estimado
- [x] Card de total estimado sempre visível (mostra R$ 0,00 quando não há preços)
- [x] **Adicionar item à lista** (modal com validação RHF + Zod)
- [x] **AddItemToListUseCase** implementado e funcional
- [x] **AddItemModal** com animação slide up e validação completa
- [x] **FAB** integrado para adicionar item
- [x] **Atualização automática** da lista após adicionar item
- [x] **Cores atualizadas:** textos #064E3B, botões/FAB #059669, card total #E8F8F0
- [x] **Marcar/desmarcar item como comprado** (toggle com atualização otimista)
- [x] **ToggleItemPurchasedUseCase** implementado e funcional
- [x] **PATCH updateItem** no datasource e repository
- [x] **Reordenação automática** após toggle (item desce para baixo imediatamente)
- [x] **Divisor visual** entre itens comprados e não comprados
- [x] **Toast de feedback** integrado (sucesso/erro)
- [x] **Prevenção de double tap** com loading state
- [ ] Repository e Data Source para operações de itens (editar/remover)
- [ ] Use Cases para editar/remover itens
- [ ] Editar lista existente
- [x] Marcar itens como comprados (toggle com atualização otimista e reordenação automática)
- [ ] Compartilhar listas com outros usuários
- [ ] Categorias de produtos

**Fase 3 - Features Avançadas:**
- [ ] Sugestões de produtos
- [ ] Histórico de compras
- [ ] Listas favoritas/templates
- [ ] Notificações push
- [ ] Modo offline completo

**Fase 4 - Qualidade:**
- [x] Testes unitários (Jest) - Use cases, mappers, repositories
- [ ] Testes de componentes (React Testing Library)
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

**Clean Architecture + Design System + Autenticação Completa + Gestão de Listas + Dados Reais = Base sólida para escalar! 🏗️✨**
