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

// ✅ Create new user (POST route)
const createUser = async (req, res) => {
  try {
    const {
      name,
      age,
      phoneNumber,
      email,
      password,
      year,
      gender,
      skills,
      trackPreference,
      bio,
      raNumber,
      techStack,
      mostPreferredRole,
      hackathonsParticipated,
      hackathonsWon,
      projects,
      mostPreferredDomain,
      github,
      linkedin,
      instagram,
    } = req.body;

    // Validate required fields
    if (!name || !age || !phoneNumber || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if email or phone already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email or phone number already exists" });
    }

    // Create and save new user
    const newUser = new UserModel({
      name,
      age,
      phoneNumber,
      email,
      password, // you should hash it if this is for production!
      year,
      gender,
      skills,
      trackPreference,
      bio,
      raNumber,
      techStack,
      mostPreferredRole,
      hackathonsParticipated,
      hackathonsWon,
      projects,
      mostPreferredDomain,
      github,
      linkedin,
      instagram,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating user", error: err.message });
  }
};

export { getProfile, updateProfile, createUser };
