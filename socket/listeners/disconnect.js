const User = require("../../models/User.model");

// socket event constants
const { SocketEvent, SocketErrorMessage } = require("../constants");

module.exports = (io, socket) => async () => {
  try {
    const user = await User.findById(socket.currentUser._id);

    user.isOnline = false;
    await user.save();

    const listUserOnline = await User.find({ isOnline: true });

    socket.leave(socket.roomId);

    io.sockets.emit(SocketEvent.SV_SEND_USERS_ONLINE, listUserOnline);
  } catch (error) {
    console.log(error.message);
  }
};
