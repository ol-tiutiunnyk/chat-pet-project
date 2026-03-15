import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import socket from "../socket";

export type Message = {
  id: number;
  text: string;
  authorId: number;
};

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/messages" }),
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    createMessage: builder.mutation<null, { text: string; conversationId: number }>({
      queryFn: async ({ text, conversationId }) => {
        return new Promise((resolve) => {
          socket.emit("send_message", { text, conversationId, room: `conversation_${conversationId}` });
          resolve({ data: null });
        });
      },
      invalidatesTags: [{ type: "Messages", id: "LIST" }],
    }),
    updateMessage: builder.mutation<Message, { id: number; text: string; }>({
      query: ({ id, text }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { text },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Messages", id },
        { type: "Messages", id: "LIST" },
      ],
    }),
    deleteMessage: builder.mutation<void, { id: number; conversationId: number }>({
      queryFn: async ({ id, conversationId }) => {
        return new Promise((resolve) => {
          socket.emit("delete_message", { id, room: `conversation_${conversationId}` });
          resolve({ data: undefined });
        });
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Messages", id },
        { type: "Messages", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;
