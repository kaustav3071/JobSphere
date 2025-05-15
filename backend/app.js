import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import userRouter from './routes/user.routes.js';
import jobRouter from './routes/job.routes.js';
import recruiterRouter from './routes/recruiter.routes.js';
import applicationRouter from './routes/application.routes.js';
import chatRouter from './routes/chat.routes.js';
// import { connectDB } from './db/db.js'
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

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  socket.on('sendMessage', ({ chatId, message }) => {
    socket.to(chatId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.locals.io = io;

// MIDDLEWARES
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// connectDB();

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
