import {
    createChat,
    getChats,
    getChatById,
    sendMessage,
} from '../controllers/chat.controller.js';
import { authenticateUser, authenticateRecruiter } from '../middlewares/auth.js';
import { body } from 'express-validator';
import express from 'express';


const chatRouter = express.Router();

const chatValidationRules = [
  body('participants')
    .isArray({ min: 2, max: 2 })
    .withMessage('Participants must be an array of exactly 2 users'),
  body('participants.*.user')
    .notEmpty()
    .withMessage('Participant ID is required')
    .isMongoId()
    .withMessage('Invalid participant ID'),
  body('participants.*.model')
    .isIn(['User', 'Recruiter'])
    .withMessage('Participant model must be either User or Recruiter'),
];

const messageValidationRules = [
  body('content')
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
];



chatRouter.post('/', [authenticateUser, authenticateRecruiter], chatValidationRules, createChat);


chatRouter.get('/', [authenticateUser, authenticateRecruiter], getChats);

chatRouter.get('/:chatId', [authenticateUser, authenticateRecruiter], getChatById);


chatRouter.post('/:chatId/message', [authenticateUser, authenticateRecruiter], messageValidationRules, sendMessage);

export default chatRouter;