import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import http from "http";

import conversationsRouter from "@/conversations";
import { messagesHttpRouter, messagesSocketsRouter } from "@/messages";
import usersRouter from "@/users";
import { errorHandler, SocketsServer } from "@/core";

const app = express();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
const sockets = new SocketsServer(server);

sockets.use(messagesSocketsRouter);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesHttpRouter);
app.use("/api/users", usersRouter);

// Serve static files from client/dist
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));

// Serve index.html for all non-API, non-static requests (React Router priority)
app.get("*", (req: Request, res: Response, next) => {
  const filePath = path.join(clientDist, req.path);
  if (
    req.path.startsWith("/api/") ||
    req.path.startsWith("/socket") ||
    (req.path.includes(".") && fs.existsSync(filePath))
  ) {
    return next();
  }
  res.sendFile(path.join(clientDist, "index.html"));
});

// Error handler middleware (should be last)
app.use(errorHandler);

sockets.listen();
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
