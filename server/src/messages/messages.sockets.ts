import { Message, SocketsRouter } from "@/core";
import { createMessageSocket, deleteMessageSocket } from "./messages.controller";
import { socketError } from "@/core/errors";

const messagesRouter = new SocketsRouter();

type SendMessageData = {
  text: string;
  conversationId: number;
  room: string;
};

messagesRouter.add<SendMessageData, Message>("send_message", async ({ room, ...data }, { session } = {}) => {
  try {
    if (!session?.id) {
      return socketError(room, "Unauthorized");
    }
    const message = await createMessageSocket({ ...data, userId: session.id });
    return { name: "message_created", room, data: message };
  } catch (error) {
    console.error("Error creating message:", error);
    return socketError(room, error);
  }
});

type DeleteMessageData = {
  id: number;
  room: string;
};

messagesRouter.add<DeleteMessageData, Omit<DeleteMessageData, "room">>("delete_message", async ({ room, ...data }, { session } = {}) => {
  try {
    if (!session?.id) {
      return socketError(room, "Unauthorized");
    }
    const message = await deleteMessageSocket(data);
    return { name: "message_deleted", room, data: message };
  } catch (error) {
    console.error("Error deleting message:", error);
    return socketError(room, error);
  }
});

export default messagesRouter;
