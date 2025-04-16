import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CometChatUIKit } from '@cometchat/chat-uikit-react-native';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!uid.trim()) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    setLoading(true);
    try {
      const user = await CometChatUIKit.login({ uid });
      console.log('Login successful:', user.getName());
      onLoginSuccess();
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WhatsApp</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={uid}
        onChangeText={setUid}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
    color: '#128C7E', 
  },
  input: {
    backgroundColor: '#F6F6F6',
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loginButton: {
    backgroundColor: '#128C7E', 
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  testUsersContainer: {
    marginTop: 30,
  },
  testUsersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#128C7E',
  },
  testUserButton: {
    backgroundColor: '#F6F6F6',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  testUserText: {
    color: '#128C7E',
    fontSize: 14,
  },
});

export default LoginScreen;