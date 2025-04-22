import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CometChatIncomingCall } from '@cometchat/chat-uikit-react-native';

interface IncomingCallProps {
  theme?: any;
}

const IncomingCall: React.FC<IncomingCallProps> = ({ theme }) => {
  const incomingCall = useRef<CometChat.Call | null>(null);
  const [callReceived, setCallReceived] = useState(false);
  const listenerID = "INCOMING_CALL_LISTENER";

  useEffect(() => {
    // Add CometChat call listener
    CometChat.addCallListener(
      listenerID,
      new CometChat.CallListener({
        onIncomingCallReceived: (call: CometChat.Call) => {
          console.log("Incoming call received:", call);
          incomingCall.current = call;
          setCallReceived(true);
        },
        onOutgoingCallRejected: (call: CometChat.Call) => {
          console.log("Outgoing call rejected:", call);
          incomingCall.current = null;
          setCallReceived(false);
        },
        onIncomingCallCancelled: (call: CometChat.Call) => {
          console.log("Incoming call cancelled:", call);
          incomingCall.current = null;
          setCallReceived(false);
        },
      })
    );

    return () => {
      // Remove call listener on component unmount
      CometChat.removeCallListener(listenerID);
    };
  }, []);

  const onDeclineHandler = (message: CometChat.BaseMessage) => {
    if (message instanceof CometChat.Call) {
      CometChat.rejectCall(message.getSessionId(), CometChat.CALL_STATUS.REJECTED)
        .then(() => {
          console.log("Call rejected successfully");
          setCallReceived(false);
        })
        .catch(error => {
          console.error("Call rejection failed:", error);
        });
    }
  };

  const onAcceptHandler = (message: CometChat.BaseMessage) => {
    setCallReceived(false);
  };

  const onErrorHandler = (error: CometChat.CometChatException) => {
    console.error("Incoming call error:", error);
  };

  return (
    <>
      {callReceived && incomingCall.current && (
        <SafeAreaView style={{ flex: 1 }}>
          <CometChatIncomingCall
            call={incomingCall.current}
            onDecline={onDeclineHandler}
            onAccept={onAcceptHandler}
            onError={onErrorHandler}
            style={{
              containerStyle: {
                backgroundColor: '#075E54',
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
              declineCallButtonStyle: {
                backgroundColor: '#FF5252',
              },
              declineCallTextStyle: {
                color: '#FFFFFF',
              },
              acceptCallButtonStyle: {
                backgroundColor: '#25D366',
              },
            }}
          />
        </SafeAreaView>
      )}
    </>
  );
};

export default IncomingCall; 