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

interface MessagesProps {
  user?: CometChat.User;
  group?: CometChat.Group;
  onBack: () => void;
}

const Messages: React.FC<MessagesProps> = ({ user, group, onBack }) => {
  const [showMembers, setShowMembers] = useState(false);
  const [parentMessage, setParentMessage] = useState<CometChat.BaseMessage | null>(null);

  const handleViewMembers = () => {
    setShowMembers(true);
  };

  const handleBackFromMembers = () => {
    setShowMembers(false);
  };

  const handleBackFromThread = () => {
    setParentMessage(null);
  };

  if (showMembers && group) {
    return <GroupMembersScreen group={group} onBack={handleBackFromMembers} />;
  }

  return (
    <View style={styles.mainContainer}>
      <CometChatMessageHeader 
        user={user} 
        group={group} 
        onBack={onBack}
        hideBackButton={false}
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
  },
  viewMembersButton: {
    backgroundColor: '#128C7E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: 10,
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  viewMembersText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default Messages; 