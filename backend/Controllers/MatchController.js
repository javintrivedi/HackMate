import UserModel from "../Modules/User.js";

// Swipe / select a user
const swipeUser = async (req, res) => {
  try {
    const { selectedUserId } = req.body;
    const userId = req.user.id;

    if (userId === selectedUserId) return res.status(400).json({ message: "Cannot select yourself", success: false });

    const user = await UserModel.findById(userId);
    const selectedUser = await UserModel.findById(selectedUserId);

    if (!user || !selectedUser) return res.status(404).json({ message: "User not found", success: false });

    if (!user.selectedUsers.includes(selectedUserId)) {
      user.selectedUsers.push(selectedUserId);
      await user.save();
    }

    if (!selectedUser.pendingRequests.includes(userId)) {
      selectedUser.pendingRequests.push(userId);
      await selectedUser.save();
    }

    res.json({ success: true, message: "User selected successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error in swiping user", error: err.message });
  }
};

// Accept a pending request
const acceptRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    const requester = await UserModel.findById(requesterId);

    if (!user || !requester) return res.status(404).json({ message: "User not found", success: false });

    if (!user.pendingRequests.includes(requesterId)) return res.status(400).json({ message: "No such pending request", success: false });

    if (!user.matches.includes(requesterId)) user.matches.push(requesterId);
    if (!requester.matches.includes(userId)) requester.matches.push(userId);

    user.pendingRequests = user.pendingRequests.filter(id => id.toString() !== requesterId);

    await user.save();
    await requester.save();

    res.json({ success: true, message: "Request accepted and matched" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error in accepting request", error: err.message });
  }
};

// Reject a pending request
const rejectRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    user.pendingRequests = user.pendingRequests.filter(id => id.toString() !== requesterId);
    await user.save();

    res.json({ success: true, message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error in rejecting request", error: err.message });
  }
};

// Get all matches of logged-in user
const getMatches = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate("matches", "name email skills trackPreference bio");
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    res.json({ success: true, matches: user.matches });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching matches", error: err.message });
  }
};

// Get all users I selected
const getSelectedUsers = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate("selectedUsers", "name email skills trackPreference bio");
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    res.json({ success: true, selectedUsers: user.selectedUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching selected users", error: err.message });
  }
};

// Get all pending requests (users who selected me)
const getPendingRequests = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate("pendingRequests", "name email skills trackPreference bio");
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    res.json({ success: true, pendingRequests: user.pendingRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching pending requests", error: err.message });
  }
};

export { swipeUser, acceptRequest, rejectRequest, getMatches, getSelectedUsers, getPendingRequests };