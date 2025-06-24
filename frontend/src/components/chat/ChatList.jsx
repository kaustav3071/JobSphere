import React, { useEffect, useState } from "react";
import { getChats } from "../../services/chatService";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../context/ChatContext";

const ChatList = ({ selectedChatId, setSelectedChatId }) => {
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { conversations, setConversations } = useChat();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await getChats();
                setConversations(res.chats);
            } catch (err) {
                console.error("Failed to load chats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, [setConversations]);

    // Helper to get the other participant
    const getOtherParticipant = (chat) => {
        if (!user) return null;
        return chat.participants.find(
            (p) => p.user && p.user._id !== user._id
        )?.user;
    };

    return (
        <div className="w-1/3 bg-gray-50 border-r p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Chats</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                conversations.map((chat) => {
                    const otherUser = getOtherParticipant(chat);
                    return (
                        <div
                            key={chat._id}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-150 ${chat._id === selectedChatId
                                    ? "bg-indigo-100 text-indigo-900"
                                    : "hover:bg-gray-100 text-gray-800"
                                }`}
                            onClick={() => setSelectedChatId(chat._id)}
                        >
                            <div className="font-medium">{otherUser?.name || otherUser?.email || "Unknown"}</div>
                            <div className="text-sm text-gray-600 truncate">
                                {chat.messages?.length > 0
                                    ? chat.messages[chat.messages.length - 1].content
                                    : "No messages yet"}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ChatList;
