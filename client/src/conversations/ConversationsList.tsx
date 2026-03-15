import React from "react";
import { useGetConversationsQuery } from "@/slices/conversations.api";
import UserSearchInput from "./user-search-input";
import ConversationsHeader from "./conversations-header";
import "./conversations-list.css";
import { Link } from "react-router-dom";

const ConversationsList: React.FC = () => {
  const { data: conversations, isLoading, isError } = useGetConversationsQuery();

  if (isLoading) return <div className="conversations-page-container">Loading...</div>;
  if (isError || !conversations) return <div className="conversations-page-container">Error loading conversations</div>;

  return (
    <div className="conversations-page-container">
      <ConversationsHeader />
      <UserSearchInput />
      <ul className="conversations-list">
        {conversations.map(conv => (
          <li key={conv.id} className="conversations-list-item">
            <Link to={`/chat/${conv.id}`} className="conversations-link">
              <span className="conversations-title">{conv.title}</span>
              <span className="conversations-participants">
                Participants: {conv.participants.map(p => p.username).join(', ')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationsList;
