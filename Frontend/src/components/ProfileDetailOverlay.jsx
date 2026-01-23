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
        {/* ❌ CLOSE */}
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
        <div className="flex-1 bg-[#A0A7B4] p-8 text-[#0B1C35] relative">
          <h1 className="text-3xl font-semibold mb-6">{user.name}</h1>

          <div className="space-y-2 text-lg">
            <p>📍 Chennai, TN</p>
            <p>🎂 Age: {user.age || "—"}</p>
            <p>⚧ Gender: {user.gender || "—"}</p>
            <p>🎓 {user.year}</p>
            <p>🧠 Skills: {user.skills?.join(", ")}</p>
          </div>

          <div className="mt-6">
            <p className="text-md text-gray-800">
              {user.bio || "No bio provided"}
            </p>
          </div>

          {/* ⭐ STAR (RIGHT SWIPE ACTION) */}
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