import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import {
  CometChatConversations,
  CometChatUIKit,
  CometChatUiKitConstants,
  CometChatThemeProvider,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import Messages from './Messages';
import UsersScreen from './UsersScreen';
import GroupsScreen from './GroupsScreen';

const ChatScreen: React.FC = () => {
  const [messageUser, setMessageUser] = useState<CometChat.User>();
  const [messageGroup, setMessageGroup] = useState<CometChat.Group>();
  const [activeScreen, setActiveScreen] = useState<'conversations' | 'users' | 'groups'>('conversations');

  const handleBack = () => {
    setMessageUser(undefined);
    setMessageGroup(undefined);
  };

  const renderContent = () => {
    if (messageUser || messageGroup) {
      return (
        <Messages
          user={messageUser}
          group={messageGroup}
          onBack={handleBack}
        />
      );
    }

    switch (activeScreen) {
      case 'users':
        return <UsersScreen />;
      case 'groups':
        return <GroupsScreen />;
      default:
        return (
          <CometChatConversations
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
              },
            }}
            onItemPress={(item: CometChat.Conversation) => {
              if (
                item.getConversationType() ===
                CometChatUiKitConstants.ConversationTypeConstants.user
              ) {
                setMessageUser(item.getConversationWith() as CometChat.User);
                return;
              }
              setMessageGroup(item.getConversationWith() as CometChat.Group);
            }}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CometChatThemeProvider>
        {!messageUser && !messageGroup && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                activeScreen === 'conversations' && styles.activeNavButton,
              ]}
              onPress={() => setActiveScreen('conversations')}
            >
              <Text
                style={[
                  styles.navButtonText,
                  activeScreen === 'conversations' && styles.activeNavButtonText,
                ]}
              >
                Conversations
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                activeScreen === 'users' && styles.activeNavButton,
              ]}
              onPress={() => setActiveScreen('users')}
            >
              <Text
                style={[
                  styles.navButtonText,
                  activeScreen === 'users' && styles.activeNavButtonText,
                ]}
              >
                Users
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                activeScreen === 'groups' && styles.activeNavButton,
              ]}
              onPress={() => setActiveScreen('groups')}
            >
              <Text
                style={[
                  styles.navButtonText,
                  activeScreen === 'groups' && styles.activeNavButtonText,
                ]}
              >
                Groups
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {renderContent()}
      </CometChatThemeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  navButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  activeNavButton: {
    backgroundColor: 'rgba(18, 140, 126, 0.1)',
  },
  navButtonText: {
    color: '#666666',
    fontWeight: '600',
  },
  activeNavButtonText: {
    color: '#128C7E',
  },
});

export default ChatScreen; 