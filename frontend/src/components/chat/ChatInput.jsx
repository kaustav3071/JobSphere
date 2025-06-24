import React, { useState } from "react";
import { sendMessage } from "../../services/chatService";
import { useChat } from "../../context/ChatContext";

const ChatInput = ({ chatId, onSend }) => {
    const [text, setText] = useState("");
    const { sendMessageSocket } = useChat();

    const handleSend = async () => {
        if (!text.trim()) return;
        try {
            // Send via REST API for persistence
            await sendMessage(chatId, text);
            // Send via socket for real-time
            sendMessageSocket(chatId, {
                content: text,
                sentAt: new Date(),
            });
            setText("");
            onSend && onSend(); // trigger refresh
        } catch (err) {
            console.error("Send failed", err);
        }
    };

    return (
        <div className="flex items-center gap-2 p-3 border-t bg-white">
            <input
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
                onClick={handleSend}
                className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
            >
                Send
            </button>
        </div>

    );
};

export default ChatInput;
