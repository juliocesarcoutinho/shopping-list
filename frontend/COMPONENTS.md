# 🎯 Componentes Reutilizáveis - Documentação

## 📚 **Componentes Implementados**

Sistema completo de componentes reutilizáveis seguindo Design System e Clean Architecture.

### **🔘 Button**

Botão com múltiplas variações, tamanhos e estados.

```tsx
import { Button } from '@/src/presentation/components';

// Variações básicas
<Button title="Primary" onPress={handlePress} />
<Button title="Secondary" onPress={handlePress} variant="secondary" />

// Tamanhos
<Button title="Small" onPress={handlePress} size="small" />
<Button title="Medium" onPress={handlePress} size="medium" />
<Button title="Large" onPress={handlePress} size="large" />

// Estados
<Button title="Disabled" onPress={handlePress} disabled={true} />
<Button title="Loading" onPress={handlePress} loading={true} />
```

**Props:**
- `title: string` - Texto do botão
- `onPress: () => void` - Função chamada ao pressionar
- `variant?: 'primary' | 'secondary'` - Estilo visual
- `disabled?: boolean` - Desabilitado
- `loading?: boolean` - Estado de carregamento
- `size?: 'small' | 'medium' | 'large'` - Tamanho

---

### **📝 TextField**

Campo de entrada de texto com label, erro e estados.

```tsx
import { TextField } from '@/src/presentation/components';

// Básico
<TextField 
  label="Nome"
  placeholder="Digite seu nome"
  value={name}
  onChangeText={setName}
/>

// Com erro
<TextField 
  label="Email"
  value={email}
  onChangeText={setEmail}
  error="Email inválido"
/>

// Variações
<TextField variant="outlined" />  // Com borda (padrão)
<TextField variant="filled" />    // Preenchido

// Desabilitado
<TextField disabled={true} value="Não editável" />
```

**Props:**
- `label?: string` - Label do campo
- `error?: string` - Mensagem de erro
- `disabled?: boolean` - Desabilitado
- `variant?: 'outlined' | 'filled'` - Estilo visual
- Herda todas as props de `TextInput` do React Native

---

### **🃏 Card**

Container com sombra e bordas arredondadas.

```tsx
import { Card } from '@/src/presentation/components';

// Básico (elevado com sombra)
<Card>
  <Text>Conteúdo do card</Text>
</Card>

// Variações
<Card variant="elevated">  // Com sombra (padrão)
<Card variant="outlined">  // Com borda
<Card variant="filled">    // Preenchido

// Clicável
<Card onPress={() => console.log('Card pressed!')}>
  <Text>Card clicável</Text>
</Card>
```

**Props:**
- `children: React.ReactNode` - Conteúdo do card
- `onPress?: () => void` - Torna clicável
- `variant?: 'elevated' | 'outlined' | 'filled'` - Estilo visual

---

### **📏 Divider**

Separador horizontal ou vertical.

```tsx
import { Divider } from '@/src/presentation/components';

// Horizontal (padrão)
<Divider />

// Vertical
<Divider orientation="vertical" />

// Customizado
<Divider 
  thickness={2} 
  color="#FF0000" 
  margin={20}
/>
```

**Props:**
- `orientation?: 'horizontal' | 'vertical'` - Orientação
- `thickness?: number` - Espessura em pixels
- `color?: string` - Cor personalizada
- `margin?: number` - Margem personalizada

---

### **⏳ Loader**

Indicador de carregamento com múltiplas variações.

```tsx
import { Loader } from '@/src/presentation/components';

// Variações
<Loader variant="spinner" />   // Spinner padrão
<Loader variant="dots" />      // Três pontos
<Loader variant="pulse" />     // Círculo pulsante

// Tamanhos
<Loader size="small" />
<Loader size="medium" />
<Loader size="large" />

// Com texto
<Loader 
  variant="spinner" 
  size="large" 
  text="Carregando dados..."
/>

// Cor customizada
<Loader color="#FF6B6B" />
```

**Props:**
- `variant?: 'spinner' | 'dots' | 'pulse'` - Tipo de animação
- `size?: 'small' | 'medium' | 'large'` - Tamanho
- `color?: string` - Cor personalizada
- `text?: string` - Texto abaixo do loader

---

## 🎮 **Playground**

Tela interativa para testar todos os componentes disponível em **app/(tabs)/playground.tsx**.

### **Funcionalidades:**

1. **Demonstrações interativas** de todos os componentes
2. **Estados dinâmicos** - loading, error, disabled
3. **Variações visuais** - todos os variants disponíveis
4. **Testes de interação** - botões clicáveis, campos editáveis
5. **Informações do Design System** - contadores de tokens

### **Como acessar:**

```bash
# No simulador/emulador, navegue para a aba "🎮 Playground"
# Ou acesse via Expo Go escaneando o QR code
```

---

## ✅ **Características dos Componentes**

### **📋 Critérios Atendidos:**

1. **✅ Componentes criados:** Button, TextField, Card, Divider, Loader
2. **✅ Estados suportados:** loading/disabled/error
3. **✅ Visual minimalista:** Design tokens aplicados
4. **✅ Tela Playground:** Demonstração interativa completa

### **🎨 Design System Integration:**

- **Cores:** Paleta centralizada (light/dark mode)
- **Tipografia:** Inter + fallbacks
- **Espaçamento:** Escala baseada em 4px
- **Bordas:** Radius consistente
- **Sombras:** Níveis de elevação
- **Estados:** Feedback visual claro

### **💡 Vantagens:**

1. **Reutilizáveis** - Use em qualquer parte da aplicação
2. **Consistentes** - Design System centralizado
3. **Accessíveis** - Suporte a temas claro/escuro
4. **Tipados** - TypeScript com autocomplete
5. **Testáveis** - Props bem definidas
6. **Escaláveis** - Fácil adicionar novos variants

---

## 🚀 **Próximos Passos**

1. **Adicionar animações** com `react-native-reanimated`
2. **Criar mais componentes:** Modal, Tooltip, Badge, etc.
3. **Implementar testes** unitários e de integração
4. **Documentar Storybook** para design review
5. **Otimizar performance** com `React.memo` se necessário

**Sistema de componentes implementado com excelência! 🎯✨**
