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
      socket.disconnect();
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
    <div className="min-h-screen bg-[#D7EEFF]">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-28 px-6">
        <div className="bg-[#3F61A8] rounded-xl overflow-hidden flex h-[75vh] shadow-xl">

          {/* LEFT SIDEBAR PLACEHOLDER */}
          <div className="w-[30%] bg-[#BFE6FF]" />

          {/* CHAT AREA */}
          <div className="flex-1 bg-[#EAF6FF] flex flex-col">

            {/* HEADER */}
            <div className="h-16 bg-[#3F61A8] text-white flex items-center px-6 font-semibold">
              {otherUser?.name}
            </div>

            {/* MESSAGE COUNT */}
            <p className="text-xs text-center text-gray-500 mt-2">
              {messages.length}/{chat.messageLimit} messages used
            </p>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.map((msg, i) => {
                const isMe =
                  msg.sender === myUser?.id ||
                  msg.sender?._id === myUser?.id;

                return (
                  <div
                    key={i}
                    className={`max-w-[60%] px-4 py-2 rounded-2xl text-sm ${
                      isMe
                        ? "ml-auto bg-green-300"
                        : "bg-blue-300"
                    }`}
                  >
                    {msg.text}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 bg-white flex gap-4">
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
                className="flex-1 border rounded-xl px-4 py-2 outline-none"
              />

              <button
                onClick={sendMessage}
                disabled={locked}
                className="bg-green-500 text-white px-6 rounded-xl disabled:bg-gray-400"
              >
                Send
              </button>
            </div>

            {locked && (
              <p className="text-red-500 text-sm text-center pb-2">
                Chat locked. Message limit reached.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;