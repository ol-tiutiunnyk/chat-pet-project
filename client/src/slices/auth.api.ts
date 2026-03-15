import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export type RegisterRequest = {
  username: string;
  password: string;
};


export type RegisterResponse = {
  id: number;
  username: string;
};


export type ErrorResponse = {
  error: string;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/users" }),
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    getUser: builder.query<RegisterResponse, void>({
      query: () => ({
        url: "/is-auth",
        method: "GET",
        credentials: "include",
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetUserQuery, useLogoutMutation } = authApi;
