import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import { getSocket } from "../socket/socket";
import { useGroups } from "../api/useGroups";
import { useAuth } from "../context/AuthContext";

/* ================= TYPES ================= */

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
  };
  text: string;
  createdAt: string;
}

/* ================= COMPONENT ================= */

const Chat = () => {
  const { ready, userId } = useAuth();
  const { data: groups } = useGroups();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(() =>
    localStorage.getItem("lastGroupId")
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ---------- LOAD MESSAGES ---------- */
  useEffect(() => {
    if (!ready || !selectedGroupId || !groups) return;

    const isValidGroup = groups.some((g) => g._id === selectedGroupId);

    if (!isValidGroup) {
      setSelectedGroupId(null);
      localStorage.removeItem("lastGroupId");
      setMessages([]);
      return;
    }

    const socket = getSocket();

    axios
      .get(`/chat/group/${selectedGroupId}`)
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]));

    socket.emit("join-group", selectedGroupId);

    return () => {
      socket.emit("leave-group", selectedGroupId);
    };
  }, [ready, selectedGroupId, groups]);

  /* ---------- REAL-TIME ---------- */
  useEffect(() => {
    if (!ready) return;

    const socket = getSocket();

    const handler = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-message", handler);

    return () => {
      socket.off("receive-message", handler);
    };
  }, [ready]);

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* ---------- SEND MESSAGE ---------- */
  const sendMessage = () => {
    if (!text.trim() || !selectedGroupId) return;

    getSocket().emit("send-message", {
      groupId: selectedGroupId,
      text,
    });

    setText("");
  };

  const selectGroup = (groupId: string) => {
    localStorage.setItem("lastGroupId", groupId);
    setSelectedGroupId(groupId);
  };

  if (!ready) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
      {/* ================= GROUP LIST ================= */}
      <div
        className="rounded-xl bg-slate-900/70 backdrop-blur
                   border border-slate-800 shadow-lg
                   flex flex-col overflow-hidden"
      >
        <div className="p-4 border-b border-slate-800 font-semibold text-slate-100">
          Groups
        </div>

        <div
          className="flex-1 overflow-y-auto
                     [&::-webkit-scrollbar]:w-1.5
                     [&::-webkit-scrollbar-thumb]:bg-slate-700
                     [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {groups?.map((group) => (
            <button
              key={group._id}
              onClick={() => selectGroup(group._id)}
              className={`w-full px-4 py-3 text-left text-sm transition
                ${
                  selectedGroupId === group._id
                    ? "bg-indigo-500/10 text-indigo-300 font-medium"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      {/* ================= CHAT ================= */}
      <div
        className="lg:col-span-2 rounded-xl
                   bg-slate-900/70 backdrop-blur
                   border border-slate-800 shadow-lg
                   flex flex-col overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-4 border-b border-slate-800 font-semibold text-slate-100">
          {selectedGroupId ? "Group Chat" : "Select a group"}
        </div>

        {/* MESSAGES */}
        <div
          className="flex-1 p-4 overflow-y-auto space-y-4
                     [&::-webkit-scrollbar]:w-1.5
                     [&::-webkit-scrollbar-thumb]:bg-slate-700
                     [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {messages.length === 0 && selectedGroupId && (
            <p className="text-sm text-slate-400">No messages yet</p>
          )}

          {messages.map((msg, index) => {
            const isMe = msg.sender._id === userId;
            const prev = messages[index - 1];
            const showName =
              !isMe && (!prev || prev.sender._id !== msg.sender._id);

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[75%] space-y-1">
                  {/* Sender name (only once per block) */}
                  {showName && (
                    <div className="text-xs text-slate-400 font-medium">
                      {msg.sender.name}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm
            ${
              isMe
                ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white rounded-br-sm"
                : "bg-slate-800 text-slate-100 rounded-bl-sm"
            }`}
                  >
                    {msg.text}
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`text-[10px] text-slate-500 ${
                      isMe ? "text-right" : "text-left"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        {selectedGroupId && (
          <div className="p-4 border-t border-slate-800 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message"
              className="flex-1 rounded-lg p-2.5 text-sm
                         bg-slate-800 text-slate-100
                         border border-slate-700
                         placeholder-slate-400
                         focus:outline-none focus:ring-2
                         focus:ring-indigo-500"
            />

            <button
              onClick={sendMessage}
              className="px-4 rounded-lg font-medium text-sm
                         text-white bg-linear-to-r
                         from-indigo-500 to-violet-500
                         hover:from-indigo-600 hover:to-violet-600
                         transition"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
