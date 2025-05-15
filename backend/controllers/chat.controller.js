import Chat from '../models/chat.model.js';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

dotenv.config();

export const createChat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { participants } = req.body;
  const requester = req.user || req.recruiter; 
  const requesterModel = req.user ? 'User' : 'Recruiter';

  try {
    const isParticipant = participants.some(
      p => p.model === requesterModel && p.user.toString() === requester._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'You must be one of the participants to create a chat' });
    }

    const existingChat = await Chat.findOne({
      $and: [
        { 'participants.user': participants[0].user },
        { 'participants.model': participants[0].model },
        { 'participants.user': participants[1].user },
        { 'participants.model': participants[1].model },
      ],
    });
    if (existingChat) {
      return res.status(400).json({ message: 'A chat between these participants already exists', chat: existingChat });
    }

    const newChat = new Chat({
      participants,
    });

    await newChat.save();

    await newChat.populate([
      { path: 'participants.user', match: { model: 'User' }, select: 'name email', model: 'User' },
      { path: 'participants.user', match: { model: 'Recruiter' }, select: 'name email companyName', model: 'Recruiter' },
    ]);

    res.status(201).json({ message: 'Chat created successfully', chat: newChat });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Failed to create chat', error: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const requester = req.user || req.recruiter;
    const requesterModel = req.user ? 'User' : 'Recruiter';

    const chats = await Chat.find({
      'participants': {
        $elemMatch: { user: requester._id, model: requesterModel },
      },
    })
      .populate([
        { path: 'participants.user', match: { model: 'User' }, select: 'name email', model: 'User' },
        { path: 'participants.user', match: { model: 'Recruiter' }, select: 'name email companyName', model: 'Recruiter' },
      ])
      .sort({ updatedAt: -1 });

    res.status(200).json({ message: 'Chats retrieved successfully', chats });
  } catch (error) {
    console.error('Error retrieving chats:', error);
    res.status(500).json({ message: 'Failed to retrieve chats', error: error.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const requester = req.user || req.recruiter;
    const requesterModel = req.user ? 'User' : 'Recruiter';

    const chat = await Chat.findById(chatId)
      .populate([
        { path: 'participants.user', match: { model: 'User' }, select: 'name email', model: 'User' },
        { path: 'participants.user', match: { model: 'Recruiter' }, select: 'name email companyName', model: 'Recruiter' },
      ])
      .populate([
        { path: 'messages.sender', match: { model: 'User' }, select: 'name email', model: 'User' },
        { path: 'messages.sender', match: { model: 'Recruiter' }, select: 'name email companyName', model: 'Recruiter' },
      ]);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const isParticipant = chat.participants.some(
      p => p.model === requesterModel && p.user.toString() === requester._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Unauthorized to access this chat' });
    }

    res.status(200).json({ message: 'Chat retrieved successfully', chat });
  } catch (error) {
    console.error('Error retrieving chat:', error);
    res.status(500).json({ message: 'Failed to retrieve chat', error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { chatId } = req.params;
  const { content } = req.body;
  const sender = req.user || req.recruiter;
  const senderModel = req.user ? 'User' : 'Recruiter';

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const isParticipant = chat.participants.some(
      p => p.model === senderModel && p.user.toString() === sender._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Unauthorized to send a message in this chat' });
    }

    const message = {
      sender: sender._id,
      senderModel,
      content,
      sentAt: new Date(),
    };

    chat.messages.push(message);
    chat.updatedAt = new Date();
    await chat.save();

    await chat.populate([
      { path: 'messages.sender', match: { model: 'User' }, select: 'name email', model: 'User' },
      { path: 'messages.sender', match: { model: 'Recruiter' }, select: 'name email companyName', model: 'Recruiter' },
    ]);

    res.status(200).json({ message: 'Message sent successfully', chat });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};
