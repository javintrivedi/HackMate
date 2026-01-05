import UserModel from "../Modules/User.js";

// Get logged-in user profile
const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, profile: user });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    // 🔒 Auth safety
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ ALL fields allowed across onboarding steps
    const allowedFields = [
      "name",
      "age",
      "phoneNumber",
      "email",
      "year",
      "gender",
      "raNumber",
      "bio",
      "skills",
      "techStack",
      "github",
      "linkedin",
      "instagram",
    ];

    const updates = {};

    // ⭐ IMPORTANT: only exclude UNDEFINED (not empty string / array)
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    console.log("📥 STEPWISE PROFILE UPDATE:", updates);

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { $set: updates },          // 🔥 merge, don't replace
      {
        new: true,
        runValidators: true,      // 🔥 validates arrays + strings
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile: user,
    });
  } catch (err) {
    console.error("❌ UPDATE PROFILE ERROR:", err);

    // Handle duplicate unique keys cleanly
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate email / phone / RA number",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { getProfile, updateProfile };
