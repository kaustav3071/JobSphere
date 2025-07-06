# JobConnect Chat System Guide

## Overview
The JobConnect chat system enables real-time communication between job seekers and recruiters. It features instant messaging, message persistence, and a modern UI.

## Features
- ✅ Real-time messaging using Socket.io
- ✅ Message persistence in MongoDB
- ✅ User authentication and authorization
- ✅ Separate chat contexts for users and recruiters
- ✅ Auto-scroll to latest messages
- ✅ Connection status indicators
- ✅ Message timestamps
- ✅ Responsive design

## How to Use

### For Job Seekers (Users)
1. **Login** to your account
2. **Apply for jobs** - This creates a connection with recruiters
3. **Navigate to Chat** - Go to `/chat` page
4. **Start a conversation** - Click on any recruiter from your applied jobs list
5. **Send messages** - Type your message and press Enter or click Send

### For Recruiters
1. **Login** to your recruiter account
2. **Post jobs** and wait for applications
3. **Navigate to Chat** - Go to `/chat` page
4. **View conversations** - See all chats with job applicants
5. **Respond to messages** - Click on any conversation to reply

## Technical Implementation

### Frontend Components

#### ChatContext (`src/context/ChatContext.jsx`)
- Manages socket connections
- Handles real-time message reception
- Maintains chat state and conversations list
- Provides methods for joining rooms and sending messages

#### ChatList (`src/components/chat/ChatList.jsx`)
- Displays all conversations
- Shows available recruiters for users to start chats
- Handles chat creation and selection

#### ChatWindow (`src/components/chat/ChatWindow.jsx`)
- Displays messages for the selected conversation
- Auto-scrolls to new messages
- Shows loading states and empty states

#### ChatInput (`src/components/chat/ChatInput.jsx`)
- Handles message composition and sending
- Integrates both API and socket for message delivery
- Provides visual feedback for message sending

#### MessageBubble (`src/components/chat/MessageBubble.jsx`)
- Renders individual messages
- Shows sender information and timestamps
- Differentiates between own and other's messages

### Backend Implementation

#### Chat Model (`models/chat.model.js`)
```javascript
{
  participants: [
    {
      user: ObjectId, // References User or Recruiter
      model: String   // 'User' or 'Recruiter'
    }
  ],
  messages: [
    {
      sender: ObjectId,     // References User or Recruiter
      senderModel: String,  // 'User' or 'Recruiter'
      content: String,
      sentAt: Date
    }
  ]
}
```

#### Socket Events
- `connect` - User connects to socket
- `joinChat` - User joins a specific chat room
- `sendMessageToRoom` - Broadcast message to room participants
- `receiveMessage` - Receive real-time messages
- `disconnect` - Clean up when user disconnects

#### API Endpoints
- `POST /chats` - Create new chat between participants
- `GET /chats` - Get all chats for current user
- `GET /chats/:id` - Get specific chat with messages
- `POST /chats/:id/message` - Send message to chat

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB running
- npm or yarn

### Installation
1. **Backend Setup**
```bash
cd backend
npm install
npm start
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Make sure these are set in your backend `.env` file:
```
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

## Troubleshooting

### Common Issues

1. **Socket Connection Failed**
   - Check if backend server is running on port 5000
   - Verify JWT token in localStorage
   - Check browser console for authentication errors

2. **Messages Not Appearing**
   - Ensure both users are in the same chat room
   - Check backend logs for socket join errors
   - Verify chat participants in database

3. **Chat List Empty**
   - For users: Apply to jobs first to see recruiters
   - For recruiters: Wait for job applications
   - Check network connectivity

4. **Authentication Issues**
   - Clear localStorage and login again
   - Check token expiration
   - Verify user/recruiter exists in database

## Testing

### Manual Testing Steps
1. **Create test accounts** - One user, one recruiter
2. **Post a job** as recruiter
3. **Apply for job** as user
4. **Start chat** from user side
5. **Send messages** back and forth
6. **Test real-time updates** in multiple browser tabs

### Socket Testing
Use the provided test scripts in `backend/test/`:
- `test-socket-user.js` - Test user socket connection
- `test-socket-recruiter.js` - Test recruiter socket connection

## Security Features
- JWT-based authentication for both REST and Socket connections
- Chat participant validation
- Message sender verification
- No cross-chat message leakage

## Performance Optimizations
- Efficient socket room management
- Message pagination support ready
- Optimistic UI updates
- Connection state management
- Automatic reconnection handling

## Future Enhancements
- File sharing support
- Message reactions
- Typing indicators
- Message search
- Chat notifications
- Message encryption
- Group chats
- Video/voice calling integration
