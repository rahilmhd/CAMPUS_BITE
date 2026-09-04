import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, CLIENT_URL } from '../config/index.js';
import { AuthUserPayload } from '../types/index.js';

let ioInstance: Server | null = null;

export const initializeSocket = (httpServer: HttpServer): Server => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication & room routing
  ioInstance.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
      (socket as any).user = decoded;
      next();
    } catch (err) {
      return next(new Error('Invalid socket authentication token'));
    }
  });

  ioInstance.on('connection', (socket: Socket) => {
    const user: AuthUserPayload = (socket as any).user;
    console.log(`🔌 Socket connected: ${user.name} (${user.role}) [socket.id=${socket.id}]`);

    // Join personal room for personal order updates & notifications
    socket.join(`user:${user.id}`);

    // Join role-based channels
    if (user.role === 'KITCHEN_STAFF' || user.role === 'ADMIN') {
      socket.join('kitchen');
    }

    if (user.role === 'ADMIN') {
      socket.join('admin');
    }

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${user.name} [socket.id=${socket.id}]`);
    });
  });

  return ioInstance;
};

export const getSocketIO = (): Server | null => {
  return ioInstance;
};
