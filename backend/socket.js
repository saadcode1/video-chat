import { Server } from "socket.io";

const socketConnection = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const waitingUsers = []; // Users waiting to connect
  const rooms = {}; // Map of rooms with connected user pairs

  io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);

    socket.on('findPartner', () => {
      console.log(`User ${socket.id} is looking for a partner`);

      if (waitingUsers.length > 0) {
        // Match this user with a waiting user
        const partnerSocketId = waitingUsers.pop();
        const room = `${socket.id}-${partnerSocketId}`;
        socket.join(room);
        io.sockets.sockets.get(partnerSocketId).join(room);

        rooms[room] = [socket.id, partnerSocketId];

        console.log(`Room ${room} created with users: ${socket.id} and ${partnerSocketId}`);

        // Notify both users that they are connected
        io.to(room).emit('connected', { roomId: room });
      } else {
        // No waiting users, add this user to the waiting pool
        waitingUsers.push(socket.id);
        console.log(`User ${socket.id} added to waiting pool.`);
      }
    });

    socket.on('offer', (data) => {
      const { roomId, offer } = data;
      const room = rooms[roomId];
      if (room && room.length === 2) {
        const otherUserId = room.find(id => id !== socket.id);
        io.to(otherUserId).emit('receiveOffer', { offer, from: socket.id });
      }
    });

    socket.on('answer', (data) => {
      const { roomId, ans } = data;
      const room = rooms[roomId];
      if (room && room.length === 2) {
        const otherUserId = room.find(id => id !== socket.id);
        io.to(otherUserId).emit('receiveAnswer', { ans, from: socket.id });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);

      // Remove from waiting list if user was waiting
      const waitingIndex = waitingUsers.indexOf(socket.id);
      if (waitingIndex !== -1) {
        waitingUsers.splice(waitingIndex, 1);
        console.log(`User ${socket.id} removed from waiting pool.`);
      }

      // Remove user from any connected room
      for (let room in rooms) {
        const index = rooms[room].indexOf(socket.id);
        if (index !== -1) {
          const partnerId = rooms[room].find(id => id !== socket.id);
          io.to(partnerId).emit('partnerDisconnected');
          delete rooms[room];
          console.log(`Room ${room} closed as ${socket.id} disconnected`);
        }
      }
    });
  });
};

export default socketConnection; 
