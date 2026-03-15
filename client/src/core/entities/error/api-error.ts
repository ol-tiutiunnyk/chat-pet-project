import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Maps an error from RTK Query or fetch to a user-friendly string
export const mapApiErrorToString = (error: FetchBaseQueryError | SerializedError | undefined): string => {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    // RTK Query error shape
    if ("data" in error && typeof error.data === "object" && error.data !== null) {
      const data = error.data;
      if ("error" in data && typeof data.error === "string") return data.error;
      if ("message" in data && typeof data.message === "string") return data.message;
    }
    if ("error" in error && typeof error.error === "string") {
      return error.error;
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return "An unexpected error occurred";
};
