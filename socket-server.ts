
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import dbConnect from './src/lib/db';
import Message from './src/lib/models/Message';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const userSockets = new Map<string, string>(); // Map<userId, socketId>

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', (userId) => {
    console.log(`Registering user ${userId} with socket ${socket.id}`);
    userSockets.set(userId, socket.id);
  });

  socket.on('privateMessage', async ({ senderId, receiverId, message }) => {
    console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
    await dbConnect();
    
    try {
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        timestamp: new Date()
      });
      await newMessage.save();

      const receiverSocketId = userSockets.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('privateMessage', newMessage);
      }
      // Also send message back to sender to confirm it was sent
      socket.emit('privateMessage', newMessage);

    } catch (error) {
      console.error("Failed to save message to DB", error);
    }
  });


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const [userId, id] of userSockets.entries()) {
      if (id === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
