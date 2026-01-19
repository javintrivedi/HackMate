import ChatModel from "../Modules/Chat.js";

// 🔹 Get chat between logged-in user & matched user
const getChatByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const chat = await ChatModel.findOne({
      participants: { $all: [userId, otherUserId] }
    }).populate("messages.sender", "name");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    res.json({
      success: true,
      chat
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching chat"
    });
  }
};

export { getChatByUser };