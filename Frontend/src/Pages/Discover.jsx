import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ProfileOverlay from "./ProfileOverlay";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [activeProfile, setActiveProfile] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_URL}/users/discover`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.users);
      });
  }, []);

  const handleRightSwipe = async (userId) => {
    await fetch(`${API_URL}/match/swipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ selectedUserId: userId }),
    });
    setActiveProfile(null);
    setIndex(i => i + 1);
  };

  const handleLeftSwipe = () => {
    setActiveProfile(null);
    setIndex(i => i + 1);
  };

  const user = users[index];

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#D7EEFF]">
        <h2 className="text-2xl font-semibold text-gray-600">
          No more profiles 👀
        </h2>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#D7EEFF] flex items-center justify-center relative">

      {/* CARD */}
      <div
        onClick={() => setActiveProfile(user)}
        className="w-[320px] h-[420px] bg-white rounded-xl shadow-lg cursor-pointer overflow-hidden"
      >
        <img
          src="https://i.pravatar.cc/400"
          className="w-full h-[65%] object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.year}</p>

          <div className="flex flex-wrap gap-2 mt-2">
            {user.skills?.slice(0, 3).map((s, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-blue-100 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="absolute bottom-10 flex gap-16">
        <button
          onClick={handleLeftSwipe}
          className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center"
        >
          <ChevronLeft size={30} />
        </button>

        <button
          onClick={() => handleRightSwipe(user._id)}
          className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center"
        >
          <ChevronRight size={30} />
        </button>
      </div>

      {/* PROFILE OVERLAY */}
      {activeProfile && (
        <ProfileOverlay
          user={activeProfile}
          onClose={() => setActiveProfile(null)}
          onAccept={() => handleRightSwipe(activeProfile._id)}
        />
      )}
    </div>
  );
};

export default Discover;
