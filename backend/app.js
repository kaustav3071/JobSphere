import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import Chat from './models/chat.model.js';

import userRouter from './routes/user.routes.js';
import jobRouter from './routes/job.routes.js';
import recruiterRouter from './routes/recruiter.routes.js';
import applicationRouter from './routes/application.routes.js';
import chatRouter from './routes/chat.routes.js';
import resumeScoreRouter from './routes/resume.routes.js';

config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error: No token provided'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.emit('userInfo', socket.user);

  socket.on('joinChat', async (chatId, callback) => {
    try {
      console.log('Attempting to join chat:', chatId);
      console.log('Socket user:', socket.user);
      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.log('Chat not found:', chatId);
        return callback?.({ error: 'Chat not found' });
      }
      console.log('Chat participants:', chat.participants);
      const isParticipant = chat.participants.some(
        p => p.user.toString() === socket.user._id && p.model === socket.user.model
      );
      if (!isParticipant) {
        console.log('User not a participant:', socket.user._id);
        return callback?.({ error: 'Unauthorized to join this chat' });
      }
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
      callback?.({ success: true });
    } catch (error) {
      console.error('Error joining chat:', error);
      callback?.({ error: 'Failed to join chat' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    socket.rooms.forEach(room => {
      if (room !== socket.id) socket.leave(room);
    });
  });
});

app.locals.io = io;

// MIDDLEWARES
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads/resumes', express.static('uploads/resumes'));

// ROUTES
app.use('/users', userRouter);
app.use('/jobs', jobRouter);
app.use('/recruiters', recruiterRouter);
app.use('/applications', applicationRouter);
app.use('/chats', chatRouter);
app.use('/resume-scores', resumeScoreRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export { app, server };