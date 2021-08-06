const Conversation = require("../../models/Conversation.model");

const { SocketEvent } = require("../constants");

module.exports = (io, socket) => async () => {
  try {
    const currentUserId = socket.currentUser._id + "";

    const conversations = await Conversation.find({
      members: { $in: [currentUserId] },
    });

    socket.emit(SocketEvent.SV_SEND_CONVERSATIONS_OF_USER, conversations);
  } catch (error) {
    console.log(error.message);
  }
};
