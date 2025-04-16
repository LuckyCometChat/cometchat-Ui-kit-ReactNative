import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  CometChatIncomingCall,
  CometChatThemeProvider,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

// WhatsApp Colors
const WHATSAPP_GREEN = '#075E54';

interface IncomingCallScreenProps {
  call: CometChat.Call;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallScreen: React.FC<IncomingCallScreenProps> = ({
  call,
  onAccept,
  onDecline,
}) => {
  return (
    <CometChatThemeProvider theme={{ palette: { primary: WHATSAPP_GREEN } }}>
      <View style={styles.container}>
        <CometChatIncomingCall
          call={call}
          onAccept={onAccept}
          onDecline={onDecline}
          disableSoundForCalls={false}
        />
      </View>
    </CometChatThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default IncomingCallScreen; 