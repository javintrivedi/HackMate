import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

/* -------------------- UTILS -------------------- */
const normalizeArray = (arr = []) =>
  arr
    .flatMap((item) => item.split(","))
    .map((v) => v.trim())
    .filter(Boolean);

/* -------------------- MAIN -------------------- */
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [edit, setEdit] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProfile(d.profile);
          setForm(d.profile);
        }
      });
  }, []);

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    try {
      setUploading(true);
      const res = await fetch(`${API_URL}/profile/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!data.success) throw new Error();

      setProfile((p) => ({ ...p, profileImage: data.profileImage }));
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    const payload = {
      bio: form.bio,
      skills: normalizeArray(form.skills || []),
      techStack: normalizeArray(form.techStack || []),
      trackPreference: normalizeArray(form.trackPreference || []),
      projects: normalizeArray(form.projects || []),
      mostPreferredRole: form.mostPreferredRole,
      mostPreferredDomain: form.mostPreferredDomain,
      hackathonsParticipated: form.hackathonsParticipated,
      hackathonsWon: form.hackathonsWon,
      github: form.github,
      linkedin: form.linkedin,
      instagram: form.instagram,
    };

    const res = await fetch(`${API_URL}/profile/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      setProfile(data.profile);
      setEdit(false);
    } else {
      alert("Save failed");
    }
  };

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
        <div className="bg-white rounded-[32px] shadow-xl p-10 flex gap-12">

          {/* ---------------- LEFT ---------------- */}
          <div className="w-1/3 flex flex-col items-center">
            <img
              src={profile.profileImage || "https://i.pravatar.cc/300"}
              className="w-40 h-40 rounded-full object-cover mb-3"
            />

            <label className="text-blue-600 cursor-pointer text-sm">
              {uploading ? "Uploading..." : "Change photo"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>

            <h2 className="text-3xl font-extrabold mt-6 leading-tight">
              {profile.name}
            </h2>

            <p className="text-gray-500 text-sm mt-1">{profile.email}</p>

            <div className="mt-8 w-full text-sm text-gray-700 space-y-3">
              <InfoRow label="Age" value={profile.age} />
              <InfoRow label="Phone" value={profile.phoneNumber} />
              <InfoRow label="Year" value={profile.year} />
              <InfoRow label="Gender" value={profile.gender} />
              <InfoRow label="RA" value={profile.raNumber} small />
            </div>
          </div>

          {/* ---------------- RIGHT ---------------- */}
          <div className="flex-1">
            {!edit ? (
              <>
                <Display label="About me" value={profile.bio} />
                <TagView label="Skills" values={profile.skills} />
                <TagView label="Tech Stack" values={profile.techStack} />
                <TagView label="Track Preference" values={profile.trackPreference} />
                <Display label="Preferred Role" value={profile.mostPreferredRole} />
                <Display label="Preferred Domain" value={profile.mostPreferredDomain} />
                <Display label="Hackathons Participated" value={profile.hackathonsParticipated} />
                <Display label="Hackathons Won" value={profile.hackathonsWon} />
                <TagView label="Projects" values={profile.projects} />
                <Display label="GitHub" value={profile.github} />
                <Display label="LinkedIn" value={profile.linkedin} />
                <Display label="Instagram" value={profile.instagram} />

                <button
                  onClick={() => setEdit(true)}
                  className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl"
                >
                  Edit ✏️
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <Textarea
                  label="About me"
                  value={form.bio}
                  onChange={(v) => setForm((f) => ({ ...f, bio: v }))}
                />

                <TagInput label="Skills" values={form.skills || []}
                  setValues={(v) => setForm((f) => ({ ...f, skills: v }))} />

                <TagInput label="Tech Stack" values={form.techStack || []}
                  setValues={(v) => setForm((f) => ({ ...f, techStack: v }))} />

                <TagInput label="Track Preference" values={form.trackPreference || []}
                  setValues={(v) => setForm((f) => ({ ...f, trackPreference: v }))} />

                <Input label="Preferred Role" value={form.mostPreferredRole}
                  onChange={(v) => setForm((f) => ({ ...f, mostPreferredRole: v }))} />

                <Input label="Preferred Domain" value={form.mostPreferredDomain}
                  onChange={(v) => setForm((f) => ({ ...f, mostPreferredDomain: v }))} />

                <Input label="Hackathons Participated" value={form.hackathonsParticipated}
                  onChange={(v) => setForm((f) => ({ ...f, hackathonsParticipated: v }))} />

                <Input label="Hackathons Won" value={form.hackathonsWon}
                  onChange={(v) => setForm((f) => ({ ...f, hackathonsWon: v }))} />

                <TagInput label="Projects" values={form.projects || []}
                  setValues={(v) => setForm((f) => ({ ...f, projects: v }))} />

                <Input label="GitHub" value={form.github}
                  onChange={(v) => setForm((f) => ({ ...f, github: v }))} />

                <Input label="LinkedIn" value={form.linkedin}
                  onChange={(v) => setForm((f) => ({ ...f, linkedin: v }))} />

                <Input label="Instagram" value={form.instagram}
                  onChange={(v) => setForm((f) => ({ ...f, instagram: v }))} />

                <div className="col-span-2 flex gap-4 mt-4">
                  <button onClick={handleSave}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl">
                    Save
                  </button>
                  <button onClick={() => setEdit(false)}
                    className="bg-gray-300 px-8 py-3 rounded-xl">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

const InfoRow = ({ label, value, small }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className={small ? "text-xs" : ""}>{value || "—"}</span>
  </div>
);

/* 🔥 CLICKABLE DISPLAY */
const Display = ({ label, value }) => {
  const isLink =
    value &&
    (value.includes("github.com") ||
      value.includes("linkedin.com") ||
      value.includes("instagram.com") ||
      value.startsWith("http"));

  const href =
    value && !value.startsWith("http")
      ? `https://${value}`
      : value;

  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      <div className="bg-gray-100 rounded-2xl px-5 py-4 whitespace-pre-wrap break-all leading-relaxed">
        {value ? (
          isLink ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          "—"
        )}
      </div>
    </div>
  );
};

const TagView = ({ label, values }) => (
  <div className="mb-6">
    <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
    <div className="bg-gray-100 rounded-2xl px-4 py-3 flex flex-wrap gap-2">
      {values?.length
        ? values.map((v, i) => (
            <span key={i} className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
              {v}
            </span>
          ))
        : <span className="text-gray-400">—</span>}
    </div>
  </div>
);

const TagInput = ({ label, values, setValues }) => {
  const [input, setInput] = useState("");

  const add = (v) => {
    if (!v.trim()) return;
    setValues([...values, v.trim()]);
    setInput("");
  };

  return (
    <div className="col-span-2">
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      <div className="bg-gray-100 rounded-2xl px-4 py-3 flex flex-wrap gap-2">
        {values.map((v, i) => (
          <span key={i} className="bg-blue-500 text-white px-4 py-1 rounded-full flex gap-2">
            {v}
            <button onClick={() => setValues(values.filter((_, x) => x !== i))}>
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value.endsWith(",")) add(e.target.value.slice(0, -1));
          }}
          placeholder="Type and press comma"
          className="flex-1 bg-transparent outline-none"
        />
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange }) => (
  <div>
    <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-100 rounded-2xl px-4 py-3"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="col-span-2">
    <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
    <textarea
      rows={3}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-100 rounded-2xl px-4 py-3 resize-none"
    />
  </div>
);

export default Profile;