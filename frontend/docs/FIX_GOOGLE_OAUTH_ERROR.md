# 🔧 Resolver Erro "Error 400: invalid_request" - Google OAuth

## ❌ Erro Atual

```
Access blocked: Authorization Error
Error 400: invalid_request
```

**Causa:** O redirect URI usado pelo app não está autorizado no Google Console.

---

## ✅ Solução Passo a Passo

### **1️⃣ Descobrir o Redirect URI Correto**

Execute o app e veja o console (Metro bundler):

```bash
cd /home/julio/Documents/GitHub/shopping-list/frontend
npm start --clear
```

No console, procure por:
```
🔗 Google OAuth Redirect URI: <URL AQUI>
```

**Exemplo de redirect URIs possíveis:**
- `shoppinglist://` (custom scheme)
- `exp://192.168.10.5:8081` (Expo Go - desenvolvimento)
- `https://auth.expo.io/@YOUR_USERNAME/shopping-list` (Expo Go - produção)

### **2️⃣ Configurar no Google Console**

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Selecione seu projeto
3. Clique no **OAuth 2.0 Client ID** que você está usando (`407408718192...`)

#### **Opção A: Se você está usando Expo Go (desenvolvimento)**

Você precisa criar um **Android OAuth Client ID** (não Web):

1. Clique em **+ CREATE CREDENTIALS** > **OAuth 2.0 Client ID**
2. Selecione: **Android**
3. Preencha:
   - **Name:** Shopping List Android (Dev)
   - **Package name:** `host.exp.exponent` (Expo Go)
   - **SHA-1:** Obtenha executando:
     ```bash
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```

#### **Opção B: Se você está usando build standalone**

No seu **Web OAuth Client ID** existente:

1. Clique em **EDIT**
2. Em **Authorized redirect URIs**, adicione:
   - `shoppinglist://` (seu custom scheme)
   - `shoppinglist://oauth2redirect` (variação)
   - O URI exato que apareceu no console

**IMPORTANTE:** Clique em **SAVE**!

### **3️⃣ Opção Recomendada: Usar Android Client ID**

Para desenvolvimento com Expo Go, crie um **Android Client ID**:

```
Tipo: Android
Package: host.exp.exponent
SHA-1: <do debug.keystore>
```

Depois, use esse Client ID no `.env`:

```bash
GOOGLE_CLIENT_ID=<NOVO_CLIENT_ID_ANDROID>.apps.googleusercontent.com
```

### **4️⃣ Alternativa Rápida: OAuth Playground**

Se quiser testar rapidamente sem configurar OAuth no app:

1. Acesse: https://developers.google.com/oauthplayground/
2. Configure:
   - OAuth Client ID: `407408718192.apps.googleusercontent.com`
   - Scopes: `email`, `profile`, `openid`
3. Clique em **Authorize APIs**
4. Copie o **ID Token** gerado
5. Use no Postman para testar o backend:
   ```json
   POST http://192.168.10.5:8080/api/v1/auth/google
   {
     "idToken": "<TOKEN_COPIADO>"
   }
   ```

---

## 🎯 Solução Recomendada para Você

### **Passo 1: Criar Android Client ID**

1. Google Console > Credentials > **CREATE CREDENTIALS**
2. Escolha: **OAuth 2.0 Client ID** > **Android**
3. Configure:
   ```
   Name: Shopping List Android Dev
   Package name: host.exp.exponent
   SHA-1: (obtenha com keytool - comando acima)
   ```

### **Passo 2: Atualizar .env**

```bash
# Substitua pelo novo Android Client ID
GOOGLE_CLIENT_ID=<NOVO_ID_ANDROID>.apps.googleusercontent.com
```

### **Passo 3: Reiniciar App**

```bash
npm start --clear
```

### **Passo 4: Testar Login**

1. Abra o app
2. Clique em "Entrar com Google"
3. Deve funcionar agora! ✅

---

## 🔍 Debug: Verificar Redirect URI

Execute isso no terminal enquanto o app está rodando:

```javascript
// No console do Metro bundler, você verá:
🔗 Google OAuth Redirect URI: <O_URI_CORRETO>
```

Use esse URI exato no Google Console.

---

## 📝 Checklist

- [ ] Obter SHA-1 do debug keystore
- [ ] Criar Android OAuth Client ID no Google Console
- [ ] Configurar package name: `host.exp.exponent`
- [ ] Copiar novo Client ID
- [ ] Atualizar `GOOGLE_CLIENT_ID` no `.env`
- [ ] Atualizar `GOOGLE_CLIENT_ID` no backend também
- [ ] Reiniciar app com `npm start --clear`
- [ ] Testar login com Google

---

## 💡 Por que isso acontece?

O **Web Client ID** que você está usando no Postman funciona porque:
- Postman simula um navegador web
- O redirect URI é `urn:ietf:wg:oauth:2.0:oob` ou similar
- Google aceita isso para apps web

Mas no **app mobile (Expo)**:
- Usa custom scheme: `shoppinglist://`
- Google precisa de um **Android/iOS Client ID** específico
- Ou o redirect URI deve estar explicitamente autorizado

---

## 🚀 Próximo Passo

Execute o comando abaixo para obter o SHA-1:

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1
```

Depois, crie o Android Client ID no Google Console com esse SHA-1!

