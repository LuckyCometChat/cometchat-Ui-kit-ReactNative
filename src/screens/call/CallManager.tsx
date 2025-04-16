import React, { useState, useEffect } from 'react';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CallingPackage } from '@cometchat/chat-uikit-react-native/src/calls/CallingPackage';
import IncomingCallScreen from './IncomingCallScreen';
import OutgoingCallScreen from './OutgoingCallScreen';
import OngoingCallScreen from './OngoingCallScreen';

// Get the CometChatCalls from the CallingPackage
const CometChatCalls = CallingPackage.CometChatCalls;

interface CallManagerProps {
  onCallEnded: () => void;
}

enum CallState {
  NO_CALL = 'NO_CALL',
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
  ONGOING = 'ONGOING'
}

const CallManager: React.FC<CallManagerProps> = ({ onCallEnded }) => {
  const [callState, setCallState] = useState<CallState>(CallState.NO_CALL);
  const [currentCall, setCurrentCall] = useState<CometChat.Call | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [callSettings, setCallSettings] = useState<typeof CometChatCalls.CallSettingsBuilder | null>(null);

  useEffect(() => {
    // Listen for incoming calls
    CometChat.addCallListener(
      'CALL_MANAGER_LISTENER',
      new CometChat.CallListener({
        onIncomingCallReceived: (call: CometChat.Call) => {
          setCurrentCall(call);
          setCallState(CallState.INCOMING);
        },
        onOutgoingCallAccepted: (call: CometChat.Call) => {
          setSessionId(call.getSessionId());
          setCallState(CallState.ONGOING);
        },
        onOutgoingCallRejected: () => {
          handleCallEnded();
        },
        onIncomingCallCancelled: () => {
          handleCallEnded();
        },
      })
    );

    return () => {
      CometChat.removeCallListener('CALL_MANAGER_LISTENER');
    };
  }, []);

  const initiateCall = (receiverId: string, receiverType: string, callType: string) => {
    const call = new CometChat.Call(receiverId, callType, receiverType);
    setCurrentCall(call);
    setCallState(CallState.OUTGOING);
    
    // Create call settings builder
    const callSettingsBuilder = new CometChatCalls.CallSettingsBuilder()
      .setSessionID(call.getSessionId())
      .enableDefaultLayout(true)
      .setIsAudioOnlyCall(callType === CometChat.CALL_TYPE.AUDIO);
      
    setCallSettings(callSettingsBuilder);
  };

  const handleAcceptCall = () => {
    if (currentCall) {
      CometChat.acceptCall(currentCall.getSessionId()).then(
        (call: CometChat.Call) => {
          setSessionId(call.getSessionId());
          
          // Create call settings
          const callSettingsBuilder = new CometChatCalls.CallSettingsBuilder()
            .setSessionID(call.getSessionId())
            .enableDefaultLayout(true)
            .setIsAudioOnlyCall(call.getType() === CometChat.CALL_TYPE.AUDIO);
            
          setCallSettings(callSettingsBuilder);
          setCallState(CallState.ONGOING);
        },
        error => {
          console.log('Call acceptance failed with error:', error);
          handleCallEnded();
        }
      );
    }
  };

  const handleDeclineCall = () => {
    if (currentCall) {
      CometChat.rejectCall(currentCall.getSessionId(), CometChat.CALL_STATUS.REJECTED).then(
        () => {
          handleCallEnded();
        },
        error => {
          console.log('Call rejection failed with error', error);
          handleCallEnded();
        }
      );
    }
  };

  const handleEndCall = () => {
    if (currentCall) {
      CometChat.endCall(currentCall.getSessionId()).then(
        () => {
          handleCallEnded();
        },
        error => {
          console.log('Call ending failed with error', error);
          handleCallEnded();
        }
      );
    }
  };

  const handleCallEnded = () => {
    setCallState(CallState.NO_CALL);
    setCurrentCall(null);
    setSessionId('');
    setCallSettings(null);
    onCallEnded();
  };

  const handleCallError = (error: CometChat.CometChatException) => {
    console.log('Call error:', error);
    handleCallEnded();
  };

  if (callState === CallState.NO_CALL) {
    return null;
  }

  if (callState === CallState.INCOMING && currentCall) {
    return (
      <IncomingCallScreen
        call={currentCall}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />
    );
  }

  if (callState === CallState.OUTGOING && currentCall) {
    return (
      <OutgoingCallScreen
        call={currentCall}
        onEndCall={handleEndCall}
        onCallAccepted={() => {}}
      />
    );
  }

  if (callState === CallState.ONGOING && sessionId && callSettings) {
    return (
      <OngoingCallScreen
        sessionId={sessionId}
        callSettingsBuilder={callSettings}
        onError={handleCallError}
      />
    );
  }

  return null;
};

export { CallManager, CallState };
export type { CallManagerProps }; 