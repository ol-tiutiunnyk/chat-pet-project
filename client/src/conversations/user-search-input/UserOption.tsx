
import React from "react";
import { useSelector } from "react-redux";
import { useCreateConversationMutation } from "@/slices/conversations.api";
import { selectCurrentUser } from "@/slices/users.selectors";
import { useNavigate } from "react-router";
import PlusIcon from "./PlusIcon";

type UserOptionProps = {
  id: number;
  username: string;
};

const UserOption: React.FC<UserOptionProps> = ({ id, username }) => {
  const currentUser = useSelector(selectCurrentUser);
  const [createConversation, { isLoading }] = useCreateConversationMutation();
  const navigate = useNavigate();

  const handleCreateConversation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      navigate("/login");
      return;
    };
    await createConversation({
      title: `${currentUser.username}, ${username}`,
      participants: [currentUser.id, id],
    });
  };

  return (
    <li className="search-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>{username}</span>
      <button
        className="search-add-btn"
        onClick={handleCreateConversation}
        disabled={isLoading}
        aria-label={`Start conversation with ${username}`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginLeft: 8,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <PlusIcon width={20} height={20} />
      </button>
    </li>
  );
};

export default UserOption;
