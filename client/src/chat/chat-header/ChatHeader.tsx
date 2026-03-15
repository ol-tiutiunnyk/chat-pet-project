

import "./chat-header.css";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery } from "@/slices/auth.api";
import { useGetConversationQuery } from "@/slices/conversations.api";
import ArrowLeftIcon from "./ArrowLeftIcon";
import "@/styles/skeleton.css";

const ChatHeader: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { data: user } = useGetUserQuery();

  // Fetch conversation participants
  const { data: conversation, isLoading: isConversationLoading } = useGetConversationQuery(Number(conversationId));
  const participants = conversation?.participants?.filter(p => p.id !== user?.id) || [];

  const handleBack = () => {
    navigate("/");
  };

  return (
    <header className="chat-header">
      <button
        className="chat-header-back-btn"
        onClick={handleBack}
        aria-label="Go back"
      >
        <ArrowLeftIcon width={28} height={28} />
      </button>
      <div className="chat-header-participants-container">
        <div className="chat-participants">
          {isConversationLoading ? (
            <div className="skeleton skeleton-title skeleton-title-width" />
          ) : (
            <span>
              {participants.length > 0 ? participants.map(p => p.username).join(", ") : <em>No other participants</em>}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
