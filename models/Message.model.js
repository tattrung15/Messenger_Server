const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      required: [true, "Requires conventionId"],
    },
    author: {
      userId: {
        type: String,
        required: [true, "Requires author"],
      },
      displayname: {
        type: String,
        required: [true, "Requires author"],
      },
    },
    payload: {
      type: {
        type: String,
        enum: ["text", "image", "file"],
        required: [true, "Requires type"],
      },
      body: {
        type: String,
        required: [true, "Requires body"],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema, "Message");
