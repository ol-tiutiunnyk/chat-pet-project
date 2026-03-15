import "./message-bubble.css";
import React from "react";

import { useDeleteMessageMutation } from "@/slices/messages.api";

import { useGetUserQuery } from "@/slices/auth.api";

type MessageBubbleProps = {
  message: string;
  id: number;
  conversationId: number;
  authorId: number;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, id, conversationId, authorId }) => {
  const [deleteMessage, { isLoading }] = useDeleteMessageMutation();
  const { data: user } = useGetUserQuery();
  const isOwn = user?.id === authorId;

  const handleDelete = () => {
    deleteMessage({ id, conversationId });
  };

  return (
    <div className={`message-bubble${isOwn ? " message-own" : " message-other"}`} style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start' }}>
      <span>{message}</span>
      {isOwn && (
        <button
          className="message-delete"
          title="Delete message"
          onClick={handleDelete}
          aria-label="Delete message"
          disabled={isLoading}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default MessageBubble;
