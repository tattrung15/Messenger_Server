const configuration = require("../../configs/configuration");

const fs = require("fs/promises");

const User = require("../../models/User.model");
const Message = require("../../models/Message.model");
const Conversation = require("../../models/Conversation.model");

const { isDenyMimeType, randomFileName } = require("../../utils/fileType");

const { SocketEvent, SocketErrorMessage } = require("../constants");

module.exports = (io, socket) => async (data) => {
  try {
    const {
      conversationId,
      fromUserId,
      fileName,
      fileType,
      fileSize,
      dataBuffer,
    } = data;

    if (fileSize > configuration().MAX_FILE_SIZE) {
      socket.emit(SocketEvent.ERROR, {
        message: SocketErrorMessage.SEND_FILE,
        result: `The maximum upload file size: ${(
          configuration().MAX_FILE_SIZE /
          (1024 * 1024)
        ).toFixed(0)}MB`,
      });

      return;
    }

    if (isDenyMimeType(fileType)) {
      socket.emit(SocketEvent.ERROR, {
        message: SocketErrorMessage.SEND_FILE,
        result: "File type not allowed",
      });

      return;
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      socket.emit(SocketEvent.ERROR, {
        message: SocketErrorMessage.SEND_MESSAGE,
        result: "Not found conversation",
      });

      return;
    }

    const user = await User.findById(fromUserId);

    const nanoFileName = randomFileName(fileName);

    await fs.writeFile(`public/uploads/${nanoFileName}`, dataBuffer);

    const messageModel = await Message.create({
      conversationId: conversation._id,
      author: {
        userId: user._id,
        displayname: user.displayname,
      },
      payload: {
        type: fileType.startsWith("image") ? "image" : "file",
        body: `/uploads/${nanoFileName}`,
        fileName,
      },
    });

    const newMessage = {
      messageId: messageModel._id,
      content: `${user.displayname} đã gửi một file`,
    };

    conversation.newMessage = newMessage;

    await conversation.save();

    const dataMessage = {
      fromUser: user,
      conversation: conversation,
      message: messageModel,
    };

    socket.broadcast
      .to(socket.roomId)
      .emit(SocketEvent.SV_SEND_FILE, dataMessage);

    io.to(socket.id).emit(SocketEvent.SV_SEND_FILE_TO_AUTHOR, dataMessage);
  } catch (error) {
    console.log(error.message);
  }
};
