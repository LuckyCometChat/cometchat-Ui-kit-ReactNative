import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  CometChatUsers,
  CometChatThemeProvider,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

interface UsersScreenProps {
  onUserSelect: (user: CometChat.User) => void;
}

const UsersScreen: React.FC<UsersScreenProps> = ({ onUserSelect }) => {
  return (
    <View style={styles.container}>
      <CometChatThemeProvider>
        <CometChatUsers
          style={{
            containerStyle: {
              width: '100%',
              height: '100%',
            },
          }}
          onItemPress={onUserSelect}
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
    marginTop: 2,
  },
});

export default UsersScreen; 