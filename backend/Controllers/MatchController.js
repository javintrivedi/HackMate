import UserModel from "../Modules/User.js";
import ChatModel from "../Modules/Chat.js";

/*
|--------------------------------------------------------------------------
| SWIPE USER (Right Swipe)
|--------------------------------------------------------------------------
*/
const swipeUser = async (req, res) => {
  try {
    const { selectedUserId } = req.body;
    const userId = req.user.id;

    if (!selectedUserId || userId === selectedUserId) {
      return res.status(400).json({
        success: false,
        message: "Invalid selection",
      });
    }

    const [user, selectedUser] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(selectedUserId),
    ]);

    if (!user || !selectedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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

    res.json({
      success: true,
      message: "User selected successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error in swiping user",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ACCEPT REQUEST (MATCH + CREATE CHAT)
|--------------------------------------------------------------------------
*/
const acceptRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user.id;

    const [user, requester] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(requesterId),
    ]);

    if (!user || !requester) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.pendingRequests.includes(requesterId)) {
      return res.status(400).json({
        success: false,
        message: "No pending request",
      });
    }

    // 🧹 Cleanup
    user.pendingRequests = user.pendingRequests.filter(
      (id) => id.toString() !== requesterId
    );

    requester.selectedUsers = requester.selectedUsers.filter(
      (id) => id.toString() !== userId
    );

    if (!user.matches.includes(requesterId)) {
      user.matches.push(requesterId);
    }

    if (!requester.matches.includes(userId)) {
      requester.matches.push(userId);
    }

    // 🔥 CREATE CHAT (only if not exists)
    const existingChat = await ChatModel.findOne({
      participants: { $all: [userId, requesterId] },
    });

    if (!existingChat) {
      await ChatModel.create({
        participants: [userId, requesterId],
      });
    }

    await Promise.all([user.save(), requester.save()]);

    res.json({
      success: true,
      message: "Request accepted, matched & chat created",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error accepting request",
    });
  }
};

/*
|--------------------------------------------------------------------------|
*/
const rejectRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user.id;

    const [user, requester] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(requesterId),
    ]);

    user.pendingRequests = user.pendingRequests.filter(
      (id) => id.toString() !== requesterId
    );

    requester.selectedUsers = requester.selectedUsers.filter(
      (id) => id.toString() !== userId
    );

    await Promise.all([user.save(), requester.save()]);

    res.json({
      success: true,
      message: "Request rejected",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error rejecting request",
    });
  }
};

const getMatches = async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate(
    "matches",
    "name skills bio"
  );

  res.json({ success: true, matches: user.matches });
};

const getSelectedUsers = async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate(
    "selectedUsers",
    "name skills bio"
  );

  res.json({ success: true, selectedUsers: user.selectedUsers });
};

const getPendingRequests = async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate(
    "pendingRequests",
    "name skills bio"
  );

  res.json({ success: true, pendingRequests: user.pendingRequests });
};

export {
  swipeUser,
  acceptRequest,
  rejectRequest,
  getMatches,
  getSelectedUsers,
  getPendingRequests,
};