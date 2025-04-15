import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import {
  CometChatUsers,
  CometChatThemeProvider,
  CometChatUiKitConstants,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import Messages from './Messages';

const UsersScreen: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<CometChat.User | undefined>();
  const [loading, setLoading] = useState(false);

  const handleUserPress = (user: CometChat.User) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(undefined);
  };

  if (selectedUser) {
    return (
      <Messages user={selectedUser} onBack={handleBack} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CometChatThemeProvider>
        <CometChatUsers
          style={{
            containerStyle: {
              width: '100%',
              height: '100%',
            },
          }}
          onItemPress={handleUserPress}
          onError={(error) => {
            console.error('Error in Users component:', error);
          }}
        />
      </CometChatThemeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UsersScreen; 