import React, { useEffect } from "react";
import { Check } from "lucide-react";
import useChatStore from "../../../../store/useChatStore";
import useAuthStore from "../../../../store/useAuthStore";

interface MessageListProps {
  searchQuery: string;
}

export const MessageList: React.FC<MessageListProps> = ({ searchQuery }) => {
  const { users, getUsers, isUsersLoading, selectedUser, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isUsersLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <p className="text-zinc-400">Loading conversations...</p>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <p className="text-zinc-400">
          {searchQuery ? "No matches found" : "No conversations yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredUsers.map((user) => {
        const isOnline = onlineUsers.includes(user._id);

        return (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-4 flex items-center space-x-3 hover:bg-zinc-800/50 transition-colors ${
              selectedUser?._id === user._id ? "bg-zinc-800" : ""
            }`}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName || user.username || "User"}
                className="w-12 h-12 rounded-full grayscale hover:grayscale-0 transition-all"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-zinc-900" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-baseline">
                <h3 className="text-zinc-200 font-medium truncate">
                  {user.fullName || user.username || "User"}
                </h3>
                {/* We don't have last message time in our data model yet, but you could add it */}
                <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">
                  {/* Last message time would go here */}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {/* This is where you'd add read status indicators */}
                <p className="text-sm truncate text-zinc-500">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MessageList;
