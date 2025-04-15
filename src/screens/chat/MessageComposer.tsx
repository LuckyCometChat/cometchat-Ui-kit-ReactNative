import React from 'react';
import { CometChatMessageComposer } from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

interface MessageComposerProps {
  user?: CometChat.User;
  group?: CometChat.Group;
  parentMessageId?: string;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  user,
  group,
  parentMessageId,
}) => {
  return (
    <CometChatMessageComposer
      user={user}
      group={group}
      parentMessageId={parentMessageId}
    />
  );
};

export default MessageComposer; 