import React from 'react';
import { CometChatMessageList } from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

interface MessageListProps {
  user?: CometChat.User;
  group?: CometChat.Group;
  parentMessageId?: string;
  onThreadRepliesPress?: (message: CometChat.BaseMessage) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  user,
  group,
  parentMessageId,
  onThreadRepliesPress,
}) => {
  return (
    <CometChatMessageList
      user={user}
      group={group}
      parentMessageId={parentMessageId}
      onThreadRepliesPress={onThreadRepliesPress}
      style={{
        containerStyle: {
          backgroundColor: '#FFFFFF',
        },
        outgoingMessageBubbleStyles: {
          containerStyle: {
            backgroundColor: "#075E54",
            fontColor: "#FFFFFF",
            fontWeight: "bold",
          },
        },
        incomingMessageBubbleStyles: {
          containerStyle: {
            backgroundColor: "#F2F2F2", 
            borderColor: "transparent",
            borderRadius: 10,
            padding: 10,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1
           
          },
        },
      }}
    />
  );
};

export default MessageList; 