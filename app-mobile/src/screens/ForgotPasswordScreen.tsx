import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { colors } from '../styles/colors';

export function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Handle password reset
    alert('Link de redefinição enviado para ' + email);
    navigation.goBack();
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
          paddingTop: 24,
          paddingBottom: 24,
          justifyContent: 'center',
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 32,
            width: 'fit-content',
          }}
        >
          <ArrowLeft size={20} color={colors.mutedForeground} />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 14,
              color: colors.mutedForeground,
            }}
          >
            Voltar para login
          </Text>
        </TouchableOpacity>

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
            Redefinir senha
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.mutedForeground,
            }}
          >
            Digite seu email e enviaremos um link para redefinir sua senha
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 20 }}>
          {/* Email */}
          <View>
            <Label>Email</Label>
            <View style={{ position: 'relative' }}>
              <Mail
                size={20}
                color={colors.mutedForeground}
                style={{ position: 'absolute', left: 16, top: 18, zIndex: 1 }}
              />
              <Input
                placeholder="Digite seu email"
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

          {/* Submit Button */}
          <Button onPress={handleSubmit}>Enviar link de redefinição</Button>
        </View>
      </View>
    </ScrollView>
  );
}
