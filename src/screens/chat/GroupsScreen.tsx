import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import {
  CometChatGroups,
  CometChatThemeProvider,
  CometChatUiKitConstants,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import Messages from './Messages';
import GroupMembersScreen from './GroupMembersScreen';

const GroupsScreen: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group | undefined>();
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGroupPress = (group: CometChat.Group) => {
    setSelectedGroup(group);
  };

  const handleBack = () => {
    setSelectedGroup(undefined);
    setShowMembers(false);
  };

  const handleViewMembers = () => {
    setShowMembers(true);
  };

  if (showMembers && selectedGroup) {
    return (
      <GroupMembersScreen group={selectedGroup} onBack={handleBack} />
    );
  }

  if (selectedGroup) {
    return (
      <Messages group={selectedGroup} onBack={handleBack} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CometChatThemeProvider>
        <CometChatGroups
          style={{
            containerStyle: {
              width: '100%',
              height: '100%',
            },
          }}
          onItemPress={handleGroupPress}
          onError={(error) => {
            console.error('Error in Groups component:', error);
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

export default GroupsScreen; 