import { ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProfileDetailOverlay from "../components/ProfileDetailOverlay";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

const swipeVariants = {
  center: { x: 0, opacity: 1, rotate: 0 },
  left: { x: -300, opacity: 0, rotate: -8, transition: { duration: 0.4 } },
  right: { x: 300, opacity: 0, rotate: 8, transition: { duration: 0.4 } },
};

const Discover = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  const [counts, setCounts] = useState({
    selected: 0,
    matches: 0,
    pending: 0,
  });

  const token = localStorage.getItem("token");

  // Fetch discover users + counts
  useEffect(() => {
    fetch(`${API_URL}/users/discover`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => data.success && setUsers(data.users));

    refreshCounts();
  }, []);

  const refreshCounts = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    const [s, m, p] = await Promise.all([
      fetch(`${API_URL}/match/selected`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/match/matches`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/match/pending`, { headers }).then((r) => r.json()),
    ]);

    setCounts({
      selected: s.selectedUsers?.length || 0,
      matches: m.matches?.length || 0,
      pending: p.pendingRequests?.length || 0,
    });
  };

  // LEFT SWIPE (REJECT)
  const swipeLeft = () => {
    setDirection("left");
    setOverlay("reject");

    setTimeout(() => {
      setIndex((i) => i + 1);
      setDirection(null);
      setOverlay(null);
    }, 400);
  };

  // RIGHT SWIPE (SELECT)
  const swipeRight = async () => {
    const user = users[index];
    if (!user) return;

    setDirection("right");
    setOverlay("accept");

    await fetch(`${API_URL}/match/swipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ selectedUserId: user._id }),
    });

    setTimeout(() => {
      setIndex((i) => i + 1);
      setDirection(null);
      setOverlay(null);
      refreshCounts();
    }, 400);
  };

  const user = users[index];

  return (
    <div className="min-h-screen bg-[#D7EEFF] pt-28 overflow-hidden">
      <Navbar />

      {/* CARD AREA */}
      <div className="relative flex justify-center items-center mt-14">
        {/* LEFT ARROW */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          onClick={swipeLeft}
          className="absolute left-24 w-14 h-14 bg-white rounded-full shadow"
        >
          <ChevronLeft size={30} />
        </motion.button>

        {/* CARD */}
        <AnimatePresence>
          {user && (
            <motion.div
              key={user._id}
              variants={swipeVariants}
              initial="center"
              animate={direction || "center"}
              exit={direction}
              onClick={() => setActiveUser(user)}
              className="w-[360px] h-[470px] bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
            >
              <img
                src="https://i.pravatar.cc/600"
                className="w-full h-[60%] object-cover"
              />

              <div className="p-5">
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <p className="text-gray-600">{user.year}</p>
              </div>

              {overlay === "reject" && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <X size={100} className="text-red-600" />
                </div>
              )}

              {overlay === "accept" && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <Check size={100} className="text-green-600" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT ARROW */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          onClick={swipeRight}
          className="absolute right-24 w-14 h-14 bg-white rounded-full shadow"
        >
          <ChevronRight size={30} />
        </motion.button>
      </div>

      {/* 🔥 BOTTOM BUTTONS (NOW CLICKABLE) */}
      <div className="mt-10 flex justify-center gap-10">
        <BottomPill
          label="My Selections"
          count={counts.selected}
          onClick={() => navigate("/selections")}
        />
        <BottomPill
          label="My Matches"
          count={counts.matches}
          onClick={() => navigate("/matches")}
        />
        <BottomPill
          label="Pending requests"
          count={counts.pending}
          onClick={() => navigate("/pending")}
        />
      </div>

      {/* PROFILE OVERLAY */}
      {activeUser && (
        <ProfileDetailOverlay
          user={activeUser}
          onClose={() => setActiveUser(null)}
          onSelect={async () => {
            setActiveUser(null);
            await swipeRight(); // ⭐ SAME RIGHT SWIPE LOGIC
          }}
        />
      )}
    </div>
  );
};

const BottomPill = ({ label, count, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ y: -4, scale: 1.05 }}
    className="relative px-10 py-3 bg-white rounded-full shadow cursor-pointer"
  >
    {label}
    <span className="absolute -top-2 -right-2 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
      {count}
    </span>
  </motion.div>
);

export default Discover;