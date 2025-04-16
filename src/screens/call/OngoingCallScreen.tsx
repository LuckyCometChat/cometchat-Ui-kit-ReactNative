import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  CometChatOngoingCall,
  CometChatThemeProvider,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CallingPackage } from '@cometchat/chat-uikit-react-native/src/calls/CallingPackage';

// WhatsApp Colors
const WHATSAPP_GREEN = '#075E54';

// Get the CometChatCalls from the CallingPackage
const CometChatCalls = CallingPackage.CometChatCalls;

interface OngoingCallScreenProps {
  sessionId: string;
  callSettingsBuilder: typeof CometChatCalls.CallSettingsBuilder;
  onError?: (error: CometChat.CometChatException) => void;
}

const OngoingCallScreen: React.FC<OngoingCallScreenProps> = ({
  sessionId,
  callSettingsBuilder,
  onError,
}) => {
  return (
    <CometChatThemeProvider theme={{ palette: { primary: WHATSAPP_GREEN } }}>
      <View style={styles.container}>
        <CometChatOngoingCall
          sessionID={sessionId}
          callSettingsBuilder={callSettingsBuilder}
          onError={onError}
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

export default OngoingCallScreen; 