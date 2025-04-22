import React from 'react';
import { SafeAreaView } from 'react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { 
  CometChatOutgoingCall, 
  CometChatUiKitConstants 
} from '@cometchat/chat-uikit-react-native';

interface OutgoingCallProps {
  call: CometChat.Call;
  onCallEnded?: () => void;
  theme?: any;
}

const OutgoingCall: React.FC<OutgoingCallProps> = ({ call, onCallEnded, theme }) => {
  
  const cancelCall = (callObj: CometChat.Call) => {
    console.log("Ending call with session ID:", callObj.getSessionId());
    CometChat.endCall(callObj.getSessionId())
      .then(() => {
        console.log("Call ended successfully");
        if (onCallEnded) {
          onCallEnded();
        }
      })
      .catch(error => {
        console.error("Call ending failed:", error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CometChatOutgoingCall
        call={call}
        onEndCallButtonPressed={cancelCall}
        style={{
          avatarStyle: {
            containerStyle: {
              backgroundColor: '#128C7E',
              borderRadius: 8,
            },
            imageStyle: {
              borderRadius: 8,
            },
          },
          endCallButtonStyle: {
            backgroundColor: '#FF5252',
            borderRadius: 8,
          },
        }}
      />
    </SafeAreaView>
  );
};

export default OutgoingCall; 