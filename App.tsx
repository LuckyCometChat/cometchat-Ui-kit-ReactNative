/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, View } from 'react-native';
import { CometChatUIKit } from '@cometchat/chat-uikit-react-native';
import { cometChatConfig } from './src/config/cometChatConfig';
import LoginScreen from './src/screens/auth/LoginScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeCometChat();
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem('loggedInUser');
      if (loggedInUser) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      await AsyncStorage.setItem('loggedInUser', 'true');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error saving login state:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const initializeCometChat = async () => {
    try {
      await getPermissions();
      await CometChatUIKit.init(cometChatConfig);
      console.log('CometChatUiKit successfully initialized');
      setIsInitialized(true);
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  };

  const getPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ]);

        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );
        if (!allGranted) {
          console.warn('Not all permissions granted on Android');
        }
      } catch (err) {
        console.warn('Android permissions error:', err);
      }
    }
  };

  if (!isInitialized || isLoading) {
    return null; 
  }

  return (
    <View style={{ 
      flex: 1, 
      marginBottom:20,
      ...(Platform.OS === 'android' ? { marginTop: 30 } : {marginTop: 50 })
    }}>
      {isLoggedIn ? (
        <ChatScreen onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </View>
  );
};

export default App;
