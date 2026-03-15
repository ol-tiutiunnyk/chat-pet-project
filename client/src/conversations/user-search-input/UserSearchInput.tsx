import { FC } from "react";
import useUserSearchInput from "./use-user-search-input";
import UserOption from "./UserOption";
import "./user-search-input.css";

const UserSearchInput: FC = () => {
  const {
    search,
    isLoading,
    showDropdown,
    users,
    handleChange,
    handleBlur,
    handleFocus,
    hasUsers,
  } = useUserSearchInput();

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        className="search-input"
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        autoComplete="off"
      />
      {showDropdown && (
        hasUsers ? (
          <ul className="search-dropdown">
            {users.map((user) => (
              <UserOption key={user.id} id={user.id} username={user.username} />
            ))}
          </ul>
        ) : !isLoading ? (
          <div className="search-no-users">No users found</div>
        ) : null
      )}
    </div>
  );
};

export default UserSearchInput;
