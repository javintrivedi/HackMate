import { X, Star } from "lucide-react";
import { motion } from "framer-motion";

const safeText = (v) =>
  v !== undefined && v !== null && v !== "" ? v : "—";

const safeArray = (arr) =>
  Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "—";

// 🔥 auto-fix link (adds https if missing)
const formatLink = (url) => {
  if (!url || url === "—") return null;
  return url.startsWith("http") ? url : `https://${url}`;
};

const ClickableLink = ({ label, value }) => {
  const link = formatLink(value);

  return (
    <p>
      <b>{label}:</b>{" "}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {value}
        </a>
      ) : (
        "—"
      )}
    </p>
  );
};

const UserOverlay = ({ user, onClose, showAccept, onAccept }) => {
  if (!user) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        className="w-[80%] h-[70%] bg-white rounded-3xl shadow-xl flex relative overflow-hidden"
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:scale-110 z-10"
        >
          <X />
        </button>

        {/* LEFT IMAGE */}
        <div className="w-1/3 bg-gray-200">
          <img
            src={user.profileImage || "https://i.pravatar.cc/400"}
            className="w-full h-full object-cover rounded-l-3xl"
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="flex-1 p-8 relative overflow-y-auto space-y-3 text-sm">
          <h2 className="text-3xl font-bold">{safeText(user.name)}</h2>

          <p><b>Age:</b> {safeText(user.age)}</p>
          <p><b>Gender:</b> {safeText(user.gender)}</p>
          <p><b>Year:</b> {safeText(user.year)}</p>

          <p className="whitespace-pre-wrap break-all leading-relaxed">
            <b>Bio:</b> {safeText(user.bio)}
          </p>

          <p><b>Skills:</b> {safeArray(user.skills)}</p>
          <p><b>Tech Stack:</b> {safeArray(user.techStack)}</p>
          <p><b>Track Preference:</b> {safeArray(user.trackPreference)}</p>

          <p><b>Preferred Role:</b> {safeText(user.mostPreferredRole)}</p>
          <p><b>Preferred Domain:</b> {safeText(user.mostPreferredDomain)}</p>

          <p><b>Hackathons Participated:</b> {safeText(user.hackathonsParticipated)}</p>
          <p><b>Hackathons Won:</b> {safeText(user.hackathonsWon)}</p>

          {/* 🔗 CLICKABLE SOCIALS */}
          <ClickableLink label="GitHub" value={user.github} />
          <ClickableLink label="LinkedIn" value={user.linkedin} />
          <ClickableLink label="Instagram" value={user.instagram} />

          {showAccept && (
            <button
              onClick={() => onAccept(user._id)}
              className="absolute bottom-6 right-6 text-yellow-400 hover:scale-125"
            >
              <Star size={40} fill="currentColor" />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserOverlay;