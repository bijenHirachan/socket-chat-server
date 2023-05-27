import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";

export const createGroupChat = catchAsyncErrors(async (req, res, next) => {
  const { roomName, selectedUsers } = req.body;

  const users = selectedUsers.map((user) => user.value);
  users.push(req.user._id.toString());

  const conversation = await Conversation.create({
    name: roomName,
    users,
    isGroup: true,
  });

  return res.status(201).json({
    success: true,
    message: "Conversation created successfully!",
  });
});

export const createChat = catchAsyncErrors(async (req, res, next) => {
  const { selectedUser } = req.body;

  const conversation = await Conversation.create({
    users: [req.user._id, selectedUser.value],
  });

  return res.status(201).json({
    success: true,
    message: "Conversation created successfully!",
  });
});

export const getConversations = catchAsyncErrors(async (req, res, next) => {
  const allConversations = await Conversation.find().populate("users");

  let conversations = [];

  allConversations.forEach((con) => {
    if (
      con.users.length > 1 &&
      con.users.map((c) => c._id.toString()).includes(req.user._id.toString())
    ) {
      conversations.push(con);
    }
  });

  res.status(200).json({
    success: true,
    conversations,
  });
});

export const getSingleConversation = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const conversation = await Conversation.findById(id)
      .populate("users")
      .populate({
        path: "messages",
        populate: { path: "sender" },
      })
      .populate({
        path: "messages",
        populate: { path: "seenUsers" },
      });

    if (conversation.messages.length > 0) {
      const messageId =
        conversation.messages[conversation.messages.length - 1]._id;
      const message = await Message.findById(messageId);

      if (!message.seenUsers.includes(req.user._id)) {
        message.seenUsers.push(req.user._id);
        await message.save();
      }
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  }
);

export const leaveConversation = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const conversation = await Conversation.findById(id);

  conversation.users = conversation.users.filter(
    (user) => user._id.toString() !== req.user._id.toString()
  );

  await conversation.save();

  res.status(200).json({
    success: true,
    message: "Group chat left!",
  });
});
