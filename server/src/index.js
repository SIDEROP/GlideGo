import app from "./app.js";
import { dbConnect } from "./db/dbConnecte.js";
import { createServer } from "http";
import { Server } from "socket.io";
import rtcConnections from "./socket/rtcConnections.js";

const PORT = process.env.PORT || 3000;

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


dbConnect()
.then(() => {
  server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

io.on("connection", (socket) => {
  rtcConnections(socket, io);
});