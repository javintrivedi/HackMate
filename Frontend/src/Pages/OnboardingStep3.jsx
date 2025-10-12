import React, { useState, useRef } from "react";
import { ArrowLeft, CheckCircle2, Plus, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OnboardingStep3({ onBack, onFinish }) {
  const [progress] = useState(50);
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: "",
    skills: [],
    techStack: [],
    github: "",
    linkedin: "",
    instagram: "",
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentTech, setCurrentTech] = useState("");

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (type, value) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }));
    type === "skills" ? setCurrentSkill("") : setCurrentTech("");
  };

  const handleRemoveTag = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleFinish = () => {
    onFinish?.(formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 font-sans">
      {/* Progress Bar */}
      <div className="w-3/4 mt-15 mb-15">
        <div className="h-2 bg-blue-300 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-700 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Form Layout */}
      <div className="flex flex-col md:flex-row w-3/4">
        {/* Left Panel */}
        <div className="bg-blue-800 text-white p-10 rounded-2xl flex items-center justify-center md:w-1/3 mb-6 md:mb-0 md:mr-6">
          <h2 className="text-2xl font-bold tracking-widest rotate-0 md:-rotate-90 whitespace-nowrap">
            BUILD YOUR PROFILE
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex-1 bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">
            Customize Your Profile
          </h1>

          {/* Profile Pic Upload */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-all"
              onClick={() => fileInputRef.current.click()}
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Plus size={36} className="text-blue-600" />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">Upload Profile Picture</p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleProfileUpload}
              className="hidden"
            />
          </div>

          {/* Bio */}
          <textarea
            name="bio"
            value={formData.bio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bio: e.target.value }))
            }
            placeholder="Write a short bio..."
            className="w-full p-3 mb-6 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Skills Input */}
          <div className="mb-6">
            <label className="block text-blue-900 font-semibold mb-2">
              Skills
            </label>
            <div className="flex flex-wrap items-center gap-2 border border-blue-300 rounded-xl p-3">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag("skills", index)}
                  />
                </span>
              ))}
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => {
                  setCurrentSkill(e.target.value);
                  if (e.target.value.endsWith(",")) {
                    handleAddTag("skills", e.target.value.slice(0, -1));
                  }
                }}
                placeholder="Type a skill and press comma"
                className="flex-1 outline-none border-none bg-transparent"
              />
            </div>
          </div>

          {/* Tech Stack Input */}
          <div className="mb-6">
            <label className="block text-blue-900 font-semibold mb-2">
              Tech Stack
            </label>
            <div className="flex flex-wrap items-center gap-2 border border-blue-300 rounded-xl p-3">
              {formData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {tech}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag("techStack", index)}
                  />
                </span>
              ))}
              <input
                type="text"
                value={currentTech}
                onChange={(e) => {
                  setCurrentTech(e.target.value);
                  if (e.target.value.endsWith(",")) {
                    handleAddTag("techStack", e.target.value.slice(0, -1));
                  }
                }}
                placeholder="Type tech stack and press comma"
                className="flex-1 outline-none border-none bg-transparent"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="url"
              placeholder="GitHub Link"
              value={formData.github}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, github: e.target.value }))
              }
              className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="LinkedIn Link"
              value={formData.linkedin}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, linkedin: e.target.value }))
              }
              className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="Instagram Link"
              value={formData.instagram}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, instagram: e.target.value }))
              }
              className="md:col-span-2 p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-between">
            <button
              onClick={() => {
                navigate('/your-info');
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-xl flex items-center gap-2 transition-all duration-300"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button
              onClick={handleFinish}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 transition-all duration-300"
            >
              Next <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
