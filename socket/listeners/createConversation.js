const Conversation = require("../../models/Conversation.model");

const { SocketEvent, SocketErrorMessage } = require("../constants");

module.exports = (io, socket) => async (data) => {
  try {
    const { typeConversation, title, from, to, members } = data;
    const oldConversation = await Conversation.findOne({
      from: {
        $in: [from, to],
      },
      to: {
        $in: [from, to],
      },
    });

    if (oldConversation) {
      socket.emit(SocketEvent.SV_SEND_CURR_CONVERSATION, oldConversation);
    } else {
      const newConversation = await Conversation.create({
        typeConversation,
        title,
        from,
        to,
        members,
      });
      socket.emit(SocketEvent.SV_SEND_CURR_CONVERSATION, newConversation);
    }

    const conversations = await Conversation.find();

    io.sockets.emit(SocketEvent.SV_SEND_CONVERSATIONS, conversations);
  } catch (error) {
    console.log(error.message);
  }
};
