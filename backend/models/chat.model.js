import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'messages.senderModel',
      required: [true, 'Sender is required'],
    },
    senderModel: {
      type: String,
      required: [true, 'Sender model is required'],
      enum: ['User', 'Recruiter'],
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const chatSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Participant ID is required'],
          },
          model: {
            type: String,
            required: [true, 'Participant model is required'],
            enum: ['User', 'Recruiter'],
          },
        },
      ],
      validate: {
        validator: (arr) => arr.length === 2 && arr.some(p => p.model === 'User') && arr.some(p => p.model === 'Recruiter'),
        message: 'Chat must have exactly two participants: one User and one Recruiter',
      },
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);


chatSchema.index({ 'participants.user': 1 });
chatSchema.index({ createdAt: -1 });


const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;