// À externaliser dans un fichier séparé pour éviter les multi-instances
import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
