// Utility to create a standard error shape for socket responses

const transformSocketError = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Unknown error";
};

export const socketError = (room: string, error: unknown) => ({
  name: "error",
  room,
  data: {
    error: transformSocketError(error)
  }
});
