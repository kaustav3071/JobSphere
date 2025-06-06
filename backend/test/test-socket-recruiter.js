import { io } from "socket.io-client";
import readline from "readline";
import axios from "axios";

const recruiterToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODQyN2I0MzM5YTBiYjc4NGFmNmFhMTIiLCJtb2RlbCI6IlJlY3J1aXRlciIsImlhdCI6MTc0OTE4ODQ1MywiZXhwIjoxNzQ5MTkyMDUzfQ.0XTki6OPrYQABo0IzoEJ8lSuO0kjGpB0cHs1Uy-247E";
const socket = io("http://localhost:5000", {
  auth: { token: recruiterToken },
  transports: ["websocket"],
});
const chatId = "68427f2139a0bb784af6aa41";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.on('connect', () => {
  console.log("Connected as", socket.id);
  socket.emit('joinChat', chatId, (response) => {
    if (response.error) {
      console.error('Failed to join chat:', response.error);
      rl.close();
    } else {
      console.log("Joined chat room:", chatId);
      rl.setPrompt("Type your message: ");
      rl.prompt();
    }
  });
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
  rl.close();
});

socket.on("userInfo", (user) => {
  console.log("Authenticated user info:", user);
  console.log("You can start sending messages now.");
  rl.prompt();
});

socket.on("receiveMessage", (message) => {
  console.log("\nReceived message:", message);
  rl.prompt();
});

socket.on('disconnect', () => {
  console.log('Client disconnected:', socket.id);
  socket.rooms.forEach(room => {
    if (room !== socket.id) socket.leave(room);
  });
  rl.close();
});

rl.on("line", async (line) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/chats/${chatId}/message`,
      { content: line.trim() },
      { headers: { Authorization: `Bearer ${recruiterToken}` } }
    );
    socket.emit('sendMessageToRoom', { chatId, message: response.data.newMessage });
    console.log("Message sent:", response.data.message);
  } catch (error) {
    console.error("Failed to send message from recruiter:", (error.response?.data?.message || error.message));
  }
  rl.prompt();
});