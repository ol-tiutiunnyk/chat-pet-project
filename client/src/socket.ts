import { io, Socket } from "socket.io-client";

const URL = "/"; // relative URL for same-origin
const socket: Socket = io(URL, {
  withCredentials: true,
});

socket.on('connect', function() {
  console.log('Connected to the server');
});

socket.on("connect_error", (err: any) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message);

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description);

  // some additional context, for example the XMLHttpRequest object
  console.log(err.context);
});

socket.on("error", (err: any) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.error);
});

export default socket;