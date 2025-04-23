import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { CometChatCallLogs } from "@cometchat/chat-uikit-react-native";

interface CallLogsProps {
  onBack?: () => void;
}

const CallLogs: React.FC<CallLogsProps> = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <CometChatCallLogs onBack={onBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'ios' ? { paddingTop: 20 } : {paddingTop: 30}),
  },
});

export default CallLogs; 