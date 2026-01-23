import UserModel from "../Modules/User.js";
import ChatModel from "../Modules/Chat.js";
import { sendEmail } from "../utils/emailService.js";

//swipe user
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

    await sendEmail({
      to: selectedUser.email,
      subject: "New collaboration request 🚀",
      text: `
Hey ${selectedUser.name},

${user.name} has sent you a collaboration request on HackMate.

Check your pending requests and respond before someone else teams up 😉

– Team HackMate
  `,
    });


    res.json({
      success: true,
      message: "User selected successfully",
    });
  } catch (err) {
    console.error("❌ swipeUser error:", err);
    res.status(500).json({
      success: false,
      message: "Error in swiping user",
    });
  }
};

//accept request krna
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

    // 🧹 Cleanup pending / selected
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

    await sendEmail({
      to: requester.email,
      subject: "It's a Match! 🎉",
      text: `
Congrats ${requester.name}!

You and ${user.name} are now matched on HackMate 🎯

You can start chatting immediately and build something awesome together.

Don't wait — hackathons don't win themselves 😄

– Team HackMate
  `,
    });

    await sendEmail({
      to: user.email,
      subject: "Match confirmed 🚀",
      text: `
Hey ${user.name},

You’ve successfully matched with ${requester.name}.

The chat is now open — break the ice and get to work!

– Team HackMate
  `,
    });


    res.json({
      success: true,
      message: "Request accepted, matched & chat created",
    });
  } catch (err) {
    console.error("❌ acceptRequest error:", err);
    res.status(500).json({
      success: false,
      message: "Error accepting request",
    });
  }
};

// reject request krna
const rejectRequest = async (req, res) => {
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
    console.error("❌ rejectRequest error:", err);
    res.status(500).json({
      success: false,
      message: "Error rejecting request",
    });
  }
};

//get matches wala
const getMatches = async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate(
    "matches",
    "name year bio skills trackPreference profileImage age gender"
  );

  res.json({
    success: true,
    matches: user.matches || [],
  });
};

///selected users wala
const getSelectedUsers = async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate(
    "selectedUsers",
    "name year bio skills trackPreference profileImage age gender"
  );

  res.json({
    success: true,
    selectedUsers: user.selectedUsers || [],
  });
};

//pending requests wala
const getPendingRequests = async (req, res) => {
  const user = await UserModel.findById(req.user.id).populate(
    "pendingRequests",
    "name year bio skills trackPreference profileImage age gender"
  );

  res.json({
    success: true,
    pendingRequests: user.pendingRequests || [],
  });
};

export {
  swipeUser,
  acceptRequest,
  rejectRequest,
  getMatches,
  getSelectedUsers,
  getPendingRequests,
};