import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { AuthToken } from "@/users/auth-token.model";
import { verifyToken } from "./auth";
import cookie  from "cookie";

export type Socket = ReturnType<Server["sockets"]["sockets"]["values"]> extends Iterable<infer R> ? R : never;
export type ListenerMetadata = { session?: AuthToken | null };
export type SocketListener = (socket: Socket, io: Server) => void;
export type SocketListenerAnswer<R> = Promise<{ name: string, room?: string, data: R | { error: string } } | void>;
export type SocketListenerInput<T, R = T> = (data: T, meta?: ListenerMetadata) => SocketListenerAnswer<R>;
  
export class SocketsRouter {
  private listeners: SocketListener[] = [];

  public get routes() {
    return Object.freeze(this.listeners);
  }

  private getCookieObject(socket: Socket) {
    const cookieHeader = socket.request?.headers?.cookie;
    return cookieHeader ? cookie.parse(cookieHeader) : {};
  }

  private getMetadata (socket: Socket): ListenerMetadata {
    const cookie = this.getCookieObject(socket);
    const session = typeof cookie?.token! === "string" ? verifyToken(cookie?.token) : null;
    return { session };
  };

  private sendAnswer(io: Server, answer: { name: string, room?: string, data: unknown }) {
    if (answer.room) {
      io.to(answer.room).emit(answer.name, answer.data);
    } else {
      io.emit(answer.name, answer.data);
    }
  }

  add<T, R = T>(eventName: string, listener: SocketListenerInput<T, R>) {
    this.listeners.push((socket, io) => {
      socket.on(eventName, async (data: T) => {
        const meta = this.getMetadata(socket);
        const answer = await listener(data, meta);
        if (answer) {
          this.sendAnswer(io, answer);
        }
      });
    });
  }
};

export class SocketsServer {
  private listeners: SocketListener[] = [];
  private io: Server;
  
  constructor(server: HttpServer) { 
    this.io = new Server(server, {
      cors: {
        origin: true,
        credentials: true,
      },
    });
  }

  public use(router: SocketsRouter) {
    this.listeners.push(...router.routes);
  }

  public listen() {
    this.io.on("connection", (socket) => {
      console.log("A user connected", socket.id);

      socket.on("join_room", ({ name, id }) => {
        socket.join(`${name}_${id}`);
        console.log(`User ${socket.id} joined room ${name}_${id}`);
      });

      socket.on("leave_room", ({ name, id }) => {
        socket.leave(`${name}_${id}`);
        console.log(`User ${socket.id} left room ${name}_${id}`);
      });
      
      this.listeners.forEach((listener) => listener(socket, this.io));

      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
      });
    });
  }
};
