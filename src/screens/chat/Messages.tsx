import React, { useState } from 'react';
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

interface MessagesProps {
  user?: CometChat.User;
  group?: CometChat.Group;
  onBack: () => void;
}

const Messages: React.FC<MessagesProps> = ({ user, group, onBack }) => {
  const [showMembers, setShowMembers] = useState(false);
  const [parentMessage, setParentMessage] = useState<CometChat.BaseMessage | null>(null);
  const [showCallManager, setShowCallManager] = useState(false);
  
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
  };
  
  const handleCallInitiated = (sessionID: string) => {
    setShowCallManager(true);
  };

  const handleAudioCall = () => {
    console.log('Audio call clicked');
    if (user) {
      handleCallInitiated(user.getUid());
    }
  };

  const handleVideoCall = () => {
    console.log('Video call clicked');
    if (user) {
      handleCallInitiated(user.getUid());
    }
  };

  if (showMembers && group) {
    return <GroupMembersScreen group={group} onBack={handleBackFromMembers} />;
  }

  if (showCallManager) {
    return <CallManager onCallEnded={handleCallEnded} />;
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
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 20,
  },
});

export default Messages; 