import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { currentMessage, conversationId } = req.body;

  const conversation = await Conversation.findById(conversationId);

  if (!conversation)
    return next(new ErrorHandler("Conversation Not Found!", 404));

  const sentMessage = await Message.create({
    body: currentMessage,
    conversation: conversationId,
    sender: req.user._id,
  });

  await sentMessage.populate("sender");

  conversation.messages.push(sentMessage._id);
  conversation.lastMessageAt = Date.now();

  await conversation.save();

  return res.status(200).json({
    success: true,
    message: "Message sent!",
    sentMessage,
  });
});

// export const sendMessage = async (conversationId, message, userId) => {
//   try {
//     const conversation = await Conversation.findById(conversationId);

//     const sentMessage = await Message.create({
//       body: message,
//       conversation: conversationId,
//       sender: userId,
//     });

//     conversation.messages.push(sentMessage._id);
//     conversation.lastMessageAt = Date.now();

//     await conversation.save();

//     return sentMessage;
//   } catch (error) {}
// };
