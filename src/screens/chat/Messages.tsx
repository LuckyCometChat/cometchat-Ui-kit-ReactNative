import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  CometChatMessageHeader,
  CometChatThreadHeader,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import GroupMembersScreen from './GroupMembersScreen';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import { CallManager } from '../call/CallManager';
import { cometChatConfig } from '../../config/cometChatConfig';

interface MessagesProps {
  user?: CometChat.User;
  group?: CometChat.Group;
  onBack: () => void;
}

const Messages: React.FC<MessagesProps> = ({ user, group, onBack }) => {
  const [showMembers, setShowMembers] = useState(false);
  const [parentMessage, setParentMessage] = useState<CometChat.BaseMessage | null>(null);
  const [showCallManager, setShowCallManager] = useState(false);
  const [callType, setCallType] = useState<string>('');
  const [receiverId, setReceiverId] = useState<string>('');
  const [directCallInProgress, setDirectCallInProgress] = useState(false);
  const [cometChatInitialized, setCometChatInitialized] = useState(false);
  
  const handleViewMembers = () => {
    setShowMembers(true);
  };

  const handleBackFromMembers = () => {
    setShowMembers(false);
  };

  const handleBackFromThread = () => {
    setParentMessage(null);
  };

  const handleCallEnded = () => {
    setShowCallManager(false);
    setDirectCallInProgress(false);
  };
  
  const handleCallInitiated = (userId: string, type: string) => {
    if (!cometChatInitialized) {
      console.log("Cannot initiate call - CometChat not initialized");
      return;
    }

    setReceiverId(userId);
    setCallType(type);
    
    // Try direct API call first
    try {
      console.log(`Initiating ${type} call to user ${userId}`);
      
      // Set the call in progress flag
      setDirectCallInProgress(true);
      
      // Create a direct call - this bypasses our CallManager component
      CometChat.initiateCall(
        new CometChat.Call(userId, type, CometChat.RECEIVER_TYPE.USER)
      ).then(
        (outgoingCall) => {
          console.log('Call initiated successfully:', outgoingCall);
          // Now show the call manager to handle the ongoing call
          setShowCallManager(true);
        },
        (error) => {
          console.log('Call initiation failed with error:', error);
          setDirectCallInProgress(false);
        }
      );
    } catch (error) {
      console.error('Error during call initiation:', error);
      // Fallback to the CallManager component
      setShowCallManager(true);
      setDirectCallInProgress(false);
    }
  };

  const handleAudioCall = () => {
    console.log('Audio call clicked');
    if (user) {
      handleCallInitiated(user.getUid(), CometChat.CALL_TYPE.AUDIO);
    }
  };

  const handleVideoCall = () => {
    console.log('Video call clicked');
    if (user) {
      handleCallInitiated(user.getUid(), CometChat.CALL_TYPE.VIDEO);
    }
  };

  // Initialize CometChat if needed
  useEffect(() => {
    const initCometChat = async () => {
      try {
        const isInitialized = await CometChat.isInitialized();
        if (isInitialized) {
          console.log("CometChat SDK is already initialized");
          setCometChatInitialized(true);
          return;
        }

        const appSettings = new CometChat.AppSettingsBuilder()
          .subscribePresenceForAllUsers()
          .setRegion(cometChatConfig.region)
          .build();
          
        await CometChat.init(cometChatConfig.appId, appSettings);
        console.log("CometChat initialized successfully");
        setCometChatInitialized(true);
      } catch (error) {
        console.error("CometChat initialization failed:", error);
      }
    };

    initCometChat();
  }, []);

  if (showMembers && group) {
    return <GroupMembersScreen group={group} onBack={handleBackFromMembers} />;
  }

  if (directCallInProgress) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.callInProgressContainer}>
          <Text style={styles.callInProgressText}>Call in progress...</Text>
        </View>
      </View>
    );
  }

  if (showCallManager) {
    return (
      <CallManager 
        onCallEnded={handleCallEnded}
        userId={receiverId}
        callType={callType} 
      />
    );
  }

  // Create a custom AuxiliaryButtonView component for call buttons
  const AuxiliaryButtonView = () => {
    if (!user) return null;
    
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={handleAudioCall}
        >
          <Text style={styles.callButtonText}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={handleVideoCall}
        >
          <Text style={styles.callButtonText}>📹</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <CometChatMessageHeader 
        user={user} 
        group={group} 
        onBack={onBack}
        hideBackButton={false}
        onError={(error) => console.log('Message Header error', error)}
        AuxiliaryButtonView={AuxiliaryButtonView}
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
    color: '#FFFFFF', // White text/icon color
  },
  callInProgressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInProgressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#128C7E',
  },
});

export default Messages; 