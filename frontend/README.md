# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

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
