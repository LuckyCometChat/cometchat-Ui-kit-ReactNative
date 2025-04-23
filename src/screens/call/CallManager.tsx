import React, { useState, useEffect } from 'react';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { 
  CometChatUIKit
} from '@cometchat/chat-uikit-react-native';
import { CallingPackage } from '@cometchat/chat-uikit-react-native/src/calls/CallingPackage';
import IncomingCall from './IncomingCall';
import OutgoingCall from './OutgoingCall';
import OngoingCallScreen from './OngoingCallScreen';
import { cometChatConfig } from '../../config/cometChatConfig';

const CometChatCalls = CallingPackage.CometChatCalls;

interface CallManagerProps {
  onCallEnded: () => void;
  userId?: string;
  callType?: string;
}

enum CallState {
  NO_CALL = 'NO_CALL',
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
  ONGOING = 'ONGOING'
}

const CallManager: React.FC<CallManagerProps> = ({ onCallEnded, userId, callType }) => {
  const [callState, setCallState] = useState<CallState>(CallState.NO_CALL);
  const [currentCall, setCurrentCall] = useState<CometChat.Call | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [callSettings, setCallSettings] = useState<typeof CometChatCalls.CallSettingsBuilder | null>(null);
  const [isUIKitInitialized, setIsUIKitInitialized] = useState(false);

  
  useEffect(() => {
    const initializeUIKit = async () => {
      try {
        const isInitialized = await CometChat.isInitialized();
        if (!isInitialized) {
          console.log("CometChat SDK is not initialized, initializing now");
          
          const appSettings = new CometChat.AppSettingsBuilder()
            .subscribePresenceForAllUsers()
            .setRegion(cometChatConfig.region)
            .build();
            
          await CometChat.init(cometChatConfig.appId, appSettings);
          console.log("CometChat SDK initialized");
        }
        
        await CometChatUIKit.init({
          appId: cometChatConfig.appId,
          region: cometChatConfig.region,
          authKey: cometChatConfig.authKey,
        });
        setIsUIKitInitialized(true);
        console.log("UIKit initialized successfully");
      } catch (error) {
        if (error instanceof Error && error.message.includes('already initialized')) {
          setIsUIKitInitialized(true);
          console.log("UIKit was already initialized");
        } else {
          console.log("UIKit initialization failed with error:", error);
        }
      }
    };
    
    initializeUIKit();
  }, []);

  useEffect(() => {
    if (!isUIKitInitialized) return;

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

    if (userId && callType) {
      initiateCall(userId, CometChat.RECEIVER_TYPE.USER, callType);
    }

    return () => {
      CometChat.removeCallListener('CALL_MANAGER_LISTENER');
    };
  }, [userId, callType, isUIKitInitialized]);

  const initiateCall = (receiverId: string, receiverType: string, callType: string) => {
    try {
      console.log("Initiating call with:", { receiverId, receiverType, callType });
      console.log("CallingPackage:", CallingPackage);
      console.log("CometChatCalls:", CometChatCalls);
      
      const call = new CometChat.Call(receiverId, callType, receiverType);
      console.log("Created call object:", call);
      setCurrentCall(call);
      setCallState(CallState.OUTGOING);
      if (!CometChatCalls || typeof CometChatCalls.CallSettingsBuilder !== 'function') {
        console.error("CometChatCalls.CallSettingsBuilder is not a function", CometChatCalls);
        handleCallEnded();
        return;
      }
      
      const callSettingsBuilder = new CometChatCalls.CallSettingsBuilder();
      
      if (typeof callSettingsBuilder.setSessionID === 'function') {
        callSettingsBuilder.setSessionID(call.getSessionId());
      }
      
      if (typeof callSettingsBuilder.enableDefaultLayout === 'function') {
        callSettingsBuilder.enableDefaultLayout(true);
      }
      
      if (typeof callSettingsBuilder.setIsAudioOnlyCall === 'function') {
        callSettingsBuilder.setIsAudioOnlyCall(callType === CometChat.CALL_TYPE.AUDIO);
      }
        
      console.log("Call settings created successfully:", callSettingsBuilder);
      setCallSettings(callSettingsBuilder);
    } catch (error) {
      console.error("Error initiating call:", error);
      handleCallEnded();
    }
  };

  const handleAcceptCall = () => {
    if (currentCall) {
      CometChat.acceptCall(currentCall.getSessionId()).then(
        (call: CometChat.Call) => {
          setSessionId(call.getSessionId());
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
    return <IncomingCall />;
  }

  if (callState === CallState.OUTGOING && currentCall) {
    return (
      <OutgoingCall 
        call={currentCall} 
        onCallEnded={handleCallEnded} 
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