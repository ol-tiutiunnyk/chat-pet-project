
import React from "react";
import "./chat-body.css";
import { MessageList } from "../messages";
import ChatInput from "../chat-input/ChatInput";
import { useParams } from "react-router-dom";

const ChatBody: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const id = Number(conversationId);
  if (!id) return <div>Invalid conversation</div>;
  return (
    <div className="chat-body-container">
      <MessageList />
      <div className="chat-body-input-wrapper">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatBody;
