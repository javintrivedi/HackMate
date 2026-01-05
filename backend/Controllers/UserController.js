import UserModel from "../Modules/User.js";

const discoverUsers = async (req, res) => {
  try {
    const userId = req.user.id;

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

    const users = await UserModel.find({
      _id: { $nin: excludeIds },
    }).select("name bio skills trackPreference year github linkedin");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to discover users",
    });
  }
};

export { discoverUsers };