import React, { useState } from "react";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";

const Chat = () => {
    const [chatId, setChatId] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const triggerRefresh = () => setRefresh((r) => !r);

    return (
        <div className="flex h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <ChatList selectedChatId={chatId} setSelectedChatId={setChatId} />
            <div className="w-2/3 flex flex-col">
                <ChatWindow key={refresh} chatId={chatId} />
                {chatId && <ChatInput chatId={chatId} onSend={triggerRefresh} />}
            </div>
        </div>
    );
};

export default Chat;
