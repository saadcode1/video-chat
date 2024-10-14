import { Server } from "socket.io";
import cors from "cors";
import express from "express";
import { createServer } from 'node:http';
import socketConnection from "./socket.js"; 

const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

// Create the HTTP server
const server = createServer(app);

// Initialize socket connection
socketConnection(server);

// Start the server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
