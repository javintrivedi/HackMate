import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { socket } from "../socket";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

const ChatPage = () => {
  const { chatId } = useParams();
  const token = localStorage.getItem("token");

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [locked, setLocked] = useState(false);

  const messagesEndRef = useRef(null);

  // 🔹 Fetch chat once
  useEffect(() => {
    fetch(`${API_URL}/chat/id/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setChat(data.chat);
          setMessages(data.chat.messages);
          setLocked(data.chat.isLocked);
        }
      });
  }, [chatId]);

  // 🔹 Socket lifecycle
  useEffect(() => {
    socket.auth = { token };
    socket.connect();
    socket.emit("join-chat", chatId);

    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("chat-locked", () => {
      setLocked(true);
    });

    return () => {
      socket.off("new-message");
      socket.off("chat-locked");
    };
  }, [chatId]);

  // 🔹 Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || locked) return;

    socket.emit("send-message", { chatId, text });
    setText("");
  };

  if (!chat) {
    return (
      <div className="min-h-screen bg-[#D7EEFF] flex items-center justify-center">
        Loading chat...
      </div>
    );
  }

  const myUser = JSON.parse(localStorage.getItem("user"));
  const otherUser = chat.participants.find(
    (p) => p._id !== myUser?.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navbar />

      <div className="ml-72 max-w-7xl mx-auto py-10 px-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden flex h-[75vh] shadow-2xl border border-white/20">

          {/* LEFT SIDEBAR PLACEHOLDER */}
          <div className="w-[30%] bg-gradient-to-b from-blue-100 to-indigo-100" />

          {/* CHAT AREA */}
          <div className="flex-1 bg-gradient-to-b from-blue-50 to-white flex flex-col">

            {/* HEADER */}
            <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center px-6 font-semibold shadow-lg">
              {otherUser?.name}
            </div>

            {/* MESSAGE COUNT */}
            <p className="text-xs text-center text-gray-500 mt-3 mb-2 font-medium">
              {messages.length}/{chat.messageLimit} messages used
            </p>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.map((msg, i) => {
                const isMe =
                  msg.sender === myUser?.id ||
                  msg.sender?._id === myUser?.id;

                return (
                  <div
                    key={i}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-sm ${
                        isMe
                          ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 bg-white/80 backdrop-blur-sm flex gap-4 border-t border-gray-200">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={locked}
                placeholder={
                  locked
                    ? "Chat locked (limit reached)"
                    : "Type your message..."
                }
                className="flex-1 border-2 border-gray-200 rounded-xl px-5 py-3 outline-none focus:border-blue-400 transition-all"
              />

              <button
                onClick={sendMessage}
                disabled={locked}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 rounded-xl font-semibold disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-lg"
              >
                Send
              </button>
            </div>

            {locked && (
              <p className="text-red-500 text-sm text-center pb-3 font-medium">
                ⚠️ Chat locked. Message limit reached.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;