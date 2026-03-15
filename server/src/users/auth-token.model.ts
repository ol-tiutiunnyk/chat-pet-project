// AuthToken type for representing JWT payloads and token-related logic

export type AuthToken = {
  id: number;
  username: string;
  iat?: number;
  exp?: number;
};

export const isAuthToken = (token: any): token is AuthToken => {
  return (
    typeof token === "object" &&
    token !== null &&
    typeof token.id === "number" &&
    typeof token.username === "string" &&
    (token.iat === undefined || typeof token.iat === "number") &&
    (token.exp === undefined || typeof token.exp === "number")
  );
};
