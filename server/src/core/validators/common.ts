import ResponseError from "@/core/errors/response-error";

export  function assertFound<T>(entity: T | null | undefined, message = "Not found"): asserts entity is T {
  if (!entity) throw new ResponseError(message, 404);
};

export function assertIsAuthor<T>(comparative: unknown, comparator: T): asserts comparative is T {
  if (comparative !== undefined && comparative !== comparator) {
    throw new ResponseError("Forbidden: not the author", 403);
  }
};
