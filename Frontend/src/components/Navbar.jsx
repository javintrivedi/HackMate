import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

const Navbar = () => {
  const navigate = useNavigate();
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

  return (
    <div className="fixed top-0 left-0 w-full h-20 px-10 flex items-center justify-between bg-[#D7EEFF] z-50">
      
      {/* Logo */}
      <div
        onClick={() => navigate("/discover")}
        className="text-xl font-bold text-[#102A52] cursor-pointer"
      >
        HackMate
      </div>

      {/* Center */}
      <div className="flex gap-8">
        {[
          { label: "Home", path: "/discover" },
          { label: "Preferences", path: "/preferences" },
          { label: "About us", path: "/about" },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => navigate(btn.path)}
            className="px-8 py-2 rounded-full bg-[#EAF4FF] shadow hover:scale-105 transition"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/chat")}
          className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition"
        >
          <MessageCircle />
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition"
        >
          <img
            src={profileImage || "https://i.pravatar.cc/100"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </button>
      </div>
    </div>
  );
};

export default Navbar;