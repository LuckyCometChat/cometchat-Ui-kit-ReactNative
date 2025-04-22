import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  CometChatMessageHeader,
  CometChatThreadHeader,
  CometChatUiKitConstants
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import GroupMembersScreen from './GroupMembersScreen';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import { cometChatConfig } from '../../config/cometChatConfig';
import IncomingCall from '../call/IncomingCall';
import OutgoingCall from '../call/OutgoingCall';

interface MessagesProps {
  user?: CometChat.User;
  group?: CometChat.Group;
  onBack: () => void;
}

const Messages: React.FC<MessagesProps> = ({ user, group, onBack }) => {
  const [showMembers, setShowMembers] = useState(false);
  const [parentMessage, setParentMessage] = useState<CometChat.BaseMessage | null>(null);
  const [cometChatInitialized, setCometChatInitialized] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [outgoingCall, setOutgoingCall] = useState<CometChat.Call | null>(null);
  
  const handleViewMembers = () => {
    setShowMembers(true);
  };

  const handleBackFromMembers = () => {
    setShowMembers(false);
  };

  const handleBackFromThread = () => {
    setParentMessage(null);
  };

  const initiateAudioCall = () => {
    if (user) {
      const callObject = new CometChat.Call(
        user.getUid(),
        CometChatUiKitConstants.MessageTypeConstants.audio,
        CometChatUiKitConstants.ReceiverTypeConstants.user
      );

      CometChat.initiateCall(callObject)
        .then((call) => {
          console.log("Audio call initiated successfully:", call);
          setOutgoingCall(call);
        })
        .catch(error => {
          console.error("Error initiating audio call:", error);
        });
    }
  };

  const initiateVideoCall = () => {
    if (user) {
      const callObject = new CometChat.Call(
        user.getUid(),
        CometChatUiKitConstants.MessageTypeConstants.video,
        CometChatUiKitConstants.ReceiverTypeConstants.user
      );

      CometChat.initiateCall(callObject)
        .then((call) => {
          console.log("Video call initiated successfully:", call);
          setOutgoingCall(call);
        })
        .catch(error => {
          console.error("Error initiating video call:", error);
        });
    }
  };

  const handleCallEnded = () => {
    setOutgoingCall(null);
  };
 


  if (showMembers && group) {
    return <GroupMembersScreen group={group} onBack={handleBackFromMembers} />;
  }

  if (outgoingCall) {
    return <OutgoingCall call={outgoingCall} onCallEnded={handleCallEnded} />;
  }

  const AuxiliaryButtonView = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={initiateAudioCall}
        >
          <Text style={styles.callButtonText}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={initiateVideoCall}
        >
          <Text style={styles.callButtonText}>📹</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* <IncomingCall /> */}
      <CometChatMessageHeader 
        user={user} 
        group={group} 
        onBack={onBack}
        hideBackButton ={false}
        // AuxiliaryButtonView={AuxiliaryButtonView}
        // onError={(error) => console.log('Message Header error', error)}
        // hideVoiceCallButton = {false}
        // hideVideoCallButton = {false}
        // usersStatusVisibility = {true}

        style={{
          containerStyle: {
            backgroundColor: '#075E54', 
            paddingTop: 60,
          },
          titleTextStyle: {
            color: "#FFFFFF", 
            fontWeight: 'bold',
          
          },
          subtitleTextStyle: {
            color: "#E0E0E0", 
          },
          typingIndicatorTextStyle: {
            color: "#25D366",
          },
          backButtonIconStyle: {
            tintColor: "#FFFFFF", 
            height: 24,
            width: 24,
          },
          callButtonStyle: {
            audioCallButtonIconStyle: {
              tintColor: "#FFFFFF", 
            },
            videoCallButtonIconStyle: {
              tintColor: "#FFFFFF", 
            },
          },
        }}
      />
      
      {group && (
        <TouchableOpacity 
          style={styles.viewMembersButton} 
          onPress={handleViewMembers}
        >
          <Text style={styles.viewMembersText}>View Members</Text>
        </TouchableOpacity>
      )}
      {!parentMessage ? (
        <MessageList 
          user={user} 
          group={group}
          onThreadRepliesPress={(message: CometChat.BaseMessage) => {
            setParentMessage(message);
          }}
        />
      ) : (
        <>
          <CometChatThreadHeader 
            parentMessage={parentMessage}
          />
          <MessageList 
            user={user} 
            group={group}
            parentMessageId={String(parentMessage.getId())}
          />
        </>
      )}
      <MessageComposer 
        user={user} 
        group={group}
        parentMessageId={parentMessage ? String(parentMessage.getId()) : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  viewMembersButton: {
    padding: 10,
    backgroundColor: '#128C7E',
    alignItems: 'center',
    margin: 8,
    borderRadius: 4,
  },
  viewMembersText: {
    color: 'white',
    fontWeight: 'bold',
  },
  callButton: {
    height: 40,
    width: 40,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});

export default Messages; 