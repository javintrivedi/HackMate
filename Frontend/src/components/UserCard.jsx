const UserCard = ({ user, onClick, showActions, onAccept, onReject }) => {
  return (
    <div
      onClick={() => onClick(user)}
      className="bg-white rounded-2xl p-4 shadow hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
    >
      {/* Image */}
      <div className="w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
        <div className="w-20 h-20 bg-gray-300 rounded-full" />
      </div>

      {/* Info */}
      <h3 className="text-center font-semibold">{user.name}</h3>
      <p className="text-center text-sm text-gray-500">{user.year}</p>

      {/* Actions (only pending page) */}
      {showActions && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex gap-2 mt-4"
        >
          <button
            onClick={() => onAccept(user._id)}
            className="flex-1 bg-green-500 text-white rounded py-1 hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => onReject(user._id)}
            className="flex-1 bg-red-500 text-white rounded py-1 hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;