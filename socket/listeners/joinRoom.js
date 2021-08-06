const Conversation = require("../../models/Conversation.model");

const { SocketEvent, SocketErrorMessage } = require("../constants");

module.exports = (io, socket) => async (data) => {
  try {
    const { roomId } = data;

    const conversation = await Conversation.findById(roomId);

    if (!conversation) {
      socket.emit(SocketEvent.ERROR, {
        message: SocketErrorMessage.JOIN_ROOM,
        result: "Not found conversation",
      });

      return;
    }

    socket.roomId = roomId;
    socket.join(roomId);

    socket.emit(SocketEvent.SV_SEND_CURR_CONVERSATION, conversation);
  } catch (error) {
    console.log(error);
  }
};
