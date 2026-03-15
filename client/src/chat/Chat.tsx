import { FC } from "react";
import ChatHeader from "./chat-header/ChatHeader";
import ChatBody from "./chat-body/ChatBody";
import { useParams, Navigate } from "react-router-dom";
import "./chat.css";

const Chat: FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const id = Number(conversationId);
  if (!id) return <Navigate to="/" replace />;
  return (
    <div className="chat-wrapper">
      <ChatHeader />
      <ChatBody />
    </div>
  );
};

export default Chat;
