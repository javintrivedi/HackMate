import { X, Star } from "lucide-react";
import { motion } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const safeText = (v) =>
  v !== undefined && v !== null && v !== "" ? v : "—";

const safeArray = (arr) =>
  Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "—";

// 🔥 auto-add https
const formatLink = (url) => {
  if (!url || url === "—") return null;
  return url.startsWith("http") ? url : `https://${url}`;
};

const ClickableLink = ({ label, value }) => {
  const link = formatLink(value);

  return (
    <p>
      {label}:{" "}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 underline break-all"
        >
          {value}
        </a>
      ) : (
        "—"
      )}
    </p>
  );
};

const ProfileDetailOverlay = ({ user, onClose, onSelect }) => {
  if (!user) return null;

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        className="w-[85%] h-[70%] bg-[#0B1C35] rounded-xl flex overflow-hidden relative shadow-2xl"
      >
        {/* CLOSE */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 8 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-white z-10 hover:text-red-400"
        >
          <X size={28} />
        </motion.button>

        {/* LEFT IMAGE */}
        <div className="w-[35%] bg-black">
          <img
            src={user.profileImage || "https://i.pravatar.cc/700"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="flex-1 bg-[#A0A7B4] p-8 text-[#0B1C35] relative overflow-y-auto">
          <h1 className="text-3xl font-semibold mb-6">
            {safeText(user.name)}
          </h1>

          <div className="space-y-2 text-lg">
            <p>🎂 Age: {safeText(user.age)}</p>
            <p>⚧ Gender: {safeText(user.gender)}</p>
            <p>🎓 Year: {safeText(user.year)}</p>
            <p>🧠 Skills: {safeArray(user.skills)}</p>
            <p>⚙️ Tech Stack: {safeArray(user.techStack)}</p>
            <p>🛣 Track Preference: {safeArray(user.trackPreference)}</p>
            <p>🎯 Preferred Role: {safeText(user.mostPreferredRole)}</p>
            <p>📌 Preferred Domain: {safeText(user.mostPreferredDomain)}</p>
            <p>🏁 Hackathons Participated: {safeText(user.hackathonsParticipated)}</p>
            <p>🏆 Hackathons Won: {safeText(user.hackathonsWon)}</p>
          </div>

          {/* BIO */}
          <div className="mt-6">
            <p className="text-md text-gray-800 whitespace-pre-wrap break-all leading-relaxed">
              {safeText(user.bio)}
            </p>
          </div>

          {/* 🔗 CLICKABLE SOCIALS */}
          <div className="mt-6 space-y-1 text-lg">
            <ClickableLink label="GitHub" value={user.github} />
            <ClickableLink label="LinkedIn" value={user.linkedin} />
            <ClickableLink label="Instagram" value={user.instagram} />
          </div>

          {/* STAR ACTION */}
          <motion.button
            whileHover={{
              scale: 1.25,
              rotate: 5,
              boxShadow: "0 0 20px rgba(250, 204, 21, 0.9)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onSelect}
            className="absolute bottom-6 right-6 text-yellow-400"
          >
            <Star size={36} fill="currentColor" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileDetailOverlay;