import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import UserOverlay from "../components/UserOverlay";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

const MyMatches = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const myUser = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);

  // 🔹 Fetch matches
  const fetchMatches = async () => {
    const res = await fetch(`${API_URL}/match/matches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data.matches || []);
  };

  // 🔹 Fetch chats (for chatId mapping)
  const fetchChats = async () => {
    const res = await fetch(`${API_URL}/chat`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setChats(data.chats || []);
  };

  useEffect(() => {
    fetchMatches();
    fetchChats();
  }, []);

  // 🔥 Find chatId for a matched user
  const openChatWithUser = (userId) => {
    const chat = chats.find((c) =>
      c.participants.some((p) => p._id === userId)
    );

    if (!chat) {
      alert("Chat not found. Try again.");
      return;
    }

    navigate(`/chat/${chat._id}`);
  };

  return (
    <div className="min-h-screen bg-[#D7EEFF]">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto pt-28 px-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/discover")}
            className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition"
          >
            ←
          </button>

          <div className="bg-white px-6 py-2 rounded-full shadow font-medium">
            My Matches ({users.length})
          </div>
        </div>

        {/* Grid */}
        {users.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            No matches yet 🤝
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-8">
            {users.map((u) => (
              <div key={u._id} className="relative">
                <UserCard user={u} onClick={setActive} />

                {/* 🔥 CHAT BUTTON */}
                <button
                  onClick={() => openChatWithUser(u._id)}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-700"
                >
                  Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlay */}
      {active && (
        <UserOverlay
          user={active}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
};

export default MyMatches;