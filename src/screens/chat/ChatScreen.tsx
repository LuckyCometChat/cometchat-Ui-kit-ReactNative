import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
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
import Ionicons from 'react-native-vector-icons/Ionicons';

// WhatsApp Colors
const WHATSAPP_GREEN = '#075E54'; // Header green
const WHATSAPP_LIGHT_GREEN = '#128C7E'; // Secondary green
const WHATSAPP_TEAL = '#25D366'; // Accent green

const ChatScreen = () => {
  const [messageUser, setMessageUser] = useState(null);
  const [messageGroup, setMessageGroup] = useState(null);
  const [activeScreen, setActiveScreen] = useState('conversations');

  const handleBack = () => {
    setMessageUser(undefined);
    setMessageGroup(undefined);
  };

  const handleUserSelect = (user) => {
    setMessageUser(user);
  };

  const handleGroupSelect = (group) => {
    setMessageGroup(group);
  };

  const renderHeader = () => {
    if (messageUser || messageGroup) {
      return null; // Messages component will handle its own header
    }

    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
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
        return <UsersScreen onUserSelect={handleUserSelect} />;
      case 'groups':
        return <GroupsScreen onGroupSelect={handleGroupSelect} />;
      default:
        return (
          <CometChatConversations
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                backgroundColor: '#FFFFFF',
              },
              listStyle: {
                backgroundColor: '#FFFFFF',
              },
              itemStyle: {
                backgroundColor: '#FFFFFF',
                titleStyle: {
                  color: '#000000',
                  fontWeight: '600',
                },
                subtitleStyle: {
                  color: '#666666',
                },
                timeStampStyle: {
                  color: '#25D366',
                },
              },
            }}
            onItemPress={(item) => {
              if (
                item.getConversationType() ===
                CometChatUiKitConstants.ConversationTypeConstants.user
              ) {
                setMessageUser(item.getConversationWith());
                return;
              }
              setMessageGroup(item.getConversationWith());
            }}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={WHATSAPP_GREEN} barStyle="light-content" />
      <CometChatThemeProvider theme={{palette: {primary: WHATSAPP_GREEN}}}>
        {/* {renderHeader()} */}
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
        
        {!messageUser && !messageGroup && (
          <View style={styles.footerTabs}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveScreen('conversations')}
            >
              <Ionicons
                name="chatbubble"
                size={24}
                color={activeScreen === 'conversations' ? WHATSAPP_TEAL : '#9E9E9E'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeScreen === 'conversations' ? WHATSAPP_TEAL : '#9E9E9E' },
                ]}
              >
                Chats
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveScreen('users')}
            >
              <Ionicons
                name="people"
                size={24}
                color={activeScreen === 'users' ? WHATSAPP_TEAL : '#9E9E9E'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeScreen === 'users' ? WHATSAPP_TEAL : '#9E9E9E' },
                ]}
              >
                Users
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveScreen('groups')}
            >
              <Ionicons
                name="people-circle"
                size={24}
                color={activeScreen === 'groups' ? WHATSAPP_TEAL : '#9E9E9E'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeScreen === 'groups' ? WHATSAPP_TEAL : '#9E9E9E' },
                ]}
              >
                Groups
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Floating Action Button for new chat/group */}
        {activeScreen === 'conversations' && !messageUser && !messageGroup && (
          <TouchableOpacity style={styles.floatingButton}>
            <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </CometChatThemeProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 100,
    backgroundColor: WHATSAPP_GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop:40
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop:40
  },
  headerButton: {
    paddingHorizontal: 10,
    paddingTop:10
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  footerTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: WHATSAPP_LIGHT_GREEN,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default ChatScreen;