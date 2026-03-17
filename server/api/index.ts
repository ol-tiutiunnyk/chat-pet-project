import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

import conversationsRouter from "@/conversations";
import { messagesHttpRouter } from "@/messages";
import usersRouter from "@/users";
import { errorHandler } from "@/core";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messagesHttpRouter);
app.use("/api/users", usersRouter);

// Serve static files from client/dist
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));

// Serve index.html for all non-API, non-static requests (React Router support)
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

export default app;
