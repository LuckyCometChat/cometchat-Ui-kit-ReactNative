import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  CometChatOutgoingCall,
  CometChatThemeProvider,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

// WhatsApp Colors
const WHATSAPP_GREEN = '#075E54';

interface OutgoingCallScreenProps {
  call: CometChat.Call;
  onEndCall: (call: CometChat.Call) => void;
  onCallAccepted: (sessionId: string) => void;
}

const OutgoingCallScreen: React.FC<OutgoingCallScreenProps> = ({
  call,
  onEndCall,
  onCallAccepted,
}) => {
  return (
    <CometChatThemeProvider theme={{ palette: { primary: WHATSAPP_GREEN } }}>
      <View style={styles.container}>
        <CometChatOutgoingCall
          call={call}
          onEndCallButtonPressed={onEndCall}
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

export default OutgoingCallScreen; 