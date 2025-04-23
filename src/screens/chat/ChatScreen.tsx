import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Alert, SafeAreaView } from 'react-native';
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
import { CallManager } from '../call/CallManager';
import CallLogs from '../call/CallLogs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// WhatsApp Colors
const WHATSAPP_GREEN = '#075E54'; 
const WHATSAPP_LIGHT_GREEN = '#128C7E'; 
const WHATSAPP_TEAL = '#25D366'; 

interface ChatScreenProps {
  onLogout?: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onLogout }) => {
  const [messageUser, setMessageUser] = useState<CometChat.User | undefined>(undefined);
  const [messageGroup, setMessageGroup] = useState<CometChat.Group | undefined>(undefined);
  const [activeScreen, setActiveScreen] = useState('conversations');
  const [showCallManager, setShowCallManager] = useState(false);

  const handleBack = () => {
    setMessageUser(undefined);
    setMessageGroup(undefined);
  };

  const handleUserSelect = (user: CometChat.User) => {
    setMessageUser(user);
  };

  const handleGroupSelect = (group: CometChat.Group) => {
    setMessageGroup(group);
  };

  const handleCallEnded = () => {
    setShowCallManager(false);
  };

  // const handleLogout = async () => {
  //   Alert.alert(
  //     'Logout',
  //     'Are you sure you want to logout?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Logout',
  //         onPress: async () => {
  //           try {
  //             await CometChatUIKit.logout();
  //             await AsyncStorage.removeItem('loggedInUser');
  //             if (onLogout) {
  //               onLogout();
  //             }
  //           } catch (error) {
  //             console.error('Logout failed:', error);
  //           }
  //         },
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  // };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              const user = await CometChat.getLoggedinUser();
              if (!user) {
                console.log("No user logged in to logout");
                await AsyncStorage.removeItem('loggedInUser');
                if (onLogout) {
                  onLogout();
                }
                return;
              }
              
             
              await CometChat.logout();
              console.log("CometChat logout successful");
              
         
              await AsyncStorage.removeItem('loggedInUser');
              
         
              if (onLogout) {
                onLogout();
              }
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert(
                'Logout Error',
                'Failed to logout. Please try again.'
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderContent = () => {
    if (showCallManager) {
      return <CallManager onCallEnded={handleCallEnded} />;
    }

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
      case 'calls':
        return <CallLogs onBack={() => setActiveScreen('conversations')} />;
      default:
        return (
          <CometChatConversations
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                backgroundColor: '#FFFFFF',
                
              },
              headerContainerStyle: {
                backgroundColor: "#075E54",
                borderBottomWidth: 0,
                paddingTop: 60,
              },
              titleStyle: {
                color: '#FFFFFF',
                fontWeight: 'bold',
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
                badgeStyle: {
                  containerStyle: {
                    backgroundColor: "#075E54",
                  },
                },
              },
            }}
            onItemPress={(item) => {
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
    <View style={styles.container}>
      <StatusBar backgroundColor={WHATSAPP_GREEN} barStyle="light-content" />
      <CometChatThemeProvider theme={{palette: {primary: WHATSAPP_GREEN}}}>
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
        
        {!messageUser && !messageGroup && !showCallManager && (
          <View style={styles.footerTabs}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveScreen('conversations')}
            >
              <Ionicons
                name="chatbubble"
                size={24}
                color={activeScreen === 'conversations' ? '#075E54' : '#9E9E9E'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeScreen === 'conversations' ? '#075E54' : '#9E9E9E' },
                ]}
              >
                Chats
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveScreen('calls')}
            >
              <Ionicons
                name="call"
                size={24}
                color={activeScreen === 'calls' ? '#075E54' : '#9E9E9E'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeScreen === 'calls' ? '#075E54' : '#9E9E9E' },
                ]}
              >
                Calls
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveScreen('users')}
            >
              <Ionicons
                name="people"
                size={24}
                color={activeScreen === 'users' ? '#075E54' : '#9E9E9E'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeScreen === 'users' ? '#075E54' : '#9E9E9E' },
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
                color={activeScreen === 'groups' ? '#075E54' : '#9E9E9E'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeScreen === 'groups' ? '#075E54' : '#9E9E9E' },
                ]}
              >
                Groups
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeScreen === 'conversations' && !messageUser && !messageGroup && !showCallManager && (
          <TouchableOpacity style={styles.floatingButton}
          onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            {/* <ion-icon name="log-out-outline"></ion-icon> */}
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
    elevation: 0,
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