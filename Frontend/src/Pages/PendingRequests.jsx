import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import UserOverlay from "../components/UserOverlay";

const API_URL = "http://localhost:3000";

const PendingRequests = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(null);

  const fetchData = async () => {
    const res = await fetch(`${API_URL}/match/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data.pendingRequests || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#D7EEFF]">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto pt-28 px-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/discover")}
            className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center"
          >
            ←
          </button>
          <div className="bg-white px-6 py-2 rounded-full shadow">
            Pending Requests ({users.length})
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-8">
          {users.map((u) => (
            <UserCard
              key={u._id}
              user={u}
              onClick={setActive}
              showActions
              onAccept={async (id) => {
                await fetch(`${API_URL}/match/accept`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ requesterId: id }),
                });
                fetchData();
              }}
              onReject={async (id) => {
                await fetch(`${API_URL}/match/reject`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ requesterId: id }),
                });
                fetchData();
              }}
            />
          ))}
        </div>
      </div>

      {/* Overlay */}
      {active && (
        <UserOverlay
          user={active}
          showAccept
          onAccept={() => {}}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
};

export default PendingRequests;