import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ActivityIndicator, Platform } from 'react-native';
import {
  CometChatGroupMembers,
  CometChatThemeProvider,
  CometChatUiKitConstants,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import Messages from './Messages';

interface GroupMembersScreenProps {
  group: CometChat.Group;
  onBack: () => void;
}

const GroupMembersScreen: React.FC<GroupMembersScreenProps> = ({ group, onBack }) => {
  const [selectedUser, setSelectedUser] = useState<CometChat.User | undefined>();
  const [loading, setLoading] = useState(false);

  const handleUserPress = (user: CometChat.User) => {
    setSelectedUser(user);
  };

  const onLongPressHandler = (groupMember: any) => {
    console.log('Group member long pressed:', groupMember.getName ? groupMember.getName() : groupMember.uid);
  };

  const handleBack = () => {
    if (selectedUser) {
      setSelectedUser(undefined);
    } else {
      onBack();
    }
  };

  if (selectedUser) {
    return (
      <SafeAreaView style={styles.container}>
        <Messages user={selectedUser} onBack={handleBack} />
      </SafeAreaView>
    );
  }
  function onBackHandler(): void {
    handleBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <CometChatThemeProvider>
        <CometChatGroupMembers
          group={group}
          Style={{
            containerStyle: {
              width: '100%',
              height: '100%',
            },
          }}
          // onItemPress={handleUserPress}
          hideBackButton={false} 
          onBack={onBackHandler}
          // onItemLongPress={onLongPressHandler}
          // onError={(error) => {
          //   console.error('Error in GroupMembers component:', error);
          // }}
        />
      </CometChatThemeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'android' ? { marginTop: 25 } : {})
  },
});

export default GroupMembersScreen; 