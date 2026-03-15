import "./message-list.css";
import { FC } from "react";
import socket from "@/socket";
import MessageBubble from "./MessageBubble";
import Skeleton from "./Skeleton";
import { useGetConversationQuery } from "@/slices/conversations.api";
import { useParams } from "react-router-dom";

const MessageList: FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const id = Number(conversationId);
  const { data: conversation, isLoading, isError } = useGetConversationQuery(id);
  const messages = conversation?.messages || [];

  if (isLoading) return (
    <div className="message-list">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} height="2.5em" style={{ marginBottom: 12 }} />
      ))}
    </div>
  );
  if (isError || !conversation) return <div className="message-list">Failed to load messages.</div>;

  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message.text}
          id={message.id}
          conversationId={Number(conversationId)}
          authorId={message.authorId}
        />
      ))}
    </div>
  );
};

export default MessageList;
