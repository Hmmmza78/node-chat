const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: false },
  },
  {
    collection: "users",
  }
);

const model = mongoose.model("userSchema", userSchema);

module.exports = model;
