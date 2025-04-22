import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { 
  CometChatOutgoingCall,
  CometChatUiKitConstants,
  CallingPackage
} from '@cometchat/chat-uikit-react-native';
import OngoingCallScreen from './OngoingCallScreen';

const CometChatCalls = CallingPackage.CometChatCalls;

interface OutgoingCallProps {
  call: CometChat.Call;
  onCallEnded?: () => void;
  theme?: any;
}

const OutgoingCall: React.FC<OutgoingCallProps> = ({ call, onCallEnded, theme }) => {
  const listenerID = "OUTGOING_CALL_LISTENER";
  const [acceptedCallSession, setAcceptedCallSession] = useState<string | null>(null);
  const [callSettings, setCallSettings] = useState<any>(null);

  useEffect(() => {
    // Add call listener to handle call events
    CometChat.addCallListener(
      listenerID,
      new CometChat.CallListener({
        onOutgoingCallAccepted: (acceptedCall: CometChat.Call) => {
          console.log("Outgoing call accepted:", acceptedCall);
          // When call is accepted, we'll handle it with CometChat's built-in UI
        },
        onOutgoingCallRejected: (rejectedCall: CometChat.Call) => {
          console.log("Outgoing call rejected:", rejectedCall);
          if (onCallEnded) {
            onCallEnded();
          }
        },
        onCallEndedMessageReceived: (call: CometChat.Call) => {
          console.log("Call ended message received:", call);
          if (onCallEnded) {
            onCallEnded();
          }
        }
      })
    );

    return () => {
      // Remove call listener on component unmount
      CometChat.removeCallListener(listenerID);
    };
  }, [onCallEnded]);
  
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
        if (onCallEnded) {
          onCallEnded();
        }
      });
  };

  const handleError = (error: CometChat.CometChatException) => {
    console.error("Call error:", error);
    setAcceptedCallSession(null);
    if (onCallEnded) {
      onCallEnded();
    }
  };

  // If we have an accepted call session, show the ongoing call screen
  if (acceptedCallSession && callSettings) {
    return (
      <OngoingCallScreen
        sessionId={acceptedCallSession}
        callSettingsBuilder={callSettings}
        onError={handleError}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CometChatOutgoingCall
        call={call}
        onEndCallButtonPressed={cancelCall}
        style={{
          containerStyle: {
            backgroundColor: theme?.backgroundColor || '#075E54',
          },
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
            backgroundColor: theme?.endCallButtonColor || '#FF5252',
            borderRadius: 8,
          },
        }}
      />
    </SafeAreaView>
  );
};

export default OutgoingCall; 