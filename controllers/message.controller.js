const MessageModel = require("../models/Message.model");
const Conversation = require("../models/Conversation.model");

const { ResponseEntity, HttpStatus, Message } = require("../dto/dataResponse");

module.exports.getMessagesByConversation = async (req, res) => {
  const perPage = 20;
  const { conversationId } = req.query;
  const page = req.query.page >= 1 ? req.query.page : 1;

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(
        new ResponseEntity(
          HttpStatus.NOT_FOUND,
          `Conversation not found by id: ${conversationId}`
        )
      );
  }

  if (!conversation.members.includes(req.user._id)) {
    return res
      .status(HttpStatus.FORBIDDEN)
      .json(new ResponseEntity(HttpStatus.FORBIDDEN, "Access denied"));
  }

  const messages = await MessageModel.find()
    .limit(perPage)
    .skip(perPage * (page - 1))
    .sort({ createdAt: -1 });

  if (!messages.length) {
    return res
      .status(HttpStatus.NO_CONTENT)
      .json(new ResponseEntity(HttpStatus.NO_CONTENT, Message.NO_CONTENT));
  }

  return res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, messages));
};
