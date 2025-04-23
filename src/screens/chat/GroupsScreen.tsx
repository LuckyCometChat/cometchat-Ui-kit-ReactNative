import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
  CometChatGroups,
  CometChatThemeProvider,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

interface GroupsScreenProps {
  onGroupSelect: (group: CometChat.Group) => void;
}

const GroupsScreen: React.FC<GroupsScreenProps> = ({ onGroupSelect }) => {
  return (
    <View style={styles.container}>
      <CometChatThemeProvider>
        <CometChatGroups
          Style={{
            containerStyle: {
              width: '100%',
              height: '100%',
            },
            headerContainerStyle: {
              paddingTop: 60,
            },
          }}
          onItemPress={onGroupSelect}
          showBackButton={true}
          onError={(error) => {
            console.error('Error in Groups component:', error);
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

export default GroupsScreen; 