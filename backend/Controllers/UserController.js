import UserModel from "../Modules/User.js";

const discoverUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current user to exclude already interacted users
    const currentUser = await UserModel.findById(userId)
      .select("selectedUsers pendingRequests matches")
      .lean();

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const excludeIds = [
      userId,
      ...currentUser.selectedUsers,
      ...currentUser.pendingRequests,
      ...currentUser.matches,
    ];

    // Read query params
    const { year, skills, techStack, trackPreference, gender } = req.query;

    // Base filter
    const filter = {
      _id: { $nin: excludeIds },
    };

    // Apply filters dynamically
    if (year) {
      filter.year = year;
    }
    if (gender) {
      filter.gender = gender;
    }
    if (skills) {
      filter.skills = { $in: skills.split(",") };
    }
    if (techStack) {
      filter.techStack = { $in: techStack.split(",") };
    }
    if (trackPreference) {
      filter.trackPreference = { $in: trackPreference.split(",") };
    }

    // Fetch users
    const users = await UserModel.find(filter).select(
      "name bio age gender year profileImage skills techStack trackPreference projects mostPreferredRole mostPreferredDomain hackathonsParticipated hackathonsWon github linkedin instagram"
    );

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("DISCOVER USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to discover users",
    });
  }
};

export { discoverUsers };