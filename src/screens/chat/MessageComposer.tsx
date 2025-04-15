import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { CometChatMessageComposer } from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

interface MessageComposerProps {
  user?: CometChat.User;
  group?: CometChat.Group;
  parentMessageId?: string;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  user,
  group,
  parentMessageId,
}) => {
  return (
    <View style={styles.container}>
      <CometChatMessageComposer
        user={user}
        group={group}
        parentMessageId={parentMessageId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...(Platform.OS === 'android' ? { marginBottom: 15 } : {})
  }
});

export default MessageComposer; 