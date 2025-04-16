import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  CometChatCallButtons,
  CometChatThemeProvider,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CallingPackage } from '@cometchat/chat-uikit-react-native/src/calls/CallingPackage';

// WhatsApp Colors
const WHATSAPP_GREEN = '#075E54';

interface CallButtonComponentProps {
  user?: CometChat.User;
  group?: CometChat.Group;
  onError?: (error: CometChat.CometChatException) => void;
}

const CallButtonComponent: React.FC<CallButtonComponentProps> = ({
  user,
  group,
  onError,
}) => {
  return (
    <CometChatThemeProvider theme={{ palette: { primary: WHATSAPP_GREEN } }}>
      <View style={styles.container}>
        <CometChatCallButtons
          user={user}
          group={group}
          onError={onError}
        />
      </View>
    </CometChatThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 8,
  },
});

export default CallButtonComponent; 