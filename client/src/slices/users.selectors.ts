import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { usersApi, User } from "./users.api";
import { authApi } from "./auth.api";
import { conversationsApi } from "./conversations.api";

/**
 * Selects the array of users returned from the latest search query.
 * Returns an empty array if no users are found.
 */
export const selectSearchedUsers = (state: RootState): User[] => {
  const usersResult = usersApi.endpoints.searchUsers.select(undefined)(state);
  return usersResult && usersResult.data ? usersResult.data : [];
};

/**
 * Selects the currently logged-in user from the auth state.
 * Returns undefined if no user is logged in.
 */
export const selectCurrentUser = (state: RootState): { id: number; username: string } | undefined => {
  const userResult = authApi.endpoints.getUser.select()(state);
  return userResult && userResult.data ? userResult.data : undefined;
};

/**
 * Selects all conversations for the current user from the RTK Query cache.
 */
export const selectUserConversationsParticipantsIds = (state: RootState) => {
  const conversationsResult = conversationsApi.endpoints.getConversations.select()(state);
  const conversationsData = conversationsResult && conversationsResult.data ? conversationsResult.data : [];
  return conversationsData.flatMap((conv) => conv.participants).map((p) => p.id);
};

/**
 * Returns the searched users array, excluding:
 * - the currently logged-in user (if any)
 * - users who already have a conversation with the current user
 * If no user is logged in, returns the full searched users array.
 */
export const selectUsersWithoutCurrent = createSelector(
  [selectSearchedUsers, selectCurrentUser, selectUserConversationsParticipantsIds],
  (searchedUsers, currentUser, participantIds) => {
    if (!currentUser) return searchedUsers;
    // Collect all user IDs that are in a conversation with the current user
    const usersWithConversation = new Set<number>(participantIds);
    return searchedUsers.filter((user) => user.id !== currentUser.id && !usersWithConversation.has(user.id));
  }
);
