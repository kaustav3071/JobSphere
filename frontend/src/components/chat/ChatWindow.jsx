import React, { useEffect, useRef } from "react";
import { getChatById } from "../../services/chatService";
import MessageBubble from "./MessageBubble";
import { useChat } from "../../context/ChatContext";

const ChatWindow = ({ chatId }) => {
    const bottomRef = useRef();
    const { messages, setMessages } = useChat();

    useEffect(() => {
        if (!chatId) return;
        const fetchMessages = async () => {
            try {
                const res = await getChatById(chatId);
                setMessages(res.chat.messages || []);
            } catch (err) {
                console.error("Failed to load messages", err);
            }
        };
        fetchMessages();
    }, [chatId, setMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!chatId) {
        return (
            <div className="w-2/3 p-4 flex items-center justify-center text-gray-500">
                Select a conversation
            </div>
        );
    }

    return (
        <div className="w-2/3 flex flex-col p-4 bg-white">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.map((msg) => (
                    <MessageBubble key={msg._id || msg.sentAt} message={msg} />
                ))}
                <div ref={bottomRef}></div>
            </div>
        </div>

    );
};

export default ChatWindow;
