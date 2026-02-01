import { MessageCircle, LogOut, Users, Heart, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [profileImage, setProfileImage] = useState(null);

  // 🔥 Fetch profile image from API
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfileImage(data.profile.profileImage);
        }
      })
      .catch((err) => {
        console.error("Navbar profile fetch error:", err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { label:"Discover", path:"/discover", icon: Users},
    {label: "My Selections", path: "/selections", icon: Heart },
    { label: "My Matches", path: "/matches", icon: Users },
    { label: "Pending Requests", path: "/pending", icon: Clock },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-white/70 backdrop-blur-xl z-50 border-r border-white/20 shadow-2xl flex flex-col">
      
      {/* Logo */}
      <div
        onClick={() => navigate("/discover")}
        className="px-6 py-8 cursor-pointer"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
          HackMate
        </h1>
      </div>

      {/* Top Section - Chat & Profile */}
      <div className="px-4 space-y-3 pb-6 border-b border-gray-200/50">
        <button
          onClick={() => navigate("/chat")}
          className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
            location.pathname === "/chat" || location.pathname.startsWith("/chat/")
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
              : "bg-white/50 hover:bg-white/80 text-gray-700"
          }`}
        >
          <MessageCircle size={22} />
          <span className="font-semibold">Messages</span>
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
            location.pathname === "/profile"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
              : "bg-white/50 hover:bg-white/80 text-gray-700"
          }`}
        >
          <img
            src={profileImage || "https://i.pravatar.cc/100"}
            alt="Profile"
            className="w-7 h-7 rounded-full object-cover border-2 border-white"
          />
          <span className="font-semibold">My Profile</span>
        </button>
      </div>

      {/* Middle Section - Navigation Items */}
      <div className="flex-1 px-4 py-6 space-y-2">
        <p className="text-xs font-bold text-gray-500 px-5 mb-3">NAVIGATION</p>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white/30 hover:bg-white/60 text-gray-700"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Section - Logout */}
      <div className="px-4 py-6 border-t border-gray-200/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg transition-all duration-200 hover:scale-105 font-semibold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;