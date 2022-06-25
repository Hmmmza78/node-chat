// msg_id, message, sender, chat_id, time
const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  chat_id: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true,
    default: Date.now()
  },
}, {
  collection: "messages",
});

const model = mongoose.model("msgSchema", msgSchema);

module.exports = model;