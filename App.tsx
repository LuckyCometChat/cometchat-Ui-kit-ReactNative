/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, View, SafeAreaView } from 'react-native';
import { CometChatUIKit } from '@cometchat/chat-uikit-react-native';
import { cometChatConfig } from './src/config/cometChatConfig';
import LoginScreen from './src/screens/auth/LoginScreen';
import ChatScreen from './src/screens/chat/ChatScreen';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showIconTest, setShowIconTest] = useState(false); // Set to false to skip icon test

  useEffect(() => {
    initializeCometChat();
    
    // Automatically hide the icon test after 5 seconds
    if (showIconTest) {
      setTimeout(() => {
        setShowIconTest(false);
      }, 5000);
    }
  }, []);

  const initializeCometChat = async () => {
    try {
      await getPermissions();
      await CometChatUIKit.init(cometChatConfig);
      console.log('CometChatUiKit successfully initialized');
      setIsInitialized(true);
      // Auto-login for testing
      setIsLoggedIn(true);
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

  if (!isInitialized) {
    return null; 
  }

  return (
    <View style={{ 
      flex: 1, 
      ...(Platform.OS === 'android' ? { marginTop: 30 } : {marginTop: 35 })
    }}>
      {showIconTest ? (
        <IconTest />
      ) : isLoggedIn ? (
        <ChatScreen />
      ) : (
        <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </View>
  );
};

export default App;
