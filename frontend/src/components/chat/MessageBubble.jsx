import React from "react";
import { useAuth } from "../../hooks/useAuth";

const MessageBubble = ({ message }) => {
    const { user } = useAuth();
    const isOwn = message.sender === user._id;

    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div
                className={`px-4 py-2 rounded-lg max-w-xs ${isOwn ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
                    }`}
            >
                {message.content}
            </div>
        </div>
    );
};

export default MessageBubble;
