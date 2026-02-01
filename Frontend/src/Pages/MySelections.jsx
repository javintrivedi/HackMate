import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import UserOverlay from "../components/UserOverlay";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

const MySelections = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(null);

  const fetchData = async () => {
    const res = await fetch(`${API_URL}/match/selected`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data.selectedUsers || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navbar />

      <div className="ml-72 max-w-7xl mx-auto py-10 px-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/discover")}
            className="w-12 h-12 bg-white/70 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 border border-white/20"
          >
            ←
          </button>

          <div className="bg-white/70 backdrop-blur-sm px-8 py-3 rounded-full shadow-lg font-semibold text-gray-800 border border-white/20">
            My Selections ({users.length})
          </div>
        </div>

        {users.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            You haven’t selected anyone yet 👀
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-8">
            {users.map((u) => (
              <UserCard
                key={u._id}
                user={u}
                onClick={setActive}
              />
            ))}
          </div>
        )}
      </div>

      {active && (
        <UserOverlay
          user={active}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
};

export default MySelections;