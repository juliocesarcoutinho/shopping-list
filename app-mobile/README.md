# Shopping List App - React Native (Expo)

Uma aplicação móvel **Lista de Compras** construída com React Native, Expo e TypeScript. Versão nativa do projeto web, com todas as funcionalidades de gerenciamento de listas de compras.

---

## 📱 Sobre o Projeto

Aplicativo mobile-first para gerenciar listas de compras com interface intuitiva e responsiva. Permite criar listas, adicionar itens, controlar quantidades e preços, além de acompanhar o progresso de compras.

**Idioma:** Português Brasileiro (pt-BR)  
**Plataformas:** iOS, Android, Web (via Expo)

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (para testar no celular)

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o servidor Expo
npm start

# No terminal, pressione:
# - 'i' para iOS
# - 'a' para Android
# - 'w' para web
# ou escaneie o QR code com Expo Go (Android) ou Camera (iOS)
```

### Builds

```bash
# Rodar no Android
npm run android

# Rodar no iOS
npm run ios

# Rodar na web
npm run web
```

---

## 🛠️ Stack Tecnológico

### Core
- **React Native** 0.81.5 - Framework mobile
- **Expo** 54.0.30 - Plataforma de desenvolvimento
- **TypeScript** 5.9.2 - Type safety
- **React Navigation** 7.x - Navegação
- **Zustand** 5.0.9 - State management

### UI & Styling
- **React Native Components** - Componentes nativos
- **Lucide React Native** 0.562.0 - Ícones SVG
- **Componentes Customizados** - Button, Input, Card, Label

---

## 📁 Estrutura do Projeto

```
app-mobile/
├── App.tsx                    # Componente raiz
├── src/
│   ├── screens/               # Telas principais (7 telas)
│   ├── components/            # Componentes reutilizáveis
│   ├── store/                 # Zustand stores (Auth + Lists)
│   ├── types/                 # TypeScript types
│   └── styles/                # Paleta de cores
├── app.json                   # Config do Expo
└── package.json              # Dependências
```

---

## 🗺️ Telas & Navegação

| Tela | Descrição |
|------|-----------|
| **SplashScreen** | Tela inicial com auto-redirect |
| **LoginScreen** | Login com email/senha |
| **SignUpScreen** | Cadastro com validação |
| **ForgotPasswordScreen** | Recuperação de senha |
| **DashboardScreen** | Dashboard com listas (FAB) |
| **CreateListScreen** | Criar nova lista |
| **ListDetailsScreen** | Gerenciar itens da lista |

---

## 🎨 Design & Tema

**Paleta de Cores (Verde):**
- Primary: `#059669`
- Secondary: `#10B981`
- Background: `#F0FDF4`
- Foreground: `#064E3B`
- Accent: `#A7F3D0`
- Destructive: `#DC2626`

---

## ✨ Funcionalidades

- ✅ 7 telas completas com navegação
- ✅ Autenticação UI (login, signup, forgot password)
- ✅ Dashboard com 3 listas de exemplo
- ✅ Criar nova lista com formulário
- ✅ Gerenciar itens (add, edit, delete, toggle)
- ✅ Cálculo de total em tempo real
- ✅ Progress indicators
- ✅ 8 itens de exemplo com quantidade e preço
- ✅ State management com Zustand
- ✅ TypeScript type-safe

---

## 🧠 State Management

### useAuthStore
- `user`, `isAuthenticated`
- `login()`, `signup()`, `logout()`

### useListStore
- `lists`, `currentList`
- `addList()`, `updateList()`, `deleteList()`, `setCurrentList()`
- `addItem()`, `updateItem()`, `deleteItem()`, `toggleItemComplete()`

---

## 📚 Recursos

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide React Native](https://lucide.dev/docs/lucide-react-native)

---

**Última atualização:** 28 de dezembro de 2025
