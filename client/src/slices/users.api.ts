import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type User = {
  id: number;
  username: string;
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/users" }),
  endpoints: (builder) => ({
    searchUsers: builder.query<User[], string | void>({
      query: (search) => ({
        url: search ? `/?search=${encodeURIComponent(search)}` : "/",
        method: "GET",
      }),
      serializeQueryArgs: () => "USERS_SEARCH",
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useLazySearchUsersQuery } = usersApi;
