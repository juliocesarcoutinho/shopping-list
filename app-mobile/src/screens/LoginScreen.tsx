import { useNavigation } from '@react-navigation/native';
import { Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { useAuthStore } from '../store/useAuthStore';
import { colors } from '../styles/colors';

export function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async () => {
    try {
      await login(email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'dashboard' as never }],
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 48,
          paddingBottom: 24,
          justifyContent: 'center',
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 48 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: 8,
            }}
          >
            Bem-vindo
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.mutedForeground,
            }}
          >
            Entre para acessar suas listas
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 20 }}>
          {/* Email */}
          <View>
            <Label>E-mail</Label>
            <View style={{ position: 'relative' }}>
              <Mail
                size={20}
                color={colors.mutedForeground}
                style={{ position: 'absolute', left: 16, top: 18, zIndex: 1 }}
              />
              <Input
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor={colors.mutedForeground}
                style={{
                  paddingLeft: 48,
                }}
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Label>Senha</Label>
            <View style={{ position: 'relative' }}>
              <Lock
                size={20}
                color={colors.mutedForeground}
                style={{ position: 'absolute', left: 16, top: 18, zIndex: 1 }}
              />
              <Input
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colors.mutedForeground}
                style={{
                  paddingLeft: 48,
                }}
              />
            </View>
          </View>

          {/* Forgot Password Link */}
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('forgot-password' as never)
              }
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.primary,
                }}
              >
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <Button onPress={handleSubmit}>Entrar</Button>
        </View>

        {/* Sign Up Link */}
        <View
          style={{
            marginTop: 32,
            alignItems: 'center',
            gap: 8,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.mutedForeground,
            }}
          >
            Não tem uma conta?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('signup' as never)}>
            <Text
              style={{
                fontSize: 14,
                color: colors.primary,
                fontWeight: '600',
              }}
            >
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
