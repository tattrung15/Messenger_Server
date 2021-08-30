const Conversation = require("../../models/Conversation.model");
const User = require("../../models/User.model");

const { SocketEvent } = require("../constants");

module.exports = (io, socket) => async () => {
  try {
    const currentUserId = socket.currentUser._id + "";

    const conversations = await Conversation.find({
      members: { $in: [currentUserId] },
    });

    const users = await User.find({}, { _id: 1, displayname: 1 });

    conversations.map((conversation) => {
      conversation.members = users.filter(function (user) {
        return this.indexOf(user._id);
      }, conversation.members);
      return conversation;
    });

    socket.emit(SocketEvent.SV_SEND_CONVERSATIONS_OF_USER, conversations);
  } catch (error) {
    console.log(error.message);
  }
};
