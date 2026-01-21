import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_URL}/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(data.profile);
      });
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#D7EEFF] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D7EEFF]">
      <Navbar />

      <div className="max-w-6xl mx-auto pt-28 px-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 flex gap-10">
          {/* LEFT – Avatar */}
          <div className="w-1/3 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-gray-200 mb-4" />
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-500">{profile.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              {profile.year} • {profile.gender || "—"}
            </p>
          </div>

          {/* RIGHT – Details */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            <Info label="Age" value={profile.age} />
            <Info label="Phone" value={profile.phoneNumber} />
            <Info label="RA Number" value={profile.raNumber} />
            <Info label="Year" value={profile.year} />

            <Info
              label="Skills"
              value={profile.skills?.join(", ")}
              full
            />
            <Info
              label="Tech Stack"
              value={profile.techStack?.join(", ")}
              full
            />
            <Info
              label="Track Preference"
              value={profile.trackPreference?.join(", ")}
              full
            />

            <Info
              label="Bio"
              value={profile.bio}
              full
            />

            <Info label="GitHub" value={profile.github} />
            <Info label="LinkedIn" value={profile.linkedin} />
            <Info label="Instagram" value={profile.instagram} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, full }) => (
  <div className={full ? "col-span-2" : ""}>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <div className="bg-gray-100 rounded-xl px-4 py-2">
      {value || "—"}
    </div>
  </div>
);

export default Profile;