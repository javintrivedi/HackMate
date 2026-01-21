import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

const ChatListPage = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const myUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${API_URL}/chat`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setChats(data.chats);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#D7EEFF]">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-28 px-6">
        <div className="bg-[#3F61A8] rounded-xl overflow-hidden flex h-[75vh] shadow-xl">

          {/* LEFT SIDEBAR */}
          <div className="w-[30%] bg-[#BFE6FF]">
            <div className="p-4 font-semibold text-lg text-[#102A52]">
              💬 CHATS
            </div>

            {chats.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                No chats yet
              </p>
            ) : (
              chats.map((chat) => {
                const otherUser = chat.participants.find(
                  (p) => p._id !== myUser?.id
                );

                return (
                  <div
                    key={chat._id}
                    onClick={() => navigate(`/chat/${chat._id}`)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#A7D8FF] transition"
                  >
                    <div className="w-10 h-10 rounded bg-blue-400" />
                    <div>
                      <p className="font-semibold">{otherUser?.name}</p>
                      <p className="text-xs text-gray-600">
                        Click to open chat
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT EMPTY PANEL */}
          <div className="flex-1 bg-[#EAF6FF] flex items-center justify-center">
            <p className="text-gray-500 text-lg">
              Select a chat to start messaging
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;