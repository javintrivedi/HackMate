import { X, ChevronRight } from "lucide-react";

const ProfileOverlay = ({ user, onClose, onAccept }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[85%] h-[70%] bg-[#102A52] rounded-xl flex overflow-hidden shadow-2xl relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white z-10"
        >
          <X size={28} />
        </button>

        {/* LEFT IMAGE */}
        <div className="w-[35%] bg-black">
          <img
            src="https://i.pravatar.cc/600"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="flex-1 bg-[#9AA3AF] p-8 text-[#0B1C35]">
          <h1 className="text-3xl font-semibold mb-6">{user.name}</h1>

          <div className="space-y-2 text-lg">
            <p>📍 Chennai, TN</p>
            <p>🎓 {user.year}</p>
            <p>🧠 Skills: {user.skills?.join(", ")}</p>
          </div>

          <div className="mt-8">
            <p className="text-md text-gray-800">
              {user.bio || "No bio provided"}
            </p>
          </div>

          <div className="absolute bottom-8 right-10">
            <button
              onClick={onAccept}
              className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow hover:scale-105 transition"
            >
              Select <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverlay;