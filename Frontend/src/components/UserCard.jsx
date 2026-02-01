    const UserCard = ({ user, onClick, showActions, onAccept, onReject }) => {
  return (
    <div
      onClick={() => onClick?.(user)}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-white/20 group"
    >
      {/* Image */}
      <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 relative">
        <img
          src={user.profileImage || "https://i.pravatar.cc/300"}
          alt={user.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info */}
      <h3 className="text-center font-bold text-gray-800 text-lg">{user.name}</h3>
      <p className="text-center text-sm text-gray-500 mt-1">{user.year}</p>

      {/* Actions (only pending page) */}
      {showActions && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex gap-2 mt-4"
        >
          <button
            onClick={() => onAccept(user._id)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg py-2 font-semibold hover:scale-105 transition-all duration-200 shadow-md"
          >
            ✓ Accept
          </button>
          <button
            onClick={() => onReject(user._id)}
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-lg py-2 font-semibold hover:scale-105 transition-all duration-200 shadow-md"
          >
            ✕ Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;