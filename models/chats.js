// chat_id, person1, person2, status(0[pending], 1[active], 2[deleted])
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  person1: {
    type: String,
    required: true
  },
  person2: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true,
    // 0 = pending, 1 = active, 2 = blocked
    default: 0
  },
  blocker: {
    type: String,
    required: false
  }
}, {
  collection: "chats",
});

const model = mongoose.model("chatSchema", chatSchema);

module.exports = model;