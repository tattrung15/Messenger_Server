const jwt = require("jsonwebtoken");
const socketIO = require("socket.io");

const configuration = require("../configs/configuration");

const User = require("../models/User.model");

// socket listeners
const listeners = require("./listeners");

// socket event constants
const { SocketEvent } = require("./constants");

module.exports.listen = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
    },
    transports: ["polling"],
    maxHttpBufferSize: 8e6,
  });

  // middleware auth
  io.use(async (socket, next) => {
    try {
      const { token } = socket.handshake.auth;

      const decode = jwt.verify(token, configuration().JWT_SECRET);

      const user = await User.findOne({ username: decode.username });

      socket.currentUser = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  // socket connect
  io.on(SocketEvent.CONNECTION, async (socket) => {
    try {
      const user = await User.findById(socket.currentUser._id);

      user.isOnline = true;
      await user.save();

      const listUserOnline = await User.find({ isOnline: true });

      socket.emit(SocketEvent.SV_SEND_CURR_USER, user);
      io.sockets.emit(SocketEvent.SV_SEND_USERS_ONLINE, listUserOnline);
    } catch (error) {
      console.log(error.message);
    }

    socket.on(SocketEvent.DISCONNECT, listeners.disconnect(io, socket));

    socket.on(SocketEvent.CLIENT_JOIN_ROOM, listeners.joinRoom(io, socket));

    socket.on(
      SocketEvent.CLIENT_CREATE_CONVERSATION,
      listeners.createConversation(io, socket)
    );

    socket.on(
      SocketEvent.CLIENT_GET_CONVERSATIONS,
      listeners.getConversation(io, socket)
    );

    socket.on(
      SocketEvent.CLIENT_SEND_MESSAGE,
      listeners.sendMessage(io, socket)
    );

    socket.on(
      SocketEvent.CLIENT_LEAVE_CONVERSATION,
      listeners.leaveConversation(io, socket)
    );

    socket.on(SocketEvent.CLIENT_SEND_FILE, listeners.sendFile(io, socket));
  });
};
