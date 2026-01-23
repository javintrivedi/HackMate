import { X, Star } from "lucide-react";
import { motion } from "framer-motion";

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
        className="w-[80%] h-[70%] bg-white rounded-3xl shadow-xl flex relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:scale-110"
        >
          <X />
        </button>

        {/* Left */}
        <div className="w-1/3 bg-gray-200">
          <img
            src={user.profileImage || "https://i.pravatar.cc/400"}
            className="w-full h-full object-cover rounded-l-3xl"
          />
        </div>


        {/* Right */}
        <div className="flex-1 p-8 relative">
          <h2 className="text-3xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.year}</p>
          <p className="mt-4">{user.bio || "No bio provided"}</p>
          <p className="mt-4 text-sm">
            Skills: {user.skills?.join(", ") || "—"}
          </p>

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