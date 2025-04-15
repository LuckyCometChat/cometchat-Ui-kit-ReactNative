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
    />
  );
};

export default MessageList; 