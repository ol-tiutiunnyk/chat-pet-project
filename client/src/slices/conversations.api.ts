import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Message } from "./messages.api";
import socket from "../socket";

export type Conversation = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  participants: { id: number; username: string }[];
  messages?: { id: number; text: string; authorId: number }[];
};

const createNewMessageListener = (updateCachedData: (callback: (draft: Conversation | undefined) => void) => void) => (data: Message) => {
  updateCachedData((draft) => {
    if (draft?.messages?.some((existingMessage) => existingMessage.id === data.id)) {
      return;
    }
    draft?.messages?.push(data);
  });
};

const createDeleteMessagListener = (updateCachedData: (callback: (draft: Conversation | undefined) => void) => void) => (messageId: number) => {
  updateCachedData((draft) => {
    draft!.messages = draft?.messages?.filter((message) => message.id !== messageId);
  });
};

export const conversationsApi = createApi({
  reducerPath: "conversationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Conversations"],
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => "/conversations",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Conversations" as const, id })),
              { type: "Conversations", id: "LIST" },
            ]
          : [{ type: "Conversations", id: "LIST" }],
    }),
    getConversation: builder.query<Conversation, number>({
      query: (id) => `/conversations/${id}`,
      providesTags: (result, error, id) => [{ type: "Conversations", id }],
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData },
      ) {
        const newMessageListener = createNewMessageListener(updateCachedData);
        const deleteMessageListener = createDeleteMessagListener(updateCachedData);

        try {
          await cacheDataLoaded;

          socket.emit(`join_room`, { name: "conversation", id: arg });
          socket.on("message_created", newMessageListener);
          socket.on("message_deleted", deleteMessageListener);
        } catch {}

        await cacheEntryRemoved;
        socket.off("message_created", newMessageListener);
        socket.off("message_deleted", deleteMessageListener);
        socket.emit(`leave_room`, { name: "conversation", id: arg });
      },
    }),
    createConversation: builder.mutation<Conversation, { title: string; participants: number[] }>({
      query: (body) => ({
        url: "/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Conversations", id: "LIST" }],
    }),
    updateConversation: builder.mutation<Conversation, { id: number; title: string; participants: number[] }>({
      query: ({ id, ...body }) => ({
        url: `/conversations/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Conversations", id },
        { type: "Conversations", id: "LIST" },
      ]
    }),
    deleteConversation: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/conversations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Conversations", id },
        { type: "Conversations", id: "LIST" },
      ],
    }),
  }),
});

export const useInvalidateConversation = (id: number) => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(conversationsApi.util.invalidateTags([{ type: "Conversations", id }]));
  }, [dispatch, id]);
};

export const useAddMessageToConversation = (conversationId: number) => {
  const dispatch = useDispatch();
  return useCallback((message: Message) => {
    dispatch(
      conversationsApi.util.updateQueryData("getConversation", conversationId, (state) => {
        if (state?.messages?.some((existingMessage) => existingMessage.id === message.id)) {
          return;
        }
        state?.messages?.push(message);
      }) as any,
    );
  }, [dispatch, conversationId]);
};

export const useRemoveMessageFromConversation = (conversationId: number) => {
  const dispatch = useDispatch();
  return useCallback((messageId: number) => {
    dispatch(
      conversationsApi.util.updateQueryData("getConversation", conversationId, (state) => {
        state!.messages = state?.messages?.filter((message) => message.id !== messageId);
      }) as any,
    );
  }, [dispatch, conversationId]);
};

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useCreateConversationMutation,
  useUpdateConversationMutation,
  useDeleteConversationMutation,
} = conversationsApi;
