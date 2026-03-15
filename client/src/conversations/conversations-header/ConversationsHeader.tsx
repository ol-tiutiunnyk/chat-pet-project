import { FC } from "react";
import "./conversations-header.css";
import DoorOutIcon from "./DoorOutIcon";
import { authApi, useLogoutMutation } from "@/slices/auth.api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { conversationsApi } from "@/slices/conversations.api";

const ConversationsHeader: FC = () => {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    dispatch(authApi.util.resetApiState());
    dispatch(conversationsApi.util.resetApiState());
    navigate("/login");
  };

  return (
    <div className="conversations-header-container">
      <h3 className="conversations-header-title">conversations</h3>
      <button
        className="conversations-header-logout-button"
        onClick={handleLogout}
        type="button"
        aria-label="Logout"
      >
        <DoorOutIcon width={24} height={24} />
      </button>
    </div>
  );
};

export default ConversationsHeader;
