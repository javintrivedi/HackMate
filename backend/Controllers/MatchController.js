import UserModel from "../Modules/User.js";

const swipeUser = async (req, res) => {
  try {
    const { selectedUserId } = req.body;
    const userId = req.user.id;

    if (!selectedUserId || userId === selectedUserId) {
      return res.status(400).json({ success: false, message: "Invalid selection" });
    }

    const [user, selectedUser] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(selectedUserId),
    ]);

    if (!user || !selectedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (
      user.matches.includes(selectedUserId) ||
      user.selectedUsers.includes(selectedUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "User already selected or matched",
      });
    }

    user.selectedUsers.push(selectedUserId);
    selectedUser.pendingRequests.push(userId);

    await Promise.all([user.save(), selectedUser.save()]);

    res.json({ success: true, message: "User selected successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Error in swiping user" });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user.id;

    const [user, requester] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(requesterId),
    ]);

    if (!user || !requester) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.pendingRequests.includes(requesterId)) {
      return res.status(400).json({ success: false, message: "No pending request" });
    }

    user.pendingRequests = user.pendingRequests.filter(
      (id) => id.toString() !== requesterId
    );

    requester.selectedUsers = requester.selectedUsers.filter(
      (id) => id.toString() !== userId
    );

    if (!user.matches.includes(requesterId)) user.matches.push(requesterId);
    if (!requester.matches.includes(userId)) requester.matches.push(userId);

    await Promise.all([user.save(), requester.save()]);

    res.json({ success: true, message: "Request accepted and matched" });
  } catch {
    res.status(500).json({ success: false, message: "Error accepting request" });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user.id;

    const [user, requester] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(requesterId),
    ]);

    if (!user || !requester) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.pendingRequests = user.pendingRequests.filter(
      (id) => id.toString() !== requesterId
    );

    requester.selectedUsers = requester.selectedUsers.filter(
      (id) => id.toString() !== userId
    );

    await Promise.all([user.save(), requester.save()]);

    res.json({ success: true, message: "Request rejected" });
  } catch {
    res.status(500).json({ success: false, message: "Error rejecting request" });
  }
};

const getMatches = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate(
      "matches",
      "name skills trackPreference bio"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, matches: user.matches });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching matches" });
  }
};

const getSelectedUsers = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate(
      "selectedUsers",
      "name skills trackPreference bio"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, selectedUsers: user.selectedUsers });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching selected users" });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate(
      "pendingRequests",
      "name skills trackPreference bio"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, pendingRequests: user.pendingRequests });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching pending requests" });
  }
};

export {
  swipeUser,
  acceptRequest,
  rejectRequest,
  getMatches,
  getSelectedUsers,
  getPendingRequests,
};