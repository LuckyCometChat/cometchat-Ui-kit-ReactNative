/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useState, useRef } from 'react';
import { Platform, PermissionsAndroid, View, AppState, AppStateStatus } from 'react-native';
import { 
  CometChatUIKit, 
  CometChatIncomingCall,
  CometChatThemeProvider,
  CometChatUIEventHandler,
  CometChatUIEvents 
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { cometChatConfig } from './src/config/cometChatConfig';
import LoginScreen from './src/screens/auth/LoginScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const listenerId = 'app';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [callReceived, setCallReceived] = useState(false);
  const incomingCall = useRef<CometChat.Call | CometChat.CustomMessage | null>(null);

  useEffect(() => {
    initializeCometChat();
    checkLoginStatus();
  }, []);


  useEffect(() => {
    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        try {
          const chatUser = await CometChat.getLoggedinUser();
          if (!chatUser) {
            setIsLoggedIn(false);
          } else {
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.log('Error verifying CometChat user on resume:', error);
        }
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Set up call listeners when user is logged in
  useEffect(() => {
    if (isLoggedIn) {

      CometChat.addCallListener(
        listenerId,
        new CometChat.CallListener({
          onIncomingCallReceived: (call: CometChat.Call) => {
            CometChatUIEventHandler.emitUIEvent(
              CometChatUIEvents.ccToggleBottomSheet,
              {
                isBottomSheetVisible: false,
              },
            );
            incomingCall.current = call;
            setCallReceived(true);
          },
          onOutgoingCallRejected: () => {
            incomingCall.current = null;
            setCallReceived(false);
          },
          onIncomingCallCancelled: () => {
            incomingCall.current = null;
            setCallReceived(false);
          },
        }),
      );

      CometChatUIEventHandler.addCallListener(listenerId, {
        ccCallEnded: () => {
          incomingCall.current = null;
          setCallReceived(false);
        },
      });
    }

    return () => {
      // Clean up CometChat listeners
      CometChatUIEventHandler.removeCallListener(listenerId);
      CometChat.removeCallListener(listenerId);
    };
  }, [isLoggedIn]);

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

  // const handleLogout = async () => {
  //   try {
  //     await AsyncStorage.removeItem('loggedInUser');
  //     await CometChatUIKit.logout();
  //     setIsLoggedIn(false);
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //   }
  // };

  const handleLogout = async () => {
    try {
      // First check if user is logged in
      const user = await CometChat.getLoggedinUser();
      if (user) {
        await CometChat.logout();
        console.log("CometChat logout successful");
      }
      
      // Then clear AsyncStorage
      await AsyncStorage.removeItem('loggedInUser');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still try to update UI even if logout fails
      await AsyncStorage.removeItem('loggedInUser');
      setIsLoggedIn(false);
    }
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
    <SafeAreaProvider >
      <CometChatThemeProvider>
        {/* Incoming call UI overlay */}
        {isLoggedIn && callReceived && incomingCall.current ? (
          <CometChatIncomingCall
            call={incomingCall.current}
            onDecline={() => {
              incomingCall.current = null;
              setCallReceived(false);
              
              
            }}
          />
        ) : null}
        
        <View style={{
          flex: 1,
          marginBottom: 20,
        }}>
          {isLoggedIn ? (
            <ChatScreen onLogout={handleLogout} />
          ) : (
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          )}
        </View>
      </CometChatThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;