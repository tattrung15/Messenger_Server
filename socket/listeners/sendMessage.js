const User = require("../../models/User.model");
const Message = require("../../models/Message.model");
const Conversation = require("../../models/Conversation.model");

const { SocketEvent, SocketErrorMessage } = require("../constants");

module.exports = (io, socket) => async (data) => {
  try {
    const { conversationId, fromUserId, message } = data;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      socket.emit(SocketEvent.ERROR, {
        message: SocketErrorMessage.SEND_MESSAGE,
        result: "Not found conversation",
      });

      return;
    }

    const user = await User.findById(fromUserId);

    const messageModel = await Message.create({
      conversationId: conversation._id,
      author: {
        userId: user._id,
        displayname: user.displayname,
      },
      payload: {
        type: "text",
        body: message,
      },
    });

    const newMessage = {
      messageId: messageModel._id,
      content: message,
    };

    conversation.newMessage = newMessage;

    await conversation.save();

    const dataMessage = {
      fromUser: user,
      conversation: conversation,
      messageModel,
    };

    socket.broadcast
      .to(socket.roomId)
      .emit(SocketEvent.SV_SEND_MESSAGE, dataMessage);

    io.to(socket.id).emit(SocketEvent.SV_SEND_MESSAGE_TO_AUTHOR, dataMessage);
  } catch (error) {
    console.log(error.message);
  }
};
