import UserModel from "../Modules/User.js";
import cloudinary from "../utils/cloudinary.js";

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
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const allowedFields = [
      "name",
      "age",
      "phoneNumber",
      "year",
      "gender",
      "raNumber",
      "bio",
      "skills",
      "techStack",
      "trackPreference",
      "github",
      "linkedin",
      "instagram",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
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

// ---------------- UPLOAD PROFILE IMAGE ----------------
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const uploadResult = await cloudinary.v2.uploader.upload(
      `data:image/png;base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "hackmate/profile-images",
        transformation: [
          { width: 400, height: 400, crop: "fill" },
          { quality: "auto" },
        ],
      }
    );

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { profileImage: uploadResult.secure_url },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error("❌ IMAGE UPLOAD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

export { getProfile, updateProfile, uploadProfileImage };