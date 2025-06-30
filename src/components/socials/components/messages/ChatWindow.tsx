import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Image,
  Paperclip,
  MoreVertical,
  Eye,
  Users,
  Lock,
} from "lucide-react";
import useChatStore from "../../../../store/useChatStore";
import useAuthStore from "../../../../store/useAuthStore";
import { formatMessageTime } from "../../../../lib/utils";

interface ChatWindowProps {
  chatId?: string;
  isGroup?: boolean;
}

export const ChatWindow = ({ chatId, isGroup = false }: ChatWindowProps) => {
  const [message, setMessage] = useState("");
  const [isHiddenMessage, setIsHiddenMessage] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages.length) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage({
        text: message,
        // Additional properties for hidden/anonymous message could be added here
      });
      setMessage("");
    }
  };

  // Check if user is online
  const isUserOnline = selectedUser
    ? onlineUsers.includes(selectedUser._id)
    : false;

  if (!selectedUser || !authUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName || selectedUser.username || "User"}
              className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all"
            />
            {isUserOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-zinc-900" />
            )}
          </div>
          <div>
            <h3 className="text-zinc-200 font-medium">
              {selectedUser.fullName || selectedUser.username || "User"}
            </h3>
            <p className="text-xs text-zinc-500">
              {isUserOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isGroup && (
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-amber-500/70" />
            </button>
          )}
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-amber-500/70" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900 bg-opacity-80">
        {isMessagesLoading ? (
          <div className="flex justify-center">
            <p className="text-zinc-400">Loading messages...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId === authUser._id ? "justify-end" : "justify-start"
              }`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div
                className={`max-w-[70%] ${
                  msg.senderId === authUser._id
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : "bg-zinc-800/90"
                } rounded-lg p-3`}
              >
                {/* If we want to add hidden message feature */}
                {isHiddenMessage && (
                  <div className="flex items-center space-x-1 mb-1 text-amber-500/70">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs">Hidden Message</span>
                  </div>
                )}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Attachment"
                    className="rounded-md mb-2 max-w-full"
                  />
                )}
                {msg.text && <p className="text-zinc-200">{msg.text}</p>}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-zinc-500">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                  {/* We could add read status indicators here */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/90">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsHiddenMessage(!isHiddenMessage)}
              className={`p-2 rounded-lg transition-colors ${
                isHiddenMessage
                  ? "bg-amber-500/20 text-amber-500"
                  : "hover:bg-zinc-800 text-zinc-400"
              }`}
              title="Send hidden message"
            >
              <Lock className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`p-2 rounded-lg transition-colors ${
                isAnonymous
                  ? "bg-amber-500/20 text-amber-500"
                  : "hover:bg-zinc-800 text-zinc-400"
              }`}
              title="Send anonymous message"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors"
              title="Attach image"
            >
              <Image className="w-5 h-5" />
            </button>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`${
              isAnonymous ? "Send anonymous message..." : "Type a message..."
            }`}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
