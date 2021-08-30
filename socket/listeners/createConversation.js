const Conversation = require("../../models/Conversation.model");
const User = require("../../models/User.model");

const { SocketEvent } = require("../constants");

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

    const users = await User.find({}, { _id: 1, displayname: 1 });

    conversations.map((conversation) => {
      conversation.members = users.filter(function (user) {
        return this.indexOf(user._id) >= 0;
      }, conversation.members);
      return conversation;
    });

    io.sockets.emit(SocketEvent.SV_SEND_CONVERSATIONS, conversations);
  } catch (error) {
    console.log(error.message);
  }
};
