const Conversation = require("../../models/Conversation.model");

const { SocketEvent, SocketErrorMessage } = require("../constants");

module.exports = (io, socket) => async (data) => {
  try {
    const { roomId } = data;

    const conversation = await Conversation.findById(roomId);

    if (!conversation) {
      socket.emit(SocketEvent.ERROR, {
        message: SocketErrorMessage.LEAVE_CONVERSATION,
        result: "Not found conversation",
      });

      return;
    }

    if (!conversation.members.includes(socket.currentUser._id.toString())) {
      socket.emit(SocketEvent.ERROR, {
        message: SocketErrorMessage.LEAVE_CONVERSATION,
        result: "User doesn't exists in conversation",
      });

      return;
    }

    const index = conversation.members.findIndex(
      (item) => item === socket.currentUser._id.toString()
    );

    conversation.members.splice(index, 1);

    await conversation.save();

    socket.emit(SocketEvent.SV_SEND_LEAVE_CONVERSATION_TO_USER, conversation);

    const conversationId = socket.roomId || conversation._id;

    socket.broadcast
      .to(conversationId)
      .emit(SocketEvent.SV_SEND_MESSAGE, dataMessage);
  } catch (error) {
    console.log(error.message);
  }
};
