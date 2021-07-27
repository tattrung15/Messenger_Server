const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    typeConversation: {
      type: String,
      enum: ["private", "group"],
      default: "private",
      required: [true, "Requires type conversation"],
    },
    title: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    members: {
      type: Array,
      required: [true, "Requires members"],
    },
    newMessage: {
      messageId: {
        type: String,
      },
      content: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Conversation",
  conversationSchema,
  "Conversation"
);
