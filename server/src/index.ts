import http from "http";

import app from "../api/index";
import { messagesSocketsRouter } from "@/messages";
import { SocketsServer } from "@/core";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const sockets = new SocketsServer(server);

sockets.use(messagesSocketsRouter);

sockets.listen();
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
