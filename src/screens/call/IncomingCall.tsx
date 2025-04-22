import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CometChatIncomingCall } from '@cometchat/chat-uikit-react-native';

interface IncomingCallProps {
  theme?: any;
  call?: CometChat.Call;
  onCallDeclined?: () => void;
  onCallAccepted?: () => void;
}

const IncomingCall: React.FC<IncomingCallProps> = ({ theme, call, onCallDeclined, onCallAccepted }) => {
  const incomingCall = useRef<CometChat.Call | null>(null);
  const [callReceived, setCallReceived] = useState(false);
  const listenerID = "INCOMING_CALL_LISTENER";

  useEffect(() => {
    // If call is passed as a prop, use it
    if (call) {
      incomingCall.current = call;
      setCallReceived(true);
      return;
    }

    // Add CometChat call listener if no call prop is provided
    CometChat.addCallListener(
      listenerID,
      new CometChat.CallListener({
        onIncomingCallReceived: (call: CometChat.Call) => {
          console.log("Incoming call received in IncomingCall component:", call);
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
  }, [call]);

  const onDeclineHandler = (message: CometChat.BaseMessage) => {
    if (message instanceof CometChat.Call) {
      CometChat.rejectCall(message.getSessionId(), CometChat.CALL_STATUS.REJECTED)
        .then(() => {
          console.log("Call rejected successfully");
          setCallReceived(false);
          if (onCallDeclined) {
            onCallDeclined();
          }
        })
        .catch(error => {
          console.error("Call rejection failed:", error);
          setCallReceived(false);
          if (onCallDeclined) {
            onCallDeclined();
          }
        });
    }
  };

  const onAcceptHandler = (message: CometChat.BaseMessage) => {
    if (message instanceof CometChat.Call) {
      CometChat.acceptCall(message.getSessionId())
        .then((acceptedCall) => {
          console.log("Call accepted successfully:", acceptedCall);
          // The acceptCall method will navigate to the call screen
          if (onCallAccepted) {
            onCallAccepted();
          }
        })
        .catch(error => {
          console.error("Call acceptance failed:", error);
          setCallReceived(false);
          if (onCallAccepted) {
            onCallAccepted();
          }
        });
    } else {
      setCallReceived(false);
    }
  };

  const onErrorHandler = (error: CometChat.CometChatException) => {
    console.error("Incoming call error:", error);
    setCallReceived(false);
    if (onCallDeclined) {
      onCallDeclined();
    }
  };

  // Use either the passed call prop or the call from the listener
  const currentCall = call || incomingCall.current;

  return (
    <>
      {(callReceived || call) && currentCall && (
        <SafeAreaView style={{ flex: 1 }}>
          <CometChatIncomingCall
            call={currentCall}
            onDecline={onDeclineHandler}
            onAccept={onAcceptHandler}
            onError={onErrorHandler}
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
              declineCallButtonStyle: {
                backgroundColor: theme?.declineButtonColor || '#FF5252',
              },
              declineCallTextStyle: {
                color: '#FFFFFF',
              },
              acceptCallButtonStyle: {
                backgroundColor: theme?.acceptButtonColor || '#25D366',
              },
            }}
          />
        </SafeAreaView>
      )}
    </>
  );
};

export default IncomingCall; 