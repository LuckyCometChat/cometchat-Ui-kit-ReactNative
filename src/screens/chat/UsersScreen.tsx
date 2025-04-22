import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  CometChatUsers,
  CometChatThemeProvider,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

interface UsersScreenProps {
  onUserSelect: (user: CometChat.User) => void;
}

const UsersScreen: React.FC<UsersScreenProps> = ({ onUserSelect }) => {
  const usersRequestBuilder = new CometChat.UsersRequestBuilder()
    .setLimit(30)
    .setStatus(CometChat.USER_STATUS.ONLINE);

  return (
    <View style={styles.container}>
      <CometChatThemeProvider>
        <CometChatUsers
          Style={{
            containerStyle: {
              width: '100%',
              height: '100%',
              backgroundColor: '#FFFFFF',
            
            },
            headerContainerStyle: {
              // backgroundColor: "#075E54",
              marginTop: 60,
            },
            
          }}
          onItemPress={onUserSelect}
          // usersRequestBuilder={usersRequestBuilder}
          onError={(error) => {
            console.error('Error in Users component:', error);
          }}
        />
      </CometChatThemeProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
});

export default UsersScreen;