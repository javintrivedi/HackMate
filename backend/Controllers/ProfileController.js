import UserModel from "../Modules/User.js";

// Get logged-in user profile
const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, profile: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching profile", error: err.message });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await UserModel.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");

    res.json({ success: true, message: "Profile updated", profile: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating profile", error: err.message });
  }
};

export { getProfile, updateProfile };
