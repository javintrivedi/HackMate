import { X, Check } from "lucide-react";
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

// 🔥 SAFE SHUFFLE (NO MUTATION)
const shuffleArray = (arr) => {
  return [...arr].sort(() => Math.random() - 0.5);
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

  // 🔹 Fetch discover users + counts
  useEffect(() => {
    fetch(`${API_URL}/users/discover`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.users?.length) {
          setUsers(shuffleArray(data.users)); // 🔥 RANDOM HERE
          setIndex(0); // reset safety
        }
      });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 overflow-hidden">
      <Navbar />
      <div className="ml-72">

        {/* CARD AREA */}
        <div className="relative flex justify-center items-center py-20">
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
              className="w-[480px] h-[680px] bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden cursor-pointer relative border border-white/20"
            >
              {/* Image Section */}
              <div className="relative h-[60%] overflow-hidden">
                <img
                  src={user.profileImage || "https://i.pravatar.cc/600"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Name on Image */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-4xl font-bold text-white drop-shadow-lg">{user.name}</h3>
                  <p className="text-white/90 text-lg font-medium mt-1">{user.year}</p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="p-6 h-[40%] flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <p className="text-md font-bold text-gray-500 mb-2 uppercase tracking-wide">About</p>
                  {user.bio ? (
                    <p className="text-gray-700 text-md leading-relaxed">{user.bio}</p>
                  ) : (
                    <p className="text-gray-400 text-sm italic">No bio available</p>
                  )}
                  
                  {/* Additional Info */}
                  {(user.skills?.length > 0 || user.techStack?.length > 0) && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {(user.skills || user.techStack)?.slice(0, 5).map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      swipeLeft();
                    }}
                    className=" flex-5 flex items-center justify-center gap-4 px-1 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-full shadow-lg text-white font-bold text-lg transition-all duration-200 cursor-pointer"
                  >
                    <X size={28} strokeWidth={2.5} />
                    
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      swipeRight();
                    }}
                    className="flex-5 flex items-center justify-center gap-4 px-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-full shadow-lg text-white font-bold text-lg transition-all duration-200 cursor-pointer"
                  >
                    <Check size={28} strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>

              {overlay === "reject" && (
                <div className="absolute inset-0 bg-red-500/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-8 shadow-2xl">
                    <X size={120} className="text-red-600" strokeWidth={3} />
                  </div>
                </div>
              )}

              {overlay === "accept" && (
                <div className="absolute inset-0 bg-green-500/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-8 shadow-2xl">
                    <Check size={120} className="text-green-600" strokeWidth={3} />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* PROFILE OVERLAY */}
      {activeUser && (
        <ProfileDetailOverlay
          user={activeUser}
          onClose={() => setActiveUser(null)}
          onSelect={async () => {
            setActiveUser(null);
            await swipeRight();
          }}
        />
      )}
      </div>
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